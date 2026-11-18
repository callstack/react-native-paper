/* eslint-disable testing-library/no-node-access, @typescript-eslint/no-unsafe-type-assertion, no-restricted-syntax --
   The ring view is an unnamed internal view (a clip view, a card's box), so
   the tree has to be walked to find it and its children. */
import { Platform, StyleSheet, Text, TextInput } from 'react-native';
import type { ViewStyle } from 'react-native';

import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  jest,
} from '@jest/globals';

import { render, screen } from '../../test-utils';
import Button from '../Button/Button';
import Card from '../Card/Card';
import FAB from '../FAB/FAB';
import FABMenu from '../FAB/Menu';

// A bare import resolves to `.native` under the jest preset. Swap in the web
// TouchableRipple for every component in this file, so the structure checked
// here is the one the browser gets.
jest.mock('../TouchableRipple/TouchableRipple', () =>
  jest.requireActual('../TouchableRipple/TouchableRipple.tsx')
);

type Node = { props?: Record<string, unknown>; children?: unknown[] };

const walk = (node: Node | undefined, hit: (n: Node) => boolean): Node[] => {
  if (!node || typeof node !== 'object') return [];
  const here = hit(node) ? [node] : [];
  const kids = (node.children ?? []).flatMap((c) => walk(c as Node, hit));
  return [...here, ...kids];
};

const withinRings = () =>
  walk(
    (screen as unknown as { root: Node }).root,
    (n) =>
      (n.props?.dataSet as Record<string, string> | undefined)
        ?.focusRingWithin !== undefined
  );

// On web a `within` ring lights only for a focused direct child
// (`:has(> :focus-visible)`), so each ring view has to hold its own focusable
// element directly, and must not hold a control nested deeper inside it. The
// stylesheet also hides the browser's outline on that direct child.
describe('focus ring `within` structure (web)', () => {
  const original = Platform.OS;
  beforeEach(() => {
    Platform.OS = 'web';
  });
  afterEach(() => {
    Platform.OS = original;
  });

  it.each([
    [
      'FAB',
      <FAB key="fab" icon="plus" testID="focusable" onPress={() => {}} />,
    ],
    [
      'Button',
      <Button key="button" testID="focusable" onPress={() => {}}>
        Add
      </Button>,
    ],
    [
      'Card',
      <Card key="card" testID="focusable" onPress={() => {}}>
        <Text>card</Text>
      </Card>,
    ],
  ])(
    '%s holds its focusable element directly inside its ring',
    async (_name, element) => {
      await render(element);

      const rings = withinRings();
      expect(rings).toHaveLength(1);
      const focusable = screen.getByTestId('focusable');
      expect(rings[0].children).toContain(focusable);
      // No inline `outline: 'none'`: the stylesheet hides the browser's
      // outline, and only where `:has()` draws the ring instead.
      expect(
        StyleSheet.flatten(focusable.props.style as ViewStyle) ?? {}
      ).not.toHaveProperty('outline');
    }
  );

  // The trigger's ring view also holds the menu's overlay views, ahead of the
  // trigger itself.
  it('FAB.Menu holds its trigger and each item directly inside their rings', async () => {
    await render(
      <FABMenu
        expanded
        onDismiss={() => {}}
        trigger={{ icon: 'plus', testID: 'trigger' }}
        items={[
          { label: 'first', onPress: () => {}, testID: 'item-0' },
          { label: 'second', onPress: () => {}, testID: 'item-1' },
        ]}
      />
    );

    const rings = withinRings();
    for (const testID of ['trigger', 'item-0', 'item-1']) {
      const focusable = screen.getByTestId(testID);
      expect(rings.some((r) => r.children?.includes(focusable))).toBe(true);
    }
  });

  // A Button or TextInput inside a pressable Card is focused on its own, so it
  // must not light the Card's ring as well.
  it("does not hold a Card's nested controls directly inside the Card's ring", async () => {
    await render(
      <Card testID="card" onPress={() => {}}>
        <TextInput testID="input" />
        <Card.Actions>
          <Button onPress={() => {}}>OK</Button>
        </Card.Actions>
      </Card>
    );

    const [cardRing] = withinRings();
    expect(cardRing.children).toContain(screen.getByTestId('card'));
    expect(cardRing.children).not.toContain(screen.getByTestId('input'));
    expect(cardRing.children).not.toContain(
      screen.getByRole('button', { name: 'OK' })
    );
  });
});
