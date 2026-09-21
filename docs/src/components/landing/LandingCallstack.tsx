import LandingSection, { asset } from './LandingSection';

export default function LandingCallstack() {
  return (
    <LandingSection className="landing-callstack" id="contact">
      <img
        alt=""
        className="landing-callstack__icon"
        src={asset('images/icons/callstack.svg')}
      />
      <h2 className="landing-heading">
        Paper is created by{' '}
        <span>
          React Native Core Contributors and official Facebook partners
        </span>
      </h2>
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
