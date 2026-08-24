import { StyleSheet, View } from 'react-native';
import type { StyleProp, TextStyle } from 'react-native';

import Animated, { useAnimatedStyle } from 'react-native-reanimated';
import type { SharedValue } from 'react-native-reanimated';

import { SegmentedButtonTokens } from './tokens';
import type { IconSource } from '../Icon';
import Icon from '../Icon';
import Text from '../Typography/Text';

type AnimatedIconProps = {
  color: TextStyle['color'];
  scale: SharedValue<number>;
  testID?: string;
};

const AnimatedCheckIcon = ({ color, scale, testID }: AnimatedIconProps) => {
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View testID={testID} style={[styles.icon, animatedStyle]}>
      <Icon
        source="check"
        size={SegmentedButtonTokens.iconSize}
        color={color}
      />
    </Animated.View>
  );
};

type AnimatedOptionIconProps = AnimatedIconProps & {
  animated: boolean;
  source: IconSource;
};

const AnimatedOptionIcon = ({
  animated,
  color,
  scale,
  source,
  testID,
}: AnimatedOptionIconProps) => {
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: 1 - scale.value }],
  }));

  return (
    <Animated.View
      testID={testID}
      style={[styles.icon, animated ? animatedStyle : undefined]}
    >
      <Icon
        source={source}
        size={SegmentedButtonTokens.iconSize}
        color={color}
      />
    </Animated.View>
  );
};

type Props = {
  checkmarkScale: SharedValue<number>;
  icon?: IconSource;
  label?: string;
  labelMaxFontSizeMultiplier?: number;
  labelStyle?: StyleProp<TextStyle>;
  labelTextStyle: TextStyle;
  shouldShowCheckIcon: boolean;
  shouldShowOptionIcon: boolean;
  testID?: string;
  textColor: TextStyle['color'];
  textOpacity: number;
};

const SegmentedButtonContent = ({
  checkmarkScale,
  icon,
  label,
  labelMaxFontSizeMultiplier,
  labelStyle,
  labelTextStyle,
  shouldShowCheckIcon,
  shouldShowOptionIcon,
  testID,
  textColor,
  textOpacity,
}: Props) => {
  return (
    <View style={[styles.content, { opacity: textOpacity }]}>
      {shouldShowCheckIcon ? (
        <AnimatedCheckIcon
          color={textColor}
          scale={checkmarkScale}
          testID={testID ? `${testID}-check-icon` : undefined}
        />
      ) : null}
      {shouldShowOptionIcon ? (
        <AnimatedOptionIcon
          animated={Boolean(label)}
          color={textColor}
          scale={checkmarkScale}
          source={icon as IconSource}
          testID={testID ? `${testID}-icon` : undefined}
        />
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
  );
};

const styles = StyleSheet.create({
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
  label: {
    flexShrink: 1,
    textAlign: 'center',
  },
});

export default SegmentedButtonContent;
