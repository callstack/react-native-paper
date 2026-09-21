import LandingSection, { asset } from './LandingSection';

const concepts = [
  {
    icon: 'platform-icon.svg',
    title: 'Platform adaptation',
    body: 'React-native-paper meets high expectations set by iOS and Android ecosystems. Your users will appreciate this choice.',
  },
  {
    icon: 'theming-icon.svg',
    title: 'Full theming support',
    body: 'Every app is different - that’s why themes are first-class citizens in React-native-paper. Switch between dark and light modes, customise default colours or make your own. It’s never been that easy.',
  },
  {
    icon: 'accessibility-icon.svg',
    title: 'Accessibility and RTL support',
    body: 'React-native-paper is fully compatible with screen readers, readability tools and right-to-left languages. Make your app inclusive by default.',
  },
];

export default function LandingConcepts() {
  return (
    <LandingSection className="landing-concepts" dark>
      <h2 className="landing-heading">Key concepts</h2>
      <p className="landing-body landing-concepts__lede">
        react-native-paper focuses in important concepts that are hard to build
        from scratch.
      </p>

      <div className="landing-concepts__grid">
        {concepts.map((concept) => (
          <article className="landing-concepts__item" key={concept.title}>
            <img
              alt=""
              className="landing-concepts__icon"
              src={asset(`images/icons/${concept.icon}`)}
            />
            <h3 className="landing-concepts__item-title">{concept.title}</h3>
            <p className="landing-concepts__item-body">{concept.body}</p>
          </article>
        ))}
      </div>
    </LandingSection>
  );
}
