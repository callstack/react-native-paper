import React from 'react';
import { Animated } from 'react-native';

import { act, render } from '@testing-library/react-native';
import mockSafeAreaContext from 'react-native-safe-area-context/jest/mock';

import { getTheme } from '../../../core/theming';
import { tokens } from '../../../styles/themes/tokens';
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
  it('does not pass any additional props to Searchbar', () => {
    const tree = render(
      <Appbar>
        <Searchbar placeholder="Search" value="" />
      </Appbar>
    ).toJSON();

    expect(tree).toMatchSnapshot();
  });

  it('passes additional props to AppbarBackAction, AppbarContent and AppbarAction', () => {
    const tree = render(
      <Appbar>
        <Appbar.BackAction onPress={() => {}} />
        <Appbar.Content title="Examples" />
        <Appbar.Action icon="menu" onPress={() => {}} />
      </Appbar>
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

    expect(result[0].props.mode).toBe('large');
  });

  it('should render centered AppbarContent', () => {
    const renderResult = () =>
      renderAppbarContent({
        children,
        isDark: false,
        renderOnly: ['Appbar.Content'],
        mode: 'center-aligned',
        shouldCenterContent: true,
      });

    const centerAlignedContent = {
      alignItems: 'center',
    };

    expect(renderResult()[0].props.style).toEqual(
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

    const spacing = {
      marginLeft: 12,
    };

    expect(renderResult()[0].props.style).toEqual(
      expect.arrayContaining([expect.objectContaining(spacing)])
    );
  });

  // TODO: Update testing-library to work with role
  it.skip('Is recognized as a header when no onPress callback has been pressed', () => {
    const { getByRole } = render(
      <mockSafeAreaContext.SafeAreaProvider>
        <Appbar.Header>
          <Appbar.Content title="Accessible test" />
        </Appbar.Header>
      </mockSafeAreaContext.SafeAreaProvider>
    );

    expect(getByRole('header')).toBeTruthy();
  });

  // TODO: Refactor after testing-library update
  it.skip('is recognized as a button when onPress callback has been passed', () => {
    const { getByTestId } = render(
      <mockSafeAreaContext.SafeAreaProvider>
        <Appbar.Header>
          <Appbar.Content title="Accessible test" onPress={() => {}} />
        </Appbar.Header>
      </mockSafeAreaContext.SafeAreaProvider>
    );

    expect(getByTestId('appbar-content').props.accessibilityRole).toEqual(
      'button'
    );
    expect(
      getByTestId('appbar-content').props.accessibilityState || {}
    ).not.toMatchObject({ disabled: true });
    expect(
      getByTestId('appbar-content-title-text').props.accessibilityRole
    ).toEqual('none');
  });

  // TODO: Refactor after testing-library update
  it.skip('is recognized as a disabled button when onPress and disabled is passed', () => {
    const { getByTestId } = render(
      <mockSafeAreaContext.SafeAreaProvider>
        <Appbar.Header>
          <Appbar.Content title="Accessible test" onPress={() => {}} disabled />
        </Appbar.Header>
      </mockSafeAreaContext.SafeAreaProvider>
    );

    expect(getByTestId('appbar-content').props.accessibilityRole).toEqual(
      'button'
    );
    expect(
      getByTestId('appbar-content').props.accessibilityState
    ).toMatchObject({ disabled: true });
    expect(
      getByTestId('appbar-content-title-text').props.accessibilityRole
    ).toEqual('none');
  });
});

describe('AppbarAction', () => {
  it('should be rendered with default theme color', () => {
    const { getByTestId } = render(
      <Appbar>
        <Appbar.Action icon="menu" testID="appbar-action" />
      </Appbar>
    );
    const appbarActionIcon = getByTestId('cross-fade-icon-current').props
      .children;
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
    const appbarActionIcon = getByTestId('cross-fade-icon-current').props
      .children;
    expect(appbarActionIcon.props.color).toBe(getTheme().colors.onSurface);
  });

  it('should be rendered with custom color', () => {
    const { getByTestId } = render(
      <Appbar>
        <Appbar.Action icon="menu" color="purple" testID="appbar-action" />
      </Appbar>
    );
    const appbarActionIcon = getByTestId('cross-fade-icon-current').props
      .children;
    expect(appbarActionIcon.props.color).toBe('purple');
  });

  it('should be rendered with custom ripple color', () => {
    const { getByTestId } = render(
      <Appbar>
        <Appbar.Action
          icon="menu"
          rippleColor="purple"
          testID="appbar-action"
        />
      </Appbar>
    );
    const appbarActionContainer = getByTestId('appbar-action-container').props
      .children;
    expect(appbarActionContainer.props.rippleColor).toBe('purple');
  });

  it('should render AppbarBackAction with custom color', () => {
    const { getByTestId } = render(
      <Appbar>
        <Appbar.BackAction color="purple" testID="appbar-action" />
      </Appbar>
    );
    const appbarBackActionIcon = getByTestId('cross-fade-icon-current').props
      .children;
    expect(appbarBackActionIcon.props.color).toBe('purple');
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
  const customBackground = 'aquamarine';

  it('should return custom color no matter what is the theme version', () => {
    expect(getAppbarBackgroundColor(getTheme(), customBackground)).toBe(
      customBackground
    );
  });

  it('should return default light color', () => {
    expect(getAppbarBackgroundColor(getTheme())).toBe(
      tokens.md.ref.palette.neutral99
    );
  });

  it('should return default dark color', () => {
    expect(getAppbarBackgroundColor(getTheme(true))).toBe(
      tokens.md.ref.palette.neutral10
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

    act(() => {
      jest.advanceTimersByTime(200);
    });

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

    act(() => {
      jest.advanceTimersByTime(200);
    });

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

    act(() => {
      jest.advanceTimersByTime(200);
    });

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

    act(() => {
      jest.advanceTimersByTime(200);
    });

    expect(getByTestId('appbar-header-outer-layer')).toHaveStyle({
      transform: [{ scale: 1.5 }],
    });
  });

  it('header bottom border radius applied correctly', () => {
    const style = { borderBottomLeftRadius: 16, borderBottomRightRadius: 16 };

    const { getByTestId } = render(
      <mockSafeAreaContext.SafeAreaProvider>
        <Appbar.Header style={style} testID="appbar-header">
          {null}
        </Appbar.Header>
      </mockSafeAreaContext.SafeAreaProvider>
    );
    expect(getByTestId('appbar-header-root-layer')).toHaveStyle(style);
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
