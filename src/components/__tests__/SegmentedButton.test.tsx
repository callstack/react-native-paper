import * as React from 'react';

import { render } from '@testing-library/react-native';
import color from 'color';

import { getTheme } from '../../core/theming';
import { black } from '../../styles/themes/v2/colors';
import SegmentedButtons from '../SegmentedButtons/SegmentedButtons';
import {
  getDisabledSegmentedButtonStyle,
  getSegmentedButtonColors,
} from '../SegmentedButtons/utils';

it('renders segmented button', () => {
  const tree = render(
    <SegmentedButtons
      onValueChange={() => {}}
      value={'walk'}
      buttons={[{ value: 'walk' }, { value: 'ride' }]}
    />
  ).toJSON();

  expect(tree).toMatchSnapshot();
});

it('renders disabled segmented button', async () => {
  const tree = render(
    <SegmentedButtons
      onValueChange={() => {}}
      value={'walk'}
      buttons={[{ value: 'walk' }, { value: 'ride', disabled: true }]}
    />
  ).toJSON();

  process.nextTick(() => {
    expect(tree).toMatchSnapshot();
  });
});

it('renders checked segmented button with selected check', async () => {
  const tree = render(
    <SegmentedButtons
      onValueChange={() => {}}
      value={'walk'}
      buttons={[
        { value: 'walk', showSelectedCheck: true },
        { value: 'ride', disabled: true },
      ]}
    />
  ).toJSON();

  process.nextTick(() => {
    expect(tree).toMatchSnapshot();
  });
});

