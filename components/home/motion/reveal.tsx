'use client';

import { motion } from 'motion/react';
import { ReactNode } from 'react';

// Fades + slides its children up when they scroll into view (once).
// Pass `delay` to stagger sibling reveals.
export function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.5, delay, ease: 'easeOut' as const }}
    >
      {children}
    </motion.div>
  );
}
