import { type ComponentProps } from 'react';

import { Layout as BasicLayout } from '@rspress/core/dist/theme/index.js';

import Outline from './Outline';
import PaperVersionSelector from '../src/components/PaperVersionSelector';
import VersionedPrereleaseNotice from '../src/components/VersionedPrereleaseNotice';

type LayoutProps = ComponentProps<typeof BasicLayout>;

const Layout = (props: LayoutProps) => (
  <BasicLayout
    {...props}
    afterNavMenu={<PaperVersionSelector />}
    afterOutline={false}
    beforeDocContent={<VersionedPrereleaseNotice />}
  />
);

export * from '@rspress/core/dist/theme/index.js';
export { Layout, Outline };
