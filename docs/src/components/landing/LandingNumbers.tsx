import { useEffect, useState } from 'react';

import LandingSection, { asset } from './LandingSection';
import { fallbackStats, loadStats, type LandingStats } from './stats';

export default function LandingNumbers() {
  const [data, setData] = useState<LandingStats>(fallbackStats);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      const stats = await loadStats();

      if (!cancelled) {
        setData(stats);
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
