import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Strips raw markdown syntax from text to produce a clean readable teaser snippet.
 */
export function cleanMarkdownSnippet(text?: string, maxLength = 160): string {
  if (!text) return '';
  const clean = text
    .replace(/```[\s\S]*?```/g, '')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/^#+\s+/gm, '')
    .replace(/(\*\*|__)(.*?)\1/g, '$2')
    .replace(/(\*|_)(.*?)\1/g, '$2')
    .replace(/~~(.*?)~~/g, '$1')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/^[>\-\*\+]\s+/gm, '')
    .replace(/^\d+\.\s+/gm, '')
    .replace(/\s+/g, ' ')
    .trim();
  if (clean.length <= maxLength) return clean;
  return clean.slice(0, maxLength).trim() + '...';
}

/**
 * Rough reading time in minutes (at least 1): strips markdown/HTML syntax and
 * counts words at `wpm`.
 */
export function readingMinutes(text?: string, wpm = 200): number {
  const words = (text ?? '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/[#*_~`>\-\[\]()!]/g, ' ')
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;
  return Math.max(1, Math.round(words / wpm));
}
