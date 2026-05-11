'use client';

import { useEffect, useMemo, useRef, useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport, type UIMessage } from 'ai';
import { useT } from '@/lib/i18n/LocaleProvider';
import { supabase } from '@/lib/supabaseClient';

// Keep in sync with the server-side allow-list in app/api/chat/route.ts.
const ALLOWED_PAGES = new Set([
  '/',
  '/emergency',
  '/golden-record',
  '/bureaucracy',
  '/assistant',
]);

interface Props {
  /** Render in a fixed-height container (for the floating widget) vs flowing full-page. */
  variant?: 'panel' | 'page';
}

async function fetchAuthToken(): Promise<string | undefined> {
  if (!supabase) return undefined;
  const { data } = await supabase.auth.getSession();
  return data.session?.access_token;
}

export function AIAssistant({ variant = 'page' }: Props) {
  const { t } = useT();
  const router = useRouter();

  const transport = useMemo(
    () =>
      new DefaultChatTransport({
        headers: async (): Promise<Record<string, string>> => {
          const token = await fetchAuthToken();
          return token ? { 'x-supabase-token': token } : {};
        },
      }),
    [],
  );

  const { messages, sendMessage, setMessages, addToolResult, status, error, clearError } =
    useChat({
      transport,
      // When the AI invokes a tool, the SDK hands the call here. We handle
      // openPage by navigating client-side and returning a result so the
      // model can continue the conversation knowing it succeeded.
      onToolCall: ({ toolCall }) => {
        if (toolCall.toolName === 'openPage') {
          const input = toolCall.input as { path?: string; reason?: string };
          const path = input?.path;
          if (typeof path === 'string' && ALLOWED_PAGES.has(path)) {
            router.push(path);
            void addToolResult({
              tool: 'openPage',
              toolCallId: toolCall.toolCallId,
              output: { ok: true, navigatedTo: path },
            });
            return;
          }
          void addToolResult({
            tool: 'openPage',
            toolCallId: toolCall.toolCallId,
            output: { ok: false, error: 'unknown_path' },
          });
        }
      },
    });

  // Hydrate prior conversation from Supabase so the AI feels like a continuing
  // companion across sessions. Runs once per mount; falls back to an empty
  // chat if the user is anonymous, has no history, or the request fails.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const token = await fetchAuthToken();
      if (!token) return;
      try {
        const res = await fetch('/api/chat/history', {
          headers: { 'x-supabase-token': token },
        });
        if (!res.ok) return;
        const json = (await res.json()) as { messages?: UIMessage[] };
        if (cancelled) return;
        if (Array.isArray(json.messages) && json.messages.length > 0) {
          setMessages(json.messages);
        }
      } catch {
        /* no history → start fresh */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [setMessages]);
  const [input, setInput] = useState('');
  const scrollerRef = useRef<HTMLDivElement>(null);

  const isStreaming = status === 'submitted' || status === 'streaming';
  const hasMessages = messages.length > 0;

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, [messages, isStreaming]);

  function submit(e: FormEvent) {
    e.preventDefault();
    const text = input.trim();
    if (!text || isStreaming) return;
    sendMessage({ text });
    setInput('');
  }

  function sendStarter(text: string) {
    if (isStreaming) return;
    sendMessage({ text });
  }

  const starters = [
    t('assistant.starter.involuntary'),
    t('assistant.starter.bituachLeumi'),
    t('assistant.starter.refusesMeds'),
  ];

  const containerClass =
    variant === 'panel'
      ? 'flex h-full flex-col'
      : 'flex flex-col h-[calc(100dvh-10rem)] max-h-[760px]';

  return (
    <div className={containerClass} dir="rtl">
      <div
        ref={scrollerRef}
        className="flex-1 overflow-y-auto px-4 md:px-5 py-5 space-y-4"
      >
        {!hasMessages && (
          <WelcomeCard subtitle={t('assistant.welcomeSubtitle')} title={t('assistant.welcomeTitle')} />
        )}

        {messages.map((m) => (
          <Bubble key={m.id} role={m.role}>
            {renderParts(m.parts)}
          </Bubble>
        ))}

        {isStreaming && messages[messages.length - 1]?.role === 'user' && (
          <Bubble role="assistant">
            <TypingDots />
          </Bubble>
        )}

        {error && (
          <div className="rounded-2xl bg-crimson/10 border border-crimson/20 text-crimson-deep text-sm px-4 py-3 leading-relaxed flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0 space-y-1">
              <div>{t('assistant.error')}</div>
              {error.message && (
                <div className="text-[11px] opacity-80 break-words font-mono leading-snug">
                  {error.message}
                </div>
              )}
            </div>
            <button
              type="button"
              onClick={clearError}
              className="shrink-0 text-xs font-semibold underline hover:no-underline"
            >
              {t('assistant.errorRetry')}
            </button>
          </div>
        )}
      </div>

      <div className="border-t border-ink/5 bg-white px-4 md:px-5 pt-3 pb-3 space-y-2">
        {!hasMessages && (
          <div className="flex flex-wrap gap-2">
            {starters.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => sendStarter(s)}
                className="text-xs md:text-sm rounded-full bg-sand-100 hover:bg-sand-50 text-ink-soft hover:text-ink px-3 py-1.5 transition-colors text-start leading-snug"
              >
                {s}
              </button>
            ))}
          </div>
        )}

        <form onSubmit={submit} className="flex items-end gap-2">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                submit(e as unknown as FormEvent);
              }
            }}
            placeholder={t('assistant.inputPlaceholder')}
            rows={1}
            className="mz-input resize-none min-h-[2.75rem] py-2.5"
          />
          <button
            type="submit"
            disabled={!input.trim() || isStreaming}
            className="mz-btn mz-btn-clay h-11 px-4 shrink-0"
            aria-label={t('assistant.send')}
          >
            <SendIcon />
          </button>
        </form>

        <p className="text-[10px] text-ink-mute leading-snug px-1">
          {t('assistant.disclaimer')}
        </p>
      </div>
    </div>
  );
}

