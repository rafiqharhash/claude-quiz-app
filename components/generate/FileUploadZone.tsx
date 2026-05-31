'use client';

import { useCallback, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, FileText, X, AlertCircle, CheckCircle2 } from 'lucide-react';
import { validateFile } from '@/lib/validators';
import { formatFileSize } from '@/lib/utils';
import { cn } from '@/lib/utils';

interface FileUploadZoneProps {
  onFileSelect: (file: File | null) => void;
  selectedFile: File | null;
}

export default function FileUploadZone({ onFileSelect, selectedFile }: FileUploadZoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFile = useCallback(
    (file: File) => {
      setError(null);
      const validation = validateFile(file);
      if (!validation.valid) {
        setError(validation.error ?? 'Invalid file.');
        onFileSelect(null);
        return;
      }
      onFileSelect(file);
    },
    [onFileSelect]
  );

  const onDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const onDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = () => setIsDragging(false);

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
    // Reset so same file can be re-selected
    e.target.value = '';
  };

  const removeFile = () => {
    onFileSelect(null);
    setError(null);
  };

  return (
    <div className="space-y-3">
      {/* Drop zone */}
      <div
        role="button"
        tabIndex={0}
        aria-label="PDF upload area. Click or drag and drop a PDF file here."
        onDrop={onDrop}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            document.getElementById('file-input')?.click();
          }
        }}
        onClick={() => document.getElementById('file-input')?.click()}
        className={cn(
          'relative w-full rounded-2xl border-2 border-dashed transition-all duration-200 cursor-pointer focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2 focus-visible:ring-offset-[#07070f] outline-none',
          isDragging
            ? 'border-violet-400 bg-violet-500/10 scale-[1.01]'
            : 'border-white/15 bg-white/3 hover:border-violet-400/50 hover:bg-white/5'
        )}
      >
        <input
          id="file-input"
          type="file"
          accept="application/pdf,.pdf"
          className="sr-only"
          onChange={onInputChange}
          aria-hidden="true"
        />

        <AnimatePresence mode="wait">
          {selectedFile ? (
            /* File preview */
            <motion.div
              key="preview"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="p-6 flex items-center gap-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="w-12 h-12 rounded-xl bg-violet-500/15 border border-violet-500/30 flex items-center justify-center flex-shrink-0">
                <FileText className="w-6 h-6 text-violet-400" aria-hidden="true" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-white truncate">{selectedFile.name}</p>
                <p className="text-sm text-zinc-400">{formatFileSize(selectedFile.size)}</p>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" aria-hidden="true" />
                <button
                  type="button"
                  onClick={removeFile}
                  aria-label="Remove selected file"
                  className="w-8 h-8 rounded-lg bg-white/8 hover:bg-red-500/20 flex items-center justify-center transition-colors text-zinc-400 hover:text-red-400"
                >
                  <X className="w-4 h-4" aria-hidden="true" />
                </button>
              </div>
            </motion.div>
          ) : (
            /* Empty state */
            <motion.div
              key="empty"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="py-12 flex flex-col items-center gap-3 text-center"
            >
              <div
                className={cn(
                  'w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-200',
                  isDragging
                    ? 'bg-violet-500/30 border-2 border-violet-400'
                    : 'bg-white/6 border border-white/10'
                )}
              >
                <Upload
                  className={cn(
                    'w-6 h-6 transition-colors',
                    isDragging ? 'text-violet-300' : 'text-zinc-400'
                  )}
                  aria-hidden="true"
                />
              </div>
              <div>
                <p className="font-medium text-white">
                  {isDragging ? 'Drop your PDF here' : 'Drag & drop your PDF'}
                </p>
                <p className="text-sm text-zinc-500 mt-1">
                  or <span className="text-violet-400">click to browse</span> — max 10 MB
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Error message */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            role="alert"
            className="flex items-center gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm"
          >
            <AlertCircle className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
            {error}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
