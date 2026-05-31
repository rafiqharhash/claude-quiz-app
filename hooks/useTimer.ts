'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

export interface TimerState {
  elapsed: number;
  isRunning: boolean;
  start: () => void;
  pause: () => void;
  reset: () => void;
}

/** Session timer that counts up in seconds */
export function useTimer(): TimerState {
  const [elapsed, setElapsed] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const start = useCallback(() => setIsRunning(true), []);
  const pause = useCallback(() => setIsRunning(false), []);
  const reset = useCallback(() => {
    setIsRunning(false);
    setElapsed(0);
  }, []);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setElapsed((prev) => prev + 1);
      }, 1000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning]);

  return { elapsed, isRunning, start, pause, reset };
}
