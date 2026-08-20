'use client';

import { animate, useInView } from 'motion/react';
import { useEffect, useRef, useState } from 'react';

// Counts from 0 up to `value` when scrolled into view.
export function CountUp({
  value,
  duration = 1.2,
  suffix = '',
}: {
  value: number;
  duration?: number;
  suffix?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView) return;
    // Animate a 0->value tween and round each frame for the counter effect.
    const controls = animate(0, value, {
      duration,
      ease: 'easeOut' as const,
      onUpdate: (v) => setDisplay(Math.round(v)),
    });
    return () => controls.stop();
  }, [inView, value, duration]);

  // The ticking figure is decorative once the real value is exposed to
  // assistive tech — that also keeps the number correct before JS runs.
  return (
    <span ref={ref}>
      <span aria-hidden="true">
        {display}
        {suffix}
      </span>
      <span className="sr-only">
        {value}
        {suffix}
      </span>
    </span>
  );
}
