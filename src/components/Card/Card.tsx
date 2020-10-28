import * as React from 'react';
import {
  StyleProp,
  StyleSheet,
  Animated,
  TouchableWithoutFeedback,
  View,
  ViewStyle,
} from 'react-native';
import CardContent from './CardContent';
import CardActions from './CardActions';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import CardCover, { CardCover as _CardCover } from './CardCover';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import CardTitle, { CardTitle as _CardTitle } from './CardTitle';
import Surface from '../Surface';
import { withTheme } from '../../core/theming';

type Props = React.ComponentProps<typeof Surface> & {
  /**
   * Resting elevation of the card which controls the drop shadow.
   */
  elevation?: number;
  /**
   * Function to execute on long press.
   */
  onLongPress?: () => void;
  /**
   * Function to execute on press.
   */
  onPress?: () => void;
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
  children,
  style,
  theme,
  testID,
  accessible,
  ...rest
}: Props) => {
  const { current: elevation } = React.useRef<Animated.Value>(
    new Animated.Value(cardElevation)
  );

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
    const {
      dark,
      mode,
      animation: { scale },
    } = theme;
    Animated.timing(elevation, {
      toValue: cardElevation,
      duration: 150 * scale,
      useNativeDriver: !dark || mode === 'exact',
    }).start();
  };

  const { roundness } = theme;
  const total = React.Children.count(children);
  const siblings = React.Children.map(children, (child) =>
    React.isValidElement(child) && child.type
      ? (child.type as any).displayName
      : null
  );
  return (
    <Surface
      // @ts-ignore
      style={[{ borderRadius: roundness, elevation }, style]}
      {...rest}
    >
      <TouchableWithoutFeedback
        delayPressIn={0}
        disabled={!(onPress || onLongPress)}
        onLongPress={onLongPress}
        onPress={onPress}
        onPressIn={onPress ? handlePressIn : undefined}
        onPressOut={onPress ? handlePressOut : undefined}
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
});

export default withTheme(Card);
