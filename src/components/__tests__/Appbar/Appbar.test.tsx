import React from 'react';
import { Animated, Platform } from 'react-native';

import { render } from '@testing-library/react-native';
import mockSafeAreaContext from 'react-native-safe-area-context/jest/mock';
import renderer from 'react-test-renderer';

import Provider from '../../../core/Provider';
import { getTheme } from '../../../core/theming';
import overlay from '../../../styles/overlay';
import { tokens } from '../../../styles/themes/v3/tokens';
import Appbar from '../../Appbar';
import AppbarAction from '../../Appbar/AppbarAction';
import AppbarBackAction from '../../Appbar/AppbarBackAction';
import AppbarContent from '../../Appbar/AppbarContent';
import AppbarHeader from '../../Appbar/AppbarHeader';
import {
  getAppbarColor,
  modeTextVariant,
  renderAppbarContent as utilRenderAppbarContent,
} from '../../Appbar/utils';
import Menu from '../../Menu/Menu';
import Searchbar from '../../Searchbar';
import Tooltip from '../../Tooltip/Tooltip';
import Text from '../../Typography/Text';

jest.mock('react-native-safe-area-context', () => mockSafeAreaContext);

const renderAppbarContent = utilRenderAppbarContent as (
  props: Parameters<typeof utilRenderAppbarContent>[0]
) => { props: any }[];

describe('Appbar', () => {
  it('does not pass any additional props to Searchbar', () => {
    const tree = renderer
      .create(
        <Appbar>
          <Searchbar placeholder="Search" value="" />
        </Appbar>
      )
      .toJSON();

    expect(tree).toMatchSnapshot();
  });

  it('passes additional props to AppbarBackAction, AppbarContent and AppbarAction', () => {
    const tree = renderer
      .create(
        <Appbar>
          <Appbar.BackAction onPress={() => {}} />
          <Appbar.Content title="Examples" />
          <Appbar.Action icon="menu" onPress={() => {}} />
        </Appbar>
      )
      .toJSON();

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
      isV3: false,
      children,
      isDark: false,
    });

    expect(result).toHaveLength(4);
  });

  it('should render all children types except specified in renderExcept', () => {
    const result = renderAppbarContent({
      isV3: false,
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
      renderExcept: [Appbar, AppbarHeader, AppbarBackAction, AppbarContent],
    });

    expect(result).toHaveLength(3);
  });

  it('should render only children types specifed in renderOnly', () => {
    const result = renderAppbarContent({
      isV3: false,
      children,
      isDark: false,
      renderOnly: [AppbarAction],
    });

    expect(result).toHaveLength(2);
  });

  it('should render AppbarContent with correct mode', () => {
    const result = renderAppbarContent({
      isV3: false,
      children,
      isDark: false,
      renderOnly: [AppbarContent],
      mode: 'large',
    });

    expect(result[0].props.mode).toBe('large');
  });

  it('should render centered AppbarContent', () => {
    const renderResult = (isV3 = true) =>
      renderAppbarContent({
        children,
        isDark: false,
        isV3,
        renderOnly: [AppbarContent],
        mode: 'center-aligned',
        shouldCenterContent: true,
      });

    const centerAlignedContent = {
      alignItems: 'center',
    };

    expect(renderResult()[0].props.style).toEqual(
      expect.arrayContaining([expect.objectContaining(centerAlignedContent)])
    );

    expect(renderResult(false)[0].props.style).toEqual(
      expect.arrayContaining([expect.objectContaining(centerAlignedContent)])
    );
  });

  it('should not render centered AppbarContent for Android, if not V3', () => {
    Platform.OS = 'android';
    const renderResult = (isV3 = true) =>
      renderAppbarContent({
        children,
        isDark: false,
        isV3,
        renderOnly: [AppbarContent],
        mode: 'center-aligned',
        shouldCenterContent: !isV3 && Platform.OS === 'ios',
      });

    const centerAlignedContent = {
      alignItems: 'center',
    };

    expect(renderResult(false)[0].props.style).not.toEqual(
      expect.arrayContaining([expect.objectContaining(centerAlignedContent)])
    );
  });

  it('should render centered AppbarContent always for iOS, if not V3', () => {
    Platform.OS = 'ios';
    const renderResult = (isV3 = true) =>
      renderAppbarContent({
        children,
        isDark: false,
        isV3,
        renderOnly: [AppbarContent],
        mode: 'center-aligned',
        shouldCenterContent: !isV3 && Platform.OS === 'ios',
      });

    const centerAlignedContent = {
      alignItems: 'center',
    };

    expect(renderResult(false)[0].props.style).toEqual(
      expect.arrayContaining([expect.objectContaining(centerAlignedContent)])
    );
  });

  it('should render AppbarContent with correct spacings', () => {
    const renderResult = (isV3 = true, withAppbarBackAction = false) =>
      renderAppbarContent({
        children,
        isDark: false,
        isV3,
        renderOnly: [AppbarContent, withAppbarBackAction && AppbarBackAction],
      });

    const v2Spacing = {
      marginLeft: 8,
    };

    const v3Spacing = {
      marginLeft: 12,
    };

    expect(renderResult()[0].props.style).toEqual(
      expect.arrayContaining([expect.objectContaining(v3Spacing)])
    );

    expect(renderResult(false, true)[1].props.style).toEqual(
      expect.arrayContaining([expect.objectContaining(v2Spacing)])
    );
  });

  it('Is recognized as a header when no onPress callback has been pressed', () => {
    const { getByRole } = render(
      <mockSafeAreaContext.SafeAreaProvider>
        <Appbar.Header>
          <Appbar.Content title="Accessible test" />
        </Appbar.Header>
      </mockSafeAreaContext.SafeAreaProvider>
    );

    expect(getByRole('text')).toBeTruthy();
  });
  it('Is recognized as a button when onPress callback has been pressed', () => {
    const { getByRole } = render(
      <mockSafeAreaContext.SafeAreaProvider>
        <Appbar.Header>
          <Appbar.Content title="Accessible test" onPress={() => {}} />
        </Appbar.Header>
      </mockSafeAreaContext.SafeAreaProvider>
    );

    expect(getByRole('button')).toBeTruthy();
  });
});

