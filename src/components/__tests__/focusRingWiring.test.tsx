/* eslint-disable testing-library/no-node-access, @typescript-eslint/no-unsafe-type-assertion, no-restricted-syntax --
   The node carrying the ring is an unnamed internal view (Card's Pressable,
   Switch's track, FAB's clip view). There is no testID to query it by, and
   which node it is IS the thing under test, so the tree has to be walked. */
import type { ReactElement } from 'react';
import { Platform, processColor, StyleSheet, Text } from 'react-native';
import type { ViewStyle } from 'react-native';

import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  jest,
} from '@jest/globals';
import { act, fireEvent } from '@testing-library/react-native';

import { ownFocusEvent, render, screen } from '../../test-utils';
import { DarkTheme, LightTheme } from '../../theme/schemes';
import { tokens } from '../../theme/tokens';
import Appbar from '../Appbar/Appbar';
import AppbarAction from '../Appbar/AppbarAction';
import AppbarBackAction from '../Appbar/AppbarBackAction';
import AppbarContent from '../Appbar/AppbarContent';
import BottomNavigation from '../BottomNavigation/BottomNavigation';
import Button from '../Button/Button';
import Card from '../Card/Card';
import CheckboxItem from '../Checkbox/CheckboxItem';
import Chip from '../Chip/Chip';
import DataTableCell from '../DataTable/DataTableCell';
import DataTableRow from '../DataTable/DataTableRow';
import DataTableTitle from '../DataTable/DataTableTitle';
import DrawerCollapsedItem from '../Drawer/DrawerCollapsedItem';
import DrawerItem from '../Drawer/DrawerItem';
import FAB from '../FAB/FAB';
import FABMenu from '../FAB/Menu';
import IconButton from '../IconButton/IconButton';
import ListAccordion from '../List/ListAccordion';
import ListItem from '../List/ListItem';
import MenuItem from '../Menu/MenuItem';
import RadioButtonItem from '../RadioButton/RadioButtonItem';
import SegmentedButtons from '../SegmentedButtons/SegmentedButtons';
import Snackbar from '../Snackbar';
import Switch from '../Switch/Switch';
import TextInputIcon from '../TextInput/TextInputIcon';
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
    await fireEvent(target as never, 'focus', ownFocusEvent());
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

  // The caller's `style` sizes the chip around the ripple that takes focus,
  // and on Android and iOS the ripple keeps its own height at the top of a
  // taller chip. So the ring goes on the chip's own box, and the 2dp gap is
  // measured from its border, the visible edge.
  it('Chip rings its own box, whatever its height', async () => {
    await render(
      <Chip onPress={() => {}} style={{ height: 40 }}>
        chip
      </Chip>
    );

    await focusFirstFocusable();

    const root = (screen as unknown as { root: Node }).root;
    const ringed = walk(root, (n) => style(n).outlineStyle === 'solid');
    expect(ringed).toHaveLength(1);
    expect(style(ringed[0])).toMatchObject({
      height: 40,
      borderWidth: 1,
      outlineOffset: OUTWARD,
    });
  });

  it('Chip drops its ring when it is disabled while focused', async () => {
    const { rerender } = await render(<Chip onPress={() => {}}>chip</Chip>);
    await focusFirstFocusable();
    expect(ringOffset()).toBe(OUTWARD);

    await act(async () => {
      await rerender(
        <Chip disabled onPress={() => {}}>
          chip
        </Chip>
      );
    });
    expect(ringOffset()).toBeUndefined();

    // No focus event in between, so nothing is ringed after re-enabling.
    await act(async () => {
      await rerender(<Chip onPress={() => {}}>chip</Chip>);
    });
    expect(ringOffset()).toBeUndefined();
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
      await fireEvent(screen.getByLabelText('Close'), 'focus', ownFocusEvent());
    });

    const root = (screen as unknown as { root: Node }).root;
    const ringed = walk(root, (n) => style(n).outlineStyle === 'solid');
    expect(ringed).toHaveLength(1);
    // Material Web: a 24dp circle with the ring right outside it. The shared
    // ring adds the outer offset, so the circle is that much smaller. It is
    // an overlay filling the glyph's box, which sets the size.
    const size = 24 - 2 * outerOffset;
    expect(style(ringed[0])).toMatchObject({
      outlineOffset: OUTWARD,
      position: 'absolute',
      borderRadius: size / 2,
    });
    const box = walk(root, (n) =>
      (n.children ?? []).some((c) => c === ringed[0])
    )[0];
    expect(style(box)).toMatchObject({ width: size, height: size });
  });

  it('Checkbox.Item rings inward, clear of the rows above and below', async () => {
    await render(
      <CheckboxItem label="row" status="checked" onPress={() => {}} />
    );

    await focusFirstFocusable();

    expect(ringOffset()).toBe(INWARD);
  });

  const ROW_BACKGROUND = 'lightgrey';

  // An inward ring on the row would sit under its content view, so a
  // background set through `style` would hide it. The ring goes on a childless
  // overlay that paints last instead.
  it.each([
    [
      'Checkbox.Item',
      <CheckboxItem
        key="checkbox"
        label="row"
        status="checked"
        onPress={() => {}}
        style={{ backgroundColor: ROW_BACKGROUND }}
      />,
    ],
    [
      'RadioButton.Item',
      <RadioButtonItem
        key="radio"
        label="row"
        value="a"
        onPress={() => {}}
        style={{ backgroundColor: ROW_BACKGROUND }}
      />,
    ],
  ])(
    '%s rings inward above a background set through style',
    async (_name, element) => {
      await render(element);

      await focusFirstFocusable();

      const root = (screen as unknown as { root: Node }).root;
      const ringed = walk(root, (n) => style(n).outlineStyle === 'solid');
      expect(ringed).toHaveLength(1);
      expect(style(ringed[0])).toMatchObject({
        outlineOffset: INWARD,
        position: 'absolute',
      });
      expect(ringed[0].children ?? []).toHaveLength(0);
      const row = walk(root, (n) =>
        (n.children ?? []).some((c) => c === ringed[0])
      )[0];
      expect(row.children?.at(-1)).toBe(ringed[0]);
    }
  );

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

  // The ring goes on the view that draws the outline, so the 2dp gap is
  // measured from the outline's outer edge, not from inside it.
  it.each(['small', 'extra-large'] as const)(
    'outlined Button (%s) keeps the 2dp gap outside its outline',
    async (size) => {
      await render(
        <Button mode="outlined" size={size} onPress={() => {}}>
          button
        </Button>
      );

      await focusFirstFocusable();

      const root = (screen as unknown as { root: Node }).root;
      const ringed = walk(root, (n) => style(n).outlineStyle === 'solid');
      expect(ringed).toHaveLength(1);
      expect(style(ringed[0]).outlineOffset).toBe(OUTWARD);
      expect(style(ringed[0]).borderWidth).toBeGreaterThan(0);
    }
  );

  it('DataTable.Row rings inward, clear of the rows above and below', async () => {
    await render(
      <DataTableRow onPress={() => {}}>
        <Text>cell</Text>
      </DataTableRow>
    );

    await focusFirstFocusable();

    expect(ringOffset()).toBe(INWARD);
  });

  it('DataTable.Title rings inward when sortable, and keeps its own onFocus', async () => {
    const onFocus = jest.fn();
    await render(
      <DataTableTitle onPress={() => {}} onFocus={onFocus}>
        title
      </DataTableTitle>
    );

    await focusFirstFocusable();

    expect(ringOffset()).toBe(INWARD);
    expect(onFocus).toHaveBeenCalledTimes(1);
  });

  it("List.Item takes a caller's focusRing over its inward default", async () => {
    await render(
      <ListItem title="row" onPress={() => {}} focusRing="outward" />
    );

    await focusFirstFocusable();

    expect(ringOffset()).toBe(OUTWARD);
  });

  // Without a touch handler or `disabled` the title is a plain View, a column
  // heading and not a control. It keeps a caller's onFocus, but even a focus
  // that reaches it draws no ring.
  it('DataTable.Title draws no ring when it is not pressable', async () => {
    const onFocus = jest.fn();
    await render(<DataTableTitle onFocus={onFocus}>title</DataTableTitle>);

    await focusFirstFocusable();

    expect(onFocus).toHaveBeenCalledTimes(1);
    expect(ringOffset()).toBeUndefined();
  });

  // MD3 rings a navigation rail item as a whole, inside the rail. The
  // Pressable also spans the gap below the item, so the ring is on the item.
  it('Drawer.Item rings inward, clear of the items above and below', async () => {
    await render(<DrawerItem label="Inbox" onPress={() => {}} />);

    await focusFirstFocusable();

    expect(ringOffset()).toBe(INWARD);
  });

  it('Drawer.CollapsedItem rings the item inward, not the Pressable', async () => {
    await render(
      <DrawerCollapsedItem
        label="Inbox"
        focusedIcon="inbox"
        onPress={() => {}}
      />
    );

    const pressable = screen.getByRole('button');
    await act(async () => {
      await fireEvent(pressable, 'focus', ownFocusEvent());
    });

    expect(style(pressable).outlineStyle).toBeUndefined();
    expect(ringOffset()).toBe(INWARD);

    // An inward ring is painted under its own element's children, where the
    // active indicator would cover it, so it is on an overlay drawn after the
    // indicator.
    const root = (screen as unknown as { root: Node }).root;
    const [ringed] = walk(root, (n) => style(n).outlineStyle === 'solid');
    expect(style(ringed).position).toBe('absolute');
    expect(ringed.children ?? []).toHaveLength(0);
  });

  // The ring stays 2dp clear of the item above and below. Without a label the
  // indicator is a circle as tall as the item, and a two-line label sets the
  // item's height, so the ring reaches below the item in both cases.
  it.each([
    ['with a label', 'Inbox'],
    ['with a two-line label', 'Inbox and other mail'],
    ['without a label', undefined],
  ])(
    'Drawer.CollapsedItem %s clears the active indicator and the label',
    async (_name, label) => {
      await render(
        <DrawerCollapsedItem
          label={label}
          focusedIcon="inbox"
          active
          onPress={() => {}}
        />
      );

      await focusFirstFocusable();

      const root = (screen as unknown as { root: Node }).root;
      const [ringed] = walk(root, (n) => style(n).outlineStyle === 'solid');
      expect(style(ringed)).toMatchObject({
        top: -(outerOffset + thickness),
        bottom: -(outerOffset + thickness),
      });
    }
  );

  // A text badge pokes above the indicator, across the ring's top edge, so it
  // has to paint over the ring to stay readable.
  it('Drawer.CollapsedItem paints its badge over the ring', async () => {
    await render(
      <DrawerCollapsedItem
        label="Inbox"
        focusedIcon="inbox"
        badge={3}
        onPress={() => {}}
      />
    );

    await focusFirstFocusable();

    const root = (screen as unknown as { root: Node }).root;
    const [ringed] = walk(root, (n) => style(n).outlineStyle === 'solid');
    const wrapper = walk(root, (n) =>
      (n.children ?? []).some((c) => c === ringed)
    )[0];
    const siblings = wrapper.children ?? [];
    const badgeBox = siblings.findIndex(
      (c) => walk(c as Node, (n) => n === screen.getByText('3')).length > 0
    );
    expect(badgeBox).toBeGreaterThan(siblings.indexOf(ringed));
  });

  it('Appbar.Content with onPress rings outward, and keeps its own onFocus', async () => {
    const onFocus = jest.fn();
    await render(
      <AppbarContent title="Title" onPress={() => {}} onFocus={onFocus} />
    );

    await focusFirstFocusable();

    expect(ringOffset()).toBe(OUTWARD);
    expect(onFocus).toHaveBeenCalledTimes(1);
  });

  // MD3's segmented button figure puts the ring on the segment's edge;
  // segments share borders, so outward would cover the neighbour.
  it('SegmentedButtons rings each segment inward', async () => {
    await render(
      <SegmentedButtons
        value="a"
        onValueChange={() => {}}
        buttons={[
          { value: 'a', label: 'A' },
          { value: 'b', label: 'B' },
        ]}
      />
    );

    await focusFirstFocusable();

    expect(ringOffset()).toBe(INWARD);
  });

  it('DataTable.Cell with onPress rings inward, like its row', async () => {
    await render(<DataTableCell onPress={() => {}}>cell</DataTableCell>);

    await focusFirstFocusable();

    expect(ringOffset()).toBe(INWARD);
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

  // The caller's `style` sizes and pads the card around the Pressable that
  // takes focus, so the ring goes on the card's own box: a ring on the
  // Pressable would stop at the content's height and sit inside the padding.
  it('Card rings its own box, whatever its size and padding', async () => {
    await render(
      <Card onPress={() => {}} style={{ height: 200, padding: 12 }}>
        <Text>card</Text>
      </Card>
    );

    await focusFirstFocusable();

    const root = (screen as unknown as { root: Node }).root;
    const ringed = walk(root, (n) => style(n).outlineStyle === 'solid');
    expect(ringed).toHaveLength(1);
    expect(style(ringed[0])).toMatchObject({
      height: 200,
      padding: 12,
      outlineOffset: OUTWARD,
    });
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
      await fireEvent(screen.getByTestId('item-0'), 'focus', ownFocusEvent());
    });

    expect(ringOffset()).toBe(INWARD);
  });

  it('Switch rings outward on its track, not inside it', async () => {
    await render(<Switch value onValueChange={() => {}} />);

    await focusFirstFocusable();

    expect(ringOffset()).toBe(OUTWARD);
  });
});

