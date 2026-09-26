'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Globe, Check, ChevronDown } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { SUPPORTED_LANGUAGES, changeAppLanguage, LANGUAGE_STORAGE_KEY } from '@/i18n';
import { useLanguageStore } from '@/features/shared/i18n/use-language-store';
import { SupportedLocale } from '@/features/shared/i18n/types';

interface LanguageSwitcherProps {
  compact?: boolean;
  className?: string;
}

export function LanguageSwitcher({ compact = false, className = '' }: LanguageSwitcherProps) {
  const { i18n, t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const setStoreLocale = useLanguageStore((state) => state.setLocale);

  const currentLangCode = (i18n.language || 'en').split(/[-_]/)[0];

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Handle keyboard shortcuts (Escape to close)
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  const handleSelect = async (langCode: string) => {
    setStoreLocale(langCode as SupportedLocale);
    await changeAppLanguage(langCode);
    setIsOpen(false);
  };

  return (
    <div className={`relative inline-block text-left ${className}`} ref={dropdownRef}>
      {/* Trigger Button: 🌐 Language */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-label="Select Language"
        className={`flex items-center gap-2 rounded-xl border border-border/80 bg-background/80 px-3 py-1.5 text-xs font-semibold text-foreground backdrop-blur-md transition-all hover:bg-accent/60 hover:border-border focus:outline-none focus:ring-2 focus:ring-primary/40 active:scale-95 ${
          compact ? 'px-2' : 'px-3'
        }`}
      >
        <Globe className="h-4 w-4 text-primary shrink-0" />
        <span className="inline-block tracking-tight">
          {t('language', 'Language')}
        </span>
        <ChevronDown
          className={`h-3 w-3 text-muted-foreground transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {/* Popover Dropdown */}
      {isOpen && (
        <div
          role="listbox"
          className="absolute right-0 z-50 mt-2 w-56 rounded-2xl border border-border bg-popover/95 p-1.5 shadow-2xl backdrop-blur-xl animate-in fade-in zoom-in-95 duration-150"
        >
          <div className="space-y-0.5 max-h-72 overflow-y-auto custom-scrollbar">
            {SUPPORTED_LANGUAGES.map((lang) => {
              const isSelected = lang.code === currentLangCode;
              return (
                <button
                  key={lang.code}
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => handleSelect(lang.code)}
                  className={`group flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-xs transition-colors ${
                    isSelected
                      ? 'bg-primary text-primary-foreground font-semibold shadow-xs'
                      : 'text-foreground hover:bg-accent/70'
                  }`}
                >
                  <span className="font-medium text-sm">
                    {lang.nativeName}
                  </span>
                  {isSelected && (
                    <Check className="h-4 w-4 shrink-0 text-primary-foreground" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export default LanguageSwitcher;
