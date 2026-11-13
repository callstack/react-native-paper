/* eslint-disable testing-library/no-node-access, @typescript-eslint/no-unsafe-type-assertion, no-restricted-syntax --
   The node carrying the ring is an unnamed internal view (Card's Pressable,
   Switch's track, FAB's clip view). There is no testID to query it by, and
   which node it is IS the thing under test, so the tree has to be walked. */
import { Platform, StyleSheet, Text } from 'react-native';
import type { ViewStyle } from 'react-native';

import { afterEach, beforeEach, describe, expect, it } from '@jest/globals';
import { act, fireEvent } from '@testing-library/react-native';

import { render, screen } from '../../test-utils';
import { tokens } from '../../theme/tokens';
import BottomNavigation from '../BottomNavigation/BottomNavigation';
import Button from '../Button/Button';
import Card from '../Card/Card';
import CheckboxItem from '../Checkbox/CheckboxItem';
import Chip from '../Chip/Chip';
import FAB from '../FAB/FAB';
import FABMenu from '../FAB/Menu';
import ListAccordion from '../List/ListAccordion';
import ListItem from '../List/ListItem';
import MenuItem from '../Menu/MenuItem';
import Switch from '../Switch/Switch';
import TouchableRipple from '../TouchableRipple/TouchableRipple.native';

const { thickness, outerOffset } = tokens.md.sys.state.focusIndicator;
const OUTWARD = outerOffset;
const INWARD = -thickness;

type Node = { props?: Record<string, unknown>; children?: unknown[] };

const walk = (node: Node | undefined, hit: (n: Node) => boolean): Node[] => {
  if (!node || typeof node !== 'object') return [];
  const here = hit(node) ? [node] : [];
  const kids = (node.children ?? []).flatMap((c) => walk(c as Node, hit));
  return [...here, ...kids];
};

const style = (n: Node) =>
  StyleSheet.flatten(n.props?.style as ViewStyle) ?? {};

/** The node carrying the ring is often not the one that took focus. */
const ringOffset = () => {
  const root = (screen as unknown as { root: Node }).root;
  const ringed = walk(root, (n) => style(n).outlineStyle === 'solid');
  return ringed.length ? style(ringed[0]).outlineOffset : undefined;
};

/** Focus whichever node actually has the handler wired. */
const focusFirstFocusable = async () => {
  const root = (screen as unknown as { root: Node }).root;
  const target = walk(root, (n) => typeof n.props?.onFocus === 'function')[0];
  expect(target).toBeDefined();
  await act(async () => {
    await fireEvent(target as never, 'focus');
  });
};

/**
 * Each component decides where its ring goes, and getting it backwards is
 * invisible to a snapshot because the ring only exists while focused. Pin the
 * placement per component so a wiring change cannot pass silently.
 */
