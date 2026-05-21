import React, { ReactNode } from 'react';

//@ts-ignore
import Admonition from '@theme/Admonition';
//@ts-ignore
import TabItem from '@theme/TabItem';
//@ts-ignore
import Tabs from '@theme/Tabs';

import {
  DataObject,
  getMaxNestedLevel,
  getUniqueNestedKeys,
} from '../utils/themeColors';

const getTableHeader = (keys: string[]): ReactNode[] => {
  return keys.map((key) => <th key={key}>{key}</th>);
};

const getTableCell = (keys: string[], modes: DataObject): ReactNode[] => {
  return keys.map((key) => {
    const value = modes[key];
    if (typeof value === 'string') {
      return <td key={key}>{value || ''}</td>;
    }
    return <td key={key} />;
  });
};

const FlatTable = ({
  themeColorsData,
  uniqueKeys,
}: {
  themeColorsData: DataObject;
  uniqueKeys: string[];
}): ReactNode => {
  const rows = Object.keys(themeColorsData).map((mode) => {
    return (
      <tr key={`${mode}`}>
        <td>{mode}</td>
        {getTableCell(uniqueKeys, themeColorsData[mode] as DataObject)}
      </tr>
    );
  });

  return (
    <>
      <Admonition type="info">
        The table below outlines the theme colors, specifically for MD3{' '}
        <i>(theme version 3)</i> at the moment.
      </Admonition>
      <table>
        <thead>
          <tr>
            <th>mode</th>
            {getTableHeader(uniqueKeys)}
          </tr>
        </thead>
        <tbody>{rows}</tbody>
      </table>
    </>
  );
};

const TabbedTable = ({
  themeColorsData,
  uniqueKeys,
}: {
  themeColorsData: DataObject;
  uniqueKeys: string[];
}): ReactNode => {
  const tabTableContent = Object.keys(themeColorsData).map((key) => {
    const modes = themeColorsData[key] as DataObject;
    const rows = Object.keys(modes).map((mode) => {
      return (
        <tr key={`${key}-${mode}`}>
          <td>{mode}</td>
          {getTableCell(uniqueKeys, modes[mode] as DataObject)}
        </tr>
      );
    });
    return (
      <TabItem label={key} value={key} key={key}>
        <table>
          <thead>
            <tr>
              <th>mode</th>
              {getTableHeader(uniqueKeys)}
            </tr>
          </thead>
          <tbody>{rows}</tbody>
        </table>
      </TabItem>
    );
  });

  return (
    <>
      <Admonition type="info">
        The table below outlines the theme colors, specifically for MD3{' '}
        <i>(theme version 3)</i> at the moment.
      </Admonition>
      <Tabs>{tabTableContent}</Tabs>
    </>
  );
};

const ThemeColorsTable = ({
  themeColorsData,
  componentName,
}: {
  themeColorsData: DataObject;
  componentName: string;
}): ReactNode | null => {
  const uniqueKeys = getUniqueNestedKeys(themeColorsData);
  const nestingLevel = getMaxNestedLevel(themeColorsData);
  const isFlatTable = nestingLevel === 1;

  const Table = isFlatTable ? FlatTable : TabbedTable;

  return (
    <>
      <Table themeColorsData={themeColorsData} uniqueKeys={uniqueKeys} />
      <Admonition type="tip">
        <p>
          If a dedicated prop for a specific color is not available or the{' '}
          <code>style</code> prop does not allow color modification, you can
          customize it using the <code>theme</code> prop. It allows to override
          any color, within the component, based on the table above.
        </p>
        <p>
          <i>Example of overriding </i>
          <code>primary</code>
          <i> color:</i>
        </p>
        <code>{`<${componentName} theme={{ colors: { primary: 'green' } }} />`}</code>
      </Admonition>
    </>
  );
};

export default ThemeColorsTable;
