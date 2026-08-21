import * as React from 'react';
import { Animated, Platform, StyleSheet, View } from 'react-native';
import type {
  GestureResponderEvent,
  NativeSyntheticEvent,
  PressableAndroidRippleConfig,
  StyleProp,
  TargetedEvent,
  TextStyle,
  ViewStyle,
} from 'react-native';

import { SegmentedButtonTokens } from './tokens';
import {
  getSegmentedButtonBorderRadius,
  getSegmentedButtonColors,
  getSegmentedButtonHeight,
  getSegmentedButtonOutlineStyle,
} from './utils';
import { useInternalTheme } from '../../core/theming';
import { tokens } from '../../theme/tokens';
import type { ThemeProp } from '../../types';
import { isKeyboardFocusEvent } from '../../utils/isKeyboardFocusEvent';
import type { IconSource } from '../Icon';
import Icon from '../Icon';
import TouchableRipple from '../TouchableRipple/TouchableRipple';
import type { Props as TouchableRippleProps } from '../TouchableRipple/TouchableRipple';
import Text from '../Typography/Text';

const stateTokens = tokens.md.sys.state;
const FOCUS_RING_INSET =
  stateTokens.focusIndicator.thickness + stateTokens.focusIndicator.outerOffset;

export type Props = {
  /**
   * Whether the segmented button is checked
   */
  checked: boolean;
  /**
   * Icon to display for the `SegmentedButtonItem`.
   */
  icon?: IconSource;
  /**
   * @supported Available in v5.x with theme version 3
   * Custom color for unchecked Text and Icon.
   */
  uncheckedColor?: string;
  /**
   * @supported Available in v5.x with theme version 3
   * Custom color for checked Text and Icon.
   */
  checkedColor?: string;
  /**
   * Whether the button is disabled.
   */
  disabled?: boolean;
  /**
   * Type of background drawabale to display the feedback (Android).
   * https://reactnative.dev/docs/pressable#rippleconfig
   */
  background?: PressableAndroidRippleConfig;
  /**
   * Accessibility label for the `SegmentedButtonItem`. This is read by the screen reader when the user taps the button.
   */
  'aria-label'?: string;
  /**
   * Function to execute on press.
   */
  onPress?: (event: GestureResponderEvent) => void;
  /**
   * Value of button.
   */
  value: string;
  /**
   * Label text of the button.
   */
  label?: string;
  /**
   * Button segment.
   */
  segment?: 'first' | 'last';
  /**
   * Show optional check icon to indicate selected state
   */
  showSelectedCheck?: boolean;
  /**
   * Density is applied to the height, to allow usage in denser UIs.
   */
  density?: 'regular' | 'small' | 'medium' | 'high';
  /**
   * Specifies the largest possible scale a label font can reach.
   */
  labelMaxFontSizeMultiplier?: number;
  style?: StyleProp<ViewStyle>;
  /**
   * Style for the button label.
   */
  labelStyle?: StyleProp<TextStyle>;
  /**
   * testID to be used on tests.
   */
  testID?: string;
  /**
   * Sets additional distance outside of element in which a press can be detected.
   */
  hitSlop?: TouchableRippleProps['hitSlop'];
  /**
   * @optional
   */
  theme?: ThemeProp;
};

