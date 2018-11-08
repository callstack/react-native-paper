/* @flow */

import color from 'color';
import * as React from 'react';
import { View, StyleSheet } from 'react-native';
import FABGroup from './FABGroup';
import Surface from '../Surface';
import CrossFadeIcon from '../CrossFadeIcon';
import Text from '../Typography/Text';
import TouchableRipple from '../TouchableRipple';
import { black, white } from '../../styles/colors';
import { withTheme } from '../../core/theming';
import type { Theme, $RemoveChildren } from '../../types';
import type { IconSource } from './../Icon';

type Props = $RemoveChildren<typeof Surface> & {|
  /**
   * Icon to display for the `FAB`.
   */
  icon: IconSource,
  /**
   * Optional label for extended `FAB`.
   */
  label?: string,
  /**
   * Accessibility label for the FAB. This is read by the screen reader when the user taps the FAB.
   * Uses `label` by default if specified.
   */
  accessibilityLabel?: string,
  /**
   *  Whether FAB is mini-sized, used to create visual continuity with other elements. This has no effect if `label` is specified.
   */
  small?: boolean,
  /**
   * Custom color for the `FAB`.
   */
  color?: string,
  /**
   * Whether `FAB` is disabled. A disabled button is greyed out and `onPress` is not called on touch.
   */
  disabled?: boolean,
  /**
   * Function to execute on press.
   */
  onPress?: () => mixed,
  style?: any,
  /**
   * @optional
   */
  theme: Theme,
|};

/**
 * A floating action button represents the primary action in an application.
 *
 * <div class="screenshots">
 *   <img src="screenshots/fab-1.png" />
 *   <img src="screenshots/fab-2.png" />
 * </div>
 *
 * ## Usage
 * ```js
 * import * as React from 'react';
 * import { StyleSheet } from 'react-native';
 * import { FAB } from 'react-native-paper';
 *
 * const MyComponent = () => (
 *   <FAB
 *     style={styles.fab}
 *     small
 *     icon="add"
 *     onPress={() => console.log('Pressed')}
 *   />
 * );
 *
 * const styles = StyleSheet.create({
 *   fab: {
 *     position: 'absolute',
 *     margin: 16,
 *     right: 0,
 *     bottom: 0,
 *   },
 * })
 *
 * export default MyComponent;
 * ```
 */
class FAB extends React.Component<Props> {
  // @component ./FABGroup.js
  static Group = FABGroup;

  render() {
    const {
      small,
      icon,
      label,
      accessibilityLabel = label,
      color: customColor,
      disabled,
      onPress,
      theme,
      style,
      ...rest
    } = this.props;

    const disabledColor = color(theme.dark ? white : black)
      .alpha(0.12)
      .rgb()
      .string();

    const { backgroundColor = disabled ? disabledColor : theme.colors.accent } =
      StyleSheet.flatten(style) || {};

    let foregroundColor;

    if (typeof customColor !== 'undefined') {
      foregroundColor = customColor;
    } else if (disabled) {
      foregroundColor = color(theme.dark ? white : black)
        .alpha(0.32)
        .rgb()
        .string();
    } else {
      foregroundColor = !color(backgroundColor).light()
        ? white
        : 'rgba(0, 0, 0, .54)';
    }

    const rippleColor = color(foregroundColor)
      .alpha(0.32)
      .rgb()
      .string();

    return (
      <Surface
        {...rest}
        style={[
          { backgroundColor },
          styles.container,
          disabled && styles.disabled,
          style,
        ]}
      >
        <TouchableRipple
          borderless
          onPress={onPress}
          rippleColor={rippleColor}
          disabled={disabled}
          accessibilityLabel={accessibilityLabel}
          accessibilityTraits={disabled ? ['button', 'disabled'] : 'button'}
          accessibilityComponentType="button"
          accessibilityRole="button"
          accessibilityStates={disabled ? ['disabled'] : undefined}
          style={styles.touchable}
        >
          <View
            style={[
              styles.content,
              label ? styles.extended : small ? styles.small : styles.standard,
            ]}
            pointerEvents="none"
          >
            <CrossFadeIcon source={icon} size={24} color={foregroundColor} />
            {label ? (
              <Text
                style={[
                  styles.label,
                  { color: foregroundColor, fontFamily: theme.fonts.medium },
                ]}
              >
                {label.toUpperCase()}
              </Text>
            ) : null}
          </View>
        </TouchableRipple>
      </Surface>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 28,
    elevation: 6,
  },
  touchable: {
    borderRadius: 28,
  },
  standard: {
    height: 56,
    width: 56,
  },
  small: {
    height: 40,
    width: 40,
  },
  extended: {
    height: 48,
    paddingHorizontal: 16,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    marginHorizontal: 8,
  },
  disabled: {
    elevation: 0,
  },
});

export default withTheme(FAB);
