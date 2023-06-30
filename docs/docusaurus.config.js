// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const path = require('path');
const darkCodeTheme = require('prism-react-renderer/themes/dracula');
const lightCodeTheme = require('prism-react-renderer/themes/github');

const { themeColors } = require('./src/data/themeColors.js');

const { NODE_ENV, DOCUSAURUS_BASE_URL } = process.env;

const title = 'React Native Paper';

const url = 'https://callstack.github.io';

/**
 * There are 3 environments that we want to support:
 * 1. Development - Docs should work on `http://localhost:3000/`
 * 2. Production - Docs should work on `https://callstack.github.io/react-native-paper/
 * 3. CI - CircleCI builds and stores preview artifacts.
 *    Docs should work on `https://output.circle-artifacts.com/output/job/$CIRCLE_WORKFLOW_JOB_ID/artifacts/$CIRCLE_NODE_INDEX/`
 *
 * Both `baseUrl` and `publicUrl` work together to ensure assets and links work properly on every deployment
 */
const baseUrl =
  DOCUSAURUS_BASE_URL ||
  (NODE_ENV === 'development' ? '/' : '/react-native-paper/');
const publicUrl =
  NODE_ENV === 'development' ? 'http://localhost:3000/' : `${url}${baseUrl}`;

/** @type {import('@docusaurus/types').Config} */
const config = {
  title,
  staticDirectories: ['public', 'static'],
  tagline: 'Material Design for React Native',
  url,
  baseUrl,
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
            createMaterialBottomTabNavigator:
              '../react-navigation/navigators/createMaterialBottomTabNavigator',
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
            CheckboxAndroid: 'Checkbox/CheckboxAndroid',
            CheckboxIOS: 'Checkbox/CheckboxIOS',
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
            AnimatedFAB: 'FAB/AnimatedFAB',
            FABGroup: 'FAB/FABGroup',
          },
          HelperText: { HelperText: 'HelperText/HelperText' },
          IconButton: {
            IconButton: 'IconButton/IconButton',
          },
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
            TextInputAffix: 'TextInput/Adornment/TextInputAffix',
            TextInputIcon: 'TextInput/Adornment/TextInputIcon',
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
        },
      },
    ],
    require('./plugins/docusaurus-react-native-plugin'),
  ],

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          editUrl: (params) => {
            const urlToMain =
              'https://github.com/callstack/react-native-paper/tree/main';

            if (params.docPath.includes('guides')) {
              return `${urlToMain}/docs/docs/${params.docPath}`;
            }

            const customUrls = {
              TextInputAffix:
                'src/components/TextInput/Adornment/TextInputAffix.tsx',
              TextInputIcon:
                'src/components/TextInput/Adornment/TextInputIcon.tsx',
              Text: 'src/components/Typography/Text.tsx',
            };

            const customUrlComponent =
              params.docPath.match(/\/?([^/]+)\.mdx$/)[1];

            if (customUrls[customUrlComponent]) {
              return `${urlToMain}/${customUrls[customUrlComponent]}`;
            }

            return `${urlToMain}/src/${params.docPath.replace('mdx', 'tsx')}`;
          },

          remarkPlugins: [
            [require('@docusaurus/remark-plugin-npm2yarn'), { sync: true }],
          ],
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
            position: 'left',
            label: 'Docs',
          },
          {
            type: 'doc',
            docId: 'components/ActivityIndicator',
            position: 'left',
            label: 'Components',
          },
          {
            type: 'doc',
            docId: 'showcase',
            position: 'left',
            label: 'Showcase',
          },
          {
            type: 'dropdown',
            label: 'v5.x',
            position: 'right',
            items: [
              {
                label: 'v4.x',
                href: `${publicUrl}4.0/`,
              },
              {
                label: 'v3.x',
                href: `${publicUrl}3.0/`,
              },
              {
                label: 'v2.x',
                href: `${publicUrl}2.0/`,
              },
              {
                label: 'v1.x',
                href: `${publicUrl}1.0/`,
              },
            ],
          },
          {
            href: 'https://discord.gg/zwR2Cdh',
            className: 'nav-link nav-discord-link',
            'aria-label': 'Discord',
            position: 'right',
          },
          {
            href: 'https://twitter.com/rn_paper',
            className: 'nav-link nav-twitter-link',
            'aria-label': 'Twitter',
            position: 'right',
          },
          {
            href: 'https://github.com/callstack/react-native-paper',
            className: 'nav-link nav-github-link',
            'aria-label': 'GitHub',
            position: 'right',
          },
        ],
        title,
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
      },
      algolia: {
        appId: 'U16QMJNNW7',
        apiKey: 'c32fdc9aa2bbfaa3d44481f5cbdb3c04',
        indexName: 'crawler_React Native Paper Docs',
      },
    }),

  customFields: {
    screenshots: {
      ActivityIndicator: 'screenshots/activity-indicator.gif',
      Appbar: 'screenshots/appbar.png',
      'Appbar.Action': 'screenshots/appbar-action-android.png',
      'Appbar.BackAction': 'screenshots/appbar-backaction-android.png',
      'Appbar.Content': 'screenshots/appbar-content.png',
      'Appbar.Header': {
        small: 'screenshots/appbar-small.png',
        medium: 'screenshots/appbar-medium.png',
        large: 'screenshots/appbar-large.png',
        'center-aligned': 'screenshots/appbar-center-aligned.png',
      },
      'Avatar.Icon': 'screenshots/avatar-icon.png',
      'Avatar.Image': 'screenshots/avatar-image.png',
      'Avatar.Text': 'screenshots/avatar-text.png',
      Badge: {
        'with text': 'screenshots/badge-1.png',
        'without text': 'screenshots/badge-2.png',
        dot: 'screenshots/badge-3.png',
      },
      Banner: 'screenshots/banner.gif',
      BottomNavigation: 'screenshots/bottom-navigation.gif',
      'BottomNavigation.Bar': 'screenshots/bottom-navigation-tabs.jpg',
      Button: {
        text: 'screenshots/button-1.png',
        outlined: 'screenshots/button-2.png',
        contained: 'screenshots/button-3.png',
        elevated: 'screenshots/button-4.png',
        'contained-tonal': 'screenshots/button-5.png',
      },
      Card: {
        elevated: 'screenshots/card-1.png',
        outlined: 'screenshots/card-2.png',
        contained: 'screenshots/card-3.png',
      },
      'Card.Actions': 'screenshots/card-actions.png',
      'Card.Content': 'screenshots/card-content-example.png',
      'Card.Cover': 'screenshots/card-cover.png',
      'Card.Title': 'screenshots/card-title-1.png',
      Checkbox: {
        'Android (enabled)': 'screenshots/checkbox-enabled.android.png',
        'Android (disabled)': 'screenshots/checkbox-disabled.android.png',
        'iOS (enabled)': 'screenshots/checkbox-enabled.ios.png',
        'iOS (disabled)': 'screenshots/checkbox-disabled.ios.png',
      },
      'Checkbox.Android': {
        enabled: 'screenshots/checkbox-enabled.android.png',
        disabled: 'screenshots/checkbox-disabled.android.png',
      },
      'Checkbox.IOS': {
        enabled: 'screenshots/checkbox-enabled.ios.png',
        disabled: 'screenshots/checkbox-disabled.ios.png',
      },
      Chip: {
        flat: 'screenshots/chip-1.png',
        outlined: 'screenshots/chip-2.png',
      },
      DataTable: 'screenshots/data-table-full-width.png',
      'DataTable.Cell': 'screenshots/data-table-row-cell.png',
      'DataTable.Header': 'screenshots/data-table-header.png',
      'DataTable.Pagination': 'screenshots/data-table-pagination.png',
      'DataTable.Row': 'screenshots/data-table-row-cell.png',
      'DataTable.Title': 'screenshots/data-table-header.png',
      Dialog: 'screenshots/dialog-1.png',
      'Dialog.Actions': 'screenshots/dialog-actions.png',
      'Dialog.Content': 'screenshots/dialog-content.png',
      'Dialog.Icon': 'screenshots/dialog-icon.png',
      'Dialog.ScrollArea': 'screenshots/dialog-scroll-area.gif',
      'Dialog.Title': 'screenshots/dialog-title.png',
      Divider: 'screenshots/divider.png',
      'Drawer.CollapsedItem': 'screenshots/drawer-collapsed.png',
      'Drawer.Item': 'screenshots/drawer-item.png',
      'Drawer.Section': 'screenshots/drawer-section.png',
      FAB: {
        'all variants': 'screenshots/fab-1.png',
        'all sizes': 'screenshots/fab-2.png',
        'all modes': 'screenshots/fab-4.png',
        'with label': 'screenshots/fab-3.png',
      },
      AnimatedFAB: 'screenshots/animated-fab.gif',
      'FAB.Group': 'screenshots/fab-group.gif',
      HelperText: 'screenshots/helper-text.gif',
      IconButton: {
        default: 'screenshots/icon-button-1.png',
        outlined: 'screenshots/icon-button-4.png',
        contained: 'screenshots/icon-button-2.png',
        'contained-tonal': 'screenshots/icon-button-3.png',
      },
      'List.Accordion': {
        'with left icon': 'screenshots/list-accordion-1.png',
        'with description': 'screenshots/list-accordion-2.png',
        'items with icon': 'screenshots/list-accordion-3.png',
      },
      'List.AccordionGroup': 'screenshots/list-accordion-group.png',
      'List.Icon': 'screenshots/list-icon.png',
      'List.Item': {
        'with left icon': 'screenshots/list-item-1.png',
        'with description': 'screenshots/list-item-2.png',
        'with right element': 'screenshots/list-item-3.png',
      },
      'List.Section': 'screenshots/list-section.png',
      Menu: {
        'with icons': 'screenshots/menu-1.png',
        'without icons': 'screenshots/menu-2.png',
      },
      'Menu.Item': 'screenshots/menu-item.png',
      Modal: 'screenshots/modal.gif',
      ProgressBar: 'screenshots/progress-bar.png',
      RadioButton: {
        'Android (enabled)': 'screenshots/radio-enabled.android.png',
        'Android (disabled)': 'screenshots/radio-disabled.android.png',
        'iOS (enabled)': 'screenshots/radio-enabled.ios.png',
        'iOS (disabled)': 'screenshots/radio-disabled.ios.png',
      },
      'RadioButton.Android': {
        enabled: 'screenshots/radio-enabled.android.png',
        disabled: 'screenshots/radio-disabled.android.png',
      },
      'RadioButton.Group': {
        Android: 'screenshots/radio-button-group-android.gif',
        iOS: 'screenshots/radio-button-group-ios.gif',
      },
      'RadioButton.IOS': {
        enabled: 'screenshots/radio-enabled.ios.png',
        disabled: 'screenshots/radio-disabled.ios.png',
      },
      'RadioButton.Item': 'screenshots/radio-item.ios.png',
      Searchbar: {
        bar: 'screenshots/searchbar.png',
        view: 'screenshots/searchbar-view.png',
      },
      SegmentedButtons: 'screenshots/segmented-button.png',
      Snackbar: 'screenshots/snackbar.gif',
      Surface: {
        elevated: 'screenshots/surface-elevated-full-width.png',
        flat: 'screenshots/surface-flat-full-width.png',
      },
      Switch: {
        'Android (enabled)': 'screenshots/switch-enabled.android.png',
        'Android (disabled)': 'screenshots/switch-disabled.android.png',
        'iOS (enabled)': 'screenshots/switch-enabled.ios.png',
        'iOS (disabled)': 'screenshots/switch-disabled.ios.png',
      },
      Text: 'screenshots/typography.png',
      TextInput: {
        'flat (focused)': 'screenshots/textinput-flat.focused.png',
        'flat (disabled)': 'screenshots/textinput-flat.disabled.png',
        'outlined (focused)': 'screenshots/textinput-outlined.focused.png',
        'outlined (disabled)': 'screenshots/textinput-outlined.disabled.png',
      },
      'TextInput.Affix': 'screenshots/textinput-outline.affix.png',
      'TextInput.Icon': 'screenshots/textinput-flat.icon.png',
      ToggleButton: 'screenshots/toggle-button.png',
      'ToggleButton.Group': 'screenshots/toggle-button-group.gif',
      'ToggleButton.Row': 'screenshots/toggle-button-row.gif',
      Tooltip: 'screenshots/tooltip.png',
      TouchableRipple: 'screenshots/touchable-ripple.gif',
    },
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
    knownIssues: {
      TextInput: {
        'Outline overlaps label':
          'https://github.com/callstack/react-native-paper/issues/3759#issuecomment-1601235262',
        'Long text wraps to a second line':
          'https://github.com/callstack/react-native-paper/issues/2581#issuecomment-790251987',
      },
    },
    themeColors,
  },
};

module.exports = config;
