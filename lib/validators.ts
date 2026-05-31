// ─────────────────────────────────────────────────────────
// Input validation helpers for files and text
// ─────────────────────────────────────────────────────────

/** Maximum allowed PDF upload size: 10 MB */
export const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024;

/** Only PDF files are accepted */
export const ALLOWED_MIME_TYPES = ['application/pdf'];

export interface ValidationResult {
  valid: boolean;
  error?: string;
}

/** Validate a File object before uploading */
export function validateFile(file: File): ValidationResult {
  if (!ALLOWED_MIME_TYPES.includes(file.type)) {
    return { valid: false, error: 'Only PDF files are supported. Please upload a .pdf file.' };
  }
  if (file.size > MAX_FILE_SIZE_BYTES) {
    return { valid: false, error: 'File exceeds the 10 MB limit. Please upload a smaller PDF.' };
  }
  if (file.size === 0) {
    return { valid: false, error: 'The uploaded file is empty.' };
  }
  return { valid: true };
}

/** Validate user-pasted text before sending to the API */
export function validateTextInput(text: string): ValidationResult {
  const trimmed = text.trim();
  if (trimmed.length < 100) {
    return {
      valid: false,
      error: 'Please provide at least 100 characters so the AI has enough content to work with.',
    };
  }
  if (trimmed.length > 50_000) {
    return {
      valid: false,
      error: 'Text is too long (max 50,000 characters). Please trim it before generating.',
    };
  }
  return { valid: true };
}
