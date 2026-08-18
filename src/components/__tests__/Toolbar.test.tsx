import { Platform } from 'react-native';

import { describe, expect, it } from '@jest/globals';
import { SafeAreaInsetsContext } from 'react-native-safe-area-context';

import { getTheme } from '../../core/theming';
import { render, screen } from '../../test-utils';
import Button from '../Button/Button';
import IconButton from '../IconButton/IconButton';
import type { ColorScheme } from '../Toolbar/tokens';
import Toolbar from '../Toolbar/Toolbar';
import {
  resolveIconColors,
  resolveLabelColor,
} from '../Toolbar/ToolbarColorContext';
import { resolveContainerColor } from '../Toolbar/utils';

type Field =
  | 'container'
  | 'label'
  | 'icon'
  | 'selectedIcon'
  | 'selectedContainer';

const ToolbarChildren = () => (
  <>
    <IconButton icon="format-bold" onPress={() => {}} />
    <IconButton icon="format-italic" onPress={() => {}} />
  </>
);

it('renders Toolbar with default props', async () => {
  const tree = (
    await render(
      <Toolbar>
        <ToolbarChildren />
      </Toolbar>
    )
  ).toJSON();
  expect(tree).toMatchSnapshot();
});

it('renders Toolbar with docked variant', async () => {
  const tree = (
    await render(
      <Toolbar variant="docked">
        <ToolbarChildren />
      </Toolbar>
    )
  ).toJSON();
  expect(tree).toMatchSnapshot();
});

it('extends the docked container into the bottom safe-area inset', async () => {
  const tree = (
    await render(
      <SafeAreaInsetsContext.Provider
        value={{ top: 0, left: 0, right: 0, bottom: 34 }}
      >
        <Toolbar variant="docked">
          <ToolbarChildren />
        </Toolbar>
      </SafeAreaInsetsContext.Provider>
    )
  ).toJSON();
  expect(tree).toMatchSnapshot();
});

it('renders Toolbar with vertical orientation', async () => {
  const tree = (
    await render(
      <Toolbar orientation="vertical">
        <ToolbarChildren />
      </Toolbar>
    )
  ).toJSON();
  expect(tree).toMatchSnapshot();
});

it("applies `style` directly to the floating pill's outer (position) layer", async () => {
  const originalPlatform = Platform.OS;
  Platform.OS = 'ios';

  await render(
    <Toolbar testID="floating" style={{ position: 'absolute', top: 5 }}>
      <ToolbarChildren />
    </Toolbar>
  );

  expect(screen.getByTestId('floating-outer-layer')).toHaveStyle({
    position: 'absolute',
    top: 5,
  });

  Platform.OS = originalPlatform;
});

it("lets `style` override the floating pill's internal container styles", async () => {
  await render(
    <Toolbar testID="floating" style={{ height: 200 }}>
      <ToolbarChildren />
    </Toolbar>
  );

  expect(screen.getByTestId('floating-outer-layer')).toHaveStyle({
    height: 200,
  });
});

it("lets `contentContainerStyle` override the pill's fixed cross-axis thickness for full control", async () => {
  await render(
    <Toolbar testID="floating" contentContainerStyle={{ height: 10 }}>
      <ToolbarChildren />
    </Toolbar>
  );

  expect(screen.getByTestId('floating-content')).toHaveStyle({ height: 10 });
});

it("applies `style` to the docked variant's self-anchoring container", async () => {
  await render(
    <Toolbar testID="docked" variant="docked" style={{ bottom: 10 }}>
      <ToolbarChildren />
    </Toolbar>
  );

  expect(screen.getByTestId('docked-container')).toHaveStyle({ bottom: 10 });
});

it('renders floating Toolbar with vibrant colorScheme', async () => {
  const tree = (
    await render(
      <Toolbar colorScheme="vibrant">
        <ToolbarChildren />
      </Toolbar>
    )
  ).toJSON();
  expect(tree).toMatchSnapshot();
});

