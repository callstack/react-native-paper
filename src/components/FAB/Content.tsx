import { StyleSheet, View } from 'react-native';
import type { ColorValue, StyleProp, ViewStyle } from 'react-native';

import Reanimated from 'react-native-reanimated';
import type { AnimatedStyle } from 'react-native-reanimated';

import type { TypescaleKey } from '../../theme/types';
import Icon from '../Icon';
import type { IconSource } from '../Icon';
import AnimatedText from '../Typography/AnimatedText';

export type ContentProps = {
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
  labelNumberOfLines?: number;
  labelEllipsisMode?: 'clip' | 'tail' | 'head' | 'middle';
  testID?: string;
};

/**
 * Internal layout primitive: an icon-and-label row used by every FAB-flavored
 * surface in this package (regular, Extended, Menu trigger, Menu item).
 *
 * No animation, no ripple, no shadow, no container shape. Just the content.
 */
const Content = ({
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
  labelNumberOfLines,
  labelEllipsisMode,
  testID,
}: ContentProps) => {
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
              variant={labelTypescale}
              selectable={false}
              numberOfLines={labelNumberOfLines}
              ellipsizeMode={labelEllipsisMode}
              maxFontSizeMultiplier={labelMaxFontSizeMultiplier}
              style={colorStyle}
              testID={testID ? `${testID}-text` : undefined}
            >
              {label}
            </AnimatedText>
          </Reanimated.View>
        ) : null}
      </View>
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
});

export default Content;
