import LandingBanner from './LandingBanner';
import LandingCallstack from './LandingCallstack';
import LandingCode from './LandingCode';
import LandingConcepts from './LandingConcepts';
import LandingDiscord from './LandingDiscord';
import LandingHero from './LandingHero';
import LandingLookAndFeel from './LandingLookAndFeel';
import LandingMaterialYou from './LandingMaterialYou';
import LandingNumbers from './LandingNumbers';
import LandingTestimonials from './LandingTestimonials';

/** Section order follows src/pages/index.js in the landing page source. */
export default function Landing() {
  return (
    <main className="landing">
      <LandingBanner />
      <LandingHero />
      <LandingNumbers />
      <LandingLookAndFeel />
      <LandingMaterialYou />
      <LandingCode />
      <LandingConcepts />
      <LandingTestimonials />
      <LandingDiscord />
      <LandingCallstack />
    </main>
  );
}
