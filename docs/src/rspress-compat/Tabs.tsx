import type { ReactNode } from 'react';
import { Tabs as RspressTabs } from '@rspress/core/theme';

type TabsProps = {
  children: ReactNode;
};

export default function Tabs({ children }: TabsProps) {
  return <RspressTabs>{children}</RspressTabs>;
}