describe('focus ring wiring', () => {
  it('List.Item rings inward, clear of the rows above and below', async () => {
    await render(<ListItem title="row" onPress={() => {}} />);

    await focusFirstFocusable();

    expect(ringOffset()).toBe(INWARD);
  });

  // Outward like MD3 and Material Web. A scrolling chip row that trims it is
  // the app's container, not the chip's own view.
  it('Chip rings outward', async () => {
    await render(<Chip onPress={() => {}}>chip</Chip>);

    await focusFirstFocusable();

    expect(ringOffset()).toBe(OUTWARD);
  });

  // The bar clips (`overflow: 'hidden'`) and tabs fill it edge to edge, so an
  // outward ring loses its top and bottom. Rendered through a custom
  // `renderTouchable` so the test runs the ring path on every platform.
  it('BottomNavigation.Bar rings its tabs inward', async () => {
    await render(
      <BottomNavigation.Bar
        navigationState={{
          index: 0,
          routes: [
            { key: 'a', title: 'A', focusedIcon: 'home' },
            { key: 'b', title: 'B', focusedIcon: 'cog' },
          ],
        }}
        onTabPress={() => {}}
        renderTouchable={({ key, route: _route, ...props }) => (
          <TouchableRipple key={key} {...props} />
        )}
      />
    );

    await focusFirstFocusable();

    expect(ringOffset()).toBe(INWARD);
  });

  // Material Web rings the remove button with a circle around the glyph, not
  // the whole close column.
  it('Chip rings its close button with a circle around the glyph', async () => {
    await render(
      <Chip onPress={() => {}} onClose={() => {}}>
        chip
      </Chip>
    );

    await act(async () => {
      await fireEvent(screen.getByLabelText('Close'), 'focus');
    });

    const root = (screen as unknown as { root: Node }).root;
    const ringed = walk(root, (n) => style(n).outlineStyle === 'solid');
    expect(ringed).toHaveLength(1);
    expect(style(ringed[0])).toMatchObject({
      outlineOffset: OUTWARD,
      width: 24,
      height: 24,
      borderRadius: 12,
    });
  });

  it('Checkbox.Item rings inward, clear of the rows above and below', async () => {
    await render(
      <CheckboxItem label="row" status="checked" onPress={() => {}} />
    );

    await focusFirstFocusable();

    expect(ringOffset()).toBe(INWARD);
  });

  it('List.Accordion rings inward, like List.Item', async () => {
    await render(
      <ListAccordion title="section">
        <ListItem title="row" />
      </ListAccordion>
    );

    await focusFirstFocusable();

    expect(ringOffset()).toBe(INWARD);
  });

  it("Menu.Item rings inward, inside the menu's scroll view", async () => {
    await render(<MenuItem title="item" onPress={() => {}} />);

    await focusFirstFocusable();

    expect(ringOffset()).toBe(INWARD);
  });

  it('Button rings outward', async () => {
    await render(<Button onPress={() => {}}>button</Button>);

    await focusFirstFocusable();

    expect(ringOffset()).toBe(OUTWARD);
  });

  it('Card rings outward', async () => {
    await render(
      <Card onPress={() => {}}>
        <Text>card</Text>
      </Card>
    );

    await focusFirstFocusable();

    expect(ringOffset()).toBe(OUTWARD);
  });

  it('FAB rings outward on its clip view', async () => {
    await render(<FAB icon="plus" onPress={() => {}} />);

    await focusFirstFocusable();

    expect(ringOffset()).toBe(OUTWARD);
  });

  // Inward here lands on the filled track, where `secondary` is ~1:1 against
  // `primary` and effectively invisible.
  // Items are 4dp apart, less than an outward ring's 2dp gap plus 3dp
  // thickness, so it would run into the next item.
  it('FAB.Menu rings its items inward, clear of the neighbouring items', async () => {
    await render(
      <FABMenu
        expanded
        onDismiss={() => {}}
        trigger={{ icon: 'plus' }}
        items={[
          { label: 'first', onPress: () => {}, testID: 'item-0' },
          { label: 'second', onPress: () => {}, testID: 'item-1' },
        ]}
      />
    );

    await act(async () => {
      await fireEvent(screen.getByTestId('item-0'), 'focus');
    });

    expect(ringOffset()).toBe(INWARD);
  });

  it('Switch rings outward on its track, not inside it', async () => {
    await render(<Switch value onValueChange={() => {}} />);

    await focusFirstFocusable();

    expect(ringOffset()).toBe(OUTWARD);
  });
});

describe('focus ring wiring (web)', () => {
  const original = Platform.OS;
  beforeEach(() => {
    Platform.OS = 'web';
  });
  afterEach(() => {
    Platform.OS = original;
  });

  // The track is a child of the focused Pressable, so it can't be ringed with
  // `:has(:focus-visible)` (that only matches ancestors of the focused node).
  it('Switch marks its Pressable as the focus target and rings the track inside it', async () => {
    await render(<Switch value onValueChange={() => {}} />);

    const pressable = screen.getByRole('switch');
    expect(pressable.props.dataSet).toEqual({ focusRingTarget: 'true' });

    const ringed = walk(
      pressable,
      (n) =>
        (n.props?.dataSet as Record<string, string> | undefined)
          ?.focusRingDescendant !== undefined
    );
    expect(ringed).toHaveLength(1);
    expect(
      (ringed[0].props?.dataSet as Record<string, string>).focusRingDescendant
    ).toBe('outward');
  });

  it('Chip marks its close button as the focus target and rings the glyph circle inside it', async () => {
    await render(
      <Chip onPress={() => {}} onClose={() => {}}>
        chip
      </Chip>
    );

    const close = screen.getByLabelText('Close');
    expect(close.props.dataSet).toEqual({ focusRingTarget: 'true' });

    const ringed = walk(
      close,
      (n) =>
        (n.props?.dataSet as Record<string, string> | undefined)
          ?.focusRingDescendant !== undefined
    );
    expect(ringed).toHaveLength(1);
    expect(
      (ringed[0].props?.dataSet as Record<string, string>).focusRingDescendant
    ).toBe('outward');
    expect(style(ringed[0])).toMatchObject({ width: 24, borderRadius: 12 });
  });
});
