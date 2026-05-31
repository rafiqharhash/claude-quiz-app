// ─────────────────────────────────────────────────────────
// PDF text extraction — SERVER SIDE ONLY
// Uses pdf-parse which requires the Node.js runtime.
// ─────────────────────────────────────────────────────────

import pdfParse from 'pdf-parse';

export interface ParsedPDF {
  text: string;
  numPages: number;
  wordCount: number;
}

/**
 * Extracts and normalises text from a PDF buffer.
 * Call this only inside API routes (Node.js runtime).
 */
export async function extractTextFromPDF(buffer: Buffer): Promise<ParsedPDF> {
  const data = await pdfParse(buffer);

  // Collapse excessive whitespace while preserving paragraph breaks
  const text = data.text
    .replace(/[ \t]+/g, ' ')      // collapse horizontal whitespace
    .replace(/\n{3,}/g, '\n\n')   // collapse 3+ blank lines into one
    .trim();

  const wordCount = text.split(/\s+/).filter(Boolean).length;

  return {
    text,
    numPages: data.numpages,
    wordCount,
  };
}
