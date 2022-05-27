import * as MD2Colors from './styles/themes/v2/colors';

export { MD3Colors } from './styles/themes/v3/tokens';
export { MD2Colors };

export { useTheme, withTheme, ThemeProvider } from './core/theming';

export { default as MD2LightTheme } from './styles/themes/v2/LightTheme';
export { default as MD2DarkTheme } from './styles/themes/v2/DarkTheme';
export { default as MD3LightTheme } from './styles/themes/v3/LightTheme';
export { default as MD3DarkTheme } from './styles/themes/v3/DarkTheme';

export { default as Provider } from './core/Provider';
export { default as shadow } from './styles/shadow';
export { default as overlay } from './styles/overlay';
export { default as configureFonts } from './styles/fonts';

import * as Avatar from './components/Avatar/Avatar';
import * as List from './components/List/List';
import * as Drawer from './components/Drawer/Drawer';

export { Avatar, List, Drawer };

export * from './components/FAB/AnimatedFAB';

export { default as Badge } from './components/Badge';
export { default as ActivityIndicator } from './components/ActivityIndicator';
export { default as Banner } from './components/Banner';
export { default as BottomNavigation } from './components/BottomNavigation/BottomNavigation';
export { default as Button } from './components/Button/Button';
export { default as Card } from './components/Card/Card';
export { default as Checkbox } from './components/Checkbox';
export { default as Chip } from './components/Chip';
export { default as DataTable } from './components/DataTable/DataTable';
export { default as Dialog } from './components/Dialog/Dialog';
export { default as Divider } from './components/Divider';
export { default as FAB } from './components/FAB';
export { default as AnimatedFAB } from './components/FAB/AnimatedFAB';
export { default as HelperText } from './components/HelperText';
export { default as IconButton } from './components/IconButton';
export { default as Menu } from './components/Menu/Menu';
export { default as Modal } from './components/Modal';
export { default as Portal } from './components/Portal/Portal';
export { default as ProgressBar } from './components/ProgressBar';
export { default as RadioButton } from './components/RadioButton';
export { default as Searchbar } from './components/Searchbar';
export { default as Snackbar } from './components/Snackbar';
export { default as Surface } from './components/Surface';
export { default as Switch } from './components/Switch';
export { default as Appbar } from './components/Appbar';
export { default as TouchableRipple } from './components/TouchableRipple/TouchableRipple';
export { default as TextInput } from './components/TextInput/TextInput';
export { default as ToggleButton } from './components/ToggleButton';

export {
  Caption,
  Headline,
  Paragraph,
  Subheading,
  Title,
} from './components/Typography/v2';
export { default as Text } from './components/Typography/Text';

export type { Theme, ThemeBase, MD3Elevation } from './types';
