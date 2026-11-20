import { I18nManager, Text as NativeText, View } from 'react-native';
import type { ColorValue } from 'react-native';

import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  jest,
} from '@jest/globals';
import {
  getAnimatedStyle,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { fireEvent, render, screen, userEvent } from '../../../test-utils';
import { DarkTheme, LightTheme } from '../../../theme/schemes';
import { tokens } from '../../../theme/tokens';
import Appbar from '../../Appbar';
import { getAppbarBackgroundColor, modeTextVariant } from '../../Appbar/utils';
import Searchbar from '../../Searchbar';
import Tooltip from '../../Tooltip/Tooltip';
import Text from '../../Typography/Text';

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

  it('renders custom background color passed to backgroundColor prop', async () => {
    await render(
      <Appbar backgroundColor="#FF0000" testID="appbar">
        <Appbar.Content title="Title" />
      </Appbar>
    );

    expect(screen.getByTestId('appbar')).toHaveStyle({
      backgroundColor: '#FF0000',
    });
  });

  it('includes safe area insets in the height', async () => {
    await render(
      <Appbar safeAreaInsets={{ top: 20, bottom: 30 }} testID="appbar">
        <Appbar.Content title="Title" />
      </Appbar>
    );

    expect(screen.getByTestId('appbar')).toHaveStyle({
      height: 64 + 20 + 30,
      paddingTop: 20,
      paddingBottom: 30,
    });
  });

  it('renders border radius passed to props', async () => {
    await render(
      <Appbar borderRadius={8} borderBottomLeftRadius={4} testID="appbar">
        <Appbar.Content title="Title" />
      </Appbar>
    );

    expect(screen.getByTestId('appbar')).toHaveStyle({
      borderRadius: 8,
      borderBottomLeftRadius: 4,
    });
  });
});

describe('Appbar context', () => {
  const ColorIcon = ({ color }: { color: ColorValue }) => (
    <NativeText testID="icon-color">{String(color)}</NativeText>
  );

  it('gives the parts a light color when the Appbar is dark', async () => {
    await render(
      <Appbar dark>
        <Appbar.Action icon={ColorIcon} />
        <Appbar.Content title="Title" />
      </Appbar>
    );

    expect(screen.getByTestId('icon-color')).toHaveTextContent('#ffffff');
    expect(screen.getByText('Title')).toHaveStyle({ color: '#ffffff' });
  });

  it('keeps the color of a part over the color of a dark Appbar', async () => {
    await render(
      <Appbar dark>
        <Appbar.Action icon={ColorIcon} color="purple" />
        <Appbar.Content title="Title" color="purple" />
      </Appbar>
    );

    expect(screen.getByTestId('icon-color')).toHaveTextContent('purple');
    expect(screen.getByText('Title')).toHaveStyle({ color: 'purple' });
  });

  it('applies the Appbar settings to parts wrapped in other components', async () => {
    await render(
      <Appbar dark>
        <Tooltip title="Menu">
          {(props) => (
            <Appbar.Action {...props} icon={ColorIcon} aria-label="Menu" />
          )}
        </Tooltip>
        <View>
          <Appbar.Content title="Title" />
        </View>
      </Appbar>
    );

    expect(screen.getByTestId('icon-color')).toHaveTextContent('#ffffff');
    expect(screen.getByText('Title')).toHaveStyle({ color: '#ffffff' });
  });

  it('applies the theme of the Appbar to its parts', async () => {
    await render(
      <Appbar theme={{ colors: { onSurface: 'tomato' } }}>
        <Appbar.Action icon={ColorIcon} isLeading />
        <Appbar.Content title="Title" />
      </Appbar>
    );

    expect(screen.getByTestId('icon-color')).toHaveTextContent('tomato');
    expect(screen.getByText('Title')).toHaveStyle({ color: 'tomato' });
  });

  it('prefers the theme of a part over the theme of the Appbar', async () => {
    await render(
      <Appbar theme={{ colors: { onSurface: 'tomato' } }}>
        <Appbar.Content
          title="Title"
          theme={{ colors: { onSurface: 'navy' } }}
        />
      </Appbar>
    );

    expect(screen.getByText('Title')).toHaveStyle({ color: 'navy' });
  });

  it('merges the theme of a part over the theme of the Appbar', async () => {
    await render(
      <Appbar theme={{ colors: { onSurface: 'tomato' } }}>
        <Appbar.Action
          icon={ColorIcon}
          isLeading
          theme={{ colors: { primary: 'navy' } }}
        />
        <Appbar.Content title="Title" theme={{ colors: { primary: 'navy' } }} />
      </Appbar>
    );

    // A part that sets other values still gets the rest from the Appbar
    expect(screen.getByTestId('icon-color')).toHaveTextContent('tomato');
    expect(screen.getByText('Title')).toHaveStyle({ color: 'tomato' });
  });

  it('renders parts on their own, outside of an Appbar', async () => {
    await render(
      <>
        <Appbar.Content title="Title" />
        <Appbar.Action icon="menu" aria-label="Menu" onPress={() => {}} />
      </>
    );

    expect(screen.getByText('Title')).toBeOnTheScreen();
    expect(screen.getByRole('button', { name: 'Menu' })).toBeOnTheScreen();
  });

  it('renders children in the order they are given', async () => {
    await render(
      <Appbar testID="appbar">
        <Appbar.Content title="Title" />
        <Appbar.Action
          icon="menu"
          aria-label="Menu"
          isLeading
          onPress={() => {}}
        />
        <Appbar.BackAction onPress={() => {}} />
      </Appbar>
    );

    const [first, second] = screen.getAllByRole('button');

    expect(first).toHaveAccessibleName('Menu');
    expect(second).toHaveAccessibleName('Back');
  });

  it('forwards accessibility props to the container', async () => {
    await render(
      <Appbar accessible aria-label="Navigation" role="toolbar">
        <Appbar.Content title="Title" />
      </Appbar>
    );

    expect(
      screen.getByRole('toolbar', { name: 'Navigation' })
    ).toBeOnTheScreen();
  });
});

