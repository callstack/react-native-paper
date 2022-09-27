import * as React from 'react';

import { render } from '@testing-library/react-native';
import color from 'color';
import renderer from 'react-test-renderer';

import { getTheme } from '../../core/theming';
import { black } from '../../styles/themes/v2/colors';
import SegmentedButtons from '../SegmentedButtons/SegmentedButtons';
import {
  getDisabledSegmentedButtonStyle,
  getSegmentedButtonColors,
} from '../SegmentedButtons/utils';

it('renders segmented button', () => {
  const tree = renderer
    .create(
      <SegmentedButtons
        onValueChange={() => {}}
        value={'walk'}
        buttons={[{ value: 'walk' }, { value: 'ride' }]}
      />
    )
    .toJSON();

  expect(tree).toMatchSnapshot();
});

it('renders disabled segmented button', () => {
  const tree = renderer
    .create(
      <SegmentedButtons
        onValueChange={() => {}}
        value={'walk'}
        buttons={[{ value: 'walk' }, { value: 'ride', disabled: true }]}
      />
    )
    .toJSON();

  expect(tree).toMatchSnapshot();
});

it('renders checked segmented button with selected check', () => {
  const tree = renderer
    .create(
      <SegmentedButtons
        onValueChange={() => {}}
        value={'walk'}
        buttons={[
          { value: 'walk', showSelectedCheck: true },
          { value: 'ride', disabled: true },
        ]}
      />
    )
    .toJSON();

  expect(tree).toMatchSnapshot();
});

describe('getSegmentedButtonColors', () => {
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
