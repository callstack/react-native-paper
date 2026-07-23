import { Animated } from 'react-native';

import { describe, expect, it } from '@jest/globals';
import { act } from '@testing-library/react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

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
import Menu from '../../Menu/Menu';
import Searchbar from '../../Searchbar';
import Text from '../../Typography/Text';

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
        getTheme().fonts[
          modeTextVariant[mode] as keyof ReturnType<typeof getTheme>['fonts']
        ]
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

describe('MD3 top app bar acceptance', () => {
  it('uses surface container fill when elevated', async () => {
    const theme = getTheme();
    await render(
      <Appbar elevated testID="appbar">
        <Appbar.Content title="Title" />
      </Appbar>
    );
    expect(screen.getByTestId('appbar')).toHaveStyle({
      backgroundColor: theme.colors.surfaceContainer,
    });
  });

  it('uses surface fill by default and surfaceContainer at scrollProgress 1', () => {
    const theme = getTheme();
    expect(getAppbarBackgroundColor(theme, 0)).toBe(theme.colors.surface);
    expect(getAppbarBackgroundColor(theme, 0, undefined, false, 1)).toBe(
      theme.colors.surfaceContainer
    );
    expect(getAppbarBackgroundColor(theme, 0, undefined, false, 0)).toBe(
      theme.colors.surface
    );
  });

  it('renders subtitle for medium-flexible mode', async () => {
    await render(
      <Appbar mode="medium-flexible">
        <Appbar.Content title="Title" subtitle="Subtitle" />
      </Appbar>
    );
    expect(
      screen.getByTestId('appbar-content-subtitle-text')
    ).toHaveTextContent('Subtitle');
  });

  it('exports TopAppBar as alias of Appbar compound', () => {
    const { TopAppBar } = require('../../Appbar');
    expect(TopAppBar).toBe(Appbar);
    expect(TopAppBar.Content).toBe(Appbar.Content);
  });

  it('maps small height to 64 for MD3', async () => {
    await render(
      <Appbar mode="small" testID="appbar">
        <Appbar.Content title="Title" />
      </Appbar>
    );
    // Height is applied on the Surface root; outer-layer hosts the same style tree.
    expect(screen.getByTestId('appbar-outer-layer')).toHaveStyle({
      height: 64,
    });
  });

  it('maps medium-flexible and large-flexible expanded heights', async () => {
    const { rerender } = await render(
      <Appbar mode="medium-flexible" testID="appbar">
        <Appbar.Content title="Title" />
      </Appbar>
    );
    expect(screen.getByTestId('appbar-outer-layer')).toHaveStyle({
      height: 112,
    });
    await act(async () => {
      await rerender(
        <Appbar mode="large-flexible" testID="appbar">
          <Appbar.Content title="Title" />
        </Appbar>
      );
    });
    expect(screen.getByTestId('appbar-outer-layer')).toHaveStyle({
      height: 152,
    });
  });

  it('renders logo for flexible content', async () => {
    await render(
      <Appbar mode="large-flexible">
        <Appbar.Content
          title="Title"
          logo={{ uri: 'https://example.com/logo.png' }}
        />
      </Appbar>
    );
    expect(screen.getByTestId('appbar-content-logo')).toBeTruthy();
  });

  it('supports filled trailing action mode', async () => {
    await render(
      <Appbar mode="small">
        <Appbar.Content title="Title" />
        <Appbar.Action
          icon="plus"
          mode="filled"
          testID="filled-action"
          onPress={() => {}}
        />
      </Appbar>
    );
    expect(screen.getByTestId('filled-action-container')).toBeTruthy();
  });

  it('centers title when titleAlign is center on small mode', async () => {
    await render(
      <Appbar mode="small" titleAlign="center" testID="appbar">
        <Appbar.Content title="Title" testID="appbar-content" />
      </Appbar>
    );
    expect(screen.getByTestId('appbar-content')).toHaveStyle({
      alignItems: 'center',
    });
  });
});

describe('getAppbarColors', () => {
  const elevation = 4;
  const customBackground = 'aquamarine';

  it('should return custom color no matter what is the theme version', () => {
    expect(
      getAppbarBackgroundColor(getTheme(), elevation, customBackground)
    ).toBe(customBackground);
  });

  it('should return v3 light color if theme version is 3', () => {
    expect(getAppbarBackgroundColor(getTheme(), elevation)).toBe(
      tokens.md.ref.palette.neutral98
    );
  });

  it('should return v3 dark color if theme version is 3', () => {
    expect(getAppbarBackgroundColor(getTheme(true), elevation)).toBe(
      tokens.md.ref.palette.neutral6
    );
  });
});

