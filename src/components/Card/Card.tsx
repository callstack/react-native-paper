import * as React from 'react';
import { StyleSheet, Pressable, View } from 'react-native';
import type {
  GestureResponderEvent,
  StyleProp,
  ViewProps,
  ViewStyle,
} from 'react-native';

import useLatestCallback from 'use-latest-callback';

import CardActions from './CardActions';
import CardContent from './CardContent';
import { CardContext } from './CardContext';
import CardCover from './CardCover';
import CardTitle from './CardTitle';
import { getCardColors } from './utils';
import { useInternalTheme } from '../../core/theming';
import type { Elevation, ThemeProp } from '../../theme/types';
import hasTouchHandler from '../../utils/hasTouchHandler';
import Surface from '../Surface';
import type { SurfaceStyle } from '../Surface';

type OutlinedCardProps = {
  mode: 'outlined';
  elevation?: never;
};

type ElevatedCardProps = {
  mode?: 'elevated';
  elevation?: Elevation;
};

type ContainedCardProps = {
  mode?: 'contained';
  elevation?: never;
};

type Mode = 'elevated' | 'outlined' | 'contained';
type Direction = 'vertical' | 'horizontal';

export type Props = Omit<ViewProps, 'style'> & {
  /**
   * Mode of the Card.
   * - `elevated` - Card with elevation.
   * - `contained` - Card without outline and elevation @supported Available in v5.x with theme version 3
   * - `outlined` - Card with an outline.
   */
  mode?: Mode;
  /**
   * Direction of the Card's content.
   * - `vertical`
   * - `horizontal`
   */
  direction?: Direction;
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
  elevation?: Elevation;
  /**
   * Style of card's content.
   */
  contentStyle?: StyleProp<ViewStyle>;
  style?: StyleProp<SurfaceStyle>;
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
  /**
   * Reference to the card container.
   */
  ref?: React.Ref<View>;
};

const DEFAULT_CARD_GAP = 16;
const DEFAULT_CARD_PADDING = 16;

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
 *     <Card.Cover source={{ uri: 'https://picsum.photos/700' }} />
 *     <Card.Title title="Card Title" subtitle="Card Subtitle" left={LeftContent} />
 *     <Card.Content>
 *       <Text variant="titleLarge">Card title</Text>
 *       <Text variant="bodyMedium">Card content</Text>
 *     </Card.Content>
 *     <Card.Actions>
 *       <Button mode="outlined">Cancel</Button>
 *       <Button mode="contained">Ok</Button>
 *     </Card.Actions>
 *   </Card>
 * );
 *
 * export default MyComponent;
 * ```
 */
const Card = ({
  elevation: cardElevation = 1,
  delayLongPress,
  onPress,
  onLongPress,
  onPressOut,
  onPressIn,
  mode: cardMode = 'elevated',
  direction: cardDirection = 'vertical',
  children,
  style,
  contentStyle,
  theme: themeOverrides,
  testID,
  accessible,
  disabled,
  ref,
  ...rest
}: (OutlinedCardProps | ElevatedCardProps | ContainedCardProps) & Props) => {
  const theme = useInternalTheme(themeOverrides);

  const isMode = React.useCallback(
    (modeToCompare: Mode) => {
      return cardMode === modeToCompare;
    },
    [cardMode]
  );

  const hasPassedTouchHandler = hasTouchHandler({
    onPress,
    onLongPress,
    onPressIn,
    onPressOut,
  });

  const [pressed, setPressed] = React.useState(false);
  const elevation = isMode('elevated') ? (pressed ? 2 : cardElevation) : 0;

  const handlePressIn = useLatestCallback((e: GestureResponderEvent) => {
    onPressIn?.(e);

    if (isMode('elevated')) {
      setPressed(true);
    }
  });

  const handlePressOut = useLatestCallback((e: GestureResponderEvent) => {
    onPressOut?.(e);

    if (isMode('elevated')) {
      setPressed(false);
    }
  });

  const { backgroundColor, borderColor: themedBorderColor } = getCardColors({
    theme,
    mode: cardMode,
  });

  // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion
  const flattenedStyles = (StyleSheet.flatten(style) || {}) as ViewStyle;

  const { borderColor = themedBorderColor } = flattenedStyles;

  const borderRadius = theme.shapes.corner.medium;

  const cardContext = React.useMemo(
    () => ({ padding: DEFAULT_CARD_PADDING, direction: cardDirection }),
    [cardDirection]
  );

  const content = (
    <CardContext.Provider value={cardContext}>
      <View
        style={[
          styles.content,
          { borderRadius },
          cardDirection === 'horizontal' ? styles.horizontal : styles.vertical,
          contentStyle,
          {
            padding: DEFAULT_CARD_PADDING,
            gap: DEFAULT_CARD_GAP,
          },
        ]}
      >
        {children}
      </View>
    </CardContext.Provider>
  );

  return (
    <Surface
      ref={ref}
      borderRadius={borderRadius}
      backgroundColor={!isMode('elevated') ? backgroundColor : undefined}
      style={[{ borderColor }, style]}
      theme={theme}
      elevation={elevation}
      testID={hasPassedTouchHandler ? undefined : testID}
      {...rest}
    >
      {isMode('outlined') && (
        <View
          pointerEvents="none"
          style={[
            {
              borderColor,
            },
            styles.outline,
            { borderRadius },
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
          testID={testID}
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

// @component ./CardContent.tsx
Card.Content = CardContent;
// @component ./CardActions.tsx
Card.Actions = CardActions;
// @component ./CardCover.tsx
Card.Cover = CardCover;
// @component ./CardTitle.tsx
Card.Title = CardTitle;

const styles = StyleSheet.create({
  content: {
    flexShrink: 1,
    overflow: 'hidden',
  },
  horizontal: {
    flexDirection: 'row',
  },
  vertical: {
    flexDirection: 'column',
  },
  outline: {
    borderWidth: 1,
    position: 'absolute',
    width: '100%',
    height: '100%',
    zIndex: 2,
  },
});

export default Card;
