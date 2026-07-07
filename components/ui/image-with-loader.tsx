'use client';

import NextImage, { ImageProps } from 'next/image';
import { useState } from 'react';
import { cn } from '@/lib/utils';

// next/image wrapper that shows the image blurred + slightly scaled while it
// loads, then transitions to sharp once loaded. Accepts all next/image props;
// `className` styles the image itself.
export function ImageWithLoader({
  className,
  onLoad,
  ...props
}: ImageProps) {
  const [loaded, setLoaded] = useState(false);

  return (
    <span className="relative block h-full w-full overflow-hidden bg-muted">
      <NextImage
        sizes={props.fill ? '(max-width: 768px) 100vw, 33vw' : undefined}
        {...props}
        onLoad={(e) => {
          setLoaded(true);
          onLoad?.(e);
        }}
        className={cn(
          'transition-[filter,transform] duration-700 ease-out',
          // Blurry + zoomed while loading, sharp once loaded
          loaded ? 'blur-0 scale-100' : 'scale-105 blur-xl',
          className
        )}
      />
    </span>
  );
}
