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
    <LandingSection variant="s10i33tn" dark>
      <div className="c1e6p7u3">
        <div>
          <h2>Key concepts</h2>
          <p>
            react-native-paper focuses in important concepts that are hard to
            build from scratch.
          </p>
        </div>
        <div className="r1an33qj">
          {concepts.map((concept) => (
            <div className="caka61c" key={concept.title}>
              <div className="cg6sb30">
                <img
                  alt={concept.title}
                  src={asset(`images/icons/${concept.icon}`)}
                />
                <h4>{concept.title}</h4>
                <p>{concept.body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </LandingSection>
  );
}