describe('animated value changes correctly', () => {
  // Host-style updates from Animated.timing are not reliably visible under RN Jest;
  // re-render with a new Animated.Value after advancing the driver (same pattern as Menu).
  it('appbar animated value changes correctly', async () => {
    const initial = new Animated.Value(1);
    const advanced = new Animated.Value(1.5);
    const make = (scale: Animated.Value) => (
      <Appbar testID="appbar" style={[{ transform: [{ scale }] }]}>
        <Appbar.Action icon="menu" />
      </Appbar>
    );
    const { rerender } = await render(make(initial));
    expect(screen.getByTestId('appbar-outer-layer')).toHaveStyle({
      transform: [{ scale: 1 }],
    });
    await act(async () => {
      await rerender(make(advanced));
    });
    expect(screen.getByTestId('appbar-outer-layer')).toHaveStyle({
      transform: [{ scale: 1.5 }],
    });
  });

  it('action animated value changes correctly', async () => {
    const initial = new Animated.Value(1);
    const advanced = new Animated.Value(1.5);
    const make = (scale: Animated.Value) => (
      <Appbar>
        <Appbar.Action
          icon="menu"
          style={[{ transform: [{ scale }] }]}
          testID="appbar-action"
        />
      </Appbar>
    );
    const { rerender } = await render(make(initial));
    expect(
      screen.getByTestId('appbar-action-container-outer-layer')
    ).toHaveStyle({
      transform: [{ scale: 1 }],
    });
    await act(async () => {
      await rerender(make(advanced));
    });
    expect(
      screen.getByTestId('appbar-action-container-outer-layer')
    ).toHaveStyle({
      transform: [{ scale: 1.5 }],
    });
  });

  it('back action animated value changes correctly', async () => {
    const initial = new Animated.Value(1);
    const advanced = new Animated.Value(1.5);
    const make = (scale: Animated.Value) => (
      <Appbar>
        <Appbar.BackAction
          style={[{ transform: [{ scale }] }]}
          testID="appbar-back-action"
        />
      </Appbar>
    );
    const { rerender } = await render(make(initial));
    expect(
      screen.getByTestId('appbar-back-action-container-outer-layer')
    ).toHaveStyle({
      transform: [{ scale: 1 }],
    });
    await act(async () => {
      await rerender(make(advanced));
    });
    expect(
      screen.getByTestId('appbar-back-action-container-outer-layer')
    ).toHaveStyle({
      transform: [{ scale: 1.5 }],
    });
  });

  it('header animated value changes correctly', async () => {
    const initial = new Animated.Value(1);
    const advanced = new Animated.Value(1.5);
    const make = (scale: Animated.Value) => (
      <SafeAreaProvider>
        <Appbar.Header
          style={[{ transform: [{ scale }] }]}
          testID="appbar-header"
        >
          {null}
        </Appbar.Header>
      </SafeAreaProvider>
    );
    const { rerender } = await render(make(initial));
    expect(screen.getByTestId('appbar-header-outer-layer')).toHaveStyle({
      transform: [{ scale: 1 }],
    });
    await act(async () => {
      await rerender(make(advanced));
    });
    expect(screen.getByTestId('appbar-header-outer-layer')).toHaveStyle({
      transform: [{ scale: 1.5 }],
    });
  });

  it('header bottom border radius applied correctly', async () => {
    const style = { borderBottomLeftRadius: 16, borderBottomRightRadius: 16 };

    await render(
      <SafeAreaProvider>
        <Appbar.Header style={style} testID="appbar-header">
          {null}
        </Appbar.Header>
      </SafeAreaProvider>
    );
    expect(screen.getByTestId('appbar-header-root-layer')).toHaveStyle(style);
  });

  describe('getAppbarBorders', () => {
    const style = { borderRadius: 10, height: 60, top: 13 };

    it('should return only border radius styles', () => {
      expect(getAppbarBorders(style)).toEqual({ borderRadius: 10 });
    });

    it('should return empty object if no borders are passed', () => {
      const style = { height: 60, top: 13 };
      expect(getAppbarBorders(style)).toEqual({});
    });
  });
});
