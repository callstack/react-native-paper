import type { ReactNode } from 'react';

import LandingSection, { asset } from './LandingSection';
import LandingSlider from './LandingSlider';

type Testimonial = {
  avatar: string;
  name: string;
  role: string;
  quote: ReactNode;
  href: string;
};

const testimonials: Testimonial[] = [
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
    quote: (
      <>
        react-native-paper is{' '}
        <span aria-label="cool" role="img">
          😎
        </span>{' '}
        ios + android + web, and exports typescript types.
      </>
    ),
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
 * homepage/Testimonials.js, across two bands: a heading section and a
 * full-bleed track holding components/Testimonial.js cards in the Slider.
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
        <LandingSlider initialSlide={2} slidesAmount={testimonials.length}>
          {testimonials.map((testimonial) => (
            <div className="c1pd6wp7" key={testimonial.name}>
              <div className="cjmn5uj">
                <img
                  alt=""
                  className="a1r8fups"
                  src={asset(`images/${testimonial.avatar}`)}
                />
                <div>
                  <h3>{testimonial.name}</h3>
                  <h4>{testimonial.role}</h4>
                </div>
                <a
                  className="twitter"
                  href={testimonial.href}
                  rel="noreferrer noopener"
                  target="_blank"
                >
                  <img alt="" src={asset('images/icons/twitter.svg')} />
                </a>
              </div>
              <div className="c1htk8me">{testimonial.quote}</div>
            </div>
          ))}
        </LandingSlider>
      </LandingSection>
    </>
  );
}
