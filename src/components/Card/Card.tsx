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

type State = {
  /**
   * Default animated value
   */
  elevation: Animated.Value;

  /**
   * Dark adaptive animated value, used in case of toggling the theme,
   * it prevents animating the background with native drivers inside Surface
   */
  elevationDarkAdaptive: Animated.Value;
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
    // @ts-ignore
    elevationDarkAdaptive: new Animated.Value(this.props.elevation),
  };

  componentDidUpdate(prevProps: Props) {
    /**
     * Resets animations values if updating to dark adaptive mode,
     * otherwise, any card that is in the middle of animation while
     * toggling the theme will stay at that animated value until
     * the next press-in
     */

    const { dark: isDark, mode } = this.props.theme;
    const { dark: wasDark } = prevProps.theme;
    const { elevation, elevationDarkAdaptive } = this.state;
    if (isDark && mode === 'adaptive' && isDark !== wasDark) {
      // @ts-ignore
      elevation.setValue(this.props.elevation);
      // @ts-ignore
      elevationDarkAdaptive.setValue(this.props.elevation);
    }
  }

  private handlePressIn = () => {
    const {
      dark,
      mode,
      animation: { scale },
    } = this.props.theme;

    if (dark && mode === 'adaptive') {
      Animated.timing(this.state.elevationDarkAdaptive, {
        toValue: 8,
        duration: 150 * scale,
        useNativeDriver: false,
      }).start();
    } else {
      Animated.timing(this.state.elevation, {
        toValue: 8,
        duration: 150 * scale,
        useNativeDriver: true,
      }).start();
    }
  };

  private handlePressOut = () => {
    const {
      dark,
      mode,
      animation: { scale },
    } = this.props.theme;

    if (dark && mode === 'adaptive') {
      Animated.timing(this.state.elevationDarkAdaptive, {
        // @ts-ignore
        toValue: this.props.elevation,
        duration: 150 * scale,
        useNativeDriver: false,
      }).start();
    } else {
      Animated.timing(this.state.elevation, {
        // @ts-ignore
        toValue: this.props.elevation,
        duration: 150 * scale,
        useNativeDriver: true,
      }).start();
    }
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
    const { elevation, elevationDarkAdaptive } = this.state;
    const { roundness } = theme;
    const total = React.Children.count(children);
    const siblings = React.Children.map(children, (child) =>
      React.isValidElement(child) && child.type
        ? (child.type as any).displayName
        : null
    );
    const computedElevation =
      theme.dark && theme.mode === 'adaptive'
        ? elevationDarkAdaptive
        : elevation;
    return (
      <Surface
        style={[
          // @ts-ignore
          { borderRadius: roundness, elevation: computedElevation },
          style,
        ]}
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
    flexShrink: 1,
  },
});

export default withTheme(Card);
