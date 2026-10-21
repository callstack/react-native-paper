import LandingSection, { asset } from './LandingSection';

type LinkProps = { to: string; children: React.ReactNode };

/** components/Link.js in the source. */
const Link = ({ to, children }: LinkProps) => (
  <a href={to} rel="noreferrer noopener" target="_blank">
    {children}
  </a>
);

/**
 * components/Footer.js. The copy is carried over verbatim, outdated year and
 * docs URL included - refreshing the landing copy is a separate task.
 */
export default function LandingFooter() {
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
              <Link to="https://callstack.github.io/react-native-paper/index.html">
                Docs
              </Link>
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
            <img alt="" src={asset('images/icons/callstack.svg')} />
          </Link>
        </div>
      </div>
    </LandingSection>
  );
}