describe('Appbar modes', () => {
  it('centers the content in the center-aligned mode', async () => {
    await render(
      <Appbar mode="center-aligned">
        <Appbar.BackAction />
        <Appbar.Content title="Title" testID="content" />
        <Appbar.Action icon="menu" aria-label="Menu" />
      </Appbar>
    );

    expect(screen.getByTestId('content')).toHaveStyle({ alignItems: 'center' });
  });

  it.each(['medium-flexible', 'large-flexible'] as const)(
    'uses the %s height as the minimum height and includes the safe area insets',
    async (mode) => {
      await render(
        <Appbar mode={mode} safeAreaInsets={{ top: 20 }} testID="appbar">
          <Appbar.Content title="Title" />
        </Appbar>
      );

      expect(screen.getByTestId('appbar')).toHaveStyle({
        minHeight: (mode === 'medium-flexible' ? 112 : 120) + 20,
        // the safe area inset and the space above the controls
        paddingTop: 20 + 6,
      });
    }
  );

  it.each(['medium-flexible', 'large-flexible'] as const)(
    'grows the %s Appbar when the title takes more space',
    async (mode) => {
      await render(
        <Appbar mode={mode} testID="appbar">
          <Appbar.Content title="Title" testID="content" />
        </Appbar>
      );

      await fireEvent(screen.getByTestId('content'), 'layout', {
        nativeEvent: { layout: { width: 300, height: 120 } },
      });

      // the row with the controls and the content
      expect(screen.getByTestId('appbar')).toHaveStyle({ minHeight: 64 + 120 });
    }
  );

  it('allows the title of a flexible Appbar to wrap onto two lines', async () => {
    await render(
      <Appbar mode="large-flexible">
        <Appbar.Content title="A long title that wraps" />
      </Appbar>
    );

    expect(screen.getByText('A long title that wraps')).toHaveProp(
      'numberOfLines',
      2
    );
  });

  it('keeps the title of the other modes on a single line', async () => {
    await render(
      <Appbar mode="medium">
        <Appbar.Content title="A long title" />
      </Appbar>
    );

    expect(screen.getByText('A long title')).toHaveProp('numberOfLines', 1);
  });
});

