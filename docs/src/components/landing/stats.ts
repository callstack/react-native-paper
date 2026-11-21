const REPO_API = 'https://api.github.com/repos/callstack/react-native-paper';
const DOWNLOADS_API =
  'https://api.npmjs.org/downloads/point/last-week/react-native-paper';

export type LandingStats = {
  stars: number;
  commits: number;
  weeklyDownloads: number;
};

export const fallbackStats: LandingStats = {
  stars: 14400,
  commits: 2280,
  weeklyDownloads: 258000,
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null;

const count = async (url: string, key: string) => {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`${url} responded ${response.status}`);
  }

  const body: unknown = await response.json();

  if (!isRecord(body)) {
    throw new Error(`${url} did not return an object`);
  }

  const found = body[key];

  if (typeof found !== 'number' || !Number.isFinite(found)) {
    throw new Error(`${url} has no numeric ${key}`);
  }

  return found;
};

const fetchStars = () => count(REPO_API, 'stargazers_count');

const fetchWeeklyDownloads = () => count(DOWNLOADS_API, 'downloads');

const fetchCommits = async () => {
  const response = await fetch(`${REPO_API}/commits?per_page=1`);

  if (!response.ok) {
    throw new Error(`commits responded ${response.status}`);
  }

  const last = response.headers
    .get('link')
    ?.match(/[?&]page=(\d+)>; rel="last"/)?.[1];

  if (!last) {
    throw new Error('no last page in commits link header');
  }

  return Number(last);
};

const settle = async (read: () => Promise<number>, fallback: number) => {
  try {
    return await read();
  } catch {
    return fallback;
  }
};

const load = async (): Promise<LandingStats> => {
  const [stars, commits, weeklyDownloads] = await Promise.all([
    settle(fetchStars, fallbackStats.stars),
    settle(fetchCommits, fallbackStats.commits),
    settle(fetchWeeklyDownloads, fallbackStats.weeklyDownloads),
  ]);

  return { stars, commits, weeklyDownloads };
};

let pending: Promise<LandingStats> | undefined;

export const loadStats = () => (pending ??= load());
