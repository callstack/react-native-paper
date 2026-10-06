import LandingSection, { asset } from './LandingSection';

export default function LandingMaterialYou() {
  return (
    <LandingSection className="landing-materialyou">
      <div className="landing-split">
        <div>
          <h2 className="landing-split__title">
            Paper supports <span>Material You</span>!
          </h2>
          <p className="landing-body">
            React Native Paper library officially supports the new Material
            Design generation called Material You - a brand new and the most
            expressive design system by Google.
          </p>
          <p className="landing-body">
            All of the Paper&apos;s components have been adjusted to the latest
            standards of visual by changes in colors, typography and animations
            so you can build your apps according to the latest trends.
          </p>
        </div>
        <div className="landing-split__media">
          <img
            alt="Material You components"
            className="landing-split__image"
            src={asset('images/material-you.png')}
          />
        </div>
      </div>
    </LandingSection>
  );
}
