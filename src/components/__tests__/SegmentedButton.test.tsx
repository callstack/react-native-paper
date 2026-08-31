import { describe, expect, it, jest } from '@jest/globals';

import { getTheme } from '../../core/theming';
import { render, screen } from '../../test-utils';
import { tokens } from '../../theme/tokens';
import SegmentedButtons from '../SegmentedButtons/SegmentedButtons';
import {
  getDisabledSegmentedButtonStyle,
  getSegmentedButtonColors,
} from '../SegmentedButtons/utils';

const stateOpacity = tokens.md.sys.state.opacity;

it('renders segmented button', async () => {
  const tree = (
    await render(
      <SegmentedButtons
        onValueChange={() => {}}
        value={'walk'}
        buttons={[{ value: 'walk' }, { value: 'ride' }]}
      />
    )
  ).toJSON();

  expect(tree).toMatchSnapshot();
});

it('renders disabled segmented button', async () => {
  const tree = (
    await render(
      <SegmentedButtons
        onValueChange={() => {}}
        value={'walk'}
        buttons={[{ value: 'walk' }, { value: 'ride', disabled: true }]}
      />
    )
  ).toJSON();

  process.nextTick(() => {
    expect(tree).toMatchSnapshot();
  });
});

it('renders checked segmented button with selected check', async () => {
  const tree = (
    await render(
      <SegmentedButtons
        onValueChange={() => {}}
        value={'walk'}
        buttons={[
          { value: 'walk', showSelectedCheck: true },
          { value: 'ride', disabled: true },
        ]}
      />
    )
  ).toJSON();

  process.nextTick(() => {
    expect(tree).toMatchSnapshot();
  });
});

describe('getSegmentedButtonColors', () => {
  const theme = getTheme();

  it.each([
    {
      disabled: false,
      checked: true,
      checkedColor: undefined,
      uncheckedColor: undefined,
      expected: theme.colors.onSecondaryContainer,
    },
    {
      disabled: false,
      checked: false,
      checkedColor: undefined,
      uncheckedColor: undefined,
      expected: theme.colors.onSurface,
    },
    {
      disabled: true,
      checked: true,
      checkedColor: undefined,
      uncheckedColor: undefined,
      expected: theme.colors.onSurface,
    },
    {
      disabled: true,
      checked: false,
      checkedColor: undefined,
      uncheckedColor: undefined,
      expected: theme.colors.onSurface,
    },
    {
      disabled: false,
      checked: true,
      checkedColor: 'a125f5',
      uncheckedColor: undefined,
      expected: 'a125f5',
    },
    {
      disabled: false,
      checked: false,
      checkedColor: undefined,
      uncheckedColor: '000',
      expected: '000',
    },
    {
      disabled: false,
      checked: false,
      checkedColor: 'a125f5',
      uncheckedColor: '000',
      expected: '000',
    },
    {
      disabled: false,
      checked: false,
      checkedColor: 'a125f5',
      uncheckedColor: undefined,
      expected: theme.colors.onSurface,
    },
    {
      disabled: false,
      checked: true,
      checkedColor: undefined,
      uncheckedColor: '000',
      expected: theme.colors.onSecondaryContainer,
    },
  ])(
    'returns $expected when disabled: $disabled, checked: $checked, checkedColor is $checkedColor and uncheckedColor is $uncheckedColor',
    ({ disabled, checked, checkedColor, uncheckedColor, expected }) => {
      expect(
        getSegmentedButtonColors({
          theme,
          disabled,
          checked,
          checkedColor,
          uncheckedColor,
        })
      ).toMatchObject({ textColor: expected });
    }
  );

  it('should return correct background color when checked and theme version 3', () => {
    expect(
      getSegmentedButtonColors({
        theme: getTheme(),
        disabled: false,
        checked: true,
      })
    ).toMatchObject({ backgroundColor: getTheme().colors.secondaryContainer });
  });

  it('should return correct background color when uncheked (V3 & V2)', () => {
    expect(
      getSegmentedButtonColors({
        theme: getTheme(),
        disabled: false,
        checked: false,
      })
    ).toMatchObject({
      backgroundColor: 'transparent',
    });
  });

  it('should return correct border color with theme version 3', () => {
    expect(
      getSegmentedButtonColors({
        theme: getTheme(),
        disabled: false,
        checked: false,
      })
    ).toMatchObject({
      borderColor: getTheme().colors.outline,
    });
  });

  it('should return correct border color when disabled and theme version 3', () => {
    expect(
      getSegmentedButtonColors({
        theme: getTheme(),
        disabled: true,
        checked: false,
      })
    ).toMatchObject({
      borderColor: getTheme().colors.outlineVariant,
    });
  });

  it('should return correct textColor with theme version 3', () => {
    expect(
      getSegmentedButtonColors({
        theme: getTheme(),
        disabled: false,
        checked: false,
      })
    ).toMatchObject({
      textColor: getTheme().colors.onSurface,
    });
  });

  it('should return correct textColor when disabled and theme version 3', () => {
    expect(
      getSegmentedButtonColors({
        theme: getTheme(),
        disabled: true,
        checked: false,
      })
    ).toMatchObject({
      textColor: getTheme().colors.onSurface,
      textOpacity: stateOpacity.disabled,
    });
  });
});

