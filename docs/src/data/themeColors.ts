/**
 * Theme color roles rendered by each component, surfaced in the docs as
 * `<ThemeColorsTable />`.
 *
 * Top-level keys must match the generated page title (see
 * `component-docs-plugin/generatePageMDX.ts`), which is the component's
 * `displayName` - e.g. `FAB.Extended` is titled `Extended`.
 *
 * Values must reference roles that exist on `ThemeColors`
 * (`src/theme/types/color.ts`). Disabled states no longer have dedicated
 * roles - components draw them from `onSurface` at a reduced opacity.
 */
export const themeColors = {
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
      backgroundColor: 'theme.colors.surfaceContainer',
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
      backgroundColor: 'theme.colors.surfaceContainer',
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
        backgroundColor: 'theme.colors.surfaceContainerLow',
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
        borderColor: 'theme.colors.outlineVariant',
      },
      text: {
        textColor: 'theme.colors.primary',
      },
    },
    disabled: {
      elevated: {
        backgroundColor: 'theme.colors.onSurface (10% opacity)',
        textColor: 'theme.colors.onSurface (38% opacity)',
      },
      contained: {
        backgroundColor: 'theme.colors.onSurface (10% opacity)',
        textColor: 'theme.colors.onSurface (38% opacity)',
      },
      'contained-tonal': {
        backgroundColor: 'theme.colors.onSurface (10% opacity)',
        textColor: 'theme.colors.onSurface (38% opacity)',
      },
      outlined: {
        backgroundColor: 'transparent',
        textColor: 'theme.colors.onSurface (38% opacity)',
        borderColor: 'theme.colors.outlineVariant',
      },
      text: {
        backgroundColor: 'transparent',
        textColor: 'theme.colors.onSurface (38% opacity)',
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
      backgroundColor: 'theme.colors.surfaceContainerHigh',
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
    focused: {
      focusIndicatorColor: 'theme.colors.secondary',
    },
  },
  'Drawer.Section': {
    '-': {
      titleColor: 'theme.colors.onSurfaceVariant',
      dividerColor: 'theme.colors.outlineVariant',
    },
  },
  FAB: {
    primary: {
      backgroundColor: 'theme.colors.primary',
      'textColor/iconColor': 'theme.colors.onPrimary',
    },
    secondary: {
      backgroundColor: 'theme.colors.secondary',
      'textColor/iconColor': 'theme.colors.onSecondary',
    },
    tertiary: {
      backgroundColor: 'theme.colors.tertiary',
      'textColor/iconColor': 'theme.colors.onTertiary',
    },
    tonalPrimary: {
      backgroundColor: 'theme.colors.primaryContainer',
      'textColor/iconColor': 'theme.colors.onPrimaryContainer',
    },
    tonalSecondary: {
      backgroundColor: 'theme.colors.secondaryContainer',
      'textColor/iconColor': 'theme.colors.onSecondaryContainer',
    },
    tonalTertiary: {
      backgroundColor: 'theme.colors.tertiaryContainer',
      'textColor/iconColor': 'theme.colors.onTertiaryContainer',
    },
  },
  // `FAB.Extended`
  Extended: {
    primary: {
      backgroundColor: 'theme.colors.primary',
      'textColor/iconColor': 'theme.colors.onPrimary',
    },
    secondary: {
      backgroundColor: 'theme.colors.secondary',
      'textColor/iconColor': 'theme.colors.onSecondary',
    },
    tertiary: {
      backgroundColor: 'theme.colors.tertiary',
      'textColor/iconColor': 'theme.colors.onTertiary',
    },
    tonalPrimary: {
      backgroundColor: 'theme.colors.primaryContainer',
      'textColor/iconColor': 'theme.colors.onPrimaryContainer',
    },
    tonalSecondary: {
      backgroundColor: 'theme.colors.secondaryContainer',
      'textColor/iconColor': 'theme.colors.onSecondaryContainer',
    },
    tonalTertiary: {
      backgroundColor: 'theme.colors.tertiaryContainer',
      'textColor/iconColor': 'theme.colors.onTertiaryContainer',
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
        borderColor: 'theme.colors.outlineVariant',
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
        iconColor: 'theme.colors.onSurface (38% opacity)',
      },
      outlined: {
        iconColor: 'theme.colors.onSurface (38% opacity)',
        borderColor: 'theme.colors.outlineVariant',
      },
      contained: {
        backgroundColor: 'theme.colors.onSurface (38% opacity)',
        iconColor: 'theme.colors.onSurface (38% opacity)',
      },
      'contained-tonal': {
        backgroundColor: 'theme.colors.onSurface (38% opacity)',
        iconColor: 'theme.colors.onSurface (38% opacity)',
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
      textColor: 'theme.colors.onSurface (38% opacity)',
      iconColor: 'theme.colors.onSurfaceVariant (38% opacity)',
    },
  },
  Modal: {
    '-': {
      backdropColor: 'theme.colors.scrim (32% opacity)',
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
      backgroundColor: 'theme.colors.surfaceContainerHigh',
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
        borderColor: 'theme.colors.outline',
      },
    },
    unchecked: {
      '-': {
        backgroundColor: 'transparent',
        textColor: 'theme.colors.onSurface',
        borderColor: 'theme.colors.outline',
      },
    },
    disabled: {
      '-': {
        borderColor: 'theme.colors.outlineVariant',
        textColor: 'theme.colors.onSurface (38% opacity)',
      },
    },
  },
  Snackbar: {
    '-': {
      backgroundColor: 'theme.colors.inverseSurface',
      textColor: 'theme.colors.inverseOnSurface',
      'action textColor': 'theme.colors.inversePrimary',
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
