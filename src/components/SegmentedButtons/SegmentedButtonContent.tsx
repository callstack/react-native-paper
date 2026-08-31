import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import type { StyleProp, TextStyle } from 'react-native';

import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import type { SharedValue } from 'react-native-reanimated';

import { SegmentedButtonTokens } from './tokens';
import type { Theme } from '../../types';
import type { IconSource } from '../Icon';
import Icon from '../Icon';
import Text from '../Typography/Text';

type AnimatedIconProps = {
  color: TextStyle['color'];
  opacity: number;
  scale: SharedValue<number>;
  testID?: string;
};

const AnimatedCheckIcon = ({
  color,
  opacity,
  scale,
  testID,
}: AnimatedIconProps) => {
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View
      testID={testID}
      style={[styles.icon, { opacity }, animatedStyle]}
    >
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
  opacity,
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
      style={[styles.icon, { opacity }, animated ? animatedStyle : undefined]}
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
  checked: boolean;
  icon?: IconSource;
  iconColor: TextStyle['color'];
  iconOpacity: number;
  label?: string;
  labelColor: TextStyle['color'];
  labelMaxFontSizeMultiplier?: number;
  labelOpacity: number;
  labelStyle?: StyleProp<TextStyle>;
  showSelectedCheck?: boolean;
  testID?: string;
  theme: Theme;
};

const SegmentedButtonContent = ({
  checked,
  icon,
  iconColor,
  iconOpacity,
  label,
  labelColor,
  labelMaxFontSizeMultiplier,
  labelOpacity,
  labelStyle,
  showSelectedCheck,
  testID,
  theme,
}: Props) => {
  const checkmarkScale = useSharedValue(0);

  React.useEffect(() => {
    if (!showSelectedCheck) {
      return;
    }

    checkmarkScale.value = withSpring(checked ? 1 : 0);
  }, [checked, checkmarkScale, showSelectedCheck]);

  const showCheckIcon = Boolean(checked && showSelectedCheck);
  const optionIcon = icon && (!label || !showCheckIcon) ? icon : undefined;
  const labelTextStyle: TextStyle = {
    ...theme.fonts[SegmentedButtonTokens.labelTextType],
    color: labelColor,
  };

  return (
    <View style={styles.content}>
      {showCheckIcon ? (
        <AnimatedCheckIcon
          color={iconColor}
          opacity={iconOpacity}
          scale={checkmarkScale}
          testID={testID ? `${testID}-check-icon` : undefined}
        />
      ) : null}
      {optionIcon ? (
        <AnimatedOptionIcon
          animated={Boolean(label)}
          color={iconColor}
          opacity={iconOpacity}
          scale={checkmarkScale}
          source={optionIcon}
          testID={testID ? `${testID}-icon` : undefined}
        />
      ) : null}
      {label ? (
        <Text
          variant={SegmentedButtonTokens.labelTextType}
          style={[
            styles.label,
            labelTextStyle,
            { opacity: labelOpacity },
            labelStyle,
          ]}
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
