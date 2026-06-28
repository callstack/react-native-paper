import type { ReactNode } from 'react';

import { Tabs as RspressTabs } from '@rspress/core/dist/theme/index.js';

type TabsProps = {
  children: ReactNode;
};

export default function Tabs({ children }: TabsProps) {
  return <RspressTabs>{children}</RspressTabs>;
}