describe('AppbarAction', () => {
  it('should be rendered with default theme color', () => {
    const { getByTestId } = render(
      <Appbar>
        <Appbar.Action icon="menu" testID="appbar-action" />
      </Appbar>
    );
    const appbarActionIcon = getByTestId('appbar-action').props.children[0];
    expect(appbarActionIcon.props.color).toBe(
      getTheme().colors.onSurfaceVariant
    );
  });

  it('should be rendered with specific theme color if is leading', () => {
    const { getByTestId } = render(
      <Appbar>
        <Appbar.Action icon="menu" testID="appbar-action" isLeading />
      </Appbar>
    );
    const appbarActionIcon = getByTestId('appbar-action').props.children[0];
    expect(appbarActionIcon.props.color).toBe(getTheme().colors.onSurface);
  });

  it('should be rendered with custom color', () => {
    const { getByTestId } = render(
      <Appbar>
        <Appbar.Action icon="menu" color="purple" testID="appbar-action" />
      </Appbar>
    );
    const appbarActionIcon = getByTestId('appbar-action').props.children[0];
    expect(appbarActionIcon.props.color).toBe('purple');
  });

  it('should render AppbarBackAction with custom color', () => {
    const { getByTestId } = render(
      <Appbar>
        <Appbar.BackAction color="purple" testID="appbar-action" />
      </Appbar>
    );
    const appbarBackActionIcon = getByTestId('appbar-action').props.children[0];
    expect(appbarBackActionIcon.props.color).toBe('purple');
  });

  describe('When V2', () => {
    const theme = { isV3: false };

    it('should be rendered with the right color when no color is passed', () => {
      const { getByTestId } = render(
        <Appbar theme={theme}>
          <Appbar.Action icon="menu" testID="appbar-action" />
        </Appbar>
      );

      const appbarActionIcon = getByTestId('appbar-action').props.children[0];

      expect(appbarActionIcon.props.color).toBe('#ffffff');
    });

    it('should be rendered with the right color when no color is passed but is wrapped by a Tooltip', () => {
      const { getByTestId } = render(
        <Provider>
          <Appbar theme={theme}>
            <Tooltip title="Menu">
              <Appbar.Action icon="menu" testID="appbar-action" />
            </Tooltip>
          </Appbar>
        </Provider>
      );

      const appbarActionIcon = getByTestId('appbar-action').props.children[0];

      expect(appbarActionIcon.props.color).toBe('#ffffff');
    });
  });
});

