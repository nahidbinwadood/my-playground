import { CTASection } from '@/components/home/cta-section';
import { FeaturesSection } from '@/components/home/features-section';
import { HeroSection } from '@/components/home/hero-section';
import { LatestBlogsSection } from '@/components/home/latest-blogs-section';
import { StatsSection } from '@/components/home/stats-section';
import { TechMarquee } from '@/components/home/tech-marquee';
import { Fragment } from 'react';

export default function Home() {
  return (
    <Fragment>
      <HeroSection />
      <TechMarquee />
      <StatsSection />
      <FeaturesSection />
      <LatestBlogsSection />
      <CTASection />
    </Fragment>
  );
}
