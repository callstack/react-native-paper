import { usePage, useVersion } from '@rspress/core/runtime';
import PrereleaseNotice from './PrereleaseNotice';

const DOCS_PREFIX = '/6.x/docs/';

export default function VersionedPrereleaseNotice() {
  const version = useVersion() ?? '5.x';
  const { page } = usePage();
  const routePath = page.routePath ?? '/';

  if (version !== '6.x' || !routePath.startsWith(DOCS_PREFIX)) {
    return null;
  }

  const stableHref = routePath.replace(/^\/6\.x/, '');
  const stableLabel = page.title ? `${page.title} (5.x)` : 'This page (5.x)';

  return (
    <PrereleaseNotice
      stableHref={stableHref}
      stableLabel={stableLabel}
      version="6.x"
    />
  );
}