it('renders docked Toolbar with vibrant colorScheme', async () => {
  await render(
    <>
      <Toolbar testID="toolbar-vibrant" variant="docked" colorScheme="vibrant">
        <ToolbarChildren />
      </Toolbar>
      <Toolbar testID="toolbar-standard" variant="docked">
        <ToolbarChildren />
      </Toolbar>
    </>
  );

  const theme = getTheme();
  expect(screen.getByTestId('toolbar-vibrant')).toHaveStyle({
    backgroundColor: theme.colors.primaryContainer,
  });
  expect(screen.getByTestId('toolbar-standard')).toHaveStyle({
    backgroundColor: theme.colors.surfaceContainer,
  });
});

it('keeps an explicit iconColor instead of the vibrant default', async () => {
  const tree = (
    await render(
      <Toolbar colorScheme="vibrant">
        <IconButton icon="format-bold" iconColor="red" onPress={() => {}} />
        <IconButton icon="format-italic" onPress={() => {}} />
      </Toolbar>
    )
  ).toJSON();
  expect(tree).toMatchSnapshot();
});

it("defaults a mode-less IconButton child's iconColor to the toolbar's content color", async () => {
  const tree = (
    await render(
      <Toolbar>
        <IconButton icon="format-bold" onPress={() => {}} />
      </Toolbar>
    )
  ).toJSON();
  expect(tree).toMatchSnapshot();
});

it('leaves an IconButton child with an explicit mode uncolored', async () => {
  const tree = (
    await render(
      <Toolbar colorScheme="vibrant">
        <IconButton icon="format-bold" mode="outlined" onPress={() => {}} />
      </Toolbar>
    )
  ).toJSON();
  expect(tree).toMatchSnapshot();
});

it('recolors IconButtons through a Fragment held in a variable, not just direct children', async () => {
  const fragmentChildren = (
    <>
      <IconButton icon="format-bold" onPress={() => {}} />
      <IconButton icon="format-italic" onPress={() => {}} />
    </>
  );
  const tree = (
    await render(<Toolbar colorScheme="vibrant">{fragmentChildren}</Toolbar>)
  ).toJSON();
  expect(tree).toMatchSnapshot();
});

it('gives a selected IconButton child the selected container color', async () => {
  await render(
    <>
      <Toolbar>
        <IconButton
          testID="standard-selected"
          selected
          icon="format-bold"
          onPress={() => {}}
        />
      </Toolbar>
      <Toolbar colorScheme="vibrant">
        <IconButton
          testID="vibrant-selected"
          selected
          icon="format-bold"
          onPress={() => {}}
        />
      </Toolbar>
    </>
  );

  const theme = getTheme();
  expect(screen.getByTestId('standard-selected-container')).toHaveStyle({
    backgroundColor: theme.colors.secondaryContainer,
  });
  expect(screen.getByTestId('vibrant-selected-container')).toHaveStyle({
    backgroundColor: theme.colors.surfaceContainer,
  });
});

it('gives a disabled, selected IconButton child the disabled treatment instead of its selected color', async () => {
  await render(
    <Toolbar>
      <IconButton
        testID="disabled-selected"
        selected
        disabled
        icon="format-bold"
        onPress={() => {}}
      />
    </Toolbar>
  );

  const theme = getTheme();
  expect(screen.getByTestId('disabled-selected-container')).not.toHaveStyle({
    backgroundColor: theme.colors.secondaryContainer,
  });
});

it("leaves a selected IconButton child's explicit containerColor untouched", async () => {
  await render(
    <Toolbar colorScheme="vibrant">
      <IconButton
        testID="explicit"
        selected
        icon="format-bold"
        containerColor="red"
        onPress={() => {}}
      />
    </Toolbar>
  );

  expect(screen.getByTestId('explicit-container')).toHaveStyle({
    backgroundColor: 'red',
  });
});

it("defaults a mode-less Button child's textColor to the toolbar's content color", async () => {
  await render(
    <>
      <Toolbar>
        <Button testID="standard" onPress={() => {}}>
          Done
        </Button>
      </Toolbar>
      <Toolbar colorScheme="vibrant">
        <Button testID="vibrant" onPress={() => {}}>
          Done
        </Button>
      </Toolbar>
    </>
  );

  const theme = getTheme();
  expect(screen.getByTestId('standard-text')).toHaveStyle({
    color: theme.colors.onSurfaceVariant,
  });
  expect(screen.getByTestId('vibrant-text')).toHaveStyle({
    color: theme.colors.onPrimaryContainer,
  });
});

