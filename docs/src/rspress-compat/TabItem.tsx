import type { ReactNode } from 'react';
import { Tab } from '@rspress/core/theme';

type TabItemProps = {
  children: ReactNode;
  default?: boolean;
  label?: string;
  value?: string;
};

export default function TabItem({ children, label, value }: TabItemProps) {
  return <Tab label={label ?? value ?? ''}>{children}</Tab>;
}
