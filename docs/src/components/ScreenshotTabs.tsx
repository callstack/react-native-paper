import React from 'react';

//@ts-ignore
import TabItem from '@theme/TabItem';
//@ts-ignore
import Tabs from '@theme/Tabs';

import type { DataObject } from '../utils/themeColors';

type ScreenshotTabsProps = {
  screenshotData: DataObject | string;
  baseUrl: string;
};

const getClassName = (value: string) =>
  value.endsWith('.gif')
    ? 'gifScreenshot'
    : `tabScreenshot${value.includes('full-width') ? 'full-width' : ''}`;

const ScreenshotTabs: React.FC<ScreenshotTabsProps> = ({
  screenshotData,
  baseUrl,
}) => {
  const renderScreenhot = (src: string): JSX.Element => (
    <img src={`${baseUrl}${src}`} className={getClassName(src)} />
  );

  if (typeof screenshotData === 'string') {
    return renderScreenhot(screenshotData);
  }

  const screenshots = Object.entries(screenshotData).map(([key, value]) => (
    <TabItem key={key} value={key} label={key} default>
      {renderScreenhot(value as string)}
    </TabItem>
  ));

  return <Tabs>{screenshots}</Tabs>;
};

export default ScreenshotTabs;
