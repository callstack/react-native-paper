import * as React from 'react';
import type { ColorValue } from 'react-native';

import { expect, it } from '@jest/globals';

import {
  Appbar,
  Avatar,
  BottomNavigation,
  Checkbox,
  ProgressBar,
  RadioButton,
  SegmentedButtons,
  TouchableRipple,
} from '../../index';
import { render } from '../../test-utils';

it('color props accept ColorValue across components (#5179)', async () => {
  const sampleColor: ColorValue = '#123456';

  await render(<ProgressBar progress={0.5} color={sampleColor} />);
  await render(<Appbar.Content title="Title" color={sampleColor} />);
  await render(<Avatar.Icon icon="star" color={sampleColor} />);
  await render(<Avatar.Text label="AT" color={sampleColor} />);
  await render(
    <TouchableRipple underlayColor={sampleColor}>
      <React.Fragment />
    </TouchableRipple>
  );
  await render(
    <BottomNavigation.Bar
      navigationState={{
        index: 0,
        routes: [{ key: 'tab', title: 'Tab' }],
      }}
      renderIcon={() => null}
      onTabPress={() => {}}
      activeColor={sampleColor}
      inactiveColor={sampleColor}
    />
  );
  await render(
    <SegmentedButtons
      value="1"
      onValueChange={() => {}}
      buttons={[
        {
          value: '1',
          label: 'One',
          checkedColor: sampleColor,
          uncheckedColor: sampleColor,
        },
      ]}
    />
  );
  await render(
    <RadioButton
      value="opt"
      status="checked"
      color={sampleColor}
      uncheckedColor={sampleColor}
    />
  );
  await render(
    <RadioButton.Item
      label="Option"
      value="opt"
      status="checked"
      color={sampleColor}
      uncheckedColor={sampleColor}
    />
  );
  await render(
    <Checkbox.Item
      label="Checkbox"
      status="checked"
      color={sampleColor}
      uncheckedColor={sampleColor}
    />
  );

  expect(true).toBe(true);
});
