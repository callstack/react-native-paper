import * as React from 'react';
import renderer from 'react-test-renderer';
import SegmentedButton from '../SegmentedButton';
import { getSegmentedButtonColors } from '../SegmentedButton/utils';
import { getTheme } from '../../core/theming';
import { black } from '../../styles/themes/v2/colors';
import color from 'color';

it('renders segmented button', () => {
  const tree = renderer
    .create(<SegmentedButton status="checked" onPress={() => {}} icon="walk" />)
    .toJSON();

  expect(tree).toMatchSnapshot();
});

it('renders disabled segmented button', () => {
  const tree = renderer
    .create(
      <SegmentedButton
        disabled
        value="toggle"
        onValueChange={() => {}}
        icon="walk"
      />
    )
    .toJSON();

  expect(tree).toMatchSnapshot();
});

it('renders checked segmented button with selected check', () => {
  const tree = renderer
    .create(
      <SegmentedButton
        value="toggle"
        status="checked"
        showSelectedCheck
        onValueChange={() => {}}
        icon="walk"
      />
    )
    .toJSON();

  expect(tree).toMatchSnapshot();
});

it('renders segmented button with a group', () => {
  const tree = renderer
    .create(
      <SegmentedButton.Group>
        <SegmentedButton
          value="walk"
          status="checked"
          showSelectedCheck
          icon="walk"
        />
        <SegmentedButton disabled value="ride" showSelectedCheck icon="ride" />
      </SegmentedButton.Group>
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
