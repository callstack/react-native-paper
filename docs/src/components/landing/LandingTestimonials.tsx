import LandingSection, { asset } from './LandingSection';

const testimonials = [
  {
    avatar: 'kurt.jpg',
    name: 'Kurt Kemple',
    role: 'Co-organizer of @NYCGraphQL',
    quote:
      "Paper w/ RNW is a glorious thing! Universal design systems are where it's at. #alltheplatforms",
    href: 'https://twitter.com/kurtiskemple/status/1089866560641093632',
  },
  {
    avatar: 'brent.jpg',
    name: 'brent',
    role: 'Developer @ Expo / React Native',
    quote:
      'react-native-paper is 😎 ios + android + web, and exports typescript types.',
    href: 'https://twitter.com/notbrent/status/1108492804978667520',
  },
  {
    avatar: 'osadnik.jpg',
    name: 'Michał Osadnik',
    role: 'Software Engineer @SWMansion',
    quote:
      'Still cannot believe how actively react-native-paper is maintained! Is it resurrection of Material Design on iOS in React Native?',
    href: 'https://twitter.com/mosdnk/status/1106184194458374149',
  },
];

/**
 * The source renders these in a drag Slider across two bands: a heading
 * section and a full-bleed track. This keeps the two bands and the card
 * styling, but lays the cards out statically rather than as a carousel.
 */
export default function LandingTestimonials() {
  return (
    <>
      <LandingSection variant="s1k6gosz">
        <div className="ce9bm9u">
          <h1 className="h1j92dro hn5vo52">
            They are already using
            <br />
            <span>react-native-paper</span>
          </h1>
        </div>
      </LandingSection>

      <LandingSection variant="o18vdt8l" innerClassName="i1olqn3s">
        <div className="wibeo8m">
          <div className="landing-testimonials">
            {testimonials.map((t) => (
              <figure className="landing-testimonials__item" key={t.name}>
                <blockquote>{t.quote}</blockquote>
                <figcaption>
                  <img alt="" src={asset(`images/${t.avatar}`)} />
                  <span>
                    <a href={t.href} rel="noopener noreferrer" target="_blank">
                      {t.name}
                    </a>
                    <small>{t.role}</small>
                  </span>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </LandingSection>
    </>
  );
}
