import { Text } from 'react-native';

import { describe, expect, it } from '@jest/globals';

import { render, screen } from '../../test-utils';
// The bare specifier resolves to .native under the jest preset, so the web file
// needs the extension or it never runs. There is still no DOM here, so this only
// pins the tree and accessibility output it computes. Hit testing and clipping
// have to be checked in a browser.
import TouchableRipple from '../TouchableRipple/TouchableRipple.tsx';

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

describe('TouchableRipple (web file)', () => {
  it('drops a button role but keeps the name when no touch handler is passed', async () => {
    await render(
      <TouchableRipple role="button" aria-label="Add item">
        <Text>Not a button</Text>
      </TouchableRipple>
    );

    expect(screen.queryByRole('button')).not.toBeOnTheScreen();

    // hiding the element instead would silence the name, which for an icon
    // only control is all it has to announce
    expect(screen.getByLabelText('Add item')).toHaveAccessibleName('Add item');
  });

  it('keeps a state bearing role when no touch handler is passed', async () => {
    await render(
      <TouchableRipple role="checkbox" aria-checked>
        <Text>Read only</Text>
      </TouchableRipple>
    );

    expect(screen.getByRole('checkbox', { checked: true })).toBeOnTheScreen();
  });

  it('keeps the button role on a disabled control', async () => {
    await render(
      <TouchableRipple role="button" disabled>
        <Text>Disabled</Text>
      </TouchableRipple>
    );

    expect(screen.getByRole('button')).toBeDisabled();
  });
});
