import { useEffect, useState } from 'react';

import LandingSection, { asset } from './LandingSection';

const PAPER_STATS_API =
  'https://paper-github-stats-h6ah15j9p.vercel.app/api/github-stats';

type Stats = {
  stars: number;
  commits: number;
  weeklyDownloads: number;
};

/** Shown until the API responds, same values as the landing page source. */
const fallbackData: Stats = {
  stars: 7371,
  commits: 1306,
  weeklyDownloads: 55300,
};

export default function LandingNumbers() {
  const [data, setData] = useState<Stats>(fallbackData);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        const response = await fetch(PAPER_STATS_API);
        const json = await response.json();

        if (!cancelled) {
          setData(json);
        }
      } catch (error) {
        console.error('Error while fetching numbers', error);
      }
    };

    void load();

    return () => {
      cancelled = true;
    };
  }, []);

  const items = [
    {
      icon: 'download-icon.svg',
      value: data.weeklyDownloads,
      label: (
        <>
          Downloads weekly on{' '}
          <a href="https://www.npmjs.com/package/react-native-paper">npm</a>
        </>
      ),
    },
    {
      icon: 'star-icon.svg',
      value: data.stars,
      label: (
        <>
          Stars on{' '}
          <a href="https://github.com/callstack/react-native-paper">GitHub</a>
        </>
      ),
    },
    {
      icon: 'commit-icon.svg',
      value: data.commits,
      label: 'Number of commits',
    },
  ];

  return (
    <LandingSection className="landing-numbers" dark id="numbers">
      <h2 className="landing-heading">
        It&apos;s free, it&apos;s Open Source!
      </h2>

      <ul className="landing-numbers__list">
        {items.map((item) => (
          <li className="landing-numbers__item" key={item.icon}>
            <img alt="" src={asset(`images/icons/${item.icon}`)} />
            <h3 className="landing-numbers__value">
              {item.value.toLocaleString('en-US')}
            </h3>
            <h4 className="landing-numbers__label">{item.label}</h4>
          </li>
        ))}
      </ul>
    </LandingSection>
  );
}
