import LandingSection from './LandingSection';

/**
 * Header.js in the source. The paper logo and GitHub link that flank it there
 * are already provided by the docs navbar, so only the call to action remains.
 */
export default function LandingBanner() {
  return (
    <LandingSection variant="sl968z4" innerClassName="sdarceo">
      <div>
        <header className="hv0shhd">
          <div className="h12yetm2">
            <p className="hfwrvff">
              Need a customized UI kit for Android &amp; iOS?{' '}
              <a href="#contact">Get started</a>
            </p>
          </div>
        </header>
      </div>
    </LandingSection>
  );
}
