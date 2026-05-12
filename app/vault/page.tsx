'use client';

import { useCallback, useEffect, useRef, useState, type ChangeEvent } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useT } from '@/lib/i18n/LocaleProvider';
import { usePatientId } from '@/lib/usePatientId';
import { Recorder } from '@/components/Vault/Recorder';
import {
  deleteVaultFile,
  listVaultFiles,
  signVaultUrl,
  uploadVaultFile,
  type VaultFile,
} from '@/services/vaultService';

interface SignedItem {
  file: VaultFile;
  url: string;
}

export default function VaultPage() {
  const { t, locale } = useT();
  const { configured, user } = useAuth();
  const patientId = usePatientId();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [items, setItems] = useState<SignedItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pendingBlob, setPendingBlob] = useState<{
    blob: Blob;
    duration?: number;
    name?: string;
  } | null>(null);
  const [caption, setCaption] = useState('');

  const refresh = useCallback(async () => {
    if (!configured) {
      setLoading(false);
      return;
    }
    try {
      const files = await listVaultFiles(patientId);
      // Sign all URLs in parallel; we render previews directly from the
      // signed URL so the bucket can stay private.
      const signed = await Promise.all(
        files.map(async (f) => ({
          file: f,
          url: await signVaultUrl(f.storagePath, 60 * 10),
        })),
      );
      setItems(signed);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed');
    } finally {
      setLoading(false);
    }
  }, [configured, patientId]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  function onFilePicked(e: ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    e.target.value = '';
    if (!f) return;
    setPendingBlob({ blob: f, name: f.name });
    setCaption('');
  }

  async function save() {
    if (!pendingBlob) return;
    setBusy(true);
    setError(null);
    try {
      await uploadVaultFile(patientId, pendingBlob.blob, {
        caption: caption.trim() || undefined,
        durationSeconds: pendingBlob.duration,
        originalName: pendingBlob.name,
      });
      setPendingBlob(null);
      setCaption('');
      await refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to upload');
    } finally {
      setBusy(false);
    }
  }

  async function remove(item: SignedItem) {
    if (!confirm(t('vault.deleteConfirm'))) return;
    try {
      await deleteVaultFile(item.file);
      await refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete');
    }
  }

  if (!configured) {
    return (
      <div className="max-w-3xl mx-auto px-4 md:px-6 py-12 text-center text-ink-mute">
        {t('warRoom.notConfigured')}
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 md:px-6 py-8 md:py-12 space-y-6">
      <header>
        <div className="text-[11px] font-bold uppercase tracking-widest text-clay">
          {t('vault.kicker')}
        </div>
        <h1 className="text-3xl md:text-4xl font-extrabold mt-1">
          {t('vault.title')}
        </h1>
        <p className="text-ink-soft mt-3 leading-relaxed">{t('vault.intro')}</p>
      </header>

      <Recorder
        onCapture={(blob, duration) => {
          setPendingBlob({ blob, duration });
          setCaption('');
        }}
      />

      <div className="mz-card p-4 md:p-5">
        <div className="text-[11px] font-bold uppercase tracking-widest text-ink-mute">
          {t('vault.upload.title')}
        </div>
        <p className="text-sm text-ink-soft mt-2 leading-relaxed">
          {t('vault.upload.body')}
        </p>
        <input
          ref={fileInputRef}
          type="file"
          accept="video/*,audio/*,image/*"
          onChange={onFilePicked}
          className="hidden"
        />
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="mz-btn mz-btn-ghost h-10 px-4 text-sm mt-3"
        >
          {t('vault.upload.pick')}
        </button>
      </div>

      {pendingBlob && (
        <div className="mz-card p-4 md:p-5 space-y-3 border-2 border-clay/30">
          <div className="text-[11px] font-bold uppercase tracking-widest text-clay">
            {t('vault.pending.title')}
          </div>
          <p className="text-sm text-ink-soft leading-relaxed">
            {pendingBlob.name ?? t('vault.pending.newRecording')} ·{' '}
            {formatBytes(pendingBlob.blob.size)}
            {pendingBlob.duration ? ` · ${pendingBlob.duration}s` : ''}
          </p>
          <label className="block">
            <span className="text-xs font-semibold text-ink-soft">
              {t('vault.pending.captionLabel')}
            </span>
            <input
              type="text"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder={t('vault.pending.captionPlaceholder')}
              className="mz-input mt-1.5"
              maxLength={140}
            />
          </label>
          <div className="flex gap-2 justify-end">
            <button
              type="button"
              onClick={() => {
                setPendingBlob(null);
                setCaption('');
              }}
              className="mz-btn mz-btn-ghost h-10 px-4 text-sm"
            >
              {t('common.cancel')}
            </button>
            <button
              type="button"
              onClick={save}
              disabled={busy}
              className="mz-btn mz-btn-clay h-10 px-4 text-sm"
            >
              {busy ? t('common.saving') : t('vault.pending.save')}
            </button>
          </div>
        </div>
      )}

      {error && (
        <p className="text-sm text-crimson-deep bg-crimson-bg rounded-xl px-3 py-2">
          {error}
        </p>
      )}

      <section>
        <h2 className="text-lg font-bold mb-3">{t('vault.items.heading')}</h2>
        {loading ? (
          <p className="text-sm text-ink-mute">{t('common.loading')}</p>
        ) : items.length === 0 ? (
          <p className="text-sm text-ink-mute text-center py-6">{t('vault.items.empty')}</p>
        ) : (
          <ul className="space-y-3">
            {items.map((it) => (
              <li key={it.file.id} className="mz-card p-4">
                <div className="flex items-start justify-between gap-3 flex-wrap mb-2">
                  <div className="min-w-0">
                    <div className="text-xs text-ink-mute">
                      {new Date(it.file.createdAt).toLocaleString(
                        locale === 'he' ? 'he-IL' : 'en-US',
                      )}{' '}
                      · {it.file.kind} · {formatBytes(it.file.byteSize ?? 0)}
                    </div>
                    {it.file.caption && (
                      <p className="text-sm mt-1 leading-relaxed">{it.file.caption}</p>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => remove(it)}
                    className="text-xs text-ink-mute underline hover:text-crimson-deep"
                  >
                    {t('common.cancel')}
                  </button>
                </div>
                <Preview item={it} />
              </li>
            ))}
          </ul>
        )}
      </section>

      <aside className="rounded-2xl bg-amber_-bg text-amber_-ink p-4 text-sm leading-relaxed border border-amber_/30">
        {t('vault.disclaimer')}
      </aside>

      <p className="text-xs text-ink-mute leading-relaxed">{t('vault.encryptionNote')}</p>

      {!user && null}
    </div>
  );
}

function Preview({ item }: { item: SignedItem }) {
  if (item.file.kind === 'video') {
    return (
      <video
        controls
        playsInline
        src={item.url}
        className="w-full rounded-xl bg-black max-h-[60vh]"
      />
    );
  }
  if (item.file.kind === 'audio') {
    return <audio controls src={item.url} className="w-full" />;
  }
  if (item.file.kind === 'image') {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={item.url}
        alt={item.file.caption ?? ''}
        className="w-full rounded-xl max-h-[60vh] object-contain bg-sand-50"
      />
    );
  }
  return (
    <a
      href={item.url}
      target="_blank"
      rel="noreferrer noopener"
      className="mz-btn mz-btn-ghost h-10 px-4 text-sm"
    >
      Open
    </a>
  );
}

function formatBytes(n: number): string {
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${Math.round(n / 1024)} KB`;
  return `${(n / (1024 * 1024)).toFixed(1)} MB`;
}
