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

const ScreenshotTabs: React.FC<ScreenshotTabsProps> = ({
  screenshotData,
  baseUrl,
}) => {
  const getScreenshotElement = (key: string, value: string): JSX.Element => (
    <TabItem key={key} value={key} label={key} default>
      <img
        src={`${baseUrl}${value}`}
        className={
          value.endsWith('.gif')
            ? 'gifScreenshot'
            : `tabScreenshot${value.includes('full-width') ? 'full-width' : ''}`
        }
      />
    </TabItem>
  );

  if (typeof screenshotData === 'string') {
    return (
      <img
        src={`${baseUrl}${screenshotData}`}
        className={
          screenshotData.endsWith('.gif')
            ? 'gifScreenshot'
            : `tabScreenshot${
                screenshotData.includes('full-width') ? 'full-width' : ''
              }`
        }
      />
    );
  }

  const screenshots = Object.entries(screenshotData).map(([key, value]) =>
    getScreenshotElement(key, value as string)
  );

  return <Tabs>{screenshots}</Tabs>;
};

export default ScreenshotTabs;
