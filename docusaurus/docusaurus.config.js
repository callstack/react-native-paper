// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const path = require('path');

const lightCodeTheme = require('prism-react-renderer/themes/github');
const darkCodeTheme = require('prism-react-renderer/themes/dracula');

const title = 'React Native Paper';

/** @type {import('@docusaurus/types').Config} */
const config = {
  title,
  tagline: 'Material Design for React Native',
  url: 'https://reactnativepaper.com',
  baseUrl: '/',
  onBrokenLinks: 'log',
  onBrokenMarkdownLinks: 'log',
  favicon: 'images/favicon.ico',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'callstack', // Usually your GitHub org/user name.
  projectName: 'react-native-paper', // Usually your repo name.

  // Even if you don't use internalization, you can use this field to set useful
  // metadata like html lang. For example, if your site is Chinese, you may want
  // to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  plugins: [
    [
      './component-docs-plugin',
      {
        docsRootDir: path.join(__dirname, 'docs', 'components'),
        libsRootDir: path.join(__dirname, '..', 'src', 'components'),
        pages: {
          ActivityIndicator: 'ActivityIndicator',
          AnimatedFAB: 'FAB/AnimatedFAB',
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
          BottomNavigation: 'BottomNavigation/BottomNavigation',
          Button: 'Button/Button',
          Card: {
            Card: 'Card/Card',
            CardActions: 'Card/CardActions',
            CardContent: 'Card/CardContent',
            CardCover: 'Card/CardCover',
            CardTitle: 'Card/CardTitle',
          },
          Checkbox: {
            Checkbox: 'Checkbox/Checkbox',
            CheckboxAndroid: 'Checkbox/CheckboxAndroid',
            CheckboxIOS: 'Checkbox/CheckboxIOS',
            CheckboxItem: 'Checkbox/CheckboxItem',
          },
          Chip: 'Chip/Chip',
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
            FABGroup: 'FAB/FABGroup',
          },
          HelperText: 'HelperText',
          IconButton: 'IconButton/IconButton',
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
          SegmentedButtons: 'SegmentedButtons/SegmentedButtons',
          Snackbar: 'Snackbar',
          Surface: 'Surface',
          Switch: 'Switch/Switch',
          TextInput: {
            TextInput: 'TextInput/TextInput',
            TextInputAffix: 'TextInput/Adornment/TextInputAffix',
            TextInputIcon: 'TextInput/Adornment/TextInputIcon',
          },
          ToggleButton: {
            ToggleButton: 'ToggleButton/ToggleButton',
            ToggleButtonGroup: 'ToggleButton/ToggleButtonGroup',
            ToggleButtonRow: 'ToggleButton/ToggleButtonRow',
          },
          TouchableRipple: 'TouchableRipple/TouchableRipple',
          Typography: {
            Text: 'Typography/Text',
          },
        },
      },
    ],
  ],

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            'https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/',
        },
        blog: {
          showReadingTime: true,
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            'https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/',
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      navbar: {
        logo: {
          alt: 'React Native Paper',
          src: 'images/sidebar-logo.svg',
        },
        items: [
          {
            type: 'doc',
            docId: 'guides/getting-started',
            position: 'right',
            label: 'Docs',
          },
          {
            href: 'https://github.com/callstack/react-native-paper',
            label: 'GitHub',
            position: 'right',
          },
        ],
        title,
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
      },
    }),

  themes: [
    [
      '@easyops-cn/docusaurus-search-local',
      {
        hashed: true,
      },
    ],
  ],
};

module.exports = config;
