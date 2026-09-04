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
import { resolveCardVisuals } from './tokens';
import { useInternalTheme } from '../../core/theming';
import type { Elevation, ThemeProp } from '../../theme/types';
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

type CardShapeProps = {
  /**
   * Radius of every Card corner.
   */
  borderRadius?: ViewStyle['borderRadius'];
  /**
   * Radius of the Card's bottom-end corner.
   */
  borderBottomEndRadius?: ViewStyle['borderBottomEndRadius'];
  /**
   * Radius of the Card's bottom-left corner.
   */
  borderBottomLeftRadius?: ViewStyle['borderBottomLeftRadius'];
  /**
   * Radius of the Card's bottom-right corner.
   */
  borderBottomRightRadius?: ViewStyle['borderBottomRightRadius'];
  /**
   * Radius of the Card's bottom-start corner.
   */
  borderBottomStartRadius?: ViewStyle['borderBottomStartRadius'];
  /**
   * Radius of the Card's end-end corner.
   */
  borderEndEndRadius?: ViewStyle['borderEndEndRadius'];
  /**
   * Radius of the Card's end-start corner.
   */
  borderEndStartRadius?: ViewStyle['borderEndStartRadius'];
  /**
   * Radius of the Card's start-end corner.
   */
  borderStartEndRadius?: ViewStyle['borderStartEndRadius'];
  /**
   * Radius of the Card's start-start corner.
   */
  borderStartStartRadius?: ViewStyle['borderStartStartRadius'];
  /**
   * Radius of the Card's top-end corner.
   */
  borderTopEndRadius?: ViewStyle['borderTopEndRadius'];
  /**
   * Radius of the Card's top-left corner.
   */
  borderTopLeftRadius?: ViewStyle['borderTopLeftRadius'];
  /**
   * Radius of the Card's top-right corner.
   */
  borderTopRightRadius?: ViewStyle['borderTopRightRadius'];
  /**
   * Radius of the Card's top-start corner.
   */
  borderTopStartRadius?: ViewStyle['borderTopStartRadius'];
  /**
   * Corner curve used by the Card on iOS.
   */
  borderCurve?: ViewStyle['borderCurve'];
};

type FilledCardProps = {
  /**
   * Filled Card variant (default).
   */
  variant?: 'filled';
  /**
   * Filled Cards do not support custom elevation.
   */
  elevation?: never;
};

type ElevatedCardProps = {
  /**
   * Elevated Card variant.
   */
  variant: 'elevated';
  /**
   * Resting shadow elevation for an elevated Card.
   */
  elevation?: Elevation;
};

type OutlinedCardProps = {
  /**
   * Outlined Card variant.
   */
  variant: 'outlined';
  /**
   * Outlined Cards do not support custom elevation.
   */
  elevation?: never;
};

type CardVariantProps = FilledCardProps | ElevatedCardProps | OutlinedCardProps;

type CardBaseProps = Omit<ViewProps, 'children' | 'style'> &
  CardShapeProps & {
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
  (ConvenienceHeaderProps | CustomHeaderProps) &
  CardVariantProps;

/**
 * A Card groups related media, header content, body content, and actions.
 * Use the `filled` (default), `elevated`, or `outlined` variant to select its
 * Material 3 emphasis.
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
 *     variant="elevated"
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
  variant: cardVariant = 'filled',
  elevation: customElevation,
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
  borderRadius,
  borderBottomEndRadius,
  borderBottomLeftRadius,
  borderBottomRightRadius,
  borderBottomStartRadius,
  borderEndEndRadius,
  borderEndStartRadius,
  borderStartEndRadius,
  borderStartStartRadius,
  borderTopEndRadius,
  borderTopLeftRadius,
  borderTopRightRadius,
  borderTopStartRadius,
  borderCurve = 'continuous',
  ref,
  ...rest
}: Props) => {
  const theme = useInternalTheme(themeOverrides);

  const visuals = resolveCardVisuals({
    theme,
    variant: cardVariant,
    elevation: customElevation,
    disabled,
  });

  const hasPassedTouchHandler = hasTouchHandler({
    onPress,
    onLongPress,
    onPressIn,
    onPressOut,
  });

  const shapeStyle = {
    borderRadius: borderRadius ?? visuals.shape,
    borderBottomEndRadius,
    borderBottomLeftRadius,
    borderBottomRightRadius,
    borderBottomStartRadius,
    borderEndEndRadius,
    borderEndStartRadius,
    borderStartEndRadius,
    borderStartStartRadius,
    borderTopEndRadius,
    borderTopLeftRadius,
    borderTopRightRadius,
    borderTopStartRadius,
    borderCurve,
  };
  const hasConvenienceHeader =
    title != null || subtitle != null || leading != null || trailing != null;

  const content = (
    <View style={[styles.content, contentStyle]} testID={testID}>
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
      {...shapeStyle}
      backgroundColor="transparent"
      style={style}
      theme={theme}
      elevation={visuals.elevation}
      testID={`${testID}-container`}
      {...rest}
    >
      <View
        testID={`${testID}-visual`}
        style={[
          styles.visual,
          shapeStyle,
          visuals.containerOpacity === 1 && {
            backgroundColor: visuals.containerColor,
          },
        ]}
      >
        <View
          pointerEvents="none"
          testID={`${testID}-background`}
          style={[
            StyleSheet.absoluteFill,
            shapeStyle,
            {
              backgroundColor: visuals.containerColor,
              opacity: visuals.containerOpacity,
            },
          ]}
        />
        <View
          pointerEvents="none"
          testID={`${testID}-state-layer`}
          style={[
            StyleSheet.absoluteFill,
            shapeStyle,
            {
              backgroundColor: visuals.stateLayerColor,
              opacity: visuals.stateLayerOpacity,
            },
          ]}
        />
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
        {visuals.outlineWidth > 0 ? (
          <View
            pointerEvents="none"
            testID={`${testID}-outline`}
            style={[
              StyleSheet.absoluteFill,
              shapeStyle,
              {
                borderColor: visuals.outlineColor,
                borderWidth: visuals.outlineWidth,
                opacity: visuals.outlineOpacity,
              },
            ]}
          />
        ) : null}
      </View>
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
  visual: {
    flexShrink: 1,
    overflow: 'hidden',
  },
  content: {
    flexShrink: 1,
    position: 'relative',
  },
});

export default Card;
