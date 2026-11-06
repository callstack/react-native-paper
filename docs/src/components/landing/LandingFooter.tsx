import { useVersion, withBase } from '@rspress/core/dist/runtime/index.js';

import LandingSection, { asset } from './LandingSection';
import { getNextRoute } from '../../utils/versionRoutes';

type LinkProps = { to: string; children: React.ReactNode };

const GETTING_STARTED = '/docs/guides/getting-started';

const Link = ({ to, children }: LinkProps) => (
  <a href={to} rel="noreferrer noopener" target="_blank">
    {children}
  </a>
);

export default function LandingFooter() {
  const version = useVersion() || '5.x';
  const docsHref = withBase(
    version === '6.x' ? getNextRoute(GETTING_STARTED) : GETTING_STARTED
  );

  return (
    <LandingSection dark variant="s7sbtf9">
      <div className="cf3elge">
        <div className="d1cbpza3">
          <img alt="" src={asset('images/icons/paper-white.svg')} />
          <p>
            react-native-paper is a high-quality standard-compliant Material
            Design library developed by the engineers of{' '}
            <Link to="https://callstack.com/">Callstack.</Link>
          </p>
        </div>
        <div className="i7d7zjg">
          <h5>info</h5>
          <ul>
            <li>
              <Link to="https://github.com/callstack/react-native-paper">
                Github
              </Link>
            </li>
            <li>
              <a href={docsHref}>Docs</a>
            </li>
            <li>
              <Link to="https://twitter.com/rn_paper">Twitter</Link>
            </li>
            <li>
              <Link to="https://discord.gg/zwR2Cdh">Discord</Link>
            </li>
          </ul>
        </div>
        <div className="i7d7zjg">
          <h5>callstack</h5>
          <ul>
            <li>
              <Link to="https://callstack.com/careers/">Careers</Link>
            </li>
            <li>
              <Link to="https://callstack.com/our-work/">Our work</Link>
            </li>
            <li>
              <Link to="https://callstack.com/contact-us/">Contact</Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="cn49emr">
        <div>&#169; 2021 Callstack, All rights reserved</div>
        <div className="c1od1uwn">
          Created with love by:
          <Link to="https://callstack.com/">
            <img alt="Callstack" src={asset('images/icons/callstack.svg')} />
          </Link>
        </div>
      </div>
    </LandingSection>
  );
}
