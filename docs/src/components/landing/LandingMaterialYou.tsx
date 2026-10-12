import LandingSection, { asset } from './LandingSection';

export default function LandingMaterialYou() {
  return (
    <LandingSection variant="w1xuvb7e">
      <div className="c1i5490c">
        <div className="h1c4x4n0">
          <h1 className="h1knnu89">
            Paper supports <span>Material You</span>!
          </h1>
          <p className="b1tutycc">
            React Native Paper library officially supports the new Material
            Design generation called Material You - a brand new and the most
            expressive design system by Google.
          </p>
          <p className="b1tutycc">
            All of the Paper&rsquo;s components have been adjusted to the latest
            standards of visual by changes in colors, typography and animations
            so you can build your apps according to the latest trends.
          </p>
        </div>
        <div className="mbij43c">
          <img
            alt="Material You components"
            className="m6ymebm"
            src={asset('images/material-you.png')}
          />
        </div>
      </div>
    </LandingSection>
  );
}
