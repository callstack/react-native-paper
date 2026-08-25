import { Platform, Text as RNText } from 'react-native';

import { afterEach, describe, expect, it } from '@jest/globals';
import { render as rtlRender } from '@testing-library/react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import PaperProvider from '../../../core/PaperProvider';
import { getTheme } from '../../../core/theming';
import { render, screen } from '../../../test-utils';
import { tokens } from '../../../theme/tokens';
import Appbar from '../../Appbar';
import {
  getAppbarBackgroundColor,
  getAppbarBorders,
  modeTextVariant,
  renderAppbarContent as utilRenderAppbarContent,
} from '../../Appbar/utils';
import type { IconProps } from '../../MaterialCommunityIcon';
import Menu from '../../Menu/Menu';
import Searchbar from '../../Searchbar';
import Text from '../../Typography/Text';

// eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion
const renderAppbarContent = utilRenderAppbarContent as (
  props: Parameters<typeof utilRenderAppbarContent>[0]
) => { props: any }[];

describe('Appbar', () => {
  it('does not pass any additional props to Searchbar', async () => {
    const tree = (
      await render(
        <Appbar>
          <Searchbar placeholder="Search" value="" />
        </Appbar>
      )
    ).toJSON();

    expect(tree).toMatchSnapshot();
  });

  it('passes additional props to AppbarBackAction, AppbarContent and AppbarAction', async () => {
    const tree = (
      await render(
        <Appbar>
          <Appbar.BackAction onPress={() => {}} />
          <Appbar.Content title="Examples" />
          <Appbar.Action icon="menu" onPress={() => {}} />
        </Appbar>
      )
    ).toJSON();

    expect(tree).toMatchSnapshot();
  });
});

describe('renderAppbarContent', () => {
  const children = [
    <Appbar.BackAction onPress={() => {}} key={0} />,
    <Appbar.Content title="Examples" key={1} />,
    <Appbar.Action icon="magnify" onPress={() => {}} key={2} />,
    <Appbar.Action icon="menu" onPress={() => {}} key={3} />,
  ];

  it('should render all children types if renderOnly is not specified', () => {
    const result = renderAppbarContent({
      children,
      isDark: false,
    });

    expect(result).toHaveLength(4);
  });

  it('should render all children types except specified in renderExcept', () => {
    const result = renderAppbarContent({
      children: [
        ...children,
        <Menu
          key={4}
          anchor={<Appbar.Action icon="menu" onPress={() => {}} />}
          visible={false}
        >
          {null}
        </Menu>,
      ],
      isDark: false,
      renderExcept: [
        'Appbar',
        'Appbar.Header',
        'Appbar.BackAction',
        'Appbar.Content',
      ],
    });

    expect(result).toHaveLength(3);
  });

  it('should render only children types specifed in renderOnly', () => {
    const result = renderAppbarContent({
      children,
      isDark: false,
      renderOnly: ['Appbar.Action'],
    });

    expect(result).toHaveLength(2);
  });

  it('should render AppbarContent with correct mode', () => {
    const result = renderAppbarContent({
      children,
      isDark: false,
      renderOnly: ['Appbar.Content'],
      mode: 'large',
    });

    // eslint-disable-next-line no-restricted-syntax -- TODO: replace TestInstance props access with a user-visible assertion.
    expect(result[0].props.mode).toBe('large');
  });

  it('should render centered AppbarContent', () => {
    const result = renderAppbarContent({
      children,
      isDark: false,
      renderOnly: ['Appbar.Content'],
      mode: 'center-aligned',
      shouldCenterContent: true,
    });

    const centerAlignedContent = {
      alignItems: 'center',
    };

    // eslint-disable-next-line no-restricted-syntax -- TODO: replace TestInstance props access with a user-visible assertion.
    expect(result[0].props.style).toEqual(
      expect.arrayContaining([expect.objectContaining(centerAlignedContent)])
    );
  });

  it('should render AppbarContent with correct spacings', () => {
    const renderResult = (withAppbarBackAction = false) =>
      renderAppbarContent({
        children,
        isDark: false,
        renderOnly: [
          'Appbar.Content',
          withAppbarBackAction && 'Appbar.BackAction',
        ],
      });

    const v3Spacing = {
      marginLeft: 12,
    };

    // eslint-disable-next-line no-restricted-syntax -- TODO: replace TestInstance props access with a user-visible assertion.
    expect(renderResult()[0].props.style).toEqual(
      expect.arrayContaining([expect.objectContaining(v3Spacing)])
    );
  });

  it('Is recognized as a heading when no onPress callback has been passed', async () => {
    await render(
      <SafeAreaProvider>
        <Appbar.Header>
          <Appbar.Content title="Accessible test" />
        </Appbar.Header>
      </SafeAreaProvider>
    );

    expect(screen.getByRole('heading')).toBeOnTheScreen();
  });
  it('is recognized as a button when onPress callback has been passed', async () => {
    await render(
      <SafeAreaProvider>
        <Appbar.Header>
          <Appbar.Content title="Accessible test" onPress={() => {}} />
        </Appbar.Header>
      </SafeAreaProvider>
    );

    expect(screen.getByRole('button')).toBeEnabled();
    expect(screen.queryByRole('heading')).not.toBeOnTheScreen();
  });
  it('is recognized as a disabled button when onPress and disabled is passed', async () => {
    await render(
      <SafeAreaProvider>
        <Appbar.Header>
          <Appbar.Content title="Accessible test" onPress={() => {}} disabled />
        </Appbar.Header>
      </SafeAreaProvider>
    );

    expect(screen.getByRole('button')).toBeDisabled();
    expect(screen.queryByRole('heading')).not.toBeOnTheScreen();
  });
});