// A component's `theme` prop sets its ring color, not only the provider's.
describe('focus ring color follows the theme prop', () => {
  const theme = { colors: { secondary: 'rgb(255, 0, 0)' } };

  const ringColor = () => {
    const root = (screen as unknown as { root: Node }).root;
    const [ringed] = walk(root, (n) => style(n).outlineStyle === 'solid');
    return ringed ? style(ringed).outlineColor : undefined;
  };

  it.each([
    [
      'Appbar.Action',
      <AppbarAction
        key="action"
        icon="magnify"
        aria-label="Search"
        onPress={() => {}}
        theme={theme}
      />,
    ],
    [
      'Appbar.BackAction',
      <AppbarBackAction key="back" onPress={() => {}} theme={theme} />,
    ],
    [
      'IconButton',
      <IconButton
        key="icon"
        icon="plus"
        aria-label="Add"
        onPress={() => {}}
        theme={theme}
      />,
    ],
    [
      'TextInput.Icon',
      <TextInputIcon
        key="input-icon"
        icon="eye"
        aria-label="Show password"
        onPress={() => {}}
        style={undefined}
        multiline={false}
        disabled={false}
        error={false}
        theme={theme}
      />,
    ],
    [
      'Menu.Item',
      <MenuItem key="menu" title="item" onPress={() => {}} theme={theme} />,
    ],
    [
      'Chip',
      <Chip key="chip" onPress={() => {}} theme={theme}>
        chip
      </Chip>,
    ],
    [
      'DataTable.Row',
      <DataTableRow key="row" onPress={() => {}} theme={theme}>
        <DataTableCell>cell</DataTableCell>
      </DataTableRow>,
    ],
    [
      'BottomNavigation.Bar',
      <BottomNavigation.Bar
        key="bar"
        navigationState={{
          index: 0,
          routes: [{ key: 'a', title: 'A', focusedIcon: 'home' }],
        }}
        onTabPress={() => {}}
        renderTouchable={({ key, route: _route, ...props }) => (
          <TouchableRipple key={key} {...props} />
        )}
        theme={theme}
      />,
    ],
  ])('%s', async (_name, element) => {
    await render(element);

    await focusFirstFocusable();

    expect(ringColor()).toBe('rgb(255, 0, 0)');
  });

  // An Appbar hands its theme to its back action, actions and title, in every
  // mode, so their rings match the bar.
  it.each(['small', 'center-aligned', 'medium', 'large'] as const)(
    'Appbar in %s mode rings its controls in its theme color',
    async (mode) => {
      await render(
        <Appbar mode={mode} theme={theme}>
          <AppbarBackAction onPress={() => {}} />
          <AppbarAction icon="menu" isLeading onPress={() => {}} />
          <AppbarContent title="Inbox" onPress={() => {}} />
          <AppbarAction icon="magnify" onPress={() => {}} />
        </Appbar>
      );

      const root = (screen as unknown as { root: Node }).root;
      const focusables = walk(
        root,
        (n) => typeof n.props?.onFocus === 'function'
      );
      expect(focusables).toHaveLength(4);
      for (const node of focusables) {
        await act(async () => {
          await fireEvent(node as never, 'focus', ownFocusEvent());
        });
      }

      const rings = walk(root, (n) => style(n).outlineStyle === 'solid');
      expect(rings).toHaveLength(4);
      expect(rings.map((n) => style(n).outlineColor)).toEqual(
        Array(4).fill('rgb(255, 0, 0)')
      );
    }
  );
});

