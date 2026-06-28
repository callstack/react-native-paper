import type { ReactNode } from 'react';

import { withBase } from '@rspress/core/runtime';

import TabItem from './TabItem';
import Tabs from './Tabs';
import type { DataObject } from '../utils/themeColors';

type ScreenshotTabsProps = {
  screenshotData: DataObject | string;
};

const getClassName = (value: string) =>
  value.endsWith('.gif')
    ? 'gifScreenshot'
    : `tabScreenshot${value.includes('full-width') ? 'full-width' : ''}`;

const ScreenshotTabs = ({ screenshotData }: ScreenshotTabsProps) => {
  const renderScreenhot = (src: string): ReactNode => (
    <img src={withBase(src)} className={getClassName(src)} />
  );

  if (typeof screenshotData === 'string') {
    return renderScreenhot(screenshotData);
  }

  const screenshots = Object.entries(screenshotData).map(([key, value]) => (
    <TabItem key={key} value={key} label={key} default>
      {typeof value === 'string' ? renderScreenhot(value) : null}
    </TabItem>
  ));

  return <Tabs>{screenshots}</Tabs>;
};

export default ScreenshotTabs;
