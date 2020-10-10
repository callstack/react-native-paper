import * as React from 'react';
import { StyleSheet, Pressable, View, Platform } from 'react-native';
import color from 'color';
import { withTheme } from '../../core/theming';
import {
  getInteractionChildren,
  getInteractionStyle,
  InteractionChildrenType,
  InteractionState,
  InteractionStyleType,
  useRadiusStyles,
} from './utils';

type Props = React.ComponentProps<typeof Pressable> & {
  borderless?: boolean;
  background?: string;
  disabled?: boolean;
  onPress?: () => void | null;
  rippleColor?: string;
  underlayColor?: string;
  children: InteractionChildrenType;
  style?: InteractionStyleType;
  theme: ReactNativePaper.Theme;
};

const TouchableRipple = ({
  style,
  background,
  borderless = false,
  disabled: disabledProp,
  rippleColor,
  underlayColor,
  children,
  theme,
  ...rest
}: Props) => {
  const { dark, colors } = theme;
  const disabled = disabledProp || !rest.onPress;
  const calculatedRippleColor =
    rippleColor ||
    color(colors.text)
      .alpha(dark ? 0.32 : 0.2)
      .rgb()
      .string();

  const rippleContainerStyle = useRadiusStyles(style);

  return (
    <Pressable
      {...rest}
      disabled={disabled}
      android_ripple={{
        color: background != null ? background : calculatedRippleColor,
        borderless,
      }}
      style={[
        styles.touchable,
        borderless && styles.borderless,
        rippleContainerStyle,
      ]}
    >
      {(interactionState: InteractionState) => (
        <View style={getInteractionStyle(interactionState, style)}>
          {React.Children.only(
            getInteractionChildren(interactionState, children)
          )}
          {interactionState.pressed && Platform.OS !== 'android' ? (
            <View
              style={[
                StyleSheet.absoluteFill,
                { backgroundColor: underlayColor || rippleColor },
              ]}
            />
          ) : null}
        </View>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  touchable: {
    position: 'relative',
  },
  borderless: {
    overflow: 'hidden',
  },
});

export default withTheme(TouchableRipple);