// `secondary` barely shows on the snackbar's `inverseSurface` (2.04:1 in the
// light theme, 1.32:1 in the dark), so its action and close button ring in
// `inversePrimary`, the action label's color. Only those two: a control the
// app puts in the message keeps `secondary`.
describe.each([
  ['light', LightTheme],
  ['dark', DarkTheme],
])('Snackbar focus ring (%s)', (_name, theme) => {
  const renderSnackbar = () =>
    render(
      <Snackbar
        visible
        onDismiss={() => {}}
        action={{ label: 'Undo', onPress: () => {} }}
        onIconPress={() => {}}
        iconAccessibilityLabel="Close"
        theme={theme}
      >
        <Button onPress={() => {}} theme={theme}>
          Details
        </Button>
      </Snackbar>
    );

  const ringColors = () => {
    const root = (screen as unknown as { root: Node }).root;
    return walk(root, (n) => style(n).outlineStyle === 'solid').map(
      (n) => style(n).outlineColor
    );
  };

  it.each(['Undo', 'Close'])('rings %s in inversePrimary', async (name) => {
    await renderSnackbar();

    await act(async () => {
      await fireEvent(
        screen.getByRole('button', { name }),
        'focus',
        ownFocusEvent()
      );
    });

    expect(ringColors()).toEqual([theme.colors.inversePrimary]);
  });

  it('rings a control in the message in secondary', async () => {
    await renderSnackbar();

    await act(async () => {
      await fireEvent(
        screen.getByRole('button', { name: 'Details' }),
        'focus',
        ownFocusEvent()
      );
    });

    expect(ringColors()).toEqual([theme.colors.secondary]);
  });
});

