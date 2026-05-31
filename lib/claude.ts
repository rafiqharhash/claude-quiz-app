// ─────────────────────────────────────────────────────────
// Claude API client — SERVER SIDE ONLY
// Includes sanitisation, strict JSON parsing, and retry logic.
// ─────────────────────────────────────────────────────────

import Anthropic from '@anthropic-ai/sdk';
import { QuizQuestion, Difficulty } from '@/types/quiz';

const client = new Anthropic({ apiKey: process.env.CLAUDE_API_KEY });

// The model to use — configurable so you can swap to Opus/Haiku
const MODEL = process.env.CLAUDE_MODEL ?? 'claude-3-5-sonnet-20241022';

const MAX_RETRIES = 3;
const BASE_RETRY_DELAY_MS = 1200;

// ── Prompt ────────────────────────────────────────────────

const DIFFICULTY_INSTRUCTIONS: Record<Difficulty, string> = {
  easy: 'Focus on factual recall and direct comprehension. Questions should be straightforward.',
  medium: 'Combine factual recall with application of concepts. Questions should require understanding.',
  hard: 'Focus on inference, critical analysis, and evaluation. Questions should challenge deep comprehension.',
};

function buildPrompt(text: string, numQuestions: number, difficulty: Difficulty): string {
  // Truncate text to ~12 000 chars to stay within token budget
  const truncated = text.slice(0, 12_000);

  return `You are an expert quiz creator. Generate exactly ${numQuestions} multiple-choice questions based on the text provided.

Difficulty level: ${difficulty.toUpperCase()}
${DIFFICULTY_INSTRUCTIONS[difficulty]}

CRITICAL RULES — follow every one of them:
1. Return ONLY a raw JSON array. No markdown, no code fences, no prose before or after the JSON.
2. Each question must have exactly 4 answer options in the "options" array.
3. "correctAnswer" must be the zero-based index (0, 1, 2, or 3) of the correct option.
4. Include a clear, concise "explanation" for why the correct answer is right.
5. Do not repeat questions.
6. Questions must be answerable solely from the provided text.

Required JSON format (return this exact structure, nothing else):
[
  {
    "question": "Question text here?",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correctAnswer": 0,
    "explanation": "Brief explanation of why this is correct."
  }
]

TEXT TO USE:
${truncated}`;
}

// ── Sanitisation ──────────────────────────────────────────

/**
 * Strips any markdown code fences or stray prose from Claude's response
 * and extracts the raw JSON array string.
 */
function sanitizeResponse(raw: string): string {
  let cleaned = raw.trim();

  // Remove markdown code fences: ```json ... ``` or ``` ... ```
  cleaned = cleaned.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim();

  // Find the outermost JSON array
  const start = cleaned.indexOf('[');
  const end = cleaned.lastIndexOf(']');

  if (start === -1 || end === -1 || end < start) {
    throw new Error('Claude response did not contain a valid JSON array.');
  }

  return cleaned.slice(start, end + 1);
}

// ── Parsing ───────────────────────────────────────────────

interface RawQuestion {
  question: unknown;
  options: unknown;
  correctAnswer: unknown;
  explanation: unknown;
}

function parseAndValidateQuestions(raw: string, expectedCount: number): QuizQuestion[] {
  const sanitized = sanitizeResponse(raw);
  const parsed: unknown = JSON.parse(sanitized);

  if (!Array.isArray(parsed)) {
    throw new Error('Parsed response is not a JSON array.');
  }

  const questions: QuizQuestion[] = [];

  for (const [i, item] of (parsed as RawQuestion[]).entries()) {
    if (typeof item.question !== 'string' || item.question.trim() === '') {
      throw new Error(`Question ${i + 1} is missing a valid "question" field.`);
    }
    if (
      !Array.isArray(item.options) ||
      item.options.length !== 4 ||
      !(item.options as unknown[]).every((o) => typeof o === 'string')
    ) {
      throw new Error(`Question ${i + 1} must have exactly 4 string options.`);
    }
    if (
      typeof item.correctAnswer !== 'number' ||
      !Number.isInteger(item.correctAnswer) ||
      item.correctAnswer < 0 ||
      item.correctAnswer > 3
    ) {
      throw new Error(`Question ${i + 1} has an invalid "correctAnswer" (must be 0–3).`);
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

  if (questions.length === 0) {
    throw new Error('No valid questions were found in the AI response.');
  }

  return questions;
}

// ── Main export ───────────────────────────────────────────

export interface GenerateQuizOptions {
  text: string;
  numQuestions: number;
  difficulty: Difficulty;
}

/** Generates quiz questions from text using Claude, with retry logic on failure */
export async function generateQuizFromText({
  text,
  numQuestions,
  difficulty,
}: GenerateQuizOptions): Promise<QuizQuestion[]> {
  const prompt = buildPrompt(text, numQuestions, difficulty);
  let lastError: Error | null = null;

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      const response = await client.messages.create({
        model: MODEL,
        max_tokens: 4096,
        messages: [{ role: 'user', content: prompt }],
      });

      const block = response.content[0];
      if (block.type !== 'text') {
        throw new Error('Unexpected non-text response block from Claude.');
      }

      return parseAndValidateQuestions(block.text, numQuestions);
    } catch (err) {
      lastError = err instanceof Error ? err : new Error(String(err));
      console.error(`[claude] Attempt ${attempt}/${MAX_RETRIES} failed:`, lastError.message);

      if (attempt < MAX_RETRIES) {
        // Exponential back-off: 1.2s, 2.4s, …
        await new Promise((r) => setTimeout(r, BASE_RETRY_DELAY_MS * attempt));
      }
    }
  }

  throw new Error(
    `Quiz generation failed after ${MAX_RETRIES} attempts. Last error: ${lastError?.message}`
  );
}
