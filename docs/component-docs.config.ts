import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { extendedExamples } from './src/data/extendedExamples.ts';
import { screenshots } from './src/data/screenshots.ts';
import { themeColors } from './src/data/themeColors.ts';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export type Pages = Record<string, string | Record<string, string>>;

type ComponentDocsConfig = {
  docsRootDir: string;
  libsRootDir: string;
  pages: Pages;
  customFields: {
    moreExamples: Record<string, Record<string, string>>;
    knownIssues: Record<string, Record<string, string>>;
    themeColors: Record<string, unknown>;
    screenshots: Record<string, unknown>;
    extendedExamples: Record<string, unknown>;
  };
};

const pages = {
  ActivityIndicator: 'ActivityIndicator',
  Appbar: {
    Appbar: 'Appbar/Appbar',
    AppbarAction: 'Appbar/AppbarAction',
    AppbarBackAction: 'Appbar/AppbarBackAction',
    AppbarContent: 'Appbar/AppbarContent',
    AppbarHeader: 'Appbar/AppbarHeader',
  },
  Avatar: {
    AvatarIcon: 'Avatar/AvatarIcon',
    AvatarImage: 'Avatar/AvatarImage',
    AvatarText: 'Avatar/AvatarText',
  },
  Badge: 'Badge',
  Banner: 'Banner',
  BottomNavigation: {
    BottomNavigation: 'BottomNavigation/BottomNavigation',
    BottomNavigationBar: 'BottomNavigation/BottomNavigationBar',
  },
  Button: {
    Button: 'Button/Button',
  },
  Card: {
    Card: 'Card/Card',
    CardActions: 'Card/CardActions',
    CardContent: 'Card/CardContent',
    CardCover: 'Card/CardCover',
    CardTitle: 'Card/CardTitle',
  },
  Checkbox: {
    Checkbox: 'Checkbox/Checkbox',
    CheckboxItem: 'Checkbox/CheckboxItem',
  },
  Chip: {
    Chip: 'Chip/Chip',
  },
  DataTable: {
    DataTable: 'DataTable/DataTable',
    DataTableCell: 'DataTable/DataTableCell',
    DataTableHeader: 'DataTable/DataTableHeader',
    DataTablePagination: 'DataTable/DataTablePagination',
    DataTableRow: 'DataTable/DataTableRow',
    DataTableTitle: 'DataTable/DataTableTitle',
  },
  Dialog: {
    Dialog: 'Dialog/Dialog',
    DialogActions: 'Dialog/DialogActions',
    DialogContent: 'Dialog/DialogContent',
    DialogIcon: 'Dialog/DialogIcon',
    DialogScrollArea: 'Dialog/DialogScrollArea',
    DialogTitle: 'Dialog/DialogTitle',
  },
  Divider: 'Divider',
  Drawer: {
    DrawerCollapsedItem: 'Drawer/DrawerCollapsedItem',
    DrawerItem: 'Drawer/DrawerItem',
    DrawerSection: 'Drawer/DrawerSection',
  },
  FAB: {
    FAB: 'FAB/FAB',
    FABExtended: 'FAB/Extended',
    FABMenu: 'FAB/Menu',
  },
  IconButton: {
    IconButton: 'IconButton/IconButton',
  },
  Icon: 'Icon',
  List: {
    ListAccordion: 'List/ListAccordion',
    ListAccordionGroup: 'List/ListAccordionGroup',
    ListIcon: 'List/ListIcon',
    ListItem: 'List/ListItem',
    ListSection: 'List/ListSection',
    ListSubheader: 'List/ListSubheader',
  },
  Menu: {
    Menu: 'Menu/Menu',
    MenuItem: 'Menu/MenuItem',
  },
  Modal: 'Modal',
  Portal: {
    Portal: 'Portal/Portal',
    PortalHost: 'Portal/PortalHost',
  },
  ProgressBar: 'ProgressBar',
  RadioButton: {
    RadioButton: 'RadioButton/RadioButton',
    RadioButtonAndroid: 'RadioButton/RadioButtonAndroid',
    RadioButtonGroup: 'RadioButton/RadioButtonGroup',
    RadioButtonIOS: 'RadioButton/RadioButtonIOS',
    RadioButtonItem: 'RadioButton/RadioButtonItem',
  },
  Searchbar: 'Searchbar',
  SegmentedButtons: {
    SegmentedButtons: 'SegmentedButtons/SegmentedButtons',
  },
  Snackbar: 'Snackbar',
  Surface: 'Surface',
  Switch: {
    Switch: 'Switch/Switch',
  },
  TextInput: {
    TextInput: 'TextInput/TextInput',
    TextInputIcon: 'TextInput/TextInputIcon',
  },
  ToggleButton: {
    ToggleButton: 'ToggleButton/ToggleButton',
    ToggleButtonGroup: 'ToggleButton/ToggleButtonGroup',
    ToggleButtonRow: 'ToggleButton/ToggleButtonRow',
  },
  Tooltip: {
    Tooltip: 'Tooltip/Tooltip',
  },
  TouchableRipple: {
    TouchableRipple: 'TouchableRipple/TouchableRipple',
  },
  Text: {
    Text: 'Typography/Text',
  },
};

const componentDocsConfig: ComponentDocsConfig = {
  docsRootDir: path.join(__dirname, '6.x', 'docs', 'components'),
  libsRootDir: path.join(__dirname, '..', 'src', 'components'),
  pages,
  customFields: {
    moreExamples: {
      Portal: {
        'Comprehensive Portal example':
          'https://snack.expo.dev/@react-native-paper/more-examples---comprehensive-portal-example',
      },
      Snackbar: {
        'Snackbar rendered regardless of the parent positioning':
          'https://snack.expo.dev/@react-native-paper/more-examples---snackbar-rendered-regardless-of-the-parent-positioning',
      },
    },
    knownIssues: {},
    themeColors,
    screenshots,
    extendedExamples,
  },
};

export default componentDocsConfig;
