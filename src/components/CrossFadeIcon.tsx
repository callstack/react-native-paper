import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import type { ColorValue } from 'react-native';

import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import Icon, { isEqualIcon, isValidIcon } from './Icon';
import type { IconSource } from './Icon';
import { useInternalTheme } from '../core/theming';
import type { ThemeProp } from '../types';

type Props = {
  /**
   * Icon to display for the `CrossFadeIcon`.
   */
  source: IconSource;
  /**
   * Color of the icon.
   */
  color: ColorValue;
  /**
   * Size of the icon.
   */
  size: number;
  /**
   * TestID used for testing purposes
   */
  testID?: string;
  /**
   * @optional
   */
  theme?: ThemeProp;
};

const CrossFadeIcon = ({
  color,
  size,
  source,
  theme: themeOverrides,
  testID = 'cross-fade-icon',
}: Props) => {
  const theme = useInternalTheme(themeOverrides);
  const [currentIcon, setCurrentIcon] = React.useState<IconSource>(
    () => source
  );
  const [previousIcon, setPreviousIcon] = React.useState<IconSource | null>(
    null
  );
  const fade = useSharedValue(1);

  const { scale } = theme.animation;

  if (currentIcon !== source) {
    setPreviousIcon(() => currentIcon);
    setCurrentIcon(() => source);
  }

  React.useEffect(() => {
    if (isValidIcon(previousIcon) && !isEqualIcon(previousIcon, currentIcon)) {
      fade.value = 1;
      fade.value = withTiming(0, {
        duration: scale * 200,
      });
    }
  }, [currentIcon, previousIcon, fade, scale]);

  const previousIconStyle = useAnimatedStyle(() => ({
    opacity: fade.value,
    transform: [
      {
        rotate: `${interpolate(fade.value, [0, 1], [-90, 0])}deg`,
      },
    ],
  }));

  const currentIconStyle = useAnimatedStyle(() => ({
    opacity: previousIcon ? interpolate(fade.value, [0, 1], [1, 0]) : 1,
    transform: [
      {
        rotate: `${
          previousIcon ? interpolate(fade.value, [0, 1], [0, -180]) : 0
        }deg`,
      },
    ],
  }));

  return (
    <View
      style={[
        styles.content,
        {
          height: size,
          width: size,
        },
      ]}
    >
      {previousIcon ? (
        <Animated.View
          style={[styles.icon, previousIconStyle]}
          testID={`${testID}-previous`}
        >
          <Icon source={previousIcon} size={size} color={color} theme={theme} />
        </Animated.View>
      ) : null}
      <Animated.View
        style={[styles.icon, currentIconStyle]}
        testID={`${testID}-current`}
      >
        <Icon source={currentIcon} size={size} color={color} theme={theme} />
      </Animated.View>
    </View>
  );
};

export default CrossFadeIcon;

const styles = StyleSheet.create({
  content: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
});
