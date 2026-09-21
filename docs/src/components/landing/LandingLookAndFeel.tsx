import { useRef, useState } from 'react';

import LandingSection, { asset } from './LandingSection';

type PlayerProps = {
  name: string;
};

const Player = ({ name }: PlayerProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);

  const handleBegin = () => {
    void videoRef.current?.play();
    setPlaying(true);
  };

  return (
    <div className="landing-player">
      <video
        className="landing-player__video"
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
        <button
          aria-label="Play the demo video"
          className="landing-player__overlay"
          onClick={handleBegin}
          type="button"
        >
          <img alt="" src={asset('images/icons/play.svg')} />
        </button>
      )}
    </div>
  );
};

export default function LandingLookAndFeel() {
  return (
    <LandingSection className="landing-lookfeel" dark>
      <div className="landing-lookfeel__row">
        <div className="landing-lookfeel__col">
          <h3 className="landing-tag">Look</h3>
          <h2 className="landing-split__title">
            What makes an app look native?
          </h2>
          <p className="landing-body">
            Its interface. It is responsive, fast and works reliably on both
            platforms. When building a React component, you have to style each
            of them yourself, according to the guidelines of the platform you
            are targeting. This can be overwhelming and non-trivial to do right.
          </p>
          <img
            alt=""
            className="landing-lookfeel__badge"
            src={asset('images/material-badge.svg')}
          />
          <p className="landing-lookfeel__hint">
            <img alt="point up emoji" src={asset('images/finger.svg')} />
            <span>
              It&apos;s not a real badge, actually, but you can take our word
              for it ;)
            </span>
          </p>
        </div>
        <div className="landing-lookfeel__col">
          <Player name="paper-1" />
        </div>
      </div>

      <div className="landing-lookfeel__row landing-lookfeel__row--reverse">
        <div className="landing-lookfeel__col">
          <Player name="paper-2" />
        </div>
        <div className="landing-lookfeel__col">
          <h3 className="landing-tag">Feel</h3>
          <h2 className="landing-split__title">
            What makes an app feel native?
          </h2>
          <p className="landing-body">
            Snappy interface that behaves just like any other app. It supports
            accessibility standards - in other words, it does everything a
            native app would do. Interactions in React Native are easy to do,
            but getting to 100% polish requires extra effort. Implementing exact
            platform-specific animations, making sure it runs under heavy load
            are just two examples of what we have to think when writing
            first-class interface.
          </p>
          <p className="landing-body">
            React-native-paper ships with a lot of components and interactions
            that are there to satisfy every single use case you might have. See
            it for yourself.
          </p>
        </div>
      </div>
    </LandingSection>
  );
}
