// ─────────────────────────────────────────────────────────
// POST /api/generate-quiz
// Accepts multipart/form-data (PDF or text) + quiz settings.
// Validates input, extracts text, calls Gemini, returns questions.
// ─────────────────────────────────────────────────────────

import { NextRequest, NextResponse } from 'next/server';
import { extractTextFromPDF } from '@/lib/pdf-parser';
import { generateQuizFromText } from '@/lib/gemini';
import { validateFile, validateTextInput } from '@/lib/validators';
import type { Difficulty } from '@/types/quiz';

// Force Node.js runtime so pdf-parse can access 'fs'
export const runtime = 'nodejs';
export const maxDuration = 60;

export async function POST(request: NextRequest) {
  // ── Guard: API key must be set ──────────────────────────
  if (!process.env.GEMINI_API_KEY) {
    return NextResponse.json(
      { error: 'Gemini API key is not configured. Add GEMINI_API_KEY to your .env.local file.' },
      { status: 500 }
    );
  }

  try {
    const formData = await request.formData();

    const sourceType = formData.get('sourceType') as string | null;
    const rawDifficulty = formData.get('difficulty') as string | null;
    const rawNumQuestions = formData.get('numQuestions') as string | null;
    const rawModel = formData.get('model') as string | null;

    const difficulty: Difficulty =
      rawDifficulty === 'easy' || rawDifficulty === 'hard' ? rawDifficulty : 'medium';
    const numQuestions = Math.min(
      Math.max(parseInt(rawNumQuestions ?? '10', 10) || 10, 5),
      20
    );
    const model = rawModel || 'gemini-3.5-flash';

    // ── Extract source text ─────────────────────────────────
    let sourceText = '';

    if (sourceType === 'pdf') {
      const file = formData.get('file') as File | null;
      if (!file) {
        return NextResponse.json({ error: 'No PDF file provided.' }, { status: 400 });
      }

      const fileValidation = validateFile(file);
      if (!fileValidation.valid) {
        return NextResponse.json({ error: fileValidation.error }, { status: 400 });
      }

      const buffer = Buffer.from(await file.arrayBuffer());
      const parsed = await extractTextFromPDF(buffer);

      if (parsed.wordCount < 50) {
        return NextResponse.json(
          { error: 'PDF contains too little readable text to generate a quiz.' },
          { status: 400 }
        );
      }

      sourceText = parsed.text;
    } else if (sourceType === 'text') {
      const text = formData.get('text') as string | null;
      if (!text) {
        return NextResponse.json({ error: 'No text provided.' }, { status: 400 });
      }

      const textValidation = validateTextInput(text);
      if (!textValidation.valid) {
        return NextResponse.json({ error: textValidation.error }, { status: 400 });
      }

      sourceText = text;
    } else {
      return NextResponse.json(
        { error: 'Invalid source type. Must be "pdf" or "text".' },
        { status: 400 }
      );
    }

    // ── Generate quiz via Gemini ────────────────────────────
    const questions = await generateQuizFromText({ text: sourceText, numQuestions, difficulty, model });

    return NextResponse.json({ questions }, { status: 200 });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'An unexpected error occurred.';
    console.error('[API /generate-quiz]', message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
