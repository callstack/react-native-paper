import * as React from 'react';
import {
  Animated,
  GestureResponderEvent,
  StyleProp,
  StyleSheet,
  Pressable,
  View,
  ViewStyle,
} from 'react-native';

import useLatestCallback from 'use-latest-callback';

import CardActions from './CardActions';
import CardContent from './CardContent';
import CardCover from './CardCover';
import CardTitle from './CardTitle';
import { getCardColors } from './utils';
import { useInternalTheme } from '../../core/theming';
import type { $Omit, ThemeProp } from '../../types';
import { forwardRef } from '../../utils/forwardRef';
import hasTouchHandler from '../../utils/hasTouchHandler';
import { splitStyles } from '../../utils/splitStyles';
import Surface from '../Surface';

type CardComposition = {
  Content: typeof CardContent;
  Actions: typeof CardActions;
  Cover: typeof CardCover;
  Title: typeof CardTitle;
};

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

export type Props = $Omit<React.ComponentProps<typeof Surface>, 'mode'> & {
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
   * Function to execute as soon as the touchable element is pressed and invoked even before onPress.
   */
  onPressIn?: (e: GestureResponderEvent) => void;
  /**
   * Function to execute as soon as the touch is released even before onPress.
   */
  onPressOut?: (e: GestureResponderEvent) => void;
  /**
   * The number of milliseconds a user must touch the element before executing `onLongPress`.
   */
  delayLongPress?: number;
  /**
   * If true, disable all interactions for this component.
   */
  disabled?: boolean;
  /**
   * Changes Card shadow and background on iOS and Android.
   */
  elevation?: 0 | 1 | 2 | 3 | 4 | 5 | Animated.Value;
  /**
   * Style of card's inner content.
   */
  contentStyle?: StyleProp<ViewStyle>;
  style?: Animated.WithAnimatedValue<StyleProp<ViewStyle>>;
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

const Card = (
  {
    elevation: cardElevation = 1,
    delayLongPress,
    onPress,
    onLongPress,
    onPressOut,
    onPressIn,
    mode = 'elevated',
    children,
    style,
    contentStyle,
    theme: themeOverrides,
    testID = 'card',
    accessible,
    disabled,
    ...rest
  }: (OutlinedCardProps | ElevatedCardProps | ContainedCardProps) & Props,
  ref: React.ForwardedRef<View>
) => {
  const theme = useInternalTheme(themeOverrides);
  const {
    animation: { scale },
    roundness,
  } = theme;

  const isMode = React.useCallback(
    (modeToCompare: Mode) => {
      return mode === modeToCompare;
    },
    [mode]
  );

  const hasPassedTouchHandler = hasTouchHandler({
    onPress,
    onLongPress,
    onPressIn,
    onPressOut,
  });

  const { current: elevation } = React.useRef<Animated.Value>(
    new Animated.Value(cardElevation)
  );

  const runElevationAnimation = (pressType: HandlePressType) => {
    if (isMode('contained')) {
      return;
    }

    const isPressTypeIn = pressType === 'in';
    Animated.timing(elevation, {
      toValue: isPressTypeIn ? 2 : cardElevation,
      duration: 150 * scale,
      useNativeDriver: false,
    }).start();
  };

  const handlePressIn = useLatestCallback((e: GestureResponderEvent) => {
    onPressIn?.(e);
    runElevationAnimation('in');
  });

  const handlePressOut = useLatestCallback((e: GestureResponderEvent) => {
    onPressOut?.(e);
    runElevationAnimation('out');
  });

  const total = React.Children.count(children);
  const siblings = React.Children.map(children, (child) =>
    React.isValidElement(child) && child.type
      ? (child.type as any).displayName
      : null
  );

  const { backgroundColor, borderColor: themedBorderColor } = getCardColors({
    theme,
    mode,
  });

  const flattenedStyles = (StyleSheet.flatten(style) || {}) as ViewStyle;

  const { borderColor = themedBorderColor } = flattenedStyles;

  const [, borderRadiusStyles] = splitStyles(
    flattenedStyles,
    (style) => style.startsWith('border') && style.endsWith('Radius')
  );

  const borderRadiusCombinedStyles = {
    borderRadius: 3 * roundness,
    ...borderRadiusStyles,
  };

  const content = (
    <View style={[styles.innerContainer, contentStyle]} testID={testID}>
      {React.Children.map(children, (child, index) =>
        React.isValidElement(child)
          ? React.cloneElement(child as React.ReactElement<any>, {
              index,
              total,
              siblings,
              borderRadiusStyles,
            })
          : child
      )}
    </View>
  );

  return (
    <Surface
      ref={ref}
      style={[
        !isMode('elevated') && { backgroundColor },
        borderRadiusCombinedStyles,
        style,
      ]}
      theme={theme}
      elevation={isMode('elevated') ? elevation : 0}
      testID={`${testID}-container`}
      container
      {...rest}
    >
      {isMode('outlined') && (
        <View
          pointerEvents="none"
          testID={`${testID}-outline`}
          style={[
            {
              borderColor,
            },
            styles.outline,
            borderRadiusCombinedStyles,
          ]}
        />
      )}

      {hasPassedTouchHandler ? (
        <Pressable
          accessible={accessible}
          unstable_pressDelay={0}
          disabled={disabled}
          delayLongPress={delayLongPress}
          onLongPress={onLongPress}
          onPress={onPress}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
        >
          {content}
        </Pressable>
      ) : (
        content
      )}
    </Surface>
  );
};

Card.displayName = 'Card';
const Component = forwardRef(Card);

const CardComponent = Component as typeof Component & CardComposition;

// @component ./CardContent.tsx
CardComponent.Content = CardContent;
// @component ./CardActions.tsx
CardComponent.Actions = CardActions;
// @component ./CardCover.tsx
CardComponent.Cover = CardCover;
// @component ./CardTitle.tsx
CardComponent.Title = CardTitle;

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
});

export default CardComponent;
