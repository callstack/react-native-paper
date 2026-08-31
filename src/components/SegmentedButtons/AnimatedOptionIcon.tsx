import { StyleSheet } from 'react-native';
import type { TextStyle } from 'react-native';

import Animated, { useAnimatedStyle } from 'react-native-reanimated';
import type { SharedValue } from 'react-native-reanimated';

import { SegmentedButtonTokens } from './tokens';
import type { IconSource } from '../Icon';
import Icon from '../Icon';

type Props = {
  animated: boolean;
  color: TextStyle['color'];
  opacity: number;
  scale: SharedValue<number>;
  source: IconSource;
  testID?: string;
};

const AnimatedOptionIcon = ({
  animated,
  color,
  opacity,
  scale,
  source,
  testID,
}: Props) => {
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

const styles = StyleSheet.create({
  icon: {
    width: SegmentedButtonTokens.iconSize,
    height: SegmentedButtonTokens.iconSize,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default AnimatedOptionIcon;
