import React from 'react';
import { usePluginData } from '@docusaurus/useGlobalData';

export default function PropTable({ link }) {
  const { pages } = usePluginData('component-docs-plugin');
  const page = pages.find((page) => page.doc.link === link);
  const props = page.doc.data.props;

  return (
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Type</th>
          <th>Default</th>
          <th>Required</th>
          <th>Description</th>
        </tr>
      </thead>
      <tbody>
        {Object.keys(props).map((key) => {
          return (
            <tr key={key}>
              <td>
                <code>{key}</code>
              </td>
              <td>
                <code>{props[key].tsType?.name}</code>
              </td>
              <td>
                {props[key].defaultValue && (
                  <code>{props[key].defaultValue.value}</code>
                )}
              </td>
              <td>{props[key].required ? 'Yes' : 'No'}</td>
              <td>{props[key].description}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