const SegmentedButtonItem = ({
  checked,
  'aria-label': ariaLabel,
  disabled,
  style,
  labelStyle,
  showSelectedCheck,
  checkedColor,
  uncheckedColor,
  background,
  icon,
  testID,
  label,
  onPress,
  segment,
  density = 'regular',
  theme: themeOverrides,
  labelMaxFontSizeMultiplier,
  hitSlop,
}: Props) => {
  const theme = useInternalTheme(themeOverrides);

  const [pressed, setPressed] = React.useState(false);
  const [hovered, setHovered] = React.useState(false);
  const [focused, setFocused] = React.useState(false);
  const checkScale = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    if (!showSelectedCheck) {
      return;
    }
    if (checked) {
      Animated.spring(checkScale, {
        toValue: 1,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.spring(checkScale, {
        toValue: 0,
        useNativeDriver: true,
      }).start();
    }
  }, [checked, checkScale, showSelectedCheck]);

  const {
    borderColor,
    borderOpacity,
    textColor,
    textOpacity,
    backgroundColor,
    stateLayerColor,
    focusIndicatorColor,
  } = getSegmentedButtonColors({
    checked,
    theme,
    disabled,
    checkedColor,
    uncheckedColor,
  });

  const segmentBorderRadius = getSegmentedButtonBorderRadius({
    theme,
    segment,
  });
  const outlineStyle = getSegmentedButtonOutlineStyle(segment);
  const visualHeight = getSegmentedButtonHeight(density);
  const showIcon = !icon ? false : label && checked ? !showSelectedCheck : true;
  const showCheckedIcon = checked && showSelectedCheck;

  const optionIconStyle = {
    ...(label && {
      transform: [
        {
          scale: checkScale.interpolate({
            inputRange: [0, 1],
            outputRange: [1, 0],
          }),
        },
      ],
    }),
  };

  const labelTextStyle: TextStyle = {
    ...theme.fonts.labelLarge,
    color: textColor,
  };
  const stateLayerOpacity = disabled
    ? 0
    : pressed
      ? stateTokens.opacity.pressed
      : focused
        ? stateTokens.opacity.focused
        : hovered
          ? stateTokens.opacity.hovered
          : 0;
  const focusRingVerticalInset =
    (SegmentedButtonTokens.touchTargetHeight - visualHeight) / 2 -
    FOCUS_RING_INSET;

  const handleFocus = (event: NativeSyntheticEvent<TargetedEvent>) => {
    if (!disabled && isKeyboardFocusEvent(event)) {
      setFocused(true);
    }
  };

  const handleBlur = () => {
    setPressed(false);
    setFocused(false);
  };

  return (
    <View
      style={[
        styles.button,
        focused && !disabled && styles.focusedButton,
        style,
      ]}
    >
      <TouchableRipple
        borderless
        onPress={onPress}
        onPressIn={() => setPressed(true)}
        onPressOut={() => setPressed(false)}
        onHoverIn={() => setHovered(true)}
        onHoverOut={() => setHovered(false)}
        onFocus={handleFocus}
        onBlur={handleBlur}
        aria-label={ariaLabel}
        aria-disabled={disabled}
        aria-checked={checked}
        role="button"
        disabled={disabled}
        testID={testID}
        style={[
          styles.touchable,
          segmentBorderRadius,
          Platform.OS === 'web' ? webNoOutline : undefined,
        ]}
        background={background}
        rippleColor="transparent"
        underlayColor="transparent"
        theme={theme}
        hitSlop={hitSlop}
      >
        <View
          testID={testID ? `${testID}-container` : undefined}
          style={[
            styles.visual,
            segmentBorderRadius,
            { height: visualHeight, backgroundColor },
          ]}
        >
          <View
            pointerEvents="none"
            testID={testID ? `${testID}-state-layer` : undefined}
            style={[
              styles.stateLayer,
              { backgroundColor: stateLayerColor, opacity: stateLayerOpacity },
            ]}
          />
          <View style={[styles.content, { opacity: textOpacity }]}>
            {showCheckedIcon ? (
              <Animated.View
                testID={testID ? `${testID}-check-icon` : undefined}
                style={[styles.icon, { transform: [{ scale: checkScale }] }]}
              >
                <Icon
                  source="check"
                  size={SegmentedButtonTokens.iconSize}
                  color={textColor}
                />
              </Animated.View>
            ) : null}
            {showIcon ? (
              <Animated.View
                testID={testID ? `${testID}-icon` : undefined}
                style={[styles.icon, optionIconStyle]}
              >
                <Icon
                  source={icon}
                  size={SegmentedButtonTokens.iconSize}
                  color={textColor}
                />
              </Animated.View>
            ) : null}
            {label ? (
              <Text
                variant="labelLarge"
                style={[styles.label, labelTextStyle, labelStyle]}
                selectable={false}
                numberOfLines={1}
                maxFontSizeMultiplier={labelMaxFontSizeMultiplier}
                testID={testID ? `${testID}-label` : undefined}
              >
                {label}
              </Text>
            ) : null}
          </View>
          <View
            pointerEvents="none"
            testID={testID ? `${testID}-outline` : undefined}
            style={[
              styles.outline,
              segmentBorderRadius,
              outlineStyle,
              { borderColor, opacity: borderOpacity },
            ]}
          />
        </View>
      </TouchableRipple>
      {focused && !disabled ? (
        <View
          pointerEvents="none"
          testID={testID ? `${testID}-focus-ring` : undefined}
          style={[
            styles.focusRing,
            segmentBorderRadius,
            {
              top: focusRingVerticalInset,
              bottom: focusRingVerticalInset,
              borderColor: focusIndicatorColor,
            },
          ]}
        />
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  button: {
    flex: 1,
    minWidth: SegmentedButtonTokens.minimumWidth,
    minHeight: SegmentedButtonTokens.touchTargetHeight,
    justifyContent: 'center',
    overflow: 'visible',
  },
  focusedButton: {
    zIndex: 1,
  },
  touchable: {
    minHeight: SegmentedButtonTokens.touchTargetHeight,
    justifyContent: 'center',
  },
  visual: {
    width: '100%',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  stateLayer: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  },
  label: {
    flexShrink: 1,
    textAlign: 'center',
  },
  content: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: SegmentedButtonTokens.horizontalPadding,
    columnGap: SegmentedButtonTokens.iconLabelGap,
  },
  icon: {
    width: SegmentedButtonTokens.iconSize,
    height: SegmentedButtonTokens.iconSize,
    alignItems: 'center',
    justifyContent: 'center',
  },
  outline: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    pointerEvents: 'none',
  },
  focusRing: {
    position: 'absolute',
    left: -FOCUS_RING_INSET,
    right: -FOCUS_RING_INSET,
    borderWidth: stateTokens.focusIndicator.thickness,
    pointerEvents: 'none',
  },
});

const webNoOutline = { outline: 'none' } as unknown as ViewStyle;

export default SegmentedButtonItem;

export { SegmentedButtonItem as SegmentedButton };
