import LandingSection, { asset } from './LandingSection';

export default function LandingCallstack() {
  return (
    <LandingSection className="landing-callstack" id="contact">
      <h2 className="landing-heading">Paper is created by</h2>
      <img
        alt="Callstack logo"
        className="landing-callstack__icon"
        src={asset('images/icons/callstack.svg')}
      />
      <h3 className="landing-subheading">
        React Native Core Contributors and official Facebook partners
      </h3>
      <p className="landing-body landing-callstack__body">
        Callstack cooperates with many clients from various industries,
        including big enterprises, helping them to improve their React Native
        products and achieve business goals.
      </p>
      <a
        className="landing-button"
        href="https://callstack.com/"
        rel="noopener noreferrer"
        target="_blank"
      >
        Visit Callstack
      </a>
    </LandingSection>
  );
}
