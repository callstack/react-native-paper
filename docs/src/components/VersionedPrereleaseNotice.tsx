import { usePage, useVersion } from '@rspress/core/dist/runtime/index.js';

import PrereleaseNotice from './PrereleaseNotice';
import { getStableRoute, hasSameStableRoute } from '../utils/versionRoutes';

const DOCS_PREFIX = '/6.x/docs/';

export default function VersionedPrereleaseNotice() {
  const version = useVersion() ?? '5.x';
  const { page } = usePage();
  const routePath = page.routePath ?? '/';

  if (version !== '6.x' || !routePath.startsWith(DOCS_PREFIX)) {
    return null;
  }

  const stableHref = getStableRoute(routePath);
  const stableLabel =
    hasSameStableRoute(routePath) && page.title
      ? `${page.title} (5.x)`
      : 'Latest stable docs (5.x)';

  return (
    <PrereleaseNotice
      stableHref={stableHref}
      stableLabel={stableLabel}
      version="6.x"
    />
  );
}