it('recolors a Button child with an explicit mode="text", same as no mode', async () => {
  await render(
    <Toolbar colorScheme="vibrant">
      <Button testID="text-mode" mode="text" onPress={() => {}}>
        Done
      </Button>
    </Toolbar>
  );

  const theme = getTheme();
  expect(screen.getByTestId('text-mode-text')).toHaveStyle({
    color: theme.colors.onPrimaryContainer,
  });
});

it('leaves a Button child with a more opinionated mode uncolored', async () => {
  const tree = (
    await render(
      <Toolbar colorScheme="vibrant">
        <Button mode="outlined" onPress={() => {}}>
          Done
        </Button>
      </Toolbar>
    )
  ).toJSON();
  expect(tree).toMatchSnapshot();
});

it("leaves a Button child's explicit textColor/buttonColor untouched", async () => {
  await render(
    <Toolbar colorScheme="vibrant">
      <Button testID="explicit-text" textColor="red" onPress={() => {}}>
        Done
      </Button>
      <Button
        testID="explicit-button-color"
        buttonColor="blue"
        onPress={() => {}}
      >
        Done
      </Button>
    </Toolbar>
  );

  expect(screen.getByTestId('explicit-text-text')).toHaveStyle({
    color: 'red',
  });
  expect(screen.getByTestId('explicit-button-color-container')).toHaveStyle({
    backgroundColor: 'blue',
  });
});

// `theme.colors` values are `rgba(r, g, b, 1)` strings convert to hex to
// compare against the design spec's hex values directly.
const toHex = (rgba: unknown) => {
  const [r, g, b] = String(rgba).match(/\d+/g)!.map(Number);
  return (
    '#' +
    [r, g, b]
      .map((n) => n.toString(16).padStart(2, '0'))
      .join('')
      .toUpperCase()
  );
};

describe('color resolution across light/dark themes', () => {
  const light = getTheme(false);
  const dark = getTheme(true);

  it.each([
    ['standard', 'light', 'container', '#F3EDF7'],
    ['standard', 'dark', 'container', '#211F26'],
    ['standard', 'light', 'icon', '#49454F'],
    ['standard', 'dark', 'icon', '#CAC4D0'],
    ['standard', 'light', 'label', '#49454F'],
    ['standard', 'dark', 'label', '#CAC4D0'],
    ['standard', 'light', 'selectedContainer', '#E8DEF8'],
    ['standard', 'dark', 'selectedContainer', '#4A4458'],
    ['standard', 'light', 'selectedIcon', '#1D192B'],
    ['standard', 'dark', 'selectedIcon', '#E8DEF8'],
    ['vibrant', 'light', 'container', '#EADDFF'],
    ['vibrant', 'dark', 'container', '#4F378B'],
    ['vibrant', 'light', 'icon', '#21005D'],
    ['vibrant', 'dark', 'icon', '#EADDFF'],
    ['vibrant', 'light', 'label', '#21005D'],
    ['vibrant', 'dark', 'label', '#EADDFF'],
    ['vibrant', 'light', 'selectedContainer', '#F3EDF7'],
    ['vibrant', 'dark', 'selectedContainer', '#211F26'],
    ['vibrant', 'light', 'selectedIcon', '#1D1B20'],
    ['vibrant', 'dark', 'selectedIcon', '#E6E0E9'],
  ] as Array<[ColorScheme, 'light' | 'dark', Field, string]>)(
    'resolves %s %s %s to %s',
    (colorScheme, mode, field, expectedHex) => {
      const theme = mode === 'dark' ? dark : light;
      const resolved =
        field === 'container'
          ? resolveContainerColor({ theme, colorScheme })
          : field === 'label'
            ? resolveLabelColor({ theme, colorScheme })
            : field === 'selectedContainer'
              ? resolveIconColors({ theme, colorScheme, selected: true })
                  .containerColor
              : field === 'selectedIcon'
                ? resolveIconColors({ theme, colorScheme, selected: true })
                    .iconColor
                : resolveIconColors({ theme, colorScheme, selected: false })
                    .iconColor;

      expect(toHex(resolved)).toBe(expectedHex);
    }
  );
});