describe('AppbarAction', () => {
  it('should be rendered with default theme color', async () => {
    await render(
      <Appbar>
        <Appbar.Action icon="menu" testID="appbar-action" />
      </Appbar>
    );
    // eslint-disable-next-line no-restricted-syntax -- TODO: replace TestInstance props access with a user-visible assertion.
    const appbarActionIcon = screen.getByTestId('cross-fade-icon-current').props
      .children;
    // eslint-disable-next-line no-restricted-syntax -- TODO: replace TestInstance props access with a user-visible assertion.
    expect(appbarActionIcon.props.color).toBe(
      getTheme().colors.onSurfaceVariant
    );
  });

  it('should be rendered with specific theme color if is leading', async () => {
    await render(
      <Appbar>
        <Appbar.Action icon="menu" testID="appbar-action" isLeading />
      </Appbar>
    );
    // eslint-disable-next-line no-restricted-syntax -- TODO: replace TestInstance props access with a user-visible assertion.
    const appbarActionIcon = screen.getByTestId('cross-fade-icon-current').props
      .children;
    // eslint-disable-next-line no-restricted-syntax -- TODO: replace TestInstance props access with a user-visible assertion.
    expect(appbarActionIcon.props.color).toBe(getTheme().colors.onSurface);
  });

  it('should be rendered with custom color', async () => {
    await render(
      <Appbar>
        <Appbar.Action icon="menu" color="purple" testID="appbar-action" />
      </Appbar>
    );
    // eslint-disable-next-line no-restricted-syntax -- TODO: replace TestInstance props access with a user-visible assertion.
    const appbarActionIcon = screen.getByTestId('cross-fade-icon-current').props
      .children;
    // eslint-disable-next-line no-restricted-syntax -- TODO: replace TestInstance props access with a user-visible assertion.
    expect(appbarActionIcon.props.color).toBe('purple');
  });

  it('should render AppbarBackAction with custom color', async () => {
    await render(
      <Appbar>
        <Appbar.BackAction color="purple" testID="appbar-action" />
      </Appbar>
    );
    // eslint-disable-next-line no-restricted-syntax -- TODO: replace TestInstance props access with a user-visible assertion.
    const appbarBackActionIcon = screen.getByTestId('cross-fade-icon-current')
      .props.children;
    // eslint-disable-next-line no-restricted-syntax -- TODO: replace TestInstance props access with a user-visible assertion.
    expect(appbarBackActionIcon.props.color).toBe('purple');
  });
});

