import LandingButton from './LandingButton';
import LandingSection, { asset } from './LandingSection';

export default function LandingDiscord() {
  return (
    <LandingSection variant="s1k6gqjz" dark>
      <div className="c1idk4n3">
        <img alt="Discord logo" src={asset('images/icons/discord.svg')} />
        <h2>We are in Discord</h2>
        <h3>Join us in the #react-native-paper channel</h3>
        <p>
          Community where people discuss and supports others in building
          react-native-paper apps.
        </p>
        <LandingButton dark external href="https://discord.gg/zwR2Cdh">
          Join us on Discord
        </LandingButton>
      </div>
    </LandingSection>
  );
}