describe('getDisabledSegmentedButtonBorderWidth', () => {
  it('Returns empty style object for all enabled buttons', () => {
    [0, 1, 2].forEach((index) => {
      expect(
        getDisabledSegmentedButtonStyle({
          theme: getTheme(),
          buttons: [
            { disabled: false },
            { disabled: false },
            { disabled: false },
          ],
          index,
        })
      ).toMatchObject({});
    });
  });

  it('Returns empty style object for all disabled buttons', () => {
    [0, 1, 2].forEach((index) => {
      expect(
        getDisabledSegmentedButtonStyle({
          theme: getTheme(),
          buttons: [{ disabled: true }, { disabled: true }, { disabled: true }],
          index,
        })
      ).toMatchObject({});
    });
  });

  it('Returns proper style object for one disabled button', () => {
    expect(
      getDisabledSegmentedButtonStyle({
        theme: getTheme(),
        buttons: [{ disabled: false }, { disabled: true }, { disabled: true }],
        index: 0,
      })
    ).toMatchObject({ borderRightWidth: 1 });
  });

  it('Returns proper style object for two disabled buttons (alternately)', () => {
    [0, 2].forEach((index) => {
      expect(
        getDisabledSegmentedButtonStyle({
          theme: getTheme(),
          buttons: [
            { disabled: false },
            { disabled: true },
            { disabled: false },
            { disabled: true },
          ],
          index,
        })
      ).toMatchObject({ borderRightWidth: 1 });
    });
  });
});

describe('should render icon when', () => {
  it('icon prop is passed', async () => {
    await render(
      <SegmentedButtons
        value={'walk'}
        buttons={[
          {
            icon: 'walk',
            value: 'walk',
            testID: 'walking-button',
          },
          {
            icon: 'car',
            value: 'drive',
            testID: 'driving-button',
          },
        ]}
        onValueChange={() => {}}
      />
    );

    expect(screen.getByTestId('walking-button-icon')).toBeOnTheScreen();
    expect(screen.getByTestId('driving-button-icon')).toBeOnTheScreen();
  });

  it('icon prop is passed along with label, no matter if button is checked', async () => {
    await render(
      <SegmentedButtons
        value={'walk'}
        buttons={[
          {
            icon: 'walk',
            value: 'walk',
            label: 'Walking',
            testID: 'walking-button',
          },
          {
            icon: 'car',
            value: 'drive',
            label: 'Driving',
            testID: 'driving-button',
          },
        ]}
        onValueChange={() => {}}
      />
    );

    expect(screen.getByTestId('walking-button-icon')).toBeOnTheScreen();
    expect(screen.getByTestId('driving-button-icon')).toBeOnTheScreen();
  });

  it('icon prop is passed along with label, button is checked, showSelectedCheck is false', async () => {
    await render(
      <SegmentedButtons
        value={'walk'}
        buttons={[
          {
            icon: 'walk',
            value: 'walk',
            label: 'Walking',
            testID: 'walking-button',
            showSelectedCheck: false,
          },
          {
            icon: 'car',
            value: 'drive',
            label: 'Driving',
            testID: 'driving-button',
            showSelectedCheck: false,
          },
        ]}
        onValueChange={() => {}}
      />
    );

    expect(screen.getByTestId('walking-button-icon')).toBeOnTheScreen();
    expect(screen.getByTestId('driving-button-icon')).toBeOnTheScreen();
  });
});

