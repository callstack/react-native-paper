import { useEffect, useState } from 'react';

import LandingSection, { asset } from './LandingSection';

const PAPER_STATS_API =
  'https://paper-github-stats-h6ah15j9p.vercel.app/api/github-stats';

type Stats = { stars: number; commits: number; weeklyDownloads: number };

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
    <LandingSection variant="o16ish7f" dark id="numbers">
      <h1 className="h15lhj08 hn5vo52">
        It&apos;s free, it&apos;s Open Source!
      </h1>

      <ul className="n5g0et3">
        {items.map((item) => (
          <li className="n1himknf" key={item.icon}>
            <img alt="" src={asset(`images/icons/${item.icon}`)} />
            <h3>{item.value.toLocaleString('en-US')}</h3>
            <h4>{item.label}</h4>
          </li>
        ))}
      </ul>
    </LandingSection>
  );
}
