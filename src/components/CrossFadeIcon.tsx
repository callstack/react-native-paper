import * as React from 'react';
import { Animated, StyleSheet, View } from 'react-native';

import Icon, { IconSource, isEqualIcon, isValidIcon } from './Icon';
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
  color: string;
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
  const { current: fade } = React.useRef<Animated.Value>(new Animated.Value(1));

  const { scale } = theme.animation;

  if (currentIcon !== source) {
    setPreviousIcon(() => currentIcon);
    setCurrentIcon(() => source);
  }

  React.useEffect(() => {
    if (isValidIcon(previousIcon) && !isEqualIcon(previousIcon, currentIcon)) {
      fade.setValue(1);

      Animated.timing(fade, {
        duration: scale * 200,
        toValue: 0,
        useNativeDriver: true,
      }).start();
    }
  }, [currentIcon, previousIcon, fade, scale]);

  const opacityPrev = fade;
  const opacityNext = previousIcon
    ? fade.interpolate({
        inputRange: [0, 1],
        outputRange: [1, 0],
      })
    : 1;

  const rotatePrev = fade.interpolate({
    inputRange: [0, 1],
    outputRange: ['-90deg', '0deg'],
  });

  const rotateNext = previousIcon
    ? fade.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '-180deg'],
      })
    : '0deg';

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
          style={[
            styles.icon,
            {
              opacity: opacityPrev,
              transform: [{ rotate: rotatePrev }],
            },
          ]}
          testID={`${testID}-previous`}
        >
          <Icon source={previousIcon} size={size} color={color} theme={theme} />
        </Animated.View>
      ) : null}
      <Animated.View
        style={[
          styles.icon,
          {
            opacity: opacityNext,
            transform: [{ rotate: rotateNext }],
          },
        ]}
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
