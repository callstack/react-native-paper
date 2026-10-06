import { useRef, useState } from 'react';

import type { CSSVars } from './cssVars';
import LandingSection, { asset } from './LandingSection';

type PlayerProps = { name: string };

/** LookAndFeel.js `PlayerContainer` — capped at 297x630 to hold the ratio. */
const poster = (name: string): CSSVars => ({
  '--p626bjh-0': `url(${asset(`videos/${name}-poster.png`)})`,
});

const Player = ({ name }: PlayerProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);

  const handleBegin = () => {
    void videoRef.current?.play();
    setPlaying(true);
  };

  return (
    <div className="p626bjh" style={poster(name)}>
      <video
        className="py956vk"
        loop
        muted
        playsInline
        poster={asset(`videos/${name}-poster.png`)}
        preload="none"
        ref={videoRef}
      >
        <source src={asset(`videos/${name}.webm`)} type="video/webm" />
        <source src={asset(`videos/${name}.mp4`)} type="video/mp4" />
      </video>
      {playing ? null : (
        <div className="p2eysq8" onClick={handleBegin} role="presentation">
          <img
            alt="Play"
            className="p18nt66k"
            src={asset('images/icons/play.svg')}
          />
        </div>
      )}
    </div>
  );
};

export default function LandingLookAndFeel() {
  return (
    <LandingSection variant="o6bp5sh" dark>
      <div className="r1c5jsvp">
        <div className="c1r5rfba">
          <div>
            <div className="c17p1dxj">
              <h3 className="t1n6sdu9">Look</h3>
              <h2 className="h1irmz7o">What makes an app look native?</h2>
              <p className="c1ofgfit">
                Its interface. It is responsive, fast and works reliably on both
                platforms. When building a React component, you have to style
                each of them yourself, according to the guidelines of the
                platform you are targeting. This can be overwhelming and
                non-trivial to do right.
              </p>
              <img
                alt=""
                className="bpqw886"
                src={asset('images/material-badge.svg')}
              />
              <div className="hz1a1q4">
                <img alt="point up emoji" src={asset('images/finger.svg')} />
                <span>
                  It&apos;s not a real badge, actually, but you can take our
                  word for it ;)
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="c1r5rfba">
          <Player name="paper-1" />
        </div>
      </div>

      <div className="r1c5jsvp landing-lookfeel__row--second">
        <div className="c1r5rfba">
          <Player name="paper-2" />
        </div>
        <div className="c1r5rfba">
          <div className="c17p1dxj">
            <h3 className="t1n6sdu9">Feel</h3>
            <h2 className="h1irmz7o">What makes an app feel native?</h2>
            <p className="c1ofgfit">
              Snappy interface that behaves just like any other app. It supports
              accessibility standards - in other words, it does everything a
              native app would do. Interactions in React Native are easy to do,
              but getting to 100% polish requires extra effort. Implementing
              exact platform-specific animations, making sure it runs under
              heavy load are just two examples of what we have to think when
              writing first-class interface.
            </p>
            <p className="c1ofgfit">
              React-native-paper ships with a lot of components and interactions
              that are there to satisfy every single use case you might have.
              See it for yourself.
            </p>
          </div>
        </div>
      </div>
    </LandingSection>
  );
}
