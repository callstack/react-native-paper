import routeFallbacks from '../data/versionRouteFallbacks.json';

const NEXT_VERSION_PREFIX = '/6.x';
const NEXT_HOME_ROUTE = '/6.x/';
const STABLE_HOME_ROUTE = '/';

const stripNextVersionPrefix = (routePath: string) => {
  const stableRoute = routePath.replace(/^\/6\.x(?=\/|$)/, '');

  return stableRoute === '' ? STABLE_HOME_ROUTE : stableRoute;
};

export const getStableRoute = (routePath: string) => {
  if (!routePath.startsWith(NEXT_VERSION_PREFIX)) {
    return routePath || STABLE_HOME_ROUTE;
  }

  if (routePath === NEXT_VERSION_PREFIX || routePath === NEXT_HOME_ROUTE) {
    return STABLE_HOME_ROUTE;
  }

  return (
    routeFallbacks.stable[routePath as keyof typeof routeFallbacks.stable] ??
    stripNextVersionPrefix(routePath)
  );
};

export const getNextRoute = (routePath: string) => {
  if (routePath.startsWith(NEXT_VERSION_PREFIX)) {
    return routePath;
  }

  if (routePath === STABLE_HOME_ROUTE || routePath === '') {
    return NEXT_HOME_ROUTE;
  }

  return (
    routeFallbacks.next[routePath as keyof typeof routeFallbacks.next] ??
    `${NEXT_VERSION_PREFIX}${routePath}`
  );
};

export const hasSameStableRoute = (routePath: string) =>
  getStableRoute(routePath) === stripNextVersionPrefix(routePath);