describe('Appbar layout', () => {
  const layout = (x: number, width: number) => ({
    nativeEvent: { layout: { x, y: 0, width, height: 64 } },
  });

  it.each([
    { mode: 'small', offset: 0 },
    { mode: 'center-aligned', offset: 0 },
    { mode: 'medium', offset: 6 },
    { mode: 'large', offset: 6 },
    { mode: 'medium-flexible', offset: 6 },
    { mode: 'large-flexible', offset: 6 },
  ] as const)(
    'places the controls of the $mode mode at the same height',
    async ({ mode, offset }) => {
      await render(
        <Appbar mode={mode} testID="appbar">
          <Appbar.Content title="Title" />
        </Appbar>
      );

      // The controls are 64 high, and their buttons are 52 high with margins
      expect(screen.getByTestId('appbar')).toHaveStyle({ paddingTop: offset });
    }
  );

  describe('in the center-aligned mode', () => {
    const renderAppbar = async (children: React.ReactNode) => {
      await render(
        <Appbar mode="center-aligned" testID="appbar">
          {children}
        </Appbar>
      );
    };

    // The bar is 420 wide with 4 of padding on each side
    const measure = async (contentX: number, contentWidth: number) => {
      await fireEvent(screen.getByTestId('appbar'), 'layout', layout(0, 420));
      await fireEvent(
        screen.getByTestId('content'),
        'layout',
        layout(contentX, contentWidth)
      );
    };

    it('adds a margin to the title on the side with less width', async () => {
      await renderAppbar(
        <>
          <Appbar.BackAction onPress={() => {}} />
          <Appbar.Content title="Title" testID="content" />
        </>
      );

      expect(screen.getByTestId('content')).toHaveStyle({
        marginLeft: 0,
        marginRight: 0,
      });

      // 52 wide actions on the left, nothing on the right
      await measure(56, 360);

      expect(screen.getByTestId('content')).toHaveStyle({
        marginLeft: 0,
        marginRight: 52,
      });
    });

    it('does not add a margin when an action before the title is not leading', async () => {
      await renderAppbar(
        <>
          <Appbar.Action icon="menu" onPress={() => {}} />
          <Appbar.Content title="Title" testID="content" />
          <Appbar.Action icon="magnify" onPress={() => {}} />
        </>
      );

      // 52 wide actions on both sides
      await measure(56, 308);

      expect(screen.getByTestId('content')).toHaveStyle({
        marginLeft: 0,
        marginRight: 0,
      });
    });

    it('takes custom children into account', async () => {
      await renderAppbar(
        <>
          <Appbar.BackAction onPress={() => {}} />
          <Appbar.Content title="Title" testID="content" />
          <View />
        </>
      );

      // 52 wide actions on the left, and a 40 wide custom child on the right
      await measure(56, 320);

      expect(screen.getByTestId('content')).toHaveStyle({
        marginLeft: 0,
        marginRight: 12,
      });
    });

    it('balances an asymmetric number of actions', async () => {
      await renderAppbar(
        <>
          <Appbar.BackAction onPress={() => {}} />
          <Appbar.Content title="Title" testID="content" />
          <Appbar.Action icon="a" onPress={() => {}} />
          <Appbar.Action icon="b" onPress={() => {}} />
        </>
      );

      // 52 wide actions on the left, and two on the right
      await measure(56, 256);

      expect(screen.getByTestId('content')).toHaveStyle({
        marginLeft: 52,
        marginRight: 0,
      });
    });

    it('does not center the title when there are more than two actions on a side', async () => {
      await renderAppbar(
        <>
          <Appbar.BackAction onPress={() => {}} />
          <Appbar.Content title="Title" testID="content" />
          <Appbar.Action icon="a" onPress={() => {}} />
          <Appbar.Action icon="b" onPress={() => {}} />
          <Appbar.Action icon="c" onPress={() => {}} />
        </>
      );

      // 52 wide actions on the left, and three on the right
      await measure(56, 208);

      expect(screen.getByTestId('content')).toHaveStyle({
        marginLeft: 0,
        marginRight: 0,
      });
    });

    it('measures the bar again after it was resized', async () => {
      await renderAppbar(
        <>
          <Appbar.BackAction onPress={() => {}} />
          <Appbar.Content title="Title" testID="content" />
        </>
      );

      await measure(56, 360);
      expect(screen.getByTestId('content')).toHaveStyle({ marginRight: 52 });

      // The content shrinks by its margin, which must not count as an action
      await fireEvent(screen.getByTestId('content'), 'layout', layout(56, 308));

      expect(screen.getByTestId('content')).toHaveStyle({ marginRight: 52 });
    });

    describe.each([
      // React Native applies the left of a style to the right in RTL
      { swapped: true, margin: { marginLeft: 52, marginRight: 0 } },
      { swapped: false, margin: { marginLeft: 0, marginRight: 52 } },
    ])('in RTL, with the sides swapped: $swapped', ({ swapped, margin }) => {
      beforeEach(() => {
        jest.spyOn(I18nManager, 'getConstants').mockReturnValue({
          isRTL: true,
          doLeftAndRightSwapInRTL: swapped,
          localeIdentifier: 'ar',
        });
      });

      afterEach(() => {
        jest.restoreAllMocks();
      });

      it('adds the margin on the side with less width and settles', async () => {
        await renderAppbar(
          <>
            <Appbar.BackAction onPress={() => {}} />
            <Appbar.Content title="Title" testID="content" />
            <Appbar.Action icon="menu" onPress={() => {}} />
            <Appbar.Action icon="dots-vertical" onPress={() => {}} />
          </>
        );

        // The back action is on the right, and two actions are on the left
        await measure(108, 256);

        // The margin is on the right, where there is less width
        expect(screen.getByTestId('content')).toHaveStyle(margin);

        // The content shrinks by its margin on the right, and the margin must settle
        await fireEvent(
          screen.getByTestId('content'),
          'layout',
          layout(108, 204)
        );

        expect(screen.getByTestId('content')).toHaveStyle(margin);
      });
    });

    // The web only observes an element that has `onLayout` when it mounts, so
    // the handlers are set in every mode
    it('uses the layout measured before the mode changed to center-aligned', async () => {
      const { rerender } = await render(
        <Appbar testID="appbar">
          <Appbar.BackAction onPress={() => {}} />
          <Appbar.Content title="Title" testID="content" />
        </Appbar>
      );

      // The bar and the content are measured in the small mode
      await measure(56, 360);

      await rerender(
        <Appbar mode="center-aligned" testID="appbar">
          <Appbar.BackAction onPress={() => {}} />
          <Appbar.Content title="Title" testID="content" />
        </Appbar>
      );

      expect(screen.getByTestId('content')).toHaveStyle({ marginRight: 52 });
    });
  });

  it('resets the height of a flexible Appbar when the content unmounts', async () => {
    const { rerender } = await render(
      <Appbar mode="large-flexible" testID="appbar">
        <Appbar.Content title="Title" testID="content" />
      </Appbar>
    );

    await fireEvent(screen.getByTestId('content'), 'layout', layout(0, 300));
    expect(screen.getByTestId('appbar')).toHaveStyle({ minHeight: 64 + 64 });

    await rerender(
      <Appbar mode="large-flexible" testID="appbar">
        {null}
      </Appbar>
    );

    // back to the minimum height, which is larger than the controls and content
    expect(screen.getByTestId('appbar')).toHaveStyle({ minHeight: 120 });
  });

  it('forgets the measured content of a center-aligned Appbar when it unmounts', async () => {
    const { rerender } = await render(
      <Appbar mode="center-aligned" testID="appbar">
        <Appbar.BackAction onPress={() => {}} />
        <Appbar.Content title="Title" testID="content" />
      </Appbar>
    );

    await fireEvent(screen.getByTestId('appbar'), 'layout', layout(0, 420));
    await fireEvent(screen.getByTestId('content'), 'layout', layout(56, 360));
    expect(screen.getByTestId('content')).toHaveStyle({ marginRight: 52 });

    await rerender(
      <Appbar mode="center-aligned" testID="appbar">
        <Appbar.BackAction onPress={() => {}} />
      </Appbar>
    );
    await rerender(
      <Appbar mode="center-aligned" testID="appbar">
        <Appbar.BackAction onPress={() => {}} />
        <Appbar.Content title="Title" testID="content" />
      </Appbar>
    );

    // A new content starts without the margin of the removed one
    expect(screen.getByTestId('content')).toHaveStyle({
      marginLeft: 0,
      marginRight: 0,
    });
  });

  it('keeps the onLayout of Appbar.Content when the Appbar uses its layout', async () => {
    const onLayout = jest.fn();

    await render(
      <Appbar mode="large-flexible" testID="appbar">
        <Appbar.Content title="Title" testID="content" onLayout={onLayout} />
      </Appbar>
    );

    await fireEvent(screen.getByTestId('content'), 'layout', layout(0, 300));

    expect(onLayout).toHaveBeenCalledTimes(1);
    // the Appbar still grows
    expect(screen.getByTestId('appbar')).toHaveStyle({
      minHeight: 64 + 64,
    });
  });

  it('keeps the onLayout of the Appbar in the center-aligned mode', async () => {
    const onLayout = jest.fn();

    await render(
      <Appbar mode="center-aligned" testID="appbar" onLayout={onLayout}>
        <Appbar.Content title="Title" />
      </Appbar>
    );

    await fireEvent(screen.getByTestId('appbar'), 'layout', layout(0, 420));

    expect(onLayout).toHaveBeenCalledTimes(1);
  });

  it.each(['medium', 'large', 'medium-flexible', 'large-flexible'] as const)(
    'passes the Appbar settings to an action in a wrapper in the %s mode',
    async (mode) => {
      await render(
        <Appbar mode={mode} dark>
          <Appbar.Content title="Title" />
          <Tooltip title="Menu">
            {(props) => (
              <View>
                <Appbar.Action
                  {...props}
                  icon={({ color }) => (
                    <NativeText testID="icon-color">{String(color)}</NativeText>
                  )}
                  aria-label="Menu"
                  onPress={() => {}}
                />
              </View>
            )}
          </Tooltip>
        </Appbar>
      );

      expect(screen.getByTestId('icon-color')).toHaveTextContent('#ffffff');
      expect(screen.getByRole('button', { name: 'Menu' })).toBeOnTheScreen();
    }
  );
});

