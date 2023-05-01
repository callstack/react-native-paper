const themeColors = {
  IconButton: {
    selected: {
      default: {
        iconColor: 'theme.colors.primary',
      },
      outlined: {
        backgroundColor: 'theme.colors.inverseSurface',
        iconColor: 'theme.colors.inverseOnSurface',
      },
      contained: {
        backgroundColor: 'theme.colors.primary',
        iconColor: 'theme.colors.onPrimary',
      },
      'contained-tonal': {
        backgroundColor: 'theme.colors.secondaryContainer',
        iconColor: 'theme.colors.onSecondaryContainer',
      },
    },
    unselected: {
      default: {
        iconColor: 'theme.colors.onSurfaceVariant',
      },
      outlined: {
        iconColor: 'theme.colors.onSurfaceVariant',
        borderColor: 'theme.colors.outline',
      },
      contained: {
        backgroundColor: 'theme.colors.surfaceVariant',
        iconColor: 'theme.colors.primary',
      },
      'contained-tonal': {
        backgroundColor: 'theme.colors.surfaceVariant',
        iconColor: 'theme.colors.onSurfaceVariant',
      },
    },
    disabled: {
      default: {
        iconColor: 'theme.colors.onSurfaceDisabled',
      },
      outlined: {
        backgroundColor: 'theme.colors.surfaceDisabled',
        iconColor: 'theme.colors.onSurfaceDisabled',
        borderColor: 'theme.colors.surfaceDisabled',
      },
      contained: {
        backgroundColor: 'theme.colors.surfaceDisabled',
        iconColor: 'theme.colors.onSurfaceDisabled',
      },
      'contained-tonal': {
        backgroundColor: 'theme.colors.surfaceDisabled',
        iconColor: 'theme.colors.onSurfaceDisabled',
      },
    },
  },
  Button: {
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
  },
  Card: {
    contained: {
      backgroundColor: 'theme.colors.surfaceVariant',
    },
    elevated: {
      backgroundColor: 'theme.colors.elevation.level1',
    },
    outlined: {
      backgroundColor: 'theme.colors.surface',
      borderColor: 'theme.colors.outline',
    },
  },
};

module.exports = {
  themeColors,
};
