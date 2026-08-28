/* eslint-disable testing-library/no-node-access, @typescript-eslint/no-unsafe-type-assertion, no-restricted-syntax --
   The node carrying the ring is an unnamed internal view (Card's Pressable,
   Switch's track, FAB's clip view). There is no testID to query it by, and
   which node it is IS the thing under test, so the tree has to be walked. */
import { StyleSheet, Text } from 'react-native';
import type { ViewStyle } from 'react-native';

import { describe, expect, it } from '@jest/globals';
import { act, fireEvent } from '@testing-library/react-native';

import { render, screen } from '../../test-utils';
import { tokens } from '../../theme/tokens';
import Card from '../Card/Card';
import Chip from '../Chip/Chip';
import FAB from '../FAB/FAB';
import ListItem from '../List/ListItem';
import Switch from '../Switch/Switch';

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

  it('Chip rings inward, so a scrolling chip row cannot trim it', async () => {
    await render(<Chip onPress={() => {}}>chip</Chip>);

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

  it('FAB rings outward on its clip view', async () => {
    await render(<FAB icon="plus" onPress={() => {}} />);

    await focusFirstFocusable();

    expect(ringOffset()).toBe(OUTWARD);
  });

  // Inward here lands on the filled track, where `secondary` is ~1:1 against
  // `primary` and effectively invisible.
  it('Switch rings outward on its track, not inside it', async () => {
    await render(<Switch value onValueChange={() => {}} />);

    await focusFirstFocusable();

    expect(ringOffset()).toBe(OUTWARD);
  });
});