describe('Appbar scroll-aware color', () => {
  it('uses the surface color by default', async () => {
    await render(
      <Appbar testID="appbar">
        <Appbar.Content title="Title" />
      </Appbar>
    );

    expect(screen.getByTestId('appbar')).toHaveStyle({
      backgroundColor: LightTheme.colors.surface,
    });
  });

  it('uses the surface container color when scrolled, without elevation', async () => {
    await render(
      <Appbar isScrolled testID="appbar">
        <Appbar.Content title="Title" />
      </Appbar>
    );

    expect(screen.getByTestId('appbar')).toHaveStyle({
      backgroundColor: LightTheme.colors.surfaceContainer,
    });
  });

  it('keeps the shadow of an elevated Appbar when it is scrolled', async () => {
    await render(
      <>
        <Appbar elevated isScrolled testID="both">
          <Appbar.Content title="Title" />
        </Appbar>
        <Appbar isScrolled testID="scrolled">
          <Appbar.Content title="Title" />
        </Appbar>
      </>
    );

    expect(screen.getByTestId('both')).toHaveStyle({
      backgroundColor: LightTheme.colors.surfaceContainer,
      shadowOpacity: 0.19,
    });
    expect(screen.getByTestId('scrolled')).not.toHaveStyle({
      shadowOpacity: 0.19,
    });
  });

  it('prefers the custom background color', async () => {
    await render(
      <Appbar isScrolled backgroundColor="#FF0000" testID="appbar">
        <Appbar.Content title="Title" />
      </Appbar>
    );

    expect(screen.getByTestId('appbar')).toHaveStyle({
      backgroundColor: '#FF0000',
    });
  });

  it('is available on Appbar.Header', async () => {
    await render(
      <SafeAreaProvider>
        <Appbar.Header isScrolled testID="appbar-header">
          <Appbar.Content title="Title" />
        </Appbar.Header>
      </SafeAreaProvider>
    );

    expect(screen.getByTestId('appbar-header')).toHaveStyle({
      backgroundColor: LightTheme.colors.surfaceContainer,
    });
  });
});

