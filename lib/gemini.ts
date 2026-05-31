// ─────────────────────────────────────────────────────────
// Google Gemini API client — SERVER SIDE ONLY
// Uses a cascade of free-tier models.
// Get a free API key at: https://aistudio.google.com/app/apikey
// ─────────────────────────────────────────────────────────

import { GoogleGenerativeAI } from '@google/generative-ai';
import type { QuizQuestion, Difficulty } from '@/types/quiz';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY ?? '');

// Current free-tier models (May 2026). Order = preference.
// gemini-2.0-flash-lite has the highest free quota (30 RPM).
const MODEL_CASCADE = [
  'gemini-2.5-flash',
  'gemini-2.0-flash-lite',
];

const MAX_RETRIES_PER_MODEL = 2;

// ── Difficulty instructions ───────────────────────────────

const DIFFICULTY_INSTRUCTIONS: Record<Difficulty, string> = {
  easy: 'Focus on factual recall and direct comprehension. Keep questions straightforward.',
  medium: 'Combine factual recall with application of concepts. Require understanding.',
  hard: 'Focus on inference, critical analysis, and evaluation. Challenge deep comprehension.',
};

// ── Prompt ────────────────────────────────────────────────

function buildPrompt(text: string, numQuestions: number, difficulty: Difficulty): string {
  const truncated = text.slice(0, 8_000);

  return `You are an expert quiz creator. Generate exactly ${numQuestions} multiple-choice questions based on the text below.

Difficulty: ${difficulty.toUpperCase()}
${DIFFICULTY_INSTRUCTIONS[difficulty]}

RULES:
1. Return ONLY a raw JSON array — no markdown, no code fences, no extra text.
2. Each question must have exactly 4 answer options.
3. "correctAnswer" is the zero-based index (0-3) of the correct option.
4. Include a brief "explanation" for the correct answer.
5. Base all questions solely on the provided text.

Output format (nothing else):
[{"question":"...","options":["A","B","C","D"],"correctAnswer":0,"explanation":"..."}]

TEXT:
${truncated}`;
}

// ── Response sanitisation ─────────────────────────────────

function sanitizeResponse(raw: string): string {
  let cleaned = raw.trim();
  cleaned = cleaned.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim();

  const start = cleaned.indexOf('[');
  const end = cleaned.lastIndexOf(']');

  if (start === -1 || end === -1 || end < start) {
    throw new Error('AI response did not contain a valid JSON array.');
  }

  return cleaned.slice(start, end + 1);
}

// ── Parse + validate ──────────────────────────────────────

interface RawQuestion {
  question: unknown;
  options: unknown;
  correctAnswer: unknown;
  explanation: unknown;
}

function parseQuestions(raw: string, expectedCount: number): QuizQuestion[] {
  const sanitized = sanitizeResponse(raw);
  const parsed: unknown = JSON.parse(sanitized);

  if (!Array.isArray(parsed)) throw new Error('Response is not a JSON array.');

  const questions: QuizQuestion[] = [];

  for (const [i, item] of (parsed as RawQuestion[]).entries()) {
    if (typeof item.question !== 'string' || !item.question.trim()) {
      throw new Error(`Question ${i + 1}: missing "question" string.`);
    }
    if (
      !Array.isArray(item.options) ||
      item.options.length !== 4 ||
      !(item.options as unknown[]).every((o) => typeof o === 'string')
    ) {
      throw new Error(`Question ${i + 1}: must have exactly 4 string options.`);
    }
    if (
      typeof item.correctAnswer !== 'number' ||
      !Number.isInteger(item.correctAnswer) ||
      item.correctAnswer < 0 ||
      item.correctAnswer > 3
    ) {
      throw new Error(`Question ${i + 1}: "correctAnswer" must be 0–3.`);
    }

    questions.push({
      id: crypto.randomUUID(),
      question: item.question.trim(),
      options: item.options as [string, string, string, string],
      correctAnswer: item.correctAnswer,
      explanation: typeof item.explanation === 'string' ? item.explanation.trim() : '',
    });

    if (questions.length === expectedCount) break;
  }

  if (questions.length === 0) throw new Error('No valid questions found in AI response.');
  return questions;
}

// ── Error classification ──────────────────────────────────

function isQuotaError(err: unknown): boolean {
  const msg = String(err);
  return msg.includes('429') || msg.includes('quota') || msg.includes('Too Many Requests');
}

/** Key-level errors — no point retrying any model, fail fast */
function isKeyError(err: unknown): boolean {
  const msg = String(err);
  return (
    msg.includes('API_KEY_INVALID') ||
    msg.includes('API key expired') ||
    msg.includes('API key not valid') ||
    msg.includes('401')
  );
}

function extractRetryDelay(err: unknown): number {
  const msg = String(err);
  const match = msg.match(/retry in (\d+(?:\.\d+)?)s/i);
  return match ? Math.ceil(parseFloat(match[1])) * 1000 : 3000;
}

// ── Main export ───────────────────────────────────────────

export interface GenerateQuizOptions {
  text: string;
  numQuestions: number;
  difficulty: Difficulty;
  model?: string;
}

/**
 * Generates quiz questions via the Gemini free-tier API.
 * Cascades through multiple models if one hits a quota limit.
 * Fails fast on invalid/expired API keys.
 */
export async function generateQuizFromText({
  text,
  numQuestions,
  difficulty,
  model,
}: GenerateQuizOptions): Promise<QuizQuestion[]> {
  const prompt = buildPrompt(text, numQuestions, difficulty);
  const errors: string[] = [];

  // If the user selected a model, put it at the front of the cascade, and remove duplicates
  const cascade = model
    ? [model, ...MODEL_CASCADE.filter((m) => m !== model)]
    : MODEL_CASCADE;

  for (const modelName of cascade) {
    const model = genAI.getGenerativeModel({ model: modelName });

    for (let attempt = 1; attempt <= MAX_RETRIES_PER_MODEL; attempt++) {
      try {
        console.log(`[gemini] Trying ${modelName} (attempt ${attempt}/${MAX_RETRIES_PER_MODEL})`);
        const result = await model.generateContent(prompt);
        const text = result.response.text();

        if (!text) throw new Error('Empty response from Gemini API.');

        const questions = parseQuestions(text, numQuestions);
        console.log(`[gemini] ✓ Success with ${modelName}`);
        return questions;
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        errors.push(`${modelName}[${attempt}]: ${message}`);
        console.error(`[gemini] ${modelName} attempt ${attempt} failed:`, message.slice(0, 120));

        // Invalid/expired key — no point trying more models
        if (isKeyError(err)) {
          throw new Error(
            'Your Gemini API key is invalid or expired. Please create a new key at https://aistudio.google.com/app/apikey and update your .env.local file.'
          );
        }

        // Quota hit — skip remaining retries for this model
        if (isQuotaError(err)) {
          console.warn(`[gemini] Quota exceeded on ${modelName}, trying next model`);
          break;
        }

        // Other error — wait then retry same model
        if (attempt < MAX_RETRIES_PER_MODEL) {
          const delay = extractRetryDelay(err);
          console.log(`[gemini] Retrying in ${delay}ms…`);
          await new Promise((r) => setTimeout(r, delay));
        }
      }
    }
  }

  throw new Error(
    `Quiz generation failed on all models. Please check your API key and try again.\nDetails: ${errors.slice(-2).join(' | ')}`
  );
}