describe('AppbarContent', () => {
  (['small', 'medium', 'large', 'center-aligned'] as const).forEach((mode) =>
    it(`should render text component with appropriate variant for ${mode} mode`, () => {
      const { getByTestId } = render(
        <Appbar mode={mode}>
          <Appbar.Content title="Title" />
        </Appbar>
      );

      expect(getByTestId('appbar-content-title-text')).toHaveStyle(
        getTheme().fonts[modeTextVariant[mode]]
      );
    })
  );

  it('should render component passed to title', () => {
    const { getByText } = render(
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

    expect(getByText('Title')).toBeDefined();
  });
});

describe('getAppbarColors', () => {
  const elevation = 4;
  const customBackground = 'aquamarine';

  it('should return custom color no matter what is the theme version', () => {
    expect(getAppbarColor(getTheme(), elevation, customBackground)).toBe(
      customBackground
    );
  });

  it('should return v3 light color if theme version is 3', () => {
    expect(getAppbarColor(getTheme(), elevation)).toBe(
      tokens.md.ref.palette.neutral99
    );
  });

  it('should return v3 dark color if theme version is 3', () => {
    expect(getAppbarColor(getTheme(true), elevation)).toBe(
      tokens.md.ref.palette.neutral10
    );
  });

  it('should return v2 light color if theme version is 2', () => {
    expect(getAppbarColor(getTheme(false, false), elevation)).toBe('#6200ee');
  });

  it('should return v2 dark color if theme version is 2', () => {
    expect(getAppbarColor(getTheme(true, false), elevation)).toBe(
      overlay(elevation, '#121212')
    );
  });
});

describe('animated value changes correctly', () => {
  it('appbar animated value changes correctly', () => {
    const value = new Animated.Value(1);
    const { getByTestId } = render(
      <Appbar testID="appbar" style={[{ transform: [{ scale: value }] }]}>
        <Appbar.Action icon="menu" />
      </Appbar>
    );
    expect(getByTestId('appbar-outer-layer')).toHaveStyle({
      transform: [{ scale: 1 }],
    });

    Animated.timing(value, {
      toValue: 1.5,
      useNativeDriver: false,
      duration: 200,
    }).start();

    jest.advanceTimersByTime(200);

    expect(getByTestId('appbar-outer-layer')).toHaveStyle({
      transform: [{ scale: 1.5 }],
    });
  });

  it('action animated value changes correctly', () => {
    const value = new Animated.Value(1);
    const { getByTestId } = render(
      <Appbar>
        <Appbar.Action
          icon="menu"
          style={[{ transform: [{ scale: value }] }]}
          testID="appbar-action"
        />
      </Appbar>
    );
    expect(getByTestId('appbar-action-container-outer-layer')).toHaveStyle({
      transform: [{ scale: 1 }],
    });

    Animated.timing(value, {
      toValue: 1.5,
      useNativeDriver: false,
      duration: 200,
    }).start();

    jest.advanceTimersByTime(200);

    expect(getByTestId('appbar-action-container-outer-layer')).toHaveStyle({
      transform: [{ scale: 1.5 }],
    });
  });

  it('back action animated value changes correctly', () => {
    const value = new Animated.Value(1);
    const { getByTestId } = render(
      <Appbar>
        <Appbar.BackAction
          style={[{ transform: [{ scale: value }] }]}
          testID="appbar-back-action"
        />
      </Appbar>
    );
    expect(getByTestId('appbar-back-action-container-outer-layer')).toHaveStyle(
      {
        transform: [{ scale: 1 }],
      }
    );

    Animated.timing(value, {
      toValue: 1.5,
      useNativeDriver: false,
      duration: 200,
    }).start();

    jest.advanceTimersByTime(200);

    expect(getByTestId('appbar-back-action-container-outer-layer')).toHaveStyle(
      {
        transform: [{ scale: 1.5 }],
      }
    );
  });

  it('header animated value changes correctly', () => {
    const value = new Animated.Value(1);
    const { getByTestId } = render(
      <mockSafeAreaContext.SafeAreaProvider>
        <Appbar.Header
          style={[{ transform: [{ scale: value }] }]}
          testID="appbar-header"
        >
          {null}
        </Appbar.Header>
      </mockSafeAreaContext.SafeAreaProvider>
    );
    expect(getByTestId('appbar-header-outer-layer')).toHaveStyle({
      transform: [{ scale: 1 }],
    });

    Animated.timing(value, {
      toValue: 1.5,
      useNativeDriver: false,
      duration: 200,
    }).start();

    jest.advanceTimersByTime(200);

    expect(getByTestId('appbar-header-outer-layer')).toHaveStyle({
      transform: [{ scale: 1.5 }],
    });
  });
});