// A focused Pressable that unmounts sends no blur, so each of these resets its
// ring state when the handler goes away. Otherwise the new Pressable is drawn
// ringed when the handler comes back, with nothing focused.
describe('focus ring after the handler goes away and comes back', () => {
  const dropAndRestore = async (
    withHandler: ReactElement,
    withoutHandler: ReactElement
  ) => {
    const { rerender } = await render(withHandler);
    await focusFirstFocusable();
    expect(ringOffset()).toBeDefined();

    await act(async () => {
      await rerender(withoutHandler);
    });
    expect(ringOffset()).toBeUndefined();

    await act(async () => {
      await rerender(withHandler);
    });
  };

  it('Card shows no ring until it is focused again', async () => {
    await dropAndRestore(
      <Card onPress={() => {}}>
        <Text>card</Text>
      </Card>,
      <Card>
        <Text>card</Text>
      </Card>
    );

    expect(ringOffset()).toBeUndefined();
  });

  it('Chip shows no ring until it is focused again', async () => {
    await dropAndRestore(
      <Chip onPress={() => {}}>chip</Chip>,
      <Chip>chip</Chip>
    );

    expect(ringOffset()).toBeUndefined();
  });

  it('Chip close button shows no ring until it is focused again', async () => {
    await dropAndRestore(
      <Chip onClose={() => {}}>chip</Chip>,
      <Chip>chip</Chip>
    );

    expect(ringOffset()).toBeUndefined();
  });

  it('TouchableRipple shows no ring until it is focused again', async () => {
    await dropAndRestore(
      <TouchableRipple onPress={() => {}}>
        <Text>ripple</Text>
      </TouchableRipple>,
      <TouchableRipple>
        <Text>ripple</Text>
      </TouchableRipple>
    );

    expect(ringOffset()).toBeUndefined();
  });

  it('FAB shows no ring until it is focused again', async () => {
    await dropAndRestore(
      <FAB icon="plus" aria-label="Add" onPress={() => {}} />,
      <FAB icon="plus" aria-label="Add" />
    );

    expect(ringOffset()).toBeUndefined();
  });
});

