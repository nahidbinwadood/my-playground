'use client';

import { motion } from 'motion/react';

// Faux terminal card with a glowing gradient border and lines that reveal
// one-by-one. Purely decorative — no real shell.
const lines = [
  { text: '$ npx create-playground my-app', prompt: true },
  { text: '✔ Scaffolding Next.js 16 + TypeScript', prompt: false },
  { text: '✔ Adding Tailwind CSS 4 + shadcn/ui', prompt: false },
  { text: '✔ Wiring form challenges & blog CMS', prompt: false },
  { text: '🚀 Ready! Happy hacking.', prompt: false },
];

export function Terminal() {
  return (
    <div className="group relative mx-auto w-full max-w-3xl">
      {/* Neon glow behind the card */}
      <div className="absolute -inset-1 rounded-2xl bg-linear-to-r from-emerald-500/40 via-teal-500/40 to-cyan-500/40 opacity-60 blur-xl transition-opacity duration-500 group-hover:opacity-100" />

      {/* Gradient border wrapper */}
      <div className="relative rounded-2xl bg-linear-to-br from-emerald-500/40 via-white/10 to-transparent p-px shadow-2xl">
        <div className="overflow-hidden rounded-2xl bg-zinc-950/95 backdrop-blur-xl">
          {/* Title bar */}
          <div className="flex items-center gap-2 border-b border-white/10 bg-white/5 px-4 py-3">
            <span className="h-3 w-3 rounded-full bg-red-500/90" />
            <span className="h-3 w-3 rounded-full bg-yellow-500/90" />
            <span className="h-3 w-3 rounded-full bg-green-500/90" />
            <span className="ml-3 flex items-center gap-1.5 text-xs text-zinc-400">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
              bash — playground
            </span>
          </div>

          {/* Body */}
          <div className="space-y-1.5 p-6 font-mono text-sm">
            {lines.map((line, i) => (
              <motion.p
                key={i}
                initial={{ opacity: 0, x: -8 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 + i * 0.4, duration: 0.3 }}
                className={
                  line.prompt
                    ? 'text-emerald-400 drop-shadow-[0_0_8px_rgba(16,185,129,0.5)]'
                    : 'text-zinc-300'
                }
              >
                {line.text}
              </motion.p>
            ))}
            {/* Blinking caret */}
            <motion.span
              className="inline-block h-4 w-2 bg-emerald-400 align-middle shadow-[0_0_10px_rgba(16,185,129,0.8)]"
              animate={{ opacity: [1, 0, 1] }}
              transition={{ repeat: Infinity, duration: 1 }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
