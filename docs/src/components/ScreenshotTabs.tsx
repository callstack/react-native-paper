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
  const renderScreenshot = (src: string): ReactNode => (
    <img src={withBase(src)} className={getClassName(src)} />
  );

  if (typeof screenshotData === 'string') {
    return renderScreenshot(screenshotData);
  }

  const screenshots = Object.entries(screenshotData).map(([key, value]) => (
    <TabItem key={key} value={key} label={key} default>
      {typeof value === 'string' ? renderScreenshot(value) : null}
    </TabItem>
  ));

  return <Tabs>{screenshots}</Tabs>;
};

export default ScreenshotTabs;
