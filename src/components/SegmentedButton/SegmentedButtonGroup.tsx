import * as React from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import type { Theme } from '../../types';
import { withTheme } from '../../core/theming';
import SegmentedButton from './SegmentedButton';
import { getDisabledSegmentedButtonStyle } from './utils';
import type { SegmentedButtonProps } from 'react-native-paper';

export type Props = {
  /**
   * Function to execute on selection change.
   */
  onValueChange: (item: string | string[] | null) => void | null;
  /**
   * Value of the currently selected segmented button.
   */
  value: string | string[] | null;
  /**
   * React elements containing segmented buttons.
   */
  children: React.ReactElement<SegmentedButtonProps>[];
  /**
   * Support multiple selected options.
   */
  multiselect?: boolean;
  style?: StyleProp<ViewStyle>;
  /**
   * @optional
   */
  theme: Theme;
};

type SegmentedButtonContextType = {
  value: string | string[] | null;
  onValueChange: (item: string | string[] | null) => void | null;
};

export const SegmentedButtonGroupContext =
  React.createContext<SegmentedButtonContextType>(
    {} as SegmentedButtonContextType
  );

/**
 * @supported Available in v5.x
 * Segmented button group allows to control a group of segmented buttons.</br>
 *
 * ## Usage
 * ### Single select
 * ```js
 * import * as React from 'react';
 * import { SegmentedButton } from 'react-native-paper';
 *
 * const MyComponent = () => {
 *   const [value, setValue] = React.useState('left');
 *
 *   return (
 *     <SegmentedButton.Group
 *       onValueChange={value => setValue(value)}
 *       value={value}>
 *       <SegmentedButton icon="format-align-left" value="left" showSelectedCheck />
 *       <SegmentedButton icon="format-align-right" value="right" showSelectedCheck />
 *     </SegmentedButton.Group>
 *   );
 * };
 *
 * export default MyComponent;
 *```
 *
 * ### Multiselect
 * ```js
 * import * as React from 'react';
 * import { SegmentedButton } from 'react-native-paper';
 *
 * const MyComponent = () => {
 *   const [value, setValue] = React.useState('left');
 *
 *   return (
 *     <SegmentedButton.Group
 *       multiselect
 *       onValueChange={value => setValue(value)}
 *       value={value}>
 *       <SegmentedButton icon="format-align-left" value="left" />
 *       <SegmentedButton icon="format-align-right" value="right" />
 *     </SegmentedButton.Group>
 *   );
 * };
 *
 * export default MyComponent;
 *```
 */
const SegmentedButtonGroup = ({
  value,
  onValueChange,
  multiselect,
  children,
  style,
  theme,
}: Props) => {
  const count = React.Children.count(children);
  if (count < 2 || count > 5) {
    console.warn(
      'Segmented buttons are best used for selecting between 2 and 5 choices. If you have more than five choices, consider using another component, such as chips.'
    );
  }

  return (
    <SegmentedButtonGroupContext.Provider
      value={{
        value,
        onValueChange,
      }}
    >
      <View style={[styles.row, style]}>
        {React.Children.map(children, (child, i) => {
          if (child?.type === SegmentedButton) {
            const disabledChildStyle = getDisabledSegmentedButtonStyle({
              theme,
              children,
              index: i,
            });
            const segment =
              i === 0 ? 'first' : i === count - 1 ? 'last' : undefined;

            return React.cloneElement(child, {
              segment,
              multiselect,
              style: [disabledChildStyle, child.props.style],
            });
          }

          return child;
        })}
      </View>
    </SegmentedButtonGroupContext.Provider>
  );
};

SegmentedButtonGroup.displayName = 'SegmentedButton.Group';

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
  },
});

export default withTheme(SegmentedButtonGroup);

// @component-docs ignore-next-line
export { SegmentedButtonGroup };
