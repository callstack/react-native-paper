import { Fragment } from 'react';
import type { ComponentProps } from 'react';
import { HomeBanner } from '@callstack/rspress-theme';
import { Layout as BasicLayout } from '@rspress/core/theme-original';
import PaperVersionSelector from '../src/components/PaperVersionSelector';
import PaperHomeShowcase from '../src/components/PaperHomeShowcase';
import VersionedPrereleaseNotice from '../src/components/VersionedPrereleaseNotice';
import Outline from './Outline';

type LayoutProps = ComponentProps<typeof BasicLayout>;

const Layout = (props: LayoutProps) => (
  <BasicLayout
    {...props}
    afterFeatures={
      <Fragment>
        <PaperHomeShowcase />
        <HomeBanner
          buttonText="Let's talk"
          description="We've spent years building full-stack, cross-platform apps and solving tough technical challenges."
          headline="Need React or React Native expertise you can count on?"
          href="https://www.callstack.com/contact-us"
        />
      </Fragment>
    }
    afterNav={<PaperVersionSelector />}
    afterOutline={false}
    beforeDocContent={<VersionedPrereleaseNotice />}
  />
);

export * from '@rspress/core/theme-original';
export { Layout, Outline };
