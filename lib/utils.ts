import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/** Merge Tailwind classes safely, resolving conflicts */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/** Format seconds as MM:SS */
export function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

/** Format an ISO date string for display */
export function formatDate(iso: string): string {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(iso));
}

/** Truncate text with an ellipsis */
export function truncateText(text: string, maxLength: number): string {
  return text.length <= maxLength ? text : text.slice(0, maxLength) + '…';
}

/** Returns a Tailwind text color class based on accuracy percentage */
export function getScoreColor(accuracy: number): string {
  if (accuracy >= 80) return 'text-emerald-400';
  if (accuracy >= 60) return 'text-yellow-400';
  return 'text-red-400';
}

/** Returns an encouraging label based on accuracy */
export function getScoreLabel(accuracy: number): string {
  if (accuracy >= 90) return 'Outstanding! 🏆';
  if (accuracy >= 80) return 'Great Job! 🎉';
  if (accuracy >= 70) return 'Well Done! 👍';
  if (accuracy >= 60) return 'Keep Going! 💪';
  return 'Keep Practicing! 📚';
}

/** Format file size in a human-readable way */
export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
