import { StyleSheet } from 'react-native';
import type { TextStyle } from 'react-native';

import Animated, { useAnimatedStyle } from 'react-native-reanimated';
import type { SharedValue } from 'react-native-reanimated';

import { SegmentedButtonTokens } from './tokens';
import Icon from '../Icon';

type Props = {
  color: TextStyle['color'];
  opacity: number;
  scale: SharedValue<number>;
  testID?: string;
};

const AnimatedCheckIcon = ({ color, opacity, scale, testID }: Props) => {
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

const styles = StyleSheet.create({
  icon: {
    width: SegmentedButtonTokens.iconSize,
    height: SegmentedButtonTokens.iconSize,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default AnimatedCheckIcon;
