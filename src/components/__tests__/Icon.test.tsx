import React from 'react';
import { Image } from 'react-native';

import { render } from '@testing-library/react-native';

import Icon from '../Icon';

const ICON_SIZE = 24;

describe('Icon Component', () => {
  it('renders correctly with image source', () => {
    const source = { uri: 'https://picsum.photos/700' };
    const { getByTestId } = render(
      <Icon source={source} size={ICON_SIZE} testID="image-icon" />
    );
    const imageIcon = getByTestId('image-icon');

    expect(imageIcon).toBeOnTheScreen();
    expect(imageIcon).toHaveStyle({ width: ICON_SIZE, height: ICON_SIZE });
  });

  it('renders correctly with string source', () => {
    const source = 'camera';
    const { getByTestId } = render(
      <Icon source={source} size={ICON_SIZE} testID="camera-icon" />
    );
    const icon = getByTestId('camera-icon');

    expect(icon).toBeOnTheScreen();
    expect(icon).toHaveStyle({ fontSize: ICON_SIZE, lineHeight: ICON_SIZE });
  });

  it('renders correctly with function source', () => {
    const source = ({ size, testID }: { size: number; testID: string }) => (
      <Image
        accessibilityIgnoresInvertColors
        source={{ uri: 'https://picsum.photos/700' }}
        style={{ width: size, height: size }}
        testID={testID}
      />
    );
    const { getByTestId } = render(
      <Icon source={source} size={ICON_SIZE} testID="function-icon" />
    );

    const functionIcon = getByTestId('function-icon');

    expect(functionIcon).toHaveStyle({ width: ICON_SIZE, height: ICON_SIZE });
    expect(functionIcon).toBeOnTheScreen();
  });
});
