import * as React from 'react';
import { StyleSheet, Pressable, View } from 'react-native';
import type {
  GestureResponderEvent,
  StyleProp,
  ViewProps,
  ViewStyle,
} from 'react-native';

import CardActions from './CardActions';
import CardContent from './CardContent';
import CardCover from './CardCover';
import CardTitle from './CardTitle';
import type { Props as CardTitleProps } from './CardTitle';
import { useInternalTheme } from '../../core/theming';
import type { ThemeProp } from '../../theme/types';
import hasTouchHandler from '../../utils/hasTouchHandler';
import Surface from '../Surface';
import type { SurfaceStyle } from '../Surface';

type ConvenienceHeaderProps = {
  /**
   * Header title.
   */
  title?: React.ReactNode;
  /**
   * Header subtitle.
   */
  subtitle?: React.ReactNode;
  /**
   * Render slot displayed before the title and subtitle.
   */
  leading?: CardTitleProps['left'];
  /**
   * Render slot displayed after the title and subtitle.
   */
  trailing?: CardTitleProps['right'];
  /**
   * A fully custom header cannot be combined with convenience header props.
   */
  header?: never;
};

type CustomHeaderProps = {
  /**
   * Fully custom header content.
   */
  header: React.ReactNode;
  /**
   * Unavailable when a custom header is supplied.
   */
  title?: never;
  /**
   * Unavailable when a custom header is supplied.
   */
  subtitle?: never;
  /**
   * Unavailable when a custom header is supplied.
   */
  leading?: never;
  /**
   * Unavailable when a custom header is supplied.
   */
  trailing?: never;
};

type CardBaseProps = Omit<ViewProps, 'children' | 'style'> & {
  /**
   * Media rendered at the start of the Card.
   */
  media?: React.ReactNode;
  /**
   * Main Card content.
   */
  content?: React.ReactNode;
  /**
   * Actions rendered at the end of the Card.
   */
  actions?: React.ReactNode;
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
   * Style of card's inner content.
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

export type Props = CardBaseProps &
  (ConvenienceHeaderProps | CustomHeaderProps);

/**
 * A filled Card groups related media, header content, body content, and actions.
 *
 * ## Usage
 * ```js
 * import * as React from 'react';
 * import { Avatar, Button, Card, Text } from 'react-native-paper';
 *
 * const Leading = props => <Avatar.Icon {...props} icon="folder" />
 *
 * const MyComponent = () => (
 *   <Card
 *     media={<Card.Cover source={{ uri: 'https://picsum.photos/700' }} />}
 *     title="Card Title"
 *     subtitle="Card Subtitle"
 *     leading={Leading}
 *     content={<Card.Content>
 *       <Text variant="titleLarge">Card title</Text>
 *       <Text variant="bodyMedium">Card content</Text>
 *     </Card.Content>}
 *     actions={<Card.Actions>
 *       <Button>Cancel</Button>
 *       <Button>Ok</Button>
 *     </Card.Actions>}
 *   />
 * );
 *
 * export default MyComponent;
 * ```
 */

const Card = ({
  delayLongPress,
  onPress,
  onLongPress,
  onPressOut,
  onPressIn,
  media,
  header,
  title,
  subtitle,
  leading,
  trailing,
  content: cardContent,
  actions,
  style,
  contentStyle,
  theme: themeOverrides,
  testID = 'card',
  accessible,
  disabled,
  ref,
  ...rest
}: Props) => {
  const theme = useInternalTheme(themeOverrides);

  const hasPassedTouchHandler = hasTouchHandler({
    onPress,
    onLongPress,
    onPressIn,
    onPressOut,
  });

  const borderRadius = theme.shapes.corner.medium;
  const hasConvenienceHeader =
    title != null || subtitle != null || leading != null || trailing != null;

  const content = (
    <View style={[styles.innerContainer, contentStyle]} testID={testID}>
      {media}
      {header ??
        (hasConvenienceHeader ? (
          <CardTitle
            title={title}
            subtitle={subtitle}
            left={leading}
            right={trailing}
          />
        ) : null)}
      {cardContent}
      {actions}
    </View>
  );

  return (
    <Surface
      ref={ref}
      borderRadius={borderRadius}
      backgroundColor={theme.colors.surfaceVariant}
      style={style}
      theme={theme}
      elevation={0}
      testID={`${testID}-container`}
      {...rest}
    >
      {hasPassedTouchHandler ? (
        <Pressable
          accessible={accessible}
          unstable_pressDelay={0}
          disabled={disabled}
          delayLongPress={delayLongPress}
          onLongPress={onLongPress}
          onPress={onPress}
          onPressIn={onPressIn}
          onPressOut={onPressOut}
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
  innerContainer: {
    flexShrink: 1,
  },
});

export default Card;
