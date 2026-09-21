import LandingSection, { asset } from './LandingSection';

export default function LandingDiscord() {
  return (
    <LandingSection className="landing-discord" dark>
      <img
        alt=""
        className="landing-discord__icon"
        src={asset('images/icons/discord.svg')}
      />
      <h2 className="landing-heading">
        Join us in the <span>#react-native-paper</span> channel
      </h2>
      <p className="landing-body landing-discord__body">
        Community where people discuss and supports others in building
        react-native-paper apps.
      </p>
      <a
        className="landing-button landing-button--light"
        href="https://discord.gg/zwR2Cdh"
        rel="noopener noreferrer"
        target="_blank"
      >
        Join us on Discord
      </a>
    </LandingSection>
  );
}
