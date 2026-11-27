import { Image } from 'react-native';

import { describe, expect, it, jest } from '@jest/globals';

import type { Direction } from '../../core/locale';
import PaperProvider from '../../core/PaperProvider';
import type { Settings } from '../../core/settings';
import type { IconProps, IconSource } from '../../index';
import { render, screen } from '../../test-utils';
import Icon from '../Icon';

const ICON_SIZE = 24;

describe('Icon Component', () => {
  it('exports IconSource and IconProps types from root index', () => {
    const iconSource: IconSource = 'camera';
    const iconProps: IconProps = { size: 24 };
    expect(iconSource).toBe('camera');
    expect(iconProps.size).toBe(24);
  });

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
    const source = ({ size, testID }: { size: number; testID?: string }) => (
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

  it('gives a render function the ltr direction when the icon is not directional', async () => {
    const source = jest.fn(() => null);
    await render(<Icon source={source} size={ICON_SIZE} />);

    expect(source).toHaveBeenCalledWith(
      expect.objectContaining({ direction: 'ltr' })
    );
  });

  it('renders nothing for a source that is not an icon', async () => {
    await render(
      <>
        {/* @ts-expect-error: a boolean isn't an icon source */}
        <Icon source={true} size={ICON_SIZE} testID="boolean-icon" />
        {/* @ts-expect-error: source is required, so undefined isn't allowed */}
        <Icon source={undefined} size={ICON_SIZE} testID="undefined-icon" />
        {/* @ts-expect-error: null isn't an icon source */}
        <Icon source={null} size={ICON_SIZE} testID="null-icon" />
      </>
    );

    expect(
      screen.queryByTestId('boolean-icon', { includeHiddenElements: true })
    ).not.toBeOnTheScreen();
    expect(
      screen.queryByTestId('undefined-icon', { includeHiddenElements: true })
    ).not.toBeOnTheScreen();
    expect(
      screen.queryByTestId('null-icon', { includeHiddenElements: true })
    ).not.toBeOnTheScreen();
  });

  it.each<['rtl' | 'ltr' | 'auto', Direction, Direction]>([
    ['rtl', 'ltr', 'rtl'],
    ['rtl', 'rtl', 'rtl'],
    ['ltr', 'rtl', 'ltr'],
    ['auto', 'ltr', 'ltr'],
    ['auto', 'rtl', 'rtl'],
  ])(
    'gives a render function with direction %s in a %s layout the %s direction',
    async (direction, layoutDirection, expected) => {
      const renderIcon = jest.fn(() => null);
      await render(
        <PaperProvider direction={layoutDirection}>
          <Icon
            // @ts-expect-error: the types only allow a name or an image source in a directional source, but Icon also calls a render function
            source={{ source: renderIcon, direction }}
            size={ICON_SIZE}
          />
        </PaperProvider>
      );

      expect(renderIcon).toHaveBeenCalledWith(
        expect.objectContaining({ direction: expected })
      );
    }
  );

  it.each<[IconSource, Direction, Direction]>([
    ['camera', 'ltr', 'ltr'],
    ['camera', 'rtl', 'ltr'],
    [{ source: 'camera', direction: 'rtl' }, 'ltr', 'rtl'],
    [{ source: 'camera', direction: 'ltr' }, 'rtl', 'ltr'],
    [{ source: 'camera', direction: 'auto' }, 'ltr', 'ltr'],
    [{ source: 'camera', direction: 'auto' }, 'rtl', 'rtl'],
  ])(
    'gives the settings icon for source %j in a %s layout the %s direction',
    async (source, layoutDirection, expected) => {
      const icon = jest.fn<NonNullable<Settings['icon']>>(() => null);
      await render(
        <PaperProvider direction={layoutDirection} settings={{ icon }}>
          <Icon source={source} size={ICON_SIZE} />
        </PaperProvider>
      );

      expect(icon).toHaveBeenCalledWith(
        expect.objectContaining({ name: 'camera', direction: expected })
      );
    }
  );
});