describe('Appbar animated style', () => {
  const AnimatedAppbar = () => {
    const opacity = useSharedValue(0);
    const animatedStyle = useAnimatedStyle(() => ({ opacity: opacity.value }));

    return (
      <>
        <Appbar
          style={[{ marginHorizontal: 12 }, animatedStyle]}
          testID="appbar"
        >
          <Appbar.Content title="Title" />
        </Appbar>
        <Appbar.Action
          icon="menu"
          aria-label="Reveal"
          onPress={() => {
            opacity.value = 1;
          }}
        />
      </>
    );
  };

  it('keeps static styles combined with an animated style', async () => {
    await render(<AnimatedAppbar />);

    const appbar = screen.getByTestId('appbar');

    expect(appbar).toHaveStyle({ marginHorizontal: 12 });
    expect(getAnimatedStyle(appbar)).toMatchObject({ opacity: 0 });

    await userEvent.press(screen.getByRole('button', { name: 'Reveal' }));
    await jest.runAllTimersAsync();

    expect(getAnimatedStyle(appbar)).toMatchObject({ opacity: 1 });
  });
});

describe('Appbar.Header', () => {
  it('includes the status bar height in the header height', async () => {
    await render(
      <SafeAreaProvider>
        <Appbar.Header
          mode="medium"
          statusBarHeight={40}
          testID="appbar-header"
        >
          <Appbar.Content title="Title" />
        </Appbar.Header>
      </SafeAreaProvider>
    );

    expect(screen.getByTestId('appbar-header')).toHaveStyle({
      height: 112 + 40,
      // the status bar height and the space above the controls
      paddingTop: 40 + 6,
    });
  });

  it('renders custom background color passed to Appbar.Header', async () => {
    await render(
      <SafeAreaProvider>
        <Appbar.Header backgroundColor="#FF0000" testID="appbar-header">
          <Appbar.Content title="Title" />
        </Appbar.Header>
      </SafeAreaProvider>
    );

    expect(screen.getByTestId('appbar-header')).toHaveStyle({
      backgroundColor: '#FF0000',
    });
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
    const { toJSON } = await render(
      <Appbar>
        <Appbar.Action icon="menu" testID="appbar-action" />
      </Appbar>
    );
    expect(toJSON()).toMatchSnapshot();
  });

  it('should be rendered with specific theme color if is leading', async () => {
    const { toJSON } = await render(
      <Appbar>
        <Appbar.Action icon="menu" testID="appbar-action" isLeading />
      </Appbar>
    );
    expect(toJSON()).toMatchSnapshot();
  });

  it('should be rendered with custom color', async () => {
    const { toJSON } = await render(
      <Appbar>
        <Appbar.Action icon="menu" color="purple" testID="appbar-action" />
      </Appbar>
    );
    expect(toJSON()).toMatchSnapshot();
  });

  it.each(['filled', 'tonal'] as const)(
    'renders a %s action as a button that handles presses',
    async (variant) => {
      const onPress = jest.fn<() => void>();

      await render(
        <Appbar>
          <Appbar.Action
            icon="star"
            aria-label="Favorite"
            variant={variant}
            width="wide"
            onPress={onPress}
          />
        </Appbar>
      );

      await userEvent.press(screen.getByRole('button', { name: 'Favorite' }));

      expect(onPress).toHaveBeenCalledTimes(1);
    }
  );

  it.each([
    { variant: 'filled', width: 'wide', expected: 52 },
    { variant: 'tonal', width: 'wide', expected: 52 },
    { variant: 'filled', width: 'default', expected: 40 },
  ] as const)(
    'makes a $variant action with $width width $expected wide',
    async ({ variant, width, expected }) => {
      await render(
        <Appbar>
          <Appbar.Action
            icon="star"
            aria-label="Favorite"
            variant={variant}
            width={width}
            onPress={() => {}}
          />
        </Appbar>
      );

      // The container of the button is the one with the width, around the clip
      expect(
        screen.getByRole('button', { name: 'Favorite' }).parent?.parent
      ).toHaveStyle({ width: expected });
    }
  );

  describe.each([
    {
      variant: 'filled',
      defaults: { container: 'primary', icon: 'onPrimary' },
      selected: { container: 'primary', icon: 'onPrimary' },
      unselected: { container: 'surfaceContainer', icon: 'onSurfaceVariant' },
    },
    {
      variant: 'tonal',
      defaults: {
        container: 'secondaryContainer',
        icon: 'onSecondaryContainer',
      },
      selected: { container: 'secondary', icon: 'onSecondary' },
      unselected: {
        container: 'secondaryContainer',
        icon: 'onSecondaryContainer',
      },
    },
  ] as const)(
    'a $variant action',
    ({ variant, defaults, selected, unselected }) => {
      const renderAction = async (props: { selected?: boolean }) => {
        await render(
          <Appbar>
            <Appbar.Action
              icon={({ color }) => (
                <NativeText testID="icon-color">{String(color)}</NativeText>
              )}
              aria-label="Favorite"
              variant={variant}
              onPress={() => {}}
              {...props}
            />
          </Appbar>
        );
      };

      // The clip, the view around the button, has the background
      const container = () =>
        screen.getByRole('button', { name: 'Favorite' }).parent;

      it('has the default container color when selected is not passed', async () => {
        await renderAction({});

        expect(container()).toHaveStyle({
          backgroundColor: LightTheme.colors[defaults.container],
        });
        expect(screen.getByTestId('icon-color')).toHaveTextContent(
          String(LightTheme.colors[defaults.icon])
        );
      });

      it('is selected when selected is true', async () => {
        await renderAction({ selected: true });

        expect(container()).toHaveStyle({
          backgroundColor: LightTheme.colors[selected.container],
        });
      });

      it('shows the unselected container when selected is false', async () => {
        await renderAction({ selected: false });

        expect(container()).toHaveStyle({
          backgroundColor: LightTheme.colors[unselected.container],
        });
        expect(screen.getByTestId('icon-color')).toHaveTextContent(
          String(LightTheme.colors[unselected.icon])
        );
      });
    }
  );

  it('does not override the icon color of a filled action by the Appbar', async () => {
    await render(
      <Appbar dark>
        <Appbar.Action
          icon={({ color }) => (
            <NativeText testID="icon">{String(color)}</NativeText>
          )}
          variant="filled"
        />
      </Appbar>
    );

    expect(screen.getByTestId('icon')).not.toHaveTextContent('#ffffff');
  });

  it('should render AppbarBackAction with custom color', async () => {
    const { toJSON } = await render(
      <Appbar>
        <Appbar.BackAction color="purple" testID="appbar-action" />
      </Appbar>
    );
    expect(toJSON()).toMatchSnapshot();
  });
});

describe('AppbarContent', () => {
  (
    [
      'small',
      'medium',
      'large',
      'center-aligned',
      'medium-flexible',
      'large-flexible',
    ] as const
  ).forEach((mode) =>
    it(`should render text component with appropriate variant for ${mode} mode`, async () => {
      await render(
        <Appbar mode={mode}>
          <Appbar.Content testID="appbar-content" title="Title" />
        </Appbar>
      );

      expect(screen.getByText('Title')).toHaveStyle(
        LightTheme.fonts[modeTextVariant[mode]]
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
      getAppbarBackgroundColor(LightTheme, elevated, customBackground)
    ).toBe(customBackground);
  });

  it('returns the light surface container color for an elevated appbar', () => {
    expect(getAppbarBackgroundColor(LightTheme, elevated)).toBe(
      tokens.md.ref.palette.neutral94
    );
  });

  it('returns the dark surface container color for an elevated appbar', () => {
    expect(getAppbarBackgroundColor(DarkTheme, elevated)).toBe(
      tokens.md.ref.palette.neutral12
    );
  });
});
