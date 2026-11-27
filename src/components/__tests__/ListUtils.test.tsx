import { expect, it } from '@jest/globals';

import { LightTheme } from '../../theme/schemes';
import { getAccessoryStyles, getListColors } from '../List/utils';
import Text from '../Typography/Text';

const accessoryStyle = {
  marginLeft: 16,
  marginRight: 0,
  alignSelf: 'center',
};

const description = <Text>Test</Text>;

it('returns accessory styles without description', () => {
  const style = getAccessoryStyles(false, null);
  expect(style).toStrictEqual({ ...accessoryStyle, marginVertical: 0 });
});

it('returns accessory styles aligned to the top for a multiline description', () => {
  const style = getAccessoryStyles(true, description);
  expect(style).toStrictEqual({
    ...accessoryStyle,
    alignSelf: 'flex-start',
  });
});

it.each([
  [
    'an enabled row',
    {},
    {
      titleColor: LightTheme.colors.onSurface,
      descriptionColor: LightTheme.colors.onSurfaceVariant,
      leadingIconColor: LightTheme.colors.onSurfaceVariant,
      trailingIconColor: LightTheme.colors.onSurfaceVariant,
      expandIconColor: LightTheme.colors.onSurface,
    },
  ],
  [
    'a selected row',
    { selected: true },
    {
      titleColor: LightTheme.colors.onSecondaryContainer,
      descriptionColor: LightTheme.colors.onSecondaryContainer,
      leadingIconColor: LightTheme.colors.onSecondaryContainer,
      trailingIconColor: LightTheme.colors.onSecondaryContainer,
      expandIconColor: LightTheme.colors.onSecondaryContainer,
    },
  ],
  [
    'a selected, disabled row',
    { selected: true, disabled: true },
    {
      titleColor: LightTheme.colors.onSurface,
      descriptionColor: LightTheme.colors.onSurface,
      leadingIconColor: LightTheme.colors.onSurface,
      trailingIconColor: LightTheme.colors.onSurface,
      expandIconColor: LightTheme.colors.onSurface,
    },
  ],
])('returns the colors for %s', (_label, state, colors) => {
  expect(getListColors({ theme: LightTheme, ...state })).toStrictEqual(colors);
});
