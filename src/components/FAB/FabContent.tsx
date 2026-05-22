import * as React from 'react';
import {
  ColorValue,
  ScrollView,
  StyleProp,
  StyleSheet,
  Text as NativeText,
  TextLayoutEvent,
  View,
  ViewStyle,
} from 'react-native';

import Reanimated, { AnimatedStyle } from 'react-native-reanimated';

import type { TypescaleKey } from '../../theme/types';
import Icon, { IconSource } from '../Icon';
import AnimatedText from '../Typography/AnimatedText';

export type FabContentProps = {
  icon?: IconSource;
  label?: string;
  contentColor: ColorValue;
  height: number;
  iconSize: number;
  leading: number;
  trailing: number;
  iconLabelGap: number;
  labelTypescale?: TypescaleKey;
  labelMaxFontSizeMultiplier?: number;
  /**
   * Reanimated style merged onto the label wrapper. Used by the Extended FAB
   * to fade the label in and out as the FAB expands and collapses.
   */
  labelAnimatedStyle?: StyleProp<AnimatedStyle<ViewStyle>>;
  /**
   * Ref to the visible label node. Used by the Extended FAB to measure label
   * width on the web.
   */
  labelRef?: React.RefObject<(NativeText & HTMLElement) | null>;
  /**
   * `onTextLayout` for the visible label. Used by iOS, which reports the full
   * (unclipped) label width via this callback. Pass `undefined` on platforms
   * where the visible label is clipped and reports a useless width.
   */
  onLabelTextLayout?: (e: TextLayoutEvent) => void;
  labelNumberOfLines?: number;
  labelEllipsisMode?: 'clip' | 'tail' | 'head' | 'middle';
  /**
   * When set, an off-screen copy of the label is rendered with this callback
   * attached. Used by the Extended FAB on Android, where the visible label's
   * `onTextLayout` reports only the visible glyph run.
   */
  offscreenLabelMeasure?: (e: TextLayoutEvent) => void;
  testID?: string;
};

/**
 * Internal layout primitive: an icon-and-label row used by every FAB-flavored
 * surface in this package (regular, Extended, Menu trigger, Menu item).
 *
 * No animation, no ripple, no shadow, no container shape. Just the content.
 */
const FabContent = ({
  icon,
  label,
  contentColor,
  height,
  iconSize,
  leading,
  trailing,
  iconLabelGap,
  labelTypescale = 'labelLarge',
  labelMaxFontSizeMultiplier,
  labelAnimatedStyle,
  labelRef,
  onLabelTextLayout,
  labelNumberOfLines,
  labelEllipsisMode,
  offscreenLabelMeasure,
  testID,
}: FabContentProps) => {
  const hasLabel = label !== undefined && label !== '';
  const colorStyle = { color: contentColor };

  return (
    <>
      <View
        style={[
          styles.row,
          // Icon-only mode: square row, icon centered. With a label, the row
          // is padding-driven and the icon must stay at `paddingStart` so it
          // remains centered inside the 56 dp clip when the FAB collapses.
          hasLabel
            ? { height, paddingStart: leading, paddingEnd: trailing }
            : [styles.rowIconOnly, { height, width: height }],
        ]}
      >
        {icon ? (
          <Icon source={icon} size={iconSize} color={contentColor} />
        ) : null}
        {hasLabel ? (
          <Reanimated.View
            style={[
              icon ? { marginStart: iconLabelGap } : null,
              labelAnimatedStyle,
              styles.labelNoPointerEvents,
            ]}
          >
            <AnimatedText
              ref={labelRef}
              variant={labelTypescale}
              selectable={false}
              numberOfLines={labelNumberOfLines}
              ellipsizeMode={labelEllipsisMode}
              onTextLayout={onLabelTextLayout}
              maxFontSizeMultiplier={labelMaxFontSizeMultiplier}
              style={colorStyle}
              testID={testID ? `${testID}-text` : undefined}
            >
              {label}
            </AnimatedText>
          </Reanimated.View>
        ) : null}
      </View>
      {hasLabel && offscreenLabelMeasure ? (
        <ScrollView style={styles.offscreen}>
          <AnimatedText
            variant={labelTypescale}
            numberOfLines={1}
            onTextLayout={offscreenLabelMeasure}
            ellipsizeMode="tail"
            style={colorStyle}
          >
            {label}
          </AnimatedText>
        </ScrollView>
      ) : null}
    </>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    pointerEvents: 'none',
  },
  rowIconOnly: {
    justifyContent: 'center',
  },
  labelNoPointerEvents: {
    pointerEvents: 'none',
  },
  offscreen: {
    height: 0,
    position: 'absolute',
  },
});

export default FabContent;
