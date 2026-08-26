import { Platform, StyleSheet, View } from 'react-native';
import type {
  GestureResponderEvent,
  PressableAndroidRippleConfig,
  StyleProp,
  TextStyle,
  ViewStyle,
} from 'react-native';

import SegmentedButtonContent from './SegmentedButtonContent';
import { SegmentedButtonTokens } from './tokens';
import { useSegmentedButtonInteraction } from './useSegmentedButtonInteraction';
import {
  getSegmentedButtonBorderRadius,
  getSegmentedButtonColors,
  getSegmentedButtonHeight,
  getSegmentedButtonOutlineStyle,
} from './utils';
import { tokens } from '../../theme/tokens';
import type { Theme } from '../../types';
import { splitStyles } from '../../utils/splitStyles';
import type { IconSource } from '../Icon';
import TouchableRipple from '../TouchableRipple/TouchableRipple';
import type { Props as TouchableRippleProps } from '../TouchableRipple/TouchableRipple';

const focusIndicatorTokens = tokens.md.sys.state.focusIndicator;
const FOCUS_RING_OUTSET =
  focusIndicatorTokens.thickness + focusIndicatorTokens.outerOffset;

const isBorderRadiusStyle = (property: keyof ViewStyle) =>
  property === 'borderCurve' ||
  (property.startsWith('border') && property.endsWith('Radius'));

const isBorderStyle = (property: keyof ViewStyle) =>
  property.startsWith('border');

export type Props = {
  /**
   * Whether the segmented button is checked
   */
  checked: boolean;
  /**
   * Accessibility role determined by the segmented button selection variant.
   */
  role: 'radio' | 'checkbox';
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
   * Type of background drawable to display the feedback (Android).
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
   * Resolved theme inherited from the segmented button group.
   */
  theme: Theme;
};

const SegmentedButtonItem = ({
  checked,
  role,
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
  theme,
  labelMaxFontSizeMultiplier,
  hitSlop,
}: Props) => {
  const { interactionProps, stateLayerOpacity, showFocusRing } =
    useSegmentedButtonInteraction(disabled);

  const accessibilityLabel = label || ariaLabel;

  const colors = getSegmentedButtonColors({
    checked,
    theme,
    disabled,
    checkedColor,
    uncheckedColor,
  });
  const layerStyles = getSegmentedButtonItemStyles({
    colors,
    density,
    segment,
    stateLayerOpacity,
    style,
  });

  return (
    <View
      testID={testID ? `${testID}-wrapper` : undefined}
      style={[styles.wrapper, showFocusRing && styles.focusedWrapper]}
    >
      <TouchableRipple
        borderless
        onPress={onPress}
        {...interactionProps}
        aria-label={accessibilityLabel}
        aria-disabled={disabled}
        aria-checked={checked}
        role={role}
        disabled={disabled}
        focusable={!disabled}
        testID={testID}
        style={layerStyles.touchable}
        background={background}
        rippleColor="transparent"
        underlayColor="transparent"
        hitSlop={hitSlop}
      >
        <View
          testID={testID ? `${testID}-container` : undefined}
          style={layerStyles.container}
        >
          <View
            pointerEvents="none"
            testID={testID ? `${testID}-state-layer` : undefined}
            style={layerStyles.stateLayer}
          />
          <SegmentedButtonContent
            checked={checked}
            contentColor={colors.textColor}
            contentOpacity={colors.textOpacity}
            icon={icon}
            label={label}
            labelMaxFontSizeMultiplier={labelMaxFontSizeMultiplier}
            labelStyle={labelStyle}
            showSelectedCheck={showSelectedCheck}
            testID={testID}
            theme={theme}
          />
          <View
            pointerEvents="none"
            testID={testID ? `${testID}-outline` : undefined}
            style={layerStyles.outline}
          />
        </View>
      </TouchableRipple>
      {showFocusRing ? (
        <View
          pointerEvents="none"
          testID={testID ? `${testID}-focus-ring` : undefined}
          style={layerStyles.focusRing}
        />
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    minWidth: SegmentedButtonTokens.minimumWidth,
    minHeight: SegmentedButtonTokens.touchTargetHeight,
    justifyContent: 'center',
    overflow: 'visible',
  },
  focusedWrapper: {
    zIndex: 1,
  },
  touchable: {
    minHeight: SegmentedButtonTokens.touchTargetHeight,
    justifyContent: 'center',
    overflow: 'visible',
  },
  container: {
    width: '100%',
    justifyContent: 'center',
  },
  stateLayer: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
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
    left: -FOCUS_RING_OUTSET,
    right: -FOCUS_RING_OUTSET,
    borderWidth: focusIndicatorTokens.thickness,
    pointerEvents: 'none',
  },
});

const webNoOutline = { outline: 'none' } as unknown as ViewStyle;

type ItemStyleOptions = {
  colors: ReturnType<typeof getSegmentedButtonColors>;
  density: NonNullable<Props['density']>;
  segment: Props['segment'];
  stateLayerOpacity: number;
  style: Props['style'];
};

function getSegmentedButtonItemStyles({
  colors: {
    backgroundColor: containerColor,
    borderColor: outlineColor,
    borderOpacity: outlineOpacity,
    focusIndicatorColor,
    stateLayerColor,
  },
  density,
  segment,
  stateLayerOpacity,
  style,
}: ItemStyleOptions) {
  const segmentBorderRadius = getSegmentedButtonBorderRadius({ segment });
  const segmentOutlineStyle = getSegmentedButtonOutlineStyle(segment);
  const containerHeight = getSegmentedButtonHeight(density);
  const flattenedStyle = (StyleSheet.flatten(style) || {}) as ViewStyle;
  const [containerStyleOverrides, borderRadiusOverrides, borderOverrides] =
    splitStyles(flattenedStyle, isBorderRadiusStyle, isBorderStyle);
  const borderRadiusStyle = {
    ...(flattenedStyle.borderRadius === undefined ? segmentBorderRadius : {}),
    ...borderRadiusOverrides,
  };
  const focusRingVerticalInset =
    (SegmentedButtonTokens.touchTargetHeight - containerHeight) / 2 -
    FOCUS_RING_OUTSET;

  return {
    touchable: [
      styles.touchable,
      borderRadiusStyle,
      Platform.OS === 'web' ? webNoOutline : undefined,
    ],
    container: [
      styles.container,
      borderRadiusStyle,
      { height: containerHeight, backgroundColor: containerColor },
      Object.keys(containerStyleOverrides).length
        ? containerStyleOverrides
        : undefined,
    ],
    stateLayer: [
      styles.stateLayer,
      borderRadiusStyle,
      {
        backgroundColor: stateLayerColor,
        opacity: stateLayerOpacity,
      },
    ],
    outline: [
      styles.outline,
      borderRadiusStyle,
      flattenedStyle.borderWidth === undefined
        ? segmentOutlineStyle
        : undefined,
      { borderColor: outlineColor, opacity: outlineOpacity },
      Object.keys(borderOverrides).length ? borderOverrides : undefined,
    ],
    focusRing: [
      styles.focusRing,
      borderRadiusStyle,
      {
        top: focusRingVerticalInset,
        bottom: focusRingVerticalInset,
        borderColor: focusIndicatorColor,
      },
    ],
  };
}

export default SegmentedButtonItem;

export { SegmentedButtonItem as SegmentedButton };
