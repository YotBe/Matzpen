'use client';

import { useEffect, useRef, useState } from 'react';
import { useT } from '@/lib/i18n/LocaleProvider';

type RecKind = 'audio' | 'video';
type Status = 'idle' | 'starting' | 'recording' | 'stopping';

interface Props {
  onCapture: (blob: Blob, durationSeconds: number) => void;
}

// Short-clip recorder using the browser MediaRecorder API. Hard 5-minute
// cap to keep files manageable on mobile networks and prevent runaway
// recordings if the family forgets to stop.
const MAX_DURATION_MS = 5 * 60 * 1000;

export function Recorder({ onCapture }: Props) {
  const { t } = useT();
  const [kind, setKind] = useState<RecKind>('audio');
  const [status, setStatus] = useState<Status>('idle');
  const [elapsed, setElapsed] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const recRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const startedAtRef = useRef<number>(0);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    return () => {
      cleanup();
    };
  }, []);

  function cleanup() {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    recRef.current = null;
    chunksRef.current = [];
  }

  async function start() {
    setError(null);
    setStatus('starting');
    try {
      const constraints: MediaStreamConstraints =
        kind === 'video' ? { audio: true, video: { facingMode: 'environment' } } : { audio: true };
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;
      const rec = new MediaRecorder(stream);
      recRef.current = rec;
      chunksRef.current = [];
      rec.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) chunksRef.current.push(e.data);
      };
      rec.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: rec.mimeType });
        const duration = Math.round((Date.now() - startedAtRef.current) / 1000);
        cleanup();
        setStatus('idle');
        setElapsed(0);
        if (blob.size > 0) onCapture(blob, duration);
      };
      startedAtRef.current = Date.now();
      rec.start();
      setStatus('recording');
      timerRef.current = setInterval(() => {
        const e = Date.now() - startedAtRef.current;
        setElapsed(e);
        if (e >= MAX_DURATION_MS) stop();
      }, 250);
    } catch (err) {
      cleanup();
      setStatus('idle');
      setError(err instanceof Error ? err.message : 'Recorder unavailable');
    }
  }

  function stop() {
    if (recRef.current && recRef.current.state !== 'inactive') {
      setStatus('stopping');
      recRef.current.stop();
    }
  }

  const seconds = Math.floor(elapsed / 1000);
  const mm = String(Math.floor(seconds / 60)).padStart(2, '0');
  const ss = String(seconds % 60).padStart(2, '0');

  return (
    <div className="mz-card p-4 md:p-5 space-y-3">
      <div className="text-[11px] font-bold uppercase tracking-widest text-ink-mute">
        {t('vault.recorder.title')}
      </div>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => setKind('audio')}
          disabled={status !== 'idle'}
          className={`mz-pill ${kind === 'audio' ? 'bg-clay/15 text-clay-deep ring-1 ring-clay/30' : ''}`}
        >
          {t('vault.recorder.audio')}
        </button>
        <button
          type="button"
          onClick={() => setKind('video')}
          disabled={status !== 'idle'}
          className={`mz-pill ${kind === 'video' ? 'bg-clay/15 text-clay-deep ring-1 ring-clay/30' : ''}`}
        >
          {t('vault.recorder.video')}
        </button>
      </div>

      {status === 'recording' && (
        <div className="flex items-center gap-2 text-crimson-deep">
          <span className="inline-block w-2.5 h-2.5 rounded-full bg-crimson animate-pulse" />
          <span className="font-mono text-base font-semibold tabular-nums">
            {mm}:{ss}
          </span>
          <span className="text-xs text-ink-mute">{t('vault.recorder.maxLabel')}</span>
        </div>
      )}

      {error && (
        <p className="text-sm text-crimson-deep bg-crimson-bg rounded-xl px-3 py-2">
          {error}
        </p>
      )}

      <div className="flex gap-2">
        {status !== 'recording' ? (
          <button
            type="button"
            onClick={start}
            disabled={status === 'starting'}
            className="mz-btn mz-btn-clay h-10 px-4 text-sm"
          >
            {t('vault.recorder.start')}
          </button>
        ) : (
          <button
            type="button"
            onClick={stop}
            className="mz-btn mz-btn-crimson h-10 px-4 text-sm"
          >
            {t('vault.recorder.stop')}
          </button>
        )}
      </div>

      <p className="text-[11px] text-ink-mute leading-relaxed">
        {t('vault.recorder.hint')}
      </p>
    </div>
  );
}
