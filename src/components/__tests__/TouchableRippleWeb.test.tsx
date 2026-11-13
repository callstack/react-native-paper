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

  // A toggle reports a state of its own, so the role reporting it stays even with
  // no handler: `Button` passes `aria-checked` on native and `aria-pressed` on web
  // for its `selected` prop. Reporting them unchecked says "off", which is still
  // saying "toggle". The mocked `View` hands these props to the element untouched,
  // so they are asserted as given.
  it.each([
    { state: 'aria-checked', prop: 'aria-checked', value: true },
    { state: 'aria-checked', prop: 'aria-checked', value: false },
    { state: 'aria-pressed', prop: 'aria-pressed', value: true },
    { state: 'aria-pressed', prop: 'aria-pressed', value: false },
    {
      state: 'a checked accessibilityState',
      prop: 'accessibilityState',
      value: { checked: true },
    },
  ])(
    'keeps a button role carrying $state when no touch handler is passed',
    async ({ prop, value }) => {
      await render(
        <TouchableRipple role="button" {...{ [prop]: value }}>
          <Text>Toggle</Text>
        </TouchableRipple>
      );

      expect(screen.getByRole('button')).toHaveProp(prop, value);
    }
  );

  // A selection is not a toggle state: a component passes the flag for every item
  // it renders, and a selection a presentational element carries is invalid ARIA.
  // So the role and the flag go together.
  it.each([true, false])(
    'drops a button role carrying aria-selected of %s, together with the flag, when no touch handler is passed',
    async (value) => {
      await render(
        <TouchableRipple testID="plain" role="button" aria-selected={value}>
          <Text>Not a button</Text>
        </TouchableRipple>
      );

      expect(screen.queryByRole('button')).not.toBeOnTheScreen();

      const plain = screen.getByTestId('plain');

      expect(plain).not.toHaveProp('aria-selected');
      expect(plain).not.toBeSelected();
    }
  );

  it('strips the selection out of an accessibilityState when it drops the role', async () => {
    await render(
      <TouchableRipple
        testID="plain"
        role="button"
        accessibilityState={{ selected: true, disabled: false }}
      >
        <Text>Not a button</Text>
      </TouchableRipple>
    );

    expect(screen.queryByRole('button')).not.toBeOnTheScreen();

    const plain = screen.getByTestId('plain');

    expect(plain).toHaveProp('accessibilityState', { disabled: false });
    expect(plain).not.toBeSelected();
  });

  // react-native-web puts these roles in the tab order by itself, so the element
  // asks it not to: there is nothing here to activate.
  it('keeps a tabbable role out of the tab order when no touch handler is passed', async () => {
    await render(
      <TouchableRipple role="radio" aria-checked>
        <Text>Read only</Text>
      </TouchableRipple>
    );

    expect(screen.getByRole('radio')).toHaveProp('focusable', false);
  });

  it('adds no focusable prop to the element it drops the role on', async () => {
    await render(
      <TouchableRipple testID="plain" role="button">
        <Text>Not a button</Text>
      </TouchableRipple>
    );

    expect(screen.getByTestId('plain')).not.toHaveProp('focusable');
  });

  it('respects a focusable prop of its own', async () => {
    await render(
      <TouchableRipple testID="plain" role="button" focusable>
        <Text>Not a button</Text>
      </TouchableRipple>
    );

    expect(screen.getByTestId('plain')).toHaveProp('focusable', true);
  });

  it('drops a button role that carries no state when no touch handler is passed', async () => {
    await render(
      <TouchableRipple role="button">
        <Text>Not a button</Text>
      </TouchableRipple>
    );

    expect(screen.queryByRole('button')).not.toBeOnTheScreen();
  });

  it('renders more than one child, with and without a touch handler', async () => {
    const { rerender } = await render(
      <TouchableRipple>
        <Text>First</Text>
        <Text>Second</Text>
      </TouchableRipple>
    );

    expect(screen.getByText('First')).toBeOnTheScreen();
    expect(screen.getByText('Second')).toBeOnTheScreen();

    await rerender(
      <TouchableRipple onPress={() => {}}>
        <Text>First</Text>
        <Text>Second</Text>
      </TouchableRipple>
    );

    expect(screen.getByText('First')).toBeOnTheScreen();
    expect(screen.getByText('Second')).toBeOnTheScreen();
  });

  it('drops a togglebutton role when no touch handler is passed', async () => {
    await render(
      <TouchableRipple accessibilityRole="togglebutton">
        <Text>Not a control</Text>
      </TouchableRipple>
    );

    expect(screen.queryByRole('togglebutton')).not.toBeOnTheScreen();
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