describe('getSegmentedButtonColors', () => {
  it.each`
    theme                     | disabled | checked  | checkedColor | uncheckedColor | expected
    ${getTheme()}             | ${false} | ${true}  | ${undefined} | ${undefined}   | ${getTheme().colors.onSecondaryContainer}
    ${getTheme()}             | ${false} | ${false} | ${undefined} | ${undefined}   | ${getTheme().colors.onSurface}
    ${getTheme()}             | ${true}  | ${true}  | ${undefined} | ${undefined}   | ${getTheme().colors.onSurfaceDisabled}
    ${getTheme()}             | ${true}  | ${false} | ${undefined} | ${undefined}   | ${getTheme().colors.onSurfaceDisabled}
    ${getTheme()}             | ${false} | ${true}  | ${'a125f5'}  | ${undefined}   | ${'a125f5'}
    ${getTheme()}             | ${false} | ${false} | ${undefined} | ${'000'}       | ${'000'}
    ${getTheme()}             | ${false} | ${false} | ${'a125f5'}  | ${'000'}       | ${'000'}
    ${getTheme()}             | ${false} | ${false} | ${'a125f5'}  | ${undefined}   | ${getTheme().colors.onSurface}
    ${getTheme()}             | ${false} | ${true}  | ${undefined} | ${'000'}       | ${getTheme().colors.onSecondaryContainer}
    ${getTheme(false, false)} | ${false} | ${false} | ${undefined} | ${undefined}   | ${getTheme(false, false).colors.primary}
    ${getTheme(false, false)} | ${false} | ${true}  | ${undefined} | ${undefined}   | ${getTheme(false, false).colors.primary}
    ${getTheme(false, false)} | ${true}  | ${false} | ${undefined} | ${undefined}   | ${getTheme(false, false).colors.disabled}
    ${getTheme(false, false)} | ${true}  | ${true}  | ${undefined} | ${undefined}   | ${getTheme(false, false).colors.disabled}
    ${getTheme(false, false)} | ${false} | ${false} | ${'a125f5'}  | ${undefined}   | ${getTheme(false, false).colors.primary}
    ${getTheme(false, false)} | ${false} | ${true}  | ${undefined} | ${'000'}       | ${getTheme(false, false).colors.primary}
  `(
    'returns $expected when disabled: $disabled, checked: $checked, checkedColor is $checkedColor and uncheckedColor is $uncheckedColor  and isV3: $theme.isV3',
    ({ theme, disabled, checked, checkedColor, uncheckedColor, expected }) => {
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

  it('should return correct background color when checked and theme version 2', () => {
    expect(
      getSegmentedButtonColors({
        theme: getTheme(false, false),
        disabled: false,
        checked: true,
      })
    ).toMatchObject({
      backgroundColor: color(getTheme(false, false).colors.primary)
        .alpha(0.12)
        .rgb()
        .string(),
    });
  });

  it('should return correct background color when uncheked (V3 & V2)', () => {
    expect(
      getSegmentedButtonColors({
        theme: getTheme(false, false),
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

  it('should return correct border color with theme version 2', () => {
    expect(
      getSegmentedButtonColors({
        theme: getTheme(false, false),
        disabled: false,
        checked: false,
      })
    ).toMatchObject({
      borderColor: color(black).alpha(0.29).rgb().string(),
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
      borderColor: getTheme().colors.surfaceDisabled,
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

  it('should return correct textColor with theme version 2', () => {
    expect(
      getSegmentedButtonColors({
        theme: getTheme(false, false),
        disabled: false,
        checked: false,
      })
    ).toMatchObject({
      textColor: getTheme(false, false).colors.primary,
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
      textColor: getTheme().colors.onSurfaceDisabled,
    });
  });

  it('should return correct textColor when disabled and theme version 2', () => {
    expect(
      getSegmentedButtonColors({
        theme: getTheme(false, false),
        disabled: true,
        checked: false,
      })
    ).toMatchObject({
      textColor: getTheme(false, false).colors.disabled,
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
  it('icon prop is passed', () => {
    const { getByTestId } = render(
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

    expect(getByTestId('walking-button-icon')).toBeTruthy();
    expect(getByTestId('driving-button-icon')).toBeTruthy();
  });

  it('icon prop is passed along with label, no matter if button is checked', () => {
    const { getByTestId } = render(
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

    expect(getByTestId('walking-button-icon')).toBeTruthy();
    expect(getByTestId('driving-button-icon')).toBeTruthy();
  });

  it('icon prop is passed along with label, button is checked, showSelectedCheck is false', () => {
    const { getByTestId } = render(
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

    expect(getByTestId('walking-button-icon')).toBeTruthy();
    expect(getByTestId('driving-button-icon')).toBeTruthy();
  });
});

describe('should not render icon when', () => {
  it('icon prop is not passed', () => {
    const { queryByTestId } = render(
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

    expect(queryByTestId('walking-button-icon')).toBeNull();
    expect(queryByTestId('driving-button-icon')).toBeNull();
  });

  it('icon prop is passed along with label, button is checked, showSelectedCheck is true', () => {
    const { getByTestId, queryByTestId } = render(
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

    expect(queryByTestId('walking-button-icon')).toBeNull();
    expect(getByTestId('walking-button-check-icon')).toBeTruthy();
    expect(getByTestId('driving-button-icon')).toBeTruthy();
  });
});

describe('should have `accessibilityState={ checked: true }` when selected', () => {
  it('should have two button selected', () => {
    const onValueChange = jest.fn();
    const { getAllByA11yState } = render(
      <SegmentedButtons
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

    const checkedButtons = getAllByA11yState({ checked: true });
    expect(checkedButtons).toHaveLength(2);
  });

  it('show selected check icon should be shown', () => {
    const onValueChange = jest.fn();

    const { getByTestId } = render(
      <SegmentedButtons
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

    expect(getByTestId('walking-check-icon')).toBeDefined();
  });
});

describe('labelStyle is handled', () => {
  it('when labelStyle is given', () => {
    const { getByTestId } = render(
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

    expect(getByTestId('walking-button-label')).toHaveStyle({ fontSize: 10 });
    expect(getByTestId('driving-button-label')).toHaveStyle({ fontSize: 12 });
  });

  it('when labelStyle is omitted', () => {
    const { getByTestId } = render(
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

    expect(getByTestId('walking-button-label')).toHaveStyle({ fontSize: 14 });
  });
});
