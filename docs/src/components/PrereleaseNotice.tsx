import Link from './Link';

type PrereleaseNoticeProps = {
  stableHref: string;
  stableLabel: string;
  version: string;
};

export default function PrereleaseNotice({
  stableHref,
  stableLabel,
  version,
}: PrereleaseNoticeProps) {
  return (
    <aside className="paper-prerelease-notice" aria-label="Prerelease warning">
      <div className="paper-prerelease-notice__icon" aria-hidden="true">
        !
      </div>
      <div className="paper-prerelease-notice__content">
        <p className="paper-prerelease-notice__title">Warning</p>
        <p className="paper-prerelease-notice__body">
          This is unreleased documentation for React Native Paper {version}{' '}
          version.
        </p>
        <p className="paper-prerelease-notice__body">
          For up-to-date documentation, see the{' '}
          <Link to={stableHref}>latest version (5.x)</Link>.
        </p>
        <p className="paper-prerelease-notice__body">
          Stable docs: <Link to={stableHref}>{stableLabel}</Link>
        </p>
      </div>
    </aside>
  );
}
