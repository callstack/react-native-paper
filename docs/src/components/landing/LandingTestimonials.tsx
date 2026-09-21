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

export default function LandingTestimonials() {
  return (
    <LandingSection className="landing-testimonials">
      <h2 className="landing-heading">
        They are already using <span>react-native-paper</span>
      </h2>

      <div className="landing-testimonials__grid">
        {testimonials.map((testimonial) => (
          <figure className="landing-testimonials__item" key={testimonial.name}>
            <blockquote className="landing-testimonials__quote">
              {testimonial.quote}
            </blockquote>
            <figcaption className="landing-testimonials__author">
              <img
                alt=""
                className="landing-testimonials__avatar"
                src={asset(`images/${testimonial.avatar}`)}
              />
              <span>
                <span className="landing-testimonials__name">
                  {testimonial.href ? (
                    <a
                      href={testimonial.href}
                      rel="noopener noreferrer"
                      target="_blank"
                    >
                      {testimonial.name}
                    </a>
                  ) : (
                    testimonial.name
                  )}
                </span>
                <span className="landing-testimonials__role">
                  {testimonial.role}
                </span>
              </span>
            </figcaption>
          </figure>
        ))}
      </div>
    </LandingSection>
  );
}
