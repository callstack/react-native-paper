import * as React from 'react';
import { StyleSheet, type StyleProp, type ViewStyle } from 'react-native';

import Animated, {
  interpolate,
  useAnimatedStyle,
  type AnimatedStyle,
} from 'react-native-reanimated';

import type { CarouselItemMask } from './types';
import { useLocale } from '../../core/locale';

/** Below this much of its full width, an item's content has faded out entirely. */
const FADE_OUT_EXPANSION = 0.5;

export type Props = {
  /**
   * The item's live mask, from `renderItem`.
   */
  mask: CarouselItemMask;
  children?: React.ReactNode;
  style?: StyleProp<AnimatedStyle<ViewStyle>>;
  testID?: string;
};

/**
 * An item's full-size box.
 *
 * Content placed here is laid out at the item's unmasked size and clipped by
 * the mask, which is what keeps media from reflowing as the item moves through
 * the keylines. Content that should follow the mask instead — a label, most
 * often — goes in a `CarouselItemContent` inside this box.
 *
 * ## Usage
 * ```js
 * import * as React from 'react';
 * import { Image } from 'react-native';
 * import { Carousel, CarouselItem, CarouselItemContent, Text } from 'react-native-paper';
 *
 * const MyComponent = () => (
 *   <Carousel
 *     data={photos}
 *     height={200}
 *     renderItem={({ item, mask }) => (
 *       <CarouselItem mask={mask}>
 *         <Image source={{ uri: item.uri }} style={{ flex: 1 }} />
 *         <CarouselItemContent mask={mask}>
 *           <Text variant="titleMedium">{item.title}</Text>
 *         </CarouselItemContent>
 *       </CarouselItem>
 *     )}
 *   />
 * );
 *
 * export default MyComponent;
 * ```
 */
export const CarouselItem = ({ mask, children, style, testID }: Props) => (
  <Animated.View
    testID={testID}
    style={[{ width: mask.width, height: mask.height }, style]}
  >
    {children}
  </Animated.View>
);

/**
 * Content that tracks the mask rather than the item.
 *
 * It pins to the mask's leading edge and fades out as the item collapses,
 * which is the behaviour the spec asks of an item's text. Both reference
 * implementations expose the live mask for exactly this — `OnMaskChangedListener`
 * on Android, `carouselItemDrawInfo.maskRect` in Compose.
 */
export const CarouselItemContent = ({
  mask,
  children,
  style,
  testID,
}: Props) => {
  const { direction } = useLocale();
  const { width } = mask;

  const animatedStyle = useAnimatedStyle(() => {
    const { left, right } = mask.rect.value;
    return {
      transform: [{ translateX: direction === 'rtl' ? right - width : left }],
      opacity: interpolate(
        mask.expansion.value,
        [FADE_OUT_EXPANSION, 1],
        [0, 1],
        'clamp'
      ),
    };
  }, [direction, width]);

  return (
    <Animated.View
      testID={testID}
      style={[styles.content, animatedStyle, style]}
    >
      {children}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  content: {
    position: 'absolute',
    left: 0,
    bottom: 0,
  },
});

export default CarouselItem;
