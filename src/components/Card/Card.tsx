import * as React from 'react';
import {
  Animated,
  GestureResponderEvent,
  StyleProp,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
  ViewStyle,
} from 'react-native';

import { useInternalTheme } from '../../core/theming';
import type { ThemeProp } from '../../types';
import Surface from '../Surface';
import CardActions from './CardActions';
import CardContent from './CardContent';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import CardCover from './CardCover';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import CardTitle from './CardTitle';
import { getCardColors } from './utils';

type OutlinedCardProps = {
  mode: 'outlined';
  elevation?: never;
};

type ElevatedCardProps = {
  mode?: 'elevated';
  elevation?: number;
};

type ContainedCardProps = {
  mode?: 'contained';
  elevation?: never;
};

type HandlePressType = 'in' | 'out';

type Mode = 'elevated' | 'outlined' | 'contained';

export type Props = React.ComponentProps<typeof Surface> & {
  /**
   * Mode of the Card.
   * - `elevated` - Card with elevation.
   * - `contained` - Card without outline and elevation @supported Available in v5.x with theme version 3
   * - `outlined` - Card with an outline.
   */
  mode?: Mode;
  /**
   * Content of the `Card`.
   */
  children: React.ReactNode;
  /**
   * Function to execute on long press.
   */
  onLongPress?: () => void;
  /**
   * Function to execute on press.
   */
  onPress?: (e: GestureResponderEvent) => void;
  /**
   * The number of milliseconds a user must touch the element before executing `onLongPress`.
   */
  delayLongPress?: number;
  /**
   * Changes Card shadow and background on iOS and Android.
   */
  elevation?: 0 | 1 | 2 | 3 | 4 | 5 | Animated.Value;
  /**
   * Style of card's inner content.
   */
  contentStyle?: StyleProp<ViewStyle>;
  style?: StyleProp<ViewStyle>;
  /**
   * @optional
   */
  theme?: ThemeProp;
  /**
   * Pass down testID from card props to touchable
   */
  testID?: string;
  /**
   * Pass down accessible from card props to touchable
   */
  accessible?: boolean;
};

/**
 * A card is a sheet of material that serves as an entry point to more detailed information.
 *
 * <div class="screenshots">
 *   <figure>
 *     <img src="screenshots/card-1.png" />
 *     <figcaption>Elevated card</figcaption>
 *   </figure>
 *   <figure>
 *     <img src="screenshots/card-2.png" />
 *     <figcaption>Outlined card</figcaption>
 *   </figure>
 *   <figure>
 *     <img src="screenshots/card-3.png" />
 *     <figcaption>Contained card</figcaption>
 *   </figure>
 * </div>
 *
 * ## Usage
 * ```js
 * import * as React from 'react';
 * import { Avatar, Button, Card, Text } from 'react-native-paper';
 *
 * const LeftContent = props => <Avatar.Icon {...props} icon="folder" />
 *
 * const MyComponent = () => (
 *   <Card>
 *     <Card.Title title="Card Title" subtitle="Card Subtitle" left={LeftContent} />
 *     <Card.Content>
 *       <Text variant="titleLarge">Card title</Text>
 *       <Text variant="bodyMedium">Card content</Text>
 *     </Card.Content>
 *     <Card.Cover source={{ uri: 'https://picsum.photos/700' }} />
 *     <Card.Actions>
 *       <Button>Cancel</Button>
 *       <Button>Ok</Button>
 *     </Card.Actions>
 *   </Card>
 * );
 *
 * export default MyComponent;
 * ```
 */