describe('should not render icon when', () => {
  it('icon prop is not passed', async () => {
    await render(
      <SegmentedButtons
        value={'walk'}
        buttons={[
          {
            value: 'walk',
            testID: 'walking-button',
          },
          {
            value: 'drive',
            testID: 'driving-button',
          },
        ]}
        onValueChange={() => {}}
      />
    );

    expect(screen.queryByTestId('walking-button-icon')).not.toBeOnTheScreen();
    expect(screen.queryByTestId('driving-button-icon')).not.toBeOnTheScreen();
  });

  it('icon prop is passed along with label, button is checked, showSelectedCheck is true', async () => {
    await render(
      <SegmentedButtons
        value={'walk'}
        buttons={[
          {
            icon: 'walk',
            label: 'Walking',
            value: 'walk',
            testID: 'walking-button',
            showSelectedCheck: true,
          },
          {
            icon: 'car',
            label: 'Driving',
            value: 'drive',
            testID: 'driving-button',
            showSelectedCheck: true,
          },
        ]}
        onValueChange={() => {}}
      />
    );

    expect(screen.queryByTestId('walking-button-icon')).not.toBeOnTheScreen();
    expect(screen.getByTestId('walking-button-check-icon')).toBeOnTheScreen();
    expect(screen.getByTestId('driving-button-icon')).toBeOnTheScreen();
  });
});

describe('should have `accessibilityState={ checked: true }` when selected', () => {
  it('should have two button selected', async () => {
    const onValueChange = jest.fn();
    await render(
      <SegmentedButtons<string>
        multiSelect
        value={['walk', 'transit']}
        buttons={[
          { value: 'walk', label: 'Walking' },
          { value: 'transit', label: 'Transit' },
          { value: 'drive', label: 'Driving' },
        ]}
        onValueChange={onValueChange}
      />
    );

    const buttons = screen.getAllByRole('button');

    expect(buttons[0]).toHaveProp(
      'accessibilityState',
      expect.objectContaining({ checked: true })
    );
    expect(buttons[1]).toHaveProp(
      'accessibilityState',
      expect.objectContaining({ checked: true })
    );
    expect(buttons[2]).toHaveProp(
      'accessibilityState',
      expect.objectContaining({ checked: false })
    );
  });

  it('show selected check icon should be shown', async () => {
    const onValueChange = jest.fn();

    await render(
      <SegmentedButtons<string>
        multiSelect
        value={['walk', 'transit']}
        buttons={[
          {
            value: 'walk',
            label: 'Walking',
            showSelectedCheck: true,
            testID: 'walking-check-icon',
          },
          { value: 'transit', label: 'Transit' },
          { value: 'drive', label: 'Driving' },
        ]}
        onValueChange={onValueChange}
      />
    );

    expect(screen.getByTestId('walking-check-icon')).toBeOnTheScreen();
  });
});

describe('labelStyle is handled', () => {
  it('when labelStyle is given', async () => {
    await render(
      <SegmentedButtons
        value={'walk'}
        buttons={[
          {
            label: 'Walking',
            value: 'walk',
            testID: 'walking-button',
            labelStyle: { fontSize: 10 },
          },
          {
            label: 'Driving',
            value: 'drive',
            testID: 'driving-button',
            labelStyle: { fontSize: 12 },
          },
        ]}
        onValueChange={() => {}}
      />
    );

    expect(screen.getByTestId('walking-button-label')).toHaveStyle({
      fontSize: 10,
    });
    expect(screen.getByTestId('driving-button-label')).toHaveStyle({
      fontSize: 12,
    });
  });

  it('when labelStyle is omitted', async () => {
    await render(
      <SegmentedButtons
        value={'walk'}
        buttons={[
          {
            label: 'Walking',
            value: 'walk',
            testID: 'walking-button',
          },
        ]}
        onValueChange={() => {}}
      />
    );

    expect(screen.getByTestId('walking-button-label')).toHaveStyle({
      fontSize: 14,
    });
  });
});
