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
    <aside className="paper-prerelease-notice" aria-label="Prerelease notice">
      <div className="paper-prerelease-notice__icon" aria-hidden="true">
        !
      </div>
      <div className="paper-prerelease-notice__content">
        <p className="paper-prerelease-notice__title">Prerelease</p>
        <p className="paper-prerelease-notice__body">
          This is the documentation for React Native Paper {version}, which is
          in prerelease. APIs can still change before the stable release.
        </p>
        <p className="paper-prerelease-notice__body">
          For the stable version, see <Link to={stableHref}>{stableLabel}</Link>
          .
        </p>
      </div>
    </aside>
  );
}
