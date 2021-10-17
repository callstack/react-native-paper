import * as React from 'react';
import {
  StyleProp,
  StyleSheet,
  Animated,
  TouchableWithoutFeedback,
  View,
  ViewStyle,
} from 'react-native';
import color from 'color';
import { white, black } from '../../styles/colors';
import CardContent from './CardContent';
import CardActions from './CardActions';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import CardCover, { CardCover as _CardCover } from './CardCover';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import CardTitle, { CardTitle as _CardTitle } from './CardTitle';
import Surface from '../Surface';
import { withTheme } from '../../core/theming';

type OutlinedCardProps = {
  mode: 'outlined';
  elevation?: never;
};

type ElevatedCardProps = {
  mode?: 'elevated';
  elevation?: number;
};

type Props = React.ComponentProps<typeof Surface> & {
  /**
   * Resting elevation of the card which controls the drop shadow.
   */
  elevation?: never | number;
  /**
   * Function to execute on long press.
   */
  onLongPress?: () => void;
  /**
   * Function to execute on press.
   */
  onPress?: () => void;
  /**
   * Mode of the Card.
   * - `elevated` - Card with elevation.
   * - `outlined` - Card with an outline.
   */
  mode?: 'elevated' | 'outlined';
  /**
   * Content of the `Card`.
   */
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  /**
   * @optional
   */
  theme: ReactNativePaper.Theme;
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
 *   <img class="medium" src="screenshots/card-1.png" />
 *   <img class="medium" src="screenshots/card-2.png" />
 * </div>
 *
 * ## Usage
 * ```js
 * import * as React from 'react';
 * import { Avatar, Button, Card, Title, Paragraph } from 'react-native-paper';
 *
 * const LeftContent = props => <Avatar.Icon {...props} icon="folder" />
 *
 * const MyComponent = () => (
 *   <Card>
 *     <Card.Title title="Card Title" subtitle="Card Subtitle" left={LeftContent} />
 *     <Card.Content>
 *       <Title>Card title</Title>
 *       <Paragraph>Card content</Paragraph>
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
  onPress,
  mode: cardMode = 'elevated',
  children,
  style,
  theme,
  testID,
  accessible,
  ...rest
}: (OutlinedCardProps | ElevatedCardProps) & Props) => {
  const { current: elevation } = React.useRef<Animated.Value>(
    new Animated.Value(cardElevation)
  );
  const { animation, dark, mode, roundness } = theme;

  const handlePressIn = () => {
    const {
      dark,
      mode,
      animation: { scale },
    } = theme;
    Animated.timing(elevation, {
      toValue: 8,
      duration: 150 * scale,
      useNativeDriver: !dark || mode === 'exact',
    }).start();
  };

  const handlePressOut = () => {
    Animated.timing(elevation, {
      toValue: cardElevation,
      duration: 150 * animation.scale,
      useNativeDriver: !dark || mode === 'exact',
    }).start();
  };

  const total = React.Children.count(children);
  const siblings = React.Children.map(children, (child) =>
    React.isValidElement(child) && child.type
      ? (child.type as any).displayName
      : null
  );
  const borderColor = color(theme.dark ? white : black)
    .alpha(0.12)
    .rgb()
    .string();

  return (
    <Surface
      style={[
        { borderRadius: roundness, elevation, borderColor },
        cardMode === 'outlined' ? styles.outlined : {},
        style,
      ]}
      {...rest}
    >
      <TouchableWithoutFeedback
        delayPressIn={0}
        disabled={!(onPress || onLongPress)}
        onLongPress={onLongPress}
        onPress={onPress}
        onPressIn={onPress || onLongPress ? handlePressIn : undefined}
        onPressOut={onPress || onLongPress ? handlePressOut : undefined}
        testID={testID}
        accessible={accessible}
      >
        <View style={styles.innerContainer}>
          {React.Children.map(children, (child, index) =>
            React.isValidElement(child)
              ? React.cloneElement(child, {
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
    flexGrow: 1,
    flexShrink: 1,
  },
  outlined: {
    elevation: 0,
    borderWidth: 1,
  },
});

export default withTheme(Card);