describe('focus ring wiring (Android)', () => {
  const original = Platform.OS;
  beforeEach(() => {
    Platform.OS = 'android';
  });
  afterEach(() => {
    Platform.OS = original;
  });

  // The transparent ripple only keeps Android's grey focus highlight away, and
  // any ripple does that, so a caller's own ripple stays.
  it("DataTable.Title keeps a caller's android_ripple", async () => {
    await render(
      <DataTableTitle
        testID="title"
        onPress={() => {}}
        android_ripple={{ color: 'red' }}
      >
        title
      </DataTableTitle>
    );

    expect(
      screen.getByTestId('title').props.nativeBackgroundAndroid
    ).toMatchObject({ type: 'RippleAndroid', color: processColor('red') });
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
  // `:has()` (that only matches ancestors of the focused node).
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

  // These spread the caller's props onto the ringed element, so the ring's
  // `data-*` attribute must join the caller's `dataSet`, not replace it.
  it("DataTable.Title and Appbar.Content keep a caller's own dataSet", async () => {
    const dataSet = { qa: 'title' };
    await render(
      <>
        <DataTableTitle onPress={() => {}} testID="table" {...{ dataSet }}>
          title
        </DataTableTitle>
        <AppbarContent
          title="Title"
          onPress={() => {}}
          testID="appbar"
          {...{ dataSet }}
        />
      </>
    );

    expect(screen.getByTestId('table').props.dataSet).toEqual({
      qa: 'title',
      focusRing: 'inward',
    });
    expect(screen.getByTestId('appbar').props.dataSet).toEqual({
      qa: 'title',
      focusRing: 'outward',
    });
  });

  it('Drawer.CollapsedItem marks its Pressable as the focus target and rings the item inside it', async () => {
    await render(
      <DrawerCollapsedItem
        label="Inbox"
        focusedIcon="inbox"
        onPress={() => {}}
      />
    );

    const pressable = screen.getByRole('button');
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
    ).toBe('inward');
  });

  it("Card marks its own box as the ring and leaves the Pressable's outline to the stylesheet", async () => {
    await render(
      <Card testID="card" onPress={() => {}} style={{ height: 200 }}>
        <Text>card</Text>
      </Card>
    );

    const pressable = screen.getByTestId('card');
    // The stylesheet hides its outline, and only where `:has()` works.
    expect(style(pressable)).not.toHaveProperty('outline');

    const root = (screen as unknown as { root: Node }).root;
    const ringed = walk(
      root,
      (n) =>
        (n.props?.dataSet as Record<string, string> | undefined)
          ?.focusRingWithin !== undefined
    );
    expect(ringed).toHaveLength(1);
    expect(
      (ringed[0].props?.dataSet as Record<string, string>).focusRingWithin
    ).toBe('outward');
    expect(style(ringed[0]).height).toBe(200);
    expect(walk(ringed[0], (n) => n === pressable)).toHaveLength(1);
  });

  it('Button rings the view that draws its outline, not the button inside it', async () => {
    await render(
      <Button mode="outlined" onPress={() => {}}>
        button
      </Button>
    );

    const button = screen.getByRole('button');
    // The stylesheet hides its outline, and only where `:has()` works.
    expect(style(button)).not.toHaveProperty('outline');

    const root = (screen as unknown as { root: Node }).root;
    const ringed = walk(
      root,
      (n) =>
        (n.props?.dataSet as Record<string, string> | undefined)
          ?.focusRingWithin !== undefined
    );
    expect(ringed).toHaveLength(1);
    expect(
      (ringed[0].props?.dataSet as Record<string, string>).focusRingWithin
    ).toBe('outward');
    expect(style(ringed[0]).borderWidth).toBeGreaterThan(0);
    expect(walk(ringed[0], (n) => n === button)).toHaveLength(1);
  });

  it("Chip marks its own box as the ring, keeps the caller's dataSet and leaves the ripple's outline to the stylesheet", async () => {
    await render(
      <Chip
        testID="chip"
        onPress={() => {}}
        style={{ height: 40 }}
        {...{ dataSet: { qa: 'chip' } }}
      >
        chip
      </Chip>
    );

    const ripple = screen.getByTestId('chip');
    // The stylesheet hides its outline, and only where `:has()` works.
    expect(style(ripple)).not.toHaveProperty('outline');

    const root = (screen as unknown as { root: Node }).root;
    const ringed = walk(
      root,
      (n) =>
        (n.props?.dataSet as Record<string, string> | undefined)
          ?.focusRingWithin !== undefined
    );
    expect(ringed).toHaveLength(1);
    expect(ringed[0].props?.dataSet).toEqual({
      qa: 'chip',
      focusRingWithin: 'outward',
    });
    expect(style(ringed[0])).toMatchObject({ height: 40, borderWidth: 1 });
    expect(walk(ringed[0], (n) => n === ripple)).toHaveLength(1);
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
    expect(style(ringed[0])).toMatchObject({
      position: 'absolute',
      borderRadius: 12 - outerOffset,
    });
  });
});
