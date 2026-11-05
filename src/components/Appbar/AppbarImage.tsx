import * as React from 'react';
import { StyleSheet, Image } from 'react-native';
import type {
  StyleProp,
  ImageSourcePropType,
  ImageStyle,
  ImageProps,
} from 'react-native';

import type { ThemeProp } from '../../theme/types';

export type Props = Omit<React.PropsWithoutRef<ImageProps>, 'source'> & {
  /**
   * Source for the image/logo.
   */
  source: ImageSourcePropType;
  /**
   * Size (width & height) of the image/logo. Defaults to 40dp according to MD3 top app bar specs.
   */
  size?: number;
  /**
   * Style for the image.
   */
  style?: StyleProp<ImageStyle>;
  /**
   * Accessibility label for the image.
   */
  accessibilityLabel?: string;
  /**
   * Whether it's a leading image. Defaults to true when placed before Appbar.Content.
   */
  isLeading?: boolean;
  /**
   * @optional
   */
  theme?: ThemeProp;
  /**
   * TestID for testing.
   */
  testID?: string;
};

/**
 * A component used to display a logo or image in the appbar.
 *
 * ## Usage
 * ```js
 * import * as React from 'react';
 * import { Appbar } from 'react-native-paper';
 *
 * const MyComponent = () => (
 *   <Appbar.Header>
 *     <Appbar.Image source={{ uri: 'https://example.com/logo.png' }} />
 *     <Appbar.Content title="Title" />
 *   </Appbar.Header>
 * );
 *
 * export default MyComponent;
 * ```
 */
const AppbarImage = ({
  source,
  size = 40,
  style,
  accessibilityLabel,
  isLeading: _isLeading,
  theme: _theme,
  testID = 'appbar-image',
  ...rest
}: Props) => {
  return (
    <Image
      source={source}
      style={[
        styles.image,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
        },
        style,
      ]}
      accessibilityRole="image"
      accessibilityLabel={accessibilityLabel}
      accessibilityIgnoresInvertColors
      testID={testID}
      {...rest}
    />
  );
};

AppbarImage.displayName = 'Appbar.Image';

const styles = StyleSheet.create({
  image: {
    marginHorizontal: 8,
  },
});

export default AppbarImage;

// @component-docs ignore-next-line
export { AppbarImage };
