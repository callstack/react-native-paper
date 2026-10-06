import LandingSection from './LandingSection';

/**
 * The band above the hero, from Header.js in the landing page source. The
 * paper logo and GitHub link that sit alongside it there are already provided
 * by the docs navbar, so only the call to action is carried over.
 */
export default function LandingBanner() {
  return (
    <LandingSection className="landing-banner">
      <p className="landing-banner__text">
        Need a customized UI kit for Android &amp; iOS?{' '}
        <a href="#contact">Get started</a>
      </p>
    </LandingSection>
  );
}
