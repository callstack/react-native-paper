import * as Colors from './styles/colors';

export { Colors };

export { useTheme, withTheme, ThemeProvider } from './core/theming';

export { default as Provider } from './core/Provider';
export { default as DefaultTheme } from './styles/DefaultTheme';
export { default as DarkTheme } from './styles/DarkTheme';
export { default as shadow } from './styles/shadow';
export { default as overlay } from './styles/overlay';
export { default as configureFonts } from './styles/fonts';

import * as Avatar from './components/Avatar/Avatar';
import * as List from './components/List/List';
import * as Drawer from './components/Drawer/Drawer';

export { Avatar, List, Drawer };

export { default as Badge, BadgeProps } from './components/Badge';
export {
  default as ActivityIndicator,
  ActivityIndicatorProps,
} from './components/ActivityIndicator';
export { default as Banner, BannerProps } from './components/Banner';
export {
  default as BottomNavigation,
  BottomNavigationProps,
} from './components/BottomNavigation';
export { default as Button, ButtonProps } from './components/Button';
export { default as Card, CardProps } from './components/Card/Card';
export {
  default as Checkbox,
  CheckboxProps,
} from './components/Checkbox/Checkbox';
export { default as Chip, ChipProps } from './components/Chip';
export {
  default as DataTable,
  Props as DataTableProps,
} from './components/DataTable/DataTable';
export { default as Dialog, DialogProps } from './components/Dialog/Dialog';
export { default as Divider, DividerProps } from './components/Divider';
export { default as FAB, FABProps } from './components/FAB/FAB';
export {
  default as HelperText,
  HelperTextProps,
} from './components/HelperText';
export {
  default as IconButton,
  IconButtonProps,
} from './components/IconButton';
export { default as Menu, MenuProps } from './components/Menu/Menu';
export { default as Modal, ModalProps } from './components/Modal';
export { default as Portal, PortalProps } from './components/Portal/Portal';
export {
  default as ProgressBar,
  ProgressBarProps,
} from './components/ProgressBar';
export {
  default as RadioButton,
  RadioButtonProps,
} from './components/RadioButton/RadioButton';
export { default as Searchbar, SearchbarProps } from './components/Searchbar';
export { default as Snackbar, SnackbarProps } from './components/Snackbar';
export { default as Surface, SurfaceProps } from './components/Surface';
export { default as Switch, SwitchProps } from './components/Switch';
export { default as Appbar, AppBarProps } from './components/Appbar/Appbar';
export {
  default as TouchableRipple,
  TouchableRippleProps,
} from './components/TouchableRipple/TouchableRipple';
export {
  default as TextInput,
  TextInputProps,
} from './components/TextInput/TextInput';
export {
  default as ToggleButton,
  ToggleButtonProps,
} from './components/ToggleButton/ToggleButton';

export {
  default as Caption,
  Props as CaptionProps,
} from './components/Typography/Caption';
export {
  default as Headline,
  Props as HeadlineProps,
} from './components/Typography/Headline';
export {
  default as Paragraph,
  Props as ParagraphProps,
} from './components/Typography/Paragraph';
export {
  default as Subheading,
  Props as SubheadingProps,
} from './components/Typography/Subheading';
export {
  default as Title,
  Props as TitleProps,
} from './components/Typography/Title';
export { default as Text, TextProps } from './components/Typography/Text';
