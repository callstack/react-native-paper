import * as React from 'react';
import { Text } from 'react-native';

import flattenChildren from '../flattenChildren';

describe('flattenChildren', () => {
  it('replaces fragments with their children', () => {
    const children = flattenChildren(
      <>
        <Text>One</Text>
        <>
          <Text>Two</Text>
          {null}
          <Text>Three</Text>
        </>
      </>
    ) as React.ReactElement<{ children: string }>[];

    expect(children.map((child) => child.props.children)).toEqual([
      'One',
      'Two',
      'Three',
    ]);
  });

  it('keeps keys unique across fragments', () => {
    const children = flattenChildren([
      <Text key="a">One</Text>,
      <React.Fragment key="b">
        <Text key="a">Two</Text>
      </React.Fragment>,
    ]) as React.ReactElement[];

    const keys = children.map((child) => child.key);

    expect(new Set(keys).size).toBe(keys.length);
  });
});