function renderParts(parts: { type: string; text?: string }[]) {
  return (
    <>
      {parts.map((p, i) =>
        p.type === 'text' ? (
          <span key={i} className="whitespace-pre-wrap break-words leading-relaxed">
            {p.text}
          </span>
        ) : null,
      )}
    </>
  );
}

function Bubble({
  role,
  children,
}: {
  role: 'user' | 'assistant' | 'system';
  children: React.ReactNode;
}) {
  const isUser = role === 'user';
  return (
    <div className={`flex ${isUser ? 'justify-start' : 'justify-end'}`}>
      <div
        className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-[15px] leading-relaxed shadow-soft ${
          isUser
            ? 'bg-sand-100 text-ink rounded-bl-md'
            : 'bg-white text-ink border border-sand-100 rounded-br-md'
        }`}
      >
        {children}
      </div>
    </div>
  );
}

function WelcomeCard({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="rounded-card bg-white border border-sand-100 p-5 text-center shadow-soft">
      <div className="mx-auto h-10 w-10 rounded-full bg-clay/10 text-clay flex items-center justify-center mb-3">
        <SparkleIcon />
      </div>
      <h3 className="font-bold text-ink">{title}</h3>
      <p className="text-sm text-ink-mute mt-1.5 leading-relaxed">{subtitle}</p>
    </div>
  );
}

function TypingDots() {
  return (
    <span className="inline-flex items-center gap-1 py-1" aria-label="loading">
      <span className="h-1.5 w-1.5 rounded-full bg-ink-mute animate-bounce [animation-delay:-0.3s]" />
      <span className="h-1.5 w-1.5 rounded-full bg-ink-mute animate-bounce [animation-delay:-0.15s]" />
      <span className="h-1.5 w-1.5 rounded-full bg-ink-mute animate-bounce" />
    </span>
  );
}

function SendIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M21 12L4 4l3 8-3 8 17-8z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
        strokeLinecap="round"
        fill="none"
        transform="scale(-1,1) translate(-24,0)"
      />
    </svg>
  );
}

function SparkleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 3l1.7 4.6L18.4 9.3 13.8 11l-1.8 4.7L10.3 11 5.6 9.3l4.7-1.7L12 3z" />
      <path d="M19 14l.9 2.4L22 17l-2.1.9-.9 2.4-.9-2.4L16 17l2.1-.9.9-2.4z" />
    </svg>
  );
}
