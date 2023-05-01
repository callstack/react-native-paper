import { getMaxNestedLevel, getUniqueNestedKeys } from '../themeColors';

const Button = {
  active: {
    elevated: {
      backgroundColor: 'theme.colors.elevation.level1',
      color: 'theme.colors.primary',
    },
    contained: {
      backgroundColor: 'theme.colors.primary',
      color: 'theme.colors.onPrimary',
    },
    'contained-tonal': {
      backgroundColor: 'theme.colors.secondaryContainer',
      color: 'theme.colors.onSecondaryContainer',
    },
    outlined: {
      color: 'theme.colors.primary',
      borderColor: 'theme.colors.outline',
    },
    text: {
      color: 'theme.colors.primary',
    },
  },
  disabled: {
    elevated: {
      backgroundColor: 'theme.colors.surfaceDisabled',
      color: 'theme.colors.onSurfaceDisabled',
    },
    contained: {
      backgroundColor: 'theme.colors.surfaceDisabled',
      color: 'theme.colors.onSurfaceDisabled',
    },
    'contained-tonal': {
      backgroundColor: 'theme.colors.surfaceDisabled',
      color: 'theme.colors.onSurfaceDisabled',
    },
    outlined: {
      color: 'theme.colors.onSurfaceDisabled',
      borderColor: 'theme.colors.surfaceDisabled',
    },
    text: {
      color: 'theme.colors.onSurfaceDisabled',
    },
  },
};

const Card = {
  contained: {
    backgroundColor: 'theme.colors.surfaceVariant',
  },
  outlined: {
    backgroundColor: 'theme.colors.surface',
    borderColor: 'theme.colors.outline',
  },
};

const Custom = {
  active: {
    contained: {
      pressed: {
        backgroundColor: 'theme.colors.primary',
      },
    },
    outlined: {
      backgroundColor: 'theme.colors.surface',
    },
  },
};

describe('getUniqueNestedKeys', () => {
  it('should return an array of unique keys for flat structure', () => {
    expect(getUniqueNestedKeys(Card)).toEqual([
      'backgroundColor',
      'borderColor',
    ]);
  });

  it('should return an array of unique keys for nested structure', () => {
    expect(getUniqueNestedKeys(Button)).toEqual([
      'backgroundColor',
      'color',
      'borderColor',
    ]);
  });

  it('should return an empty array if data object is empty', () => {
    expect(getUniqueNestedKeys({})).toEqual([]);
  });
});

describe('getMaxNestedLevel', () => {
  it('should return the correct nesting level', () => {
    const buttonLevel = getMaxNestedLevel(Button);
    const cardLevel = getMaxNestedLevel(Card);

    expect(buttonLevel).toEqual(2);
    expect(cardLevel).toEqual(1);
  });

  it('should return 0 if the object is not nested', () => {
    const level = getMaxNestedLevel({
      foo: 'bar',
    });
    expect(level).toEqual(0);
  });

  it('should handle nested objects at different levels', () => {
    const level = getMaxNestedLevel(Custom);
    expect(level).toEqual(3);
  });
});
