const themeColors = {
  ActivityIndicator: {
    '-': {
      borderColor: 'theme.colors.primary',
    },
  },
  Appbar: {
    default: {
      backgroundColor: 'theme.colors.surface',
    },
    elevated: {
      backgroundColor: 'theme.colors.elevation.level2',
    },
  },
  'Appbar.Action': {
    'leading icon': {
      iconColor: 'theme.colors.onSurface',
    },
    'not leading icon': {
      iconColor: 'theme.colors.onSurfaceVariant',
    },
  },
  'Appbar.Content': {
    '-': {
      textColor: 'theme.colors.onSurface',
    },
  },
  'Appbar.Header': {
    default: {
      backgroundColor: 'theme.colors.surface',
    },
    elevated: {
      backgroundColor: 'theme.colors.elevation.level2',
    },
  },
  Banner: {
    '-': {
      textColor: 'theme.colors.onSurface',
      'action textColor': 'theme.colors.primary',
    },
  },
  Badge: {
    '-': {
      backgroundColor: 'theme.colors.error',
      textColor: 'theme.colors.onError',
    },
  },
  Button: {
    active: {
      elevated: {
        backgroundColor: 'theme.colors.elevation.level1',
        textColor: 'theme.colors.primary',
      },
      contained: {
        backgroundColor: 'theme.colors.primary',
        textColor: 'theme.colors.onPrimary',
      },
      'contained-tonal': {
        backgroundColor: 'theme.colors.secondaryContainer',
        textColor: 'theme.colors.onSecondaryContainer',
      },
      outlined: {
        textColor: 'theme.colors.primary',
        borderColor: 'theme.colors.outline',
      },
      text: {
        textColor: 'theme.colors.primary',
      },
    },
    disabled: {
      elevated: {
        backgroundColor: 'theme.colors.surfaceDisabled',
        textColor: 'theme.colors.onSurfaceDisabled',
      },
      contained: {
        backgroundColor: 'theme.colors.surfaceDisabled',
        textColor: 'theme.colors.onSurfaceDisabled',
      },
      'contained-tonal': {
        backgroundColor: 'theme.colors.surfaceDisabled',
        textColor: 'theme.colors.onSurfaceDisabled',
      },
      outlined: {
        textColor: 'theme.colors.onSurfaceDisabled',
        borderColor: 'theme.colors.surfaceDisabled',
      },
      text: {
        textColor: 'theme.colors.onSurfaceDisabled',
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
  Dialog: {
    '-': {
      backgroundColor: 'theme.colors.elevation.level3',
    },
  },
  'Dialog.Icon': {
    '-': {
      iconColor: 'theme.colors.secondary',
    },
  },
  'Dialog.ScrollArea': {
    '-': {
      borderColor: 'theme.colors.surfaceVariant',
    },
  },
  Divider: {
    '-': {
      dividerColor: 'theme.colors.outlineVariant',
    },
  },
  'Drawer.CollapsedItem': {
    active: {
      backgroundColor: 'theme.colors.secondaryContainer',
      textColor: 'theme.colors.onSurface',
      iconColor: 'theme.colors.onSecondaryContainer',
    },
    inactive: {
      textColor: 'theme.colors.onSurfaceVariant',
      iconColor: 'theme.colors.onSurfaceVariant',
    },
  },
  'Drawer.Item': {
    active: {
      backgroundColor: 'theme.colors.secondaryContainer',
      'iconColor/textColor': 'theme.colors.onSecondaryContainer',
    },
    inactive: {
      'iconColor/textColor': 'theme.colors.onSurfaceVariant',
    },
  },
  'Drawer.Section': {
    '-': {
      titleColor: 'theme.colors.onSurfaceVariant',
    },
  },
  FAB: {
    disabled: {
      backgroundColor: 'theme.colors.surfaceDisabled',
      'textColor/iconColor': 'theme.colors.onSurfaceDisabled',
    },
    primary: {
      backgroundColor: 'theme.colors.primaryContainer',
      'textColor/iconColor': 'theme.colors.onPrimaryContainer',
    },
    secondary: {
      backgroundColor: 'theme.colors.secondaryContainer',
      'textColor/iconColor': 'theme.colors.onSecondaryContainer',
    },
    tertiary: {
      backgroundColor: 'theme.colors.tertiaryContainer',
      'textColor/iconColor': 'theme.colors.onTertiaryContainer',
    },
    surface: {
      backgroundColor: 'theme.colors.elevarion.level3',
      'textColor/iconColor': 'theme.colors.primary',
    },
  },
  AnimatedFAB: {
    disabled: {
      backgroundColor: 'theme.colors.surfaceDisabled',
      'textColor/iconColor': 'theme.colors.onSurfaceDisabled',
    },
    primary: {
      backgroundColor: 'theme.colors.primaryContainer',
      'textColor/iconColor': 'theme.colors.onPrimaryContainer',
    },
    secondary: {
      backgroundColor: 'theme.colors.secondaryContainer',
      'textColor/iconColor': 'theme.colors.onSecondaryContainer',
    },
    tertiary: {
      backgroundColor: 'theme.colors.tertiaryContainer',
      'textColor/iconColor': 'theme.colors.onTertiaryContainer',
    },
    surface: {
      backgroundColor: 'theme.colors.elevarion.level3',
      'textColor/iconColor': 'theme.colors.primary',
    },
  },
  HelperText: {
    disabled: {
      textColor: 'theme.colors.onSurfaceDisabled',
    },
    default: {
      textColor: 'theme.colors.onSurfaceVariant',
    },
    error: {
      textColor: 'theme.colors.error',
    },
  },
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
  Menu: {
    '-': {
      backgroundColor: 'theme.colors.elevation.level2',
    },
  },
  'Menu.Item': {
    default: {
      textColor: 'theme.colors.onSurface',
      iconColor: 'theme.colors.onSurfaceVariant',
    },
    disabled: {
      textColor: 'theme.colors.onSurfaceDisabled',
      iconColor: 'theme.colors.onSurfaceDisabled',
    },
  },
  Modal: {
    '-': {
      backgroundColor: 'theme.colors.backdrop',
    },
  },
  ProgressBar: {
    '-': {
      tintColor: 'theme.colors.primary',
      trackTintColor: 'theme.colors.surfaceVariant',
    },
  },
  Searchbar: {
    '-': {
      backgroundColor: 'theme.colors.elevation.level3',
      placeholderTextColor: 'theme.colors.onSurface',
      textColor: 'theme.colors.onSurfaceVariant',
      selectionColor: 'theme.colors.primary',
      iconColor: 'theme.colors.onSurfaceVariant',
      trailingIconColor: 'theme.colors.onSurfaceVariant',
      dividerColor: 'theme.colors.outline',
    },
  },
  SegmentedButtons: {
    checked: {
      '-': {
        backgroundColor: 'theme.colors.secondaryContainer',
        textColor: 'theme.colors.onSecondaryContainer',
        borderColor: 'theme.colors.primary',
      },
    },
    unchecked: {
      '-': {
        textColor: 'theme.colors.onSurface',
        borderColor: 'theme.colors.outline',
      },
    },
    disabled: {
      '-': {
        borderColor: 'theme.colors.surfaceDisabled',
        textColor: 'theme.colors.onSurfaceDisabled',
      },
    },
  },
  Snackbar: {
    '-': {
      iconColor: 'theme.colors.inverseOnSurface',
    },
  },
  Surface: {
    flat: {
      backgroundColor: 'theme.colors.elevation[elevation]',
    },
    elevated: {
      backgroundColor: 'theme.colors.elevation[elevation]',
    },
  },
  Text: {
    '-': {
      textColor: 'theme.colors.onSurface',
    },
  },
  Tooltip: {
    '-': {
      backgroundColor: 'theme.colors.onSurface',
      textColor: 'theme.colors.surface',
    },
  },
};

module.exports = {
  themeColors,
};
