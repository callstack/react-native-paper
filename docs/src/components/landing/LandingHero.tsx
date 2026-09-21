import { useEffect, useState } from 'react';

import { useVersion, withBase } from '@rspress/core/dist/runtime/index.js';

import LandingSection, { asset } from './LandingSection';
import { getNextRoute } from '../../utils/versionRoutes';

const REPO = 'https://github.com/callstack/react-native-paper';
const GETTING_STARTED = '/docs/guides/getting-started';
const STARS_FALLBACK = '3000+';

/** Mirrors fetchStars.js from the landing page source. */
function useGithubStars() {
  const [stars, setStars] = useState<string>(() => {
    try {
      return localStorage.getItem('cachedGithubStars') ?? STARS_FALLBACK;
    } catch {
      return STARS_FALLBACK;
    }
  });

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        const response = await fetch(
          'https://api.github.com/repos/callstack/react-native-paper'
        );
        const json = await response.json();

        if (cancelled || typeof json?.stargazers_count !== 'number') {
          return;
        }

        const count = String(json.stargazers_count);

        setStars(count);

        try {
          localStorage.setItem('cachedGithubStars', count);
        } catch {
          // Storage can be unavailable; the count is non-essential.
        }
      } catch {
        // Keep whatever value is already rendered.
      }
    };

    void load();

    return () => {
      cancelled = true;
    };
  }, []);

  return stars;
}

export default function LandingHero() {
  const version = useVersion() || '5.x';
  const stars = useGithubStars();
  const docsHref = withBase(
    version === '6.x' ? getNextRoute(GETTING_STARTED) : GETTING_STARTED
  );

  return (
    <LandingSection className="landing-hero" id="hero">
      <div className="landing-hero__container">
        <div className="landing-hero__copy">
          <h1 className="landing-hero__title">
            Making your React Native apps <span>look and feel native</span>
          </h1>

          <div className="landing-hero__github">
            <span className="landing-hero__github-button">
              <a
                aria-label="Star callstack/react-native-paper on GitHub"
                href={REPO}
                rel="noopener noreferrer"
                target="_blank"
              >
                <span className="landing-hero__star-icon">
                  <svg
                    aria-hidden="true"
                    height="16"
                    viewBox="0 0 14 16"
                    width="14"
                  >
                    <path
                      fill="currentColor"
                      fillRule="evenodd"
                      d="M14 6l-4.9-.64L7 1 4.9 5.36 0 6l3.6 3.26L2.67 14 7 11.67 11.33 14l-.93-4.74L14 6z"
                    />
                  </svg>
                </span>
                <span>Star</span>
              </a>
            </span>
            <span className="landing-hero__github-count">
              <a
                aria-label={`${stars} stargazers on GitHub`}
                href={`${REPO}/stargazers`}
                rel="noopener noreferrer"
                target="_blank"
              >
                {stars}
              </a>
            </span>
          </div>

          <p className="landing-body">
            React Native Paper is a high-quality, standard-compliant Material
            Design library that has you covered in all major use-cases.
          </p>

          <div className="landing-hero__actions">
            <a className="landing-button" href="#numbers">
              Learn more
            </a>
            <a className="landing-button landing-button--light" href={docsHref}>
              Docs
            </a>
          </div>

          <div className="landing-hero__stores">
            <p className="landing-body">Try out components in our demo apps:</p>
            <div>
              <a href="https://play.google.com/store/apps/details?id=com.callstack.reactnativepaperexample">
                <img
                  alt="google play store logo"
                  className="landing-hero__store-logo"
                  src={asset('images/google-play.svg')}
                />
              </a>
              <a href="https://apps.apple.com/app/react-native-paper/id1548934513">
                <img
                  alt="appstore logo"
                  className="landing-hero__store-logo"
                  src={asset('images/appstore.svg')}
                />
              </a>
            </div>
          </div>
        </div>

        <div className="landing-hero__mobiles">
          <img
            alt="mobile mockup"
            className="landing-hero__image"
            src={asset('images/hero-image.png')}
          />
          <div className="landing-hero__image2" />
        </div>
      </div>
    </LandingSection>
  );
}
