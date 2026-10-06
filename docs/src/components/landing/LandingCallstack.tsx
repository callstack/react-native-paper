import LandingButton from './LandingButton';
import LandingSection, { asset } from './LandingSection';

export default function LandingCallstack() {
  return (
    <LandingSection variant="s1xiom6p" id="contact">
      <div className="ct77mvk">
        <h2>Paper is created by</h2>
        <img alt="Callstack logo" src={asset('images/icons/callstack.svg')} />
        <h3>React Native Core Contributors and official Facebook partners</h3>
        <p>
          Callstack cooperates with many clients from various industries,
          including big enterprises, helping them to improve their React Native
          products and achieve business goals.
        </p>
        <LandingButton dark external href="https://callstack.com/">
          Visit Callstack
        </LandingButton>
      </div>
    </LandingSection>
  );
}
