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
import { Theme } from '../../types';

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
  theme: Theme;
  /**
   * Pass down testID from card props to touchable
   */
  testID?: string;
  /**
   * Pass down accessible from card props to touchable
   */
  accessible?: boolean;
};

type State = {
  elevation: Animated.Value;
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
 * const MyComponent = () => (
 *   <Card>
 *     <Card.Title title="Card Title" subtitle="Card Subtitle" left={(props) => <Avatar.Icon {...props} icon="folder" />} />
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
class Card extends React.Component<Props, State> {
  // @component ./CardContent.tsx
  static Content = CardContent;
  // @component ./CardActions.tsx
  static Actions = CardActions;
  // @component ./CardCover.tsx
  static Cover = CardCover;
  // @component ./CardTitle.tsx
  static Title = CardTitle;

  static defaultProps = {
    elevation: 1,
  };

  state = {
    // @ts-ignore
    elevation: new Animated.Value(this.props.elevation),
  };

  private handlePressIn = () => {
    Animated.timing(this.state.elevation, {
      toValue: 8,
      duration: 150,
    }).start();
  };

  private handlePressOut = () => {
    Animated.timing(this.state.elevation, {
      // @ts-ignore
      toValue: this.props.elevation,
      duration: 150,
    }).start();
  };

  render() {
    const {
      children,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      elevation: cardElevation,
      onLongPress,
      onPress,
      style,
      theme,
      testID,
      accessible,
      ...rest
    } = this.props;
    const { elevation } = this.state;
    const { roundness } = theme;
    const total = React.Children.count(children);
    const siblings = React.Children.map(children, child =>
      React.isValidElement(child) && child.type
        ? (child.type as any).displayName
        : null
    );
    return (
      <Surface
        style={[{ borderRadius: roundness, elevation }, style]}
        {...rest}
      >
        <TouchableWithoutFeedback
          delayPressIn={0}
          disabled={!(onPress || onLongPress)}
          onLongPress={onLongPress}
          onPress={onPress}
          onPressIn={onPress ? this.handlePressIn : undefined}
          onPressOut={onPress ? this.handlePressOut : undefined}
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
  }
}

const styles = StyleSheet.create({
  innerContainer: {
    flexGrow: 1,
  },
});

export default withTheme(Card);
