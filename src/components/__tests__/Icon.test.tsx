import { Image } from 'react-native';

import { describe, expect, it } from '@jest/globals';

import { render, screen } from '../../test-utils';
import Icon from '../Icon';

const ICON_SIZE = 24;

describe('Icon Component', () => {
  it('renders correctly with image source', async () => {
    const source = { uri: 'https://picsum.photos/700' };
    await render(<Icon source={source} size={ICON_SIZE} testID="image-icon" />);
    const imageIcon = screen.getByTestId('image-icon', {
      includeHiddenElements: true,
    });

    expect(imageIcon).toBeOnTheScreen();
    expect(imageIcon).toHaveStyle({ width: ICON_SIZE, height: ICON_SIZE });
  });

  it('renders correctly with string source', async () => {
    const source = 'camera';
    await render(
      <Icon source={source} size={ICON_SIZE} testID="camera-icon" />
    );
    const icon = screen.getByTestId('camera-icon', {
      includeHiddenElements: true,
    });

    expect(icon).toBeOnTheScreen();
    expect(icon).toHaveStyle({ fontSize: ICON_SIZE, lineHeight: ICON_SIZE });
  });

  it('renders correctly with function source', async () => {
    const source = ({ size, testID }: { size: number; testID: string }) => (
      <Image
        accessibilityIgnoresInvertColors
        source={{ uri: 'https://picsum.photos/700' }}
        style={{ width: size, height: size }}
        testID={testID}
      />
    );
    await render(
      <Icon source={source} size={ICON_SIZE} testID="function-icon" />
    );

    const functionIcon = screen.getByTestId('function-icon', {
      includeHiddenElements: true,
    });

    expect(functionIcon).toHaveStyle({ width: ICON_SIZE, height: ICON_SIZE });
    expect(functionIcon).toBeOnTheScreen();
  });
});
