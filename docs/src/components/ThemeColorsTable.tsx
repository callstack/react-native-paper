import React from 'react';

//@ts-ignore
import Admonition from '@theme/Admonition';
//@ts-ignore
import TabItem from '@theme/TabItem';
//@ts-ignore
import Tabs from '@theme/Tabs';

type DataObject = {
  [key: string]: string | DataObject;
};

const getUniqueNestedKeys = (data: DataObject) => {
  let keys: string[] = [];

  const traverseObject = (obj: DataObject) => {
    for (let [key, value] of Object.entries(obj)) {
      if (typeof value === 'object') {
        traverseObject(value);
      } else {
        keys.push(key);
      }
    }
  };

  traverseObject(data);

  return [...new Set(keys)];
};

function getNestingLevel(obj: DataObject) {
  let maxNestedLevel = 0;
  for (const key in obj) {
    if (typeof obj[key] === 'object') {
      const nestedLevel = getNestingLevel(obj[key] as DataObject) + 1;
      if (nestedLevel > maxNestedLevel) {
        maxNestedLevel = nestedLevel;
      }
    }
  }
  return maxNestedLevel;
}

export default function ThemeColorsTable({
  data,
  componentName,
}: {
  data: DataObject | undefined;
  componentName: string;
}) {
  if (!data) {
    return null;
  }
  const uniqueKeys = getUniqueNestedKeys(data);

  if (getNestingLevel(data) === 1) {
    const rows = Object.keys(data).map((mode) => {
      return (
        <tr key={`${mode}`}>
          <td>{mode}</td>
          {uniqueKeys.map((key) => {
            return <td key={key}>{data[mode][key] || ''}</td>;
          })}
        </tr>
      );
    });

    return (
      <table>
        <thead>
          <tr>
            <th>mode</th>
            {uniqueKeys.map((key) => (
              <th key={key}>{key}</th>
            ))}
          </tr>
        </thead>
        <tbody>{rows}</tbody>
      </table>
    );
  }

  const tableElements = Object.keys(data).map((key) => {
    const modes = data[key];
    const rows = Object.keys(modes).map((mode) => {
      return (
        <tr key={`${key}-${mode}`}>
          <td>{mode}</td>
          {uniqueKeys.map((key) => {
            return <td key={key}>{modes[mode][key] || ''}</td>;
          })}
        </tr>
      );
    });

    return (
      <TabItem label={key} value={key} key={key}>
        <table>
          <thead>
            <tr>
              <th>mode</th>
              {uniqueKeys.map((key) => (
                <th key={key}>{key}</th>
              ))}
            </tr>
          </thead>
          <tbody>{rows}</tbody>
        </table>
      </TabItem>
    );
  });

  return (
    <>
      <Tabs>{tableElements}</Tabs>
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
}
