import { CTASection } from '@/components/home/cta-section';
import { HeroSection } from '@/components/home/hero-section';
import { Fragment } from 'react/jsx-runtime';

export default function Home() {
  return (
    <Fragment>
      <HeroSection />
      {/* <FeaturesSection /> */}
      <CTASection />
    </Fragment>
  );
}
