import { CTASection } from '@/components/home/cta-section';
import { HeroPanel } from '@/components/home/hero-panel';
import { HeroSection } from '@/components/home/hero-section';
import { LatestBlogsSection } from '@/components/home/latest-blogs-section';
import { LatestNotesSection } from '@/components/home/latest-notes-section';
import { TechMarquee } from '@/components/home/tech-marquee';
import { Fragment } from 'react';

export const revalidate = 3600;

export default function Home() {
  return (
    <Fragment>
      <HeroSection panel={<HeroPanel />} />
      <TechMarquee />
      <LatestNotesSection />
      <LatestBlogsSection />
      <CTASection />
    </Fragment>
  );
}
