import { Text } from 'react-native';

import { describe, expect, it } from '@jest/globals';

import { render } from '../../test-utils';
import type TouchableRippleType from '../TouchableRipple/TouchableRipple';

// The web variant, required with its extension on purpose. A bare specifier
// resolves to `TouchableRipple.native.tsx` under the jest preset, so importing
// it the normal way silently tests the native file.
//
// This renders the web source on the native renderer, so it only pins the
// rendered tree. Hit testing and clipping have to be checked in a browser.
const TouchableRipple: typeof TouchableRippleType =
  require('../TouchableRipple/TouchableRipple.tsx').default;

describe('TouchableRipple (web)', () => {
  it.each([
    { when: 'there is no hitSlop', props: { onPress: () => {} } },
    { when: 'there are no touch handlers', props: { hitSlop: 4 } },
    {
      when: 'it is disabled',
      props: { hitSlop: 4, onPress: () => {}, disabled: true },
    },
  ])('renders no touch target when $when', async ({ props }) => {
    const tree = (
      await render(
        <TouchableRipple {...props}>
          <Text>Button</Text>
        </TouchableRipple>
      )
    ).toJSON();

    expect(tree).toMatchSnapshot();
  });

  it.each([
    { name: 'a numeric hitSlop', hitSlop: 6 },
    { name: 'a per-edge hitSlop', hitSlop: { top: 4, left: 8 } },
  ])(
    'renders a touch target behind the children sized from $name',
    async ({ hitSlop }) => {
      const tree = (
        await render(
          <TouchableRipple hitSlop={hitSlop} onPress={() => {}}>
            <Text>Button</Text>
          </TouchableRipple>
        )
      ).toJSON();

      expect(tree).toMatchSnapshot();
    }
  );

  it('does not clip its content when borderless', async () => {
    const tree = (
      await render(
        <TouchableRipple borderless onPress={() => {}}>
          <Text>Button</Text>
        </TouchableRipple>
      )
    ).toJSON();

    expect(tree).toMatchSnapshot();
  });
});
