import { describe, expect, it } from '@jest/globals';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { render, screen } from '../../../test-utils';
import { DarkTheme, LightTheme } from '../../../theme/schemes';
import { tokens } from '../../../theme/tokens';
import Appbar from '../../Appbar';
import {
  getAppbarBackgroundColor,
  getAppbarBorders,
  getAppbarHeight,
  modeTextVariant,
  renderAppbarContent as utilRenderAppbarContent,
} from '../../Appbar/utils';
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

  it('should render only children types specified in renderOnly', () => {
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
  (['small', 'medium', 'large', 'center-aligned'] as const).forEach((mode) =>
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

describe('MD3 Expressive Top App Bar features', () => {
  describe('Flexible Appbar modes & typography', () => {
    it('should render text component with headlineSmall for medium-flexible mode', async () => {
      await render(
        <Appbar mode="medium-flexible">
          <Appbar.Content title="Inbox" />
        </Appbar>
      );

      expect(screen.getByText('Inbox')).toHaveStyle(
        LightTheme.fonts[modeTextVariant['medium-flexible']]
      );
    });

    it('should render text component with headlineMedium for large-flexible mode', async () => {
      await render(
        <Appbar mode="large-flexible">
          <Appbar.Content title="Library" />
        </Appbar>
      );

      expect(screen.getByText('Library')).toHaveStyle(
        LightTheme.fonts[modeTextVariant['large-flexible']]
      );
    });

    it('should switch typography to titleLarge when collapsed', async () => {
      await render(
        <Appbar mode="large-flexible" collapsed>
          <Appbar.Content title="Library" />
        </Appbar>
      );

      expect(screen.getByText('Library')).toHaveStyle(
        LightTheme.fonts.titleLarge
      );
    });
  });

  describe('Subtitle support in MD3 Expressive', () => {
    it('should render subtitle with bodyMedium typography and onSurfaceVariant color', async () => {
      await render(
        <Appbar mode="medium-flexible">
          <Appbar.Content title="Inbox" subtitle="3 unread messages" />
        </Appbar>
      );

      const subtitle = screen.getByText('3 unread messages');
      expect(subtitle).toBeOnTheScreen();
      expect(subtitle).toHaveStyle(LightTheme.fonts.bodyMedium);
      expect(subtitle).toHaveStyle({
        color: LightTheme.colors.onSurfaceVariant,
      });
    });

    it('should hide subtitle when collapsed into small height', async () => {
      await render(
        <Appbar mode="medium-flexible" collapsed>
          <Appbar.Content title="Inbox" subtitle="3 unread messages" />
        </Appbar>
      );

      expect(screen.getByText('Inbox')).toBeOnTheScreen();
      expect(screen.queryByText('3 unread messages')).not.toBeOnTheScreen();
    });
  });

  describe('Height calculations (getAppbarHeight)', () => {
    it('should return 112 for medium-flexible without subtitle and 136 with subtitle', () => {
      expect(
        getAppbarHeight({ mode: 'medium-flexible', hasSubtitle: false })
      ).toBe(112);
      expect(
        getAppbarHeight({ mode: 'medium-flexible', hasSubtitle: true })
      ).toBe(136);
    });

    it('should return 120 for large-flexible without subtitle and 152 with subtitle', () => {
      expect(
        getAppbarHeight({ mode: 'large-flexible', hasSubtitle: false })
      ).toBe(120);
      expect(
        getAppbarHeight({ mode: 'large-flexible', hasSubtitle: true })
      ).toBe(152);
    });

    it('should return 64 for collapsed flexible appbars', () => {
      expect(
        getAppbarHeight({
          mode: 'medium-flexible',
          hasSubtitle: true,
          collapsed: true,
        })
      ).toBe(64);
      expect(
        getAppbarHeight({
          mode: 'large-flexible',
          hasSubtitle: true,
          collapsed: true,
        })
      ).toBe(64);
    });
  });

  describe('Filled and tonal trailing action buttons', () => {
    it('should render filled action button with primary container and onPrimary icon', async () => {
      const { toJSON } = await render(
        <Appbar>
          <Appbar.Action
            icon="plus"
            mode="contained"
            testID="filled-action"
            onPress={() => {}}
          />
        </Appbar>
      );

      expect(toJSON()).toMatchSnapshot();
    });

    it('should render tonal action button with secondaryContainer container and onSecondaryContainer icon', async () => {
      const { toJSON } = await render(
        <Appbar>
          <Appbar.Action
            icon="plus"
            mode="contained-tonal"
            testID="tonal-action"
            onPress={() => {}}
          />
        </Appbar>
      );

      expect(toJSON()).toMatchSnapshot();
    });
  });

  describe('Appbar.Image / logo element', () => {
    it('should render image component in Appbar', async () => {
      await render(
        <Appbar>
          <Appbar.Image
            source={{ uri: 'https://example.com/avatar.png' }}
            testID="test-logo"
            accessibilityLabel="App logo"
          />
          <Appbar.Content title="App Name" />
        </Appbar>
      );

      const image = screen.getByLabelText('App logo');
      expect(image).toBeOnTheScreen();
      expect(image).toHaveStyle({ width: 40, height: 40, borderRadius: 20 });
    });
  });

  describe('Scroll-reactive behavior & useAppbarScrollBehavior', () => {
    it('should elevate appbar container reactively when scrollBehavior reports isElevated', async () => {
      const scrollBehavior = {
        isElevated: true,
        isCollapsed: false,
        scrollOffset: 50,
        collapseProgress: 0.5,
        elevation: 2 as const,
        elevationThreshold: 0,
        collapseThreshold: 56,
      };

      await render(
        <Appbar scrollBehavior={scrollBehavior} testID="appbar-root">
          <Appbar.Content title="Scrolled Page" />
        </Appbar>
      );

      expect(screen.getByTestId('appbar-root')).toHaveStyle({
        backgroundColor: LightTheme.colors.surfaceContainer,
      });
    });

    it('should collapse flexible appbar when scrollBehavior reports isCollapsed', async () => {
      const scrollBehavior = {
        isElevated: true,
        isCollapsed: true,
        scrollOffset: 100,
        collapseProgress: 1,
        elevation: 2 as const,
        elevationThreshold: 0,
        collapseThreshold: 56,
      };

      await render(
        <Appbar
          mode="medium-flexible"
          scrollBehavior={scrollBehavior}
          testID="appbar-root"
        >
          <Appbar.Content title="Collapsible Title" subtitle="Subtitle text" />
        </Appbar>
      );

      expect(screen.getByTestId('appbar-root')).toHaveStyle({
        height: 64,
        backgroundColor: LightTheme.colors.surfaceContainer,
      });
      expect(screen.queryByText('Subtitle text')).not.toBeOnTheScreen();
    });
  });

  describe('TopAppBar alias and titleAlignment', () => {
    it('TopAppBar alias should be defined and equal Appbar', () => {
      const { TopAppBar: ExportedTopAppBar } = require('../../Appbar');
      expect(ExportedTopAppBar).toBe(Appbar);
      expect(ExportedTopAppBar.Header).toBe(Appbar.Header);
      expect(ExportedTopAppBar.Content).toBe(Appbar.Content);
      expect(ExportedTopAppBar.Action).toBe(Appbar.Action);
      expect(ExportedTopAppBar.BackAction).toBe(Appbar.BackAction);
      expect(ExportedTopAppBar.Image).toBe(Appbar.Image);
    });

    it('should center title when titleAlignment="center" is passed to small mode', async () => {
      await render(
        <Appbar mode="small" titleAlignment="center">
          <Appbar.Content title="Centered Title" />
        </Appbar>
      );

      expect(screen.getByText('Centered Title')).toHaveStyle({
        textAlign: 'center',
      });
    });
  });
});
