'use client';

import React, { useState } from 'react';
import { Bot, Sparkles, Languages, Check, Copy } from 'lucide-react';
import { SupportedLocale } from '../../i18n/types';
import { LOCALE_MAP } from '../../i18n/language-config';
import { useTranslation } from '../../i18n/use-translation';

interface AITranslationToggleProps {
  originalText: string;
  originalLocale: SupportedLocale;
  translatedText?: string;
  targetLocale?: SupportedLocale;
  confidenceScore?: number;
  className?: string;
}

export function AITranslationToggle({
  originalText,
  originalLocale,
  translatedText,
  targetLocale = 'en',
  confidenceScore = 0.985,
  className = '',
}: AITranslationToggleProps) {
  const { t } = useTranslation();
  const [viewMode, setViewMode] = useState<'original' | 'translated'>('translated');
  const [copied, setCopied] = useState(false);

  const origLang = LOCALE_MAP[originalLocale]?.name || originalLocale;
  const targetLang = LOCALE_MAP[targetLocale]?.name || targetLocale;

  const displayText =
    viewMode === 'original'
      ? originalText
      : translatedText || `[AI English Translation]: ${originalText}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(displayText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={`rounded-xl border border-border/80 bg-card p-4 shadow-sm ${className}`}>
      {/* Header bar with language tags and mode toggles */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-border/50">
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20">
            <Sparkles className="h-3.5 w-3.5" />
            Social-X IndicAI
          </span>
          <span className="text-xs text-muted-foreground">
            {origLang} → {targetLang}
          </span>
          <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">
            {(confidenceScore * 100).toFixed(1)}% {t('ai.confidenceScore', 'Confidence')}
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          {/* Segmented Button */}
          <div className="inline-flex rounded-lg bg-muted p-0.5 text-xs font-medium">
            <button
              type="button"
              onClick={() => setViewMode('original')}
              className={`px-3 py-1 rounded-md transition-colors ${
                viewMode === 'original'
                  ? 'bg-background text-foreground shadow-sm font-semibold'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {origLang} ({t('government.citizenVernacularView', 'Original')})
            </button>
            <button
              type="button"
              onClick={() => setViewMode('translated')}
              className={`px-3 py-1 rounded-md transition-colors ${
                viewMode === 'translated'
                  ? 'bg-background text-foreground shadow-sm font-semibold'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {targetLang} ({t('government.englishTranslationView', 'Translation')})
            </button>
          </div>

          {/* Copy Button */}
          <button
            type="button"
            onClick={handleCopy}
            title="Copy Text"
            className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          >
            {copied ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Main Content display */}
      <div className="pt-3 text-sm leading-relaxed text-foreground whitespace-pre-wrap">
        {displayText}
      </div>

      {/* Footer indication */}
      <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground pt-2 border-t border-border/30">
        <span className="flex items-center gap-1">
          <Languages className="h-3 w-3" />
          {viewMode === 'original'
            ? `Original grievance submitted in ${origLang}`
            : `AI translated to ${targetLang} using Social-X Indic NMT`}
        </span>
        <span>Auto-routing & SLA Active</span>
      </div>
    </div>
  );
}
