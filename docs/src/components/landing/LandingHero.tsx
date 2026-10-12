import { useEffect, useState } from 'react';

import { useVersion, withBase } from '@rspress/core/dist/runtime/index.js';

import LandingButton from './LandingButton';
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
    <LandingSection variant="wwffi0l" id="hero">
      <div className="cztnm0o">
        <div className="hrrzndk">
          <h1 className="hmtzm5j">
            Making your React Native apps <span>look and feel native</span>
          </h1>

          <div className="g1n6np2q">
            <span className="gwvv8a1">
              <a
                className="g1cwq15n"
                aria-label="Star callstack/react-native-paper on GitHub"
                href={REPO}
                rel="noopener noreferrer"
                target="_blank"
              >
                <span className="s5mrc6w">
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
            <span className="s152rxo6">
              <b className="dqnumg8" />
              <i className="lmbp5un" />
              <a
                className="g1cwq15n"
                aria-label={`${stars} stargazers on GitHub`}
                href={`${REPO}/stargazers`}
                rel="noopener noreferrer"
                target="_blank"
              >
                {stars}
              </a>
            </span>
          </div>

          <p className="bia8az9">
            React Native Paper is a high-quality, standard-compliant Material
            Design library that has you covered in all major use-cases.
          </p>

          <div className="r17y5eu1">
            <LandingButton dark href="#numbers">
              Learn more
            </LandingButton>
            <LandingButton href={docsHref}>Docs</LandingButton>
          </div>

          <div className="smvkndv">
            <p className="bia8az9">Try out components in our demo apps:</p>
            <div>
              <a href="https://play.google.com/store/apps/details?id=com.callstack.reactnativepaperexample">
                <img
                  alt="google play store logo"
                  className="skghjfv"
                  src={asset('images/google-play.svg')}
                />
              </a>
              <a href="https://apps.apple.com/app/react-native-paper/id1548934513">
                <img
                  alt="appstore logo"
                  className="skghjfv"
                  src={asset('images/appstore.svg')}
                />
              </a>
            </div>
          </div>
        </div>

        <div className="mlu3qb8">
          <img
            alt="mobile mockup"
            className="hyn0pf"
            src={asset('images/hero-image.png')}
          />
          <div className="h1w9fa70" />
        </div>
      </div>
    </LandingSection>
  );
}
