import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import type { Insets, StyleProp, ViewStyle } from 'react-native';

import ToggleButton, { TOGGLE_BUTTON_SIZE } from './ToggleButton';
import ToggleButtonGroup from './ToggleButtonGroup';
import getMinInteractiveSizeHitSlop from '../../utils/getMinInteractiveSizeHitSlop';

export type Props = {
  /**
   * Function to execute on selection change.
   */
  onValueChange: (value: string) => void;
  /**
   * Value of the currently selected toggle button.
   */
  value: string;
  /**
   * React elements containing toggle buttons.
   */
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
};

type Position = 'first' | 'middle' | 'last';

// Buttons in a row sit flush against each other, so an unrestricted hitSlop
// would have each button's expanded target reach into its neighbour's own
// visible bounds. On web, whichever button is later in the row wins that
// overlap, so a tap meant for one button's own edge could activate the other
// instead. Zero the slop on every edge shared with a neighbour; the outer
// edges (and, for a single button, every edge) keep the usual slop.
const DEFAULT_HIT_SLOP = getMinInteractiveSizeHitSlop({
  width: TOGGLE_BUTTON_SIZE,
  height: TOGGLE_BUTTON_SIZE,
});

const HIT_SLOP_BY_POSITION: Record<Position, Insets | undefined> =
  DEFAULT_HIT_SLOP
    ? {
        first: { ...DEFAULT_HIT_SLOP, right: 0 },
        middle: { ...DEFAULT_HIT_SLOP, left: 0, right: 0 },
        last: { ...DEFAULT_HIT_SLOP, left: 0 },
      }
    : { first: undefined, middle: undefined, last: undefined };

const RADIUS_OVERRIDES_BY_POSITION: Record<Position, ViewStyle> = {
  first: { borderTopRightRadius: 0, borderBottomRightRadius: 0 },
  middle: { borderRadius: 0 },
  last: { borderTopLeftRadius: 0, borderBottomLeftRadius: 0 },
};

/**
 * Toggle button row renders a group of toggle buttons in a row.
 *
 * ## Usage
 * ```js
 * import * as React from 'react';
 * import { ToggleButton } from 'react-native-paper';
 *
 * const MyComponent = () => {
 *   const [value, setValue] = React.useState('left');
 *
 *   return (
 *     <ToggleButton.Row onValueChange={value => setValue(value)} value={value}>
 *       <ToggleButton icon="format-align-left" value="left" />
 *       <ToggleButton icon="format-align-right" value="right" />
 *     </ToggleButton.Row>
 *   );
 * };
 *
 * export default MyComponent;
 *
 *```
 */
const ToggleButtonRow = ({ value, onValueChange, children, style }: Props) => {
  const count = React.Children.count(children);

  return (
    <ToggleButtonGroup value={value} onValueChange={onValueChange}>
      <View style={[styles.row, style]}>
        {React.Children.map(children, (child, i) => {
          // @ts-expect-error: TypeScript complains about child.type but it doesn't matter
          if (child && child.type === ToggleButton) {
            const position: Position =
              i === 0 ? 'first' : i === count - 1 ? 'last' : 'middle';

            // @ts-expect-error: We're sure that child is a React Element
            return React.cloneElement(child, {
              style: [
                styles.button,
                position !== 'first' && styles.noLeftBorder,
                // @ts-expect-error: We're sure that child is a React Element
                child.props.style,
              ],
              ...RADIUS_OVERRIDES_BY_POSITION[position],
              hitSlop:
                // @ts-expect-error: We're sure that child is a React Element
                child.props.hitSlop !== undefined
                  ? // @ts-expect-error: We're sure that child is a React Element
                    child.props.hitSlop
                  : // @ts-expect-error: We're sure that child is a React Element
                    child.props.disabled
                    ? undefined
                    : count > 1
                      ? HIT_SLOP_BY_POSITION[position]
                      : DEFAULT_HIT_SLOP,
            });
          }

          return child;
        })}
      </View>
    </ToggleButtonGroup>
  );
};

ToggleButtonRow.displayName = 'ToggleButton.Row';

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
  },
  button: {
    borderWidth: StyleSheet.hairlineWidth,
  },
  noLeftBorder: {
    borderLeftWidth: 0,
  },
});

export default ToggleButtonRow;

// @component-docs ignore-next-line
export { ToggleButtonRow };
