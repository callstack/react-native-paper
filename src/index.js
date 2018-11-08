/* @flow */

import * as Colors from './styles/colors';
import type { Theme as _Theme } from './types';

export type Theme = _Theme;

export { Colors };

export { withTheme, ThemeProvider } from './core/theming';

export { default as Provider } from './core/Provider';
export { default as DefaultTheme } from './styles/DefaultTheme';
export { default as DarkTheme } from './styles/DarkTheme';

import * as List from './components/List/List';
import * as Drawer from './components/Drawer/Drawer';

export { List, Drawer };

export { default as Banner } from './components/Banner';
export { default as BottomNavigation } from './components/BottomNavigation';
export { default as Button } from './components/Button';
export { default as Card } from './components/Card/Card';
export { default as Checkbox } from './components/Checkbox';
export { default as Chip } from './components/Chip';
export { default as Dialog } from './components/Dialog/Dialog';
export { default as Divider } from './components/Divider';
export { default as FAB } from './components/FAB/FAB';
export { default as HelperText } from './components/HelperText';
export { default as IconButton } from './components/IconButton';
export { default as Modal } from './components/Modal';
export { default as Portal } from './components/Portal/Portal';
export { default as ProgressBar } from './components/ProgressBar/ProgressBar';
export { default as RadioButton } from './components/RadioButton';
export { default as Searchbar } from './components/Searchbar';
export { default as Snackbar } from './components/Snackbar';
export { default as Surface } from './components/Surface';
export { default as Switch } from './components/Switch';
export { default as Appbar } from './components/Appbar/Appbar';
export { default as TouchableRipple } from './components/TouchableRipple';
export { default as TextInput } from './components/TextInput';

export { default as Caption } from './components/Typography/Caption';
export { default as Headline } from './components/Typography/Headline';
export { default as Paragraph } from './components/Typography/Paragraph';
export { default as Subheading } from './components/Typography/Subheading';
export { default as Title } from './components/Typography/Title';
export { default as Text } from './components/Typography/Text';