describe('AppbarContent', () => {
  (['small', 'medium', 'large', 'center-aligned'] as const).forEach((mode) =>
    it(`should render text component with appropriate variant for ${mode} mode`, async () => {
      await render(
        <Appbar mode={mode}>
          <Appbar.Content title="Title" />
        </Appbar>
      );

      expect(screen.getByTestId('appbar-content-title-text')).toHaveStyle(
        getTheme().fonts[modeTextVariant[mode]]
      );
    })
  );

  it('should render component passed to title', async () => {
    await render(
      <Appbar>
        <Appbar.Content
          title={
            <Text testID="title" variant="displaySmall">
              Title
            </Text>
          }
        />
      </Appbar>
    );

    expect(screen.getByText('Title')).toBeOnTheScreen();
  });
});

describe('getAppbarColors', () => {
  const elevated = true;
  const customBackground = 'aquamarine';

  it('should return custom color no matter what is the theme version', () => {
    expect(
      getAppbarBackgroundColor(getTheme(), elevated, customBackground)
    ).toBe(customBackground);
  });

  it('returns the light surface container color for an elevated appbar', () => {
    expect(getAppbarBackgroundColor(getTheme(), elevated)).toBe(
      tokens.md.ref.palette.neutral94
    );
  });

  it('returns the dark surface container color for an elevated appbar', () => {
    expect(getAppbarBackgroundColor(getTheme(true), elevated)).toBe(
      tokens.md.ref.palette.neutral12
    );
  });
});

describe('getAppbarBorders', () => {
  const borderStyles = {
    borderRadius: 1,
    borderBottomEndRadius: 2,
    borderBottomStartRadius: 3,
    borderEndEndRadius: 4,
    borderEndStartRadius: 5,
    borderStartEndRadius: 6,
    borderStartStartRadius: 7,
    borderTopEndRadius: 8,
    borderTopStartRadius: 9,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 11,
    borderBottomRightRadius: 12,
    borderBottomLeftRadius: 13,
    borderCurve: 'continuous' as const,
  };

  it('returns every border style and excludes unrelated styles', () => {
    expect(getAppbarBorders({ ...borderStyles, height: 60, top: 13 })).toEqual(
      borderStyles
    );
  });

  it('returns an empty object when no border styles are passed', () => {
    expect(getAppbarBorders({ height: 60, top: 13 })).toEqual({});
  });
});

describe('Appbar.BackAction icon', () => {
  const originalPlatform = Platform.OS;

  afterEach(() => {
    Platform.OS = originalPlatform;
  });

  const CustomIcon = ({ name, size, direction, testID }: IconProps) => (
    <RNText
      testID={testID}
      style={{
        fontSize: size,
        transform: [{ scaleX: direction === 'rtl' ? -1 : 1 }],
      }}
    >
      {`custom-${name}`}
    </RNText>
  );

  const renderBackAction = (direction?: 'ltr' | 'rtl') =>
    rtlRender(
      <PaperProvider settings={{ icon: CustomIcon }} direction={direction}>
        <Appbar.BackAction onPress={() => {}} testID="back-action" />
      </PaperProvider>
    );

  it('renders the icon provided through PaperProvider settings', async () => {
    Platform.OS = 'android';

    await renderBackAction();

    expect(
      screen.getByText('custom-arrow-left', { includeHiddenElements: true })
    ).toBeOnTheScreen();
  });

  it('renders the icon provided through PaperProvider settings on iOS', async () => {
    Platform.OS = 'ios';

    await renderBackAction();

    expect(
      screen.getByText('custom-arrow-left', { includeHiddenElements: true })
    ).toBeOnTheScreen();
  });

  it('keeps the icon mirrored in RTL', async () => {
    Platform.OS = 'android';

    await renderBackAction('rtl');

    expect(
      screen.getByText('custom-arrow-left', { includeHiddenElements: true })
    ).toHaveStyle({ transform: [{ scaleX: -1 }] });
  });

  it('keeps the icon unmirrored in LTR', async () => {
    Platform.OS = 'android';

    await renderBackAction('ltr');

    expect(
      screen.getByText('custom-arrow-left', { includeHiddenElements: true })
    ).toHaveStyle({ transform: [{ scaleX: 1 }] });
  });
});
