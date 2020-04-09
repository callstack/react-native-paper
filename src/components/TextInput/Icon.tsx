import React from 'react';
import { View, StyleSheet } from 'react-native';
import color from 'color';
import { withTheme } from '../../core/theming';

import IconButton from '../IconButton';
import { Theme } from '../../types';

type Props = React.ComponentProps<typeof IconButton> & {
  /**
   * @optional
   */
  theme: Theme;
};

export const ICON_SIZE = 24;
const ICON_OFFSET = 12;

export function renderIcon({
  icon,
  iconTopPosition,
  side,
}: {
  icon: React.ReactNode;
  iconTopPosition: number;
  side: 'left' | 'right';
}): React.ReactNode {
  // @ts-ignore
  return React.cloneElement(icon, {
    style: {
      top: iconTopPosition,
      [side]: ICON_OFFSET,
    },
  });
}

/**
 * A component used to display an icon in the textinput.
 */
class TextInputIcon extends React.Component<Props> {
  static displayName = 'TextInput.Icon';

  render() {
    const {
      icon,
      onPress,
      style,
      color: customIconColor,
      theme,
      ...rest
    } = this.props;

    const { colors, dark } = theme;
    const textColor = colors.text;
    const iconColor =
      customIconColor ||
      (dark
        ? textColor
        : color(textColor)
            .alpha(0.54)
            .rgb()
            .string());
    const rippleColor = color(textColor)
      .alpha(0.32)
      .rgb()
      .string();

    return (
      <View style={[styles.container, style]}>
        <IconButton
          icon={icon}
          style={styles.iconButton}
          size={ICON_SIZE}
          onPress={onPress}
          rippleColor={rippleColor}
          color={iconColor}
          animated
          {...rest}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    width: ICON_SIZE,
    height: ICON_SIZE,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconButton: {
    margin: 0,
  },
});

export default withTheme(TextInputIcon);

// @component-docs ignore-next-line
export { TextInputIcon };