const Card = ({
  elevation: cardElevation = 1,
  onLongPress,
  delayLongPress,
  onPress,
  mode: cardMode = 'elevated',
  children,
  style,
  contentStyle,
  theme: themeOverrides,
  testID = 'card',
  accessible,
  ...rest
}: (OutlinedCardProps | ElevatedCardProps | ContainedCardProps) & Props) => {
  const theme = useInternalTheme(themeOverrides);
  const isMode = React.useCallback(
    (modeToCompare: Mode) => {
      return cardMode === modeToCompare;
    },
    [cardMode]
  );

  // Default animated value
  const { current: elevation } = React.useRef<Animated.Value>(
    new Animated.Value(cardElevation)
  );
  // Dark adaptive animated value, used in case of toggling the theme,
  // it prevents animating the background with native drivers inside Surface
  const { current: elevationDarkAdaptive } = React.useRef<Animated.Value>(
    new Animated.Value(cardElevation)
  );
  const { animation, dark, mode, roundness, isV3 } = theme;

  const prevDarkRef = React.useRef<boolean>(dark);
  React.useEffect(() => {
    prevDarkRef.current = dark;
  });

  const prevDark = prevDarkRef.current;
  const isAdaptiveMode = mode === 'adaptive';
  const animationDuration = 150 * animation.scale;

  React.useEffect(() => {
    /**
     * Resets animations values if updating to dark adaptive mode,
     * otherwise, any card that is in the middle of animation while
     * toggling the theme will stay at that animated value until
     * the next press-in
     */
    if (dark && isAdaptiveMode && !prevDark) {
      elevation.setValue(cardElevation);
      elevationDarkAdaptive.setValue(cardElevation);
    }
  }, [
    prevDark,
    dark,
    isAdaptiveMode,
    cardElevation,
    elevation,
    elevationDarkAdaptive,
  ]);

  const runElevationAnimation = (pressType: HandlePressType) => {
    const isPressTypeIn = pressType === 'in';
    if (dark && isAdaptiveMode) {
      Animated.timing(elevationDarkAdaptive, {
        toValue: isPressTypeIn ? (isV3 ? 2 : 8) : cardElevation,
        duration: animationDuration,
        useNativeDriver: false,
      }).start();
    } else {
      Animated.timing(elevation, {
        toValue: isPressTypeIn ? (isV3 ? 2 : 8) : cardElevation,
        duration: animationDuration,
        useNativeDriver: false,
      }).start();
    }
  };

  const handlePressIn = () => {
    runElevationAnimation('in');
  };

  const handlePressOut = () => {
    runElevationAnimation('out');
  };

  const total = React.Children.count(children);
  const siblings = React.Children.map(children, (child) =>
    React.isValidElement(child) && child.type
      ? (child.type as any).displayName
      : null
  );
  const computedElevation =
    dark && isAdaptiveMode ? elevationDarkAdaptive : elevation;

  const { backgroundColor, borderColor: themedBorderColor } = getCardColors({
    theme,
    mode: cardMode,
  });

  const {
    borderRadius = (isV3 ? 3 : 1) * roundness,
    borderColor = themedBorderColor,
  } = (StyleSheet.flatten(style) || {}) as ViewStyle;

  return (
    <Surface
      style={[
        {
          borderRadius,
        },
        isV3 && !isMode('elevated') && { backgroundColor },
        !isV3 && isMode('outlined')
          ? styles.resetElevation
          : {
              elevation: computedElevation as unknown as number,
            },
        style,
      ]}
      theme={theme}
      {...(isV3 && {
        elevation: isMode('elevated') ? computedElevation : 0,
      })}
      testID={`${testID}-container`}
      {...rest}
    >
      {isMode('outlined') && (
        <View
          pointerEvents="none"
          testID={`${testID}-outline`}
          style={[
            {
              borderRadius,
              borderColor,
            },
            styles.outline,
          ]}
        />
      )}
      <TouchableWithoutFeedback
        delayPressIn={0}
        disabled={!(onPress || onLongPress)}
        delayLongPress={delayLongPress}
        onLongPress={onLongPress}
        onPress={onPress}
        onPressIn={onPress || onLongPress ? handlePressIn : undefined}
        onPressOut={onPress || onLongPress ? handlePressOut : undefined}
        testID={testID}
        accessible={accessible}
      >
        <View style={[styles.innerContainer, contentStyle]}>
          {React.Children.map(children, (child, index) =>
            React.isValidElement(child)
              ? React.cloneElement(child as React.ReactElement<any>, {
                  index,
                  total,
                  siblings,
                })
              : child
          )}
        </View>
      </TouchableWithoutFeedback>
    </Surface>
  );
};

// @component ./CardContent.tsx
Card.Content = CardContent;
// @component ./CardActions.tsx
Card.Actions = CardActions;
// @component ./CardCover.tsx
Card.Cover = CardCover;
// @component ./CardTitle.tsx
Card.Title = CardTitle;

const styles = StyleSheet.create({
  innerContainer: {
    flexShrink: 1,
  },
  outline: {
    borderWidth: 1,
    position: 'absolute',
    width: '100%',
    height: '100%',
    zIndex: 2,
  },
  resetElevation: {
    elevation: 0,
  },
});

export default Card;
