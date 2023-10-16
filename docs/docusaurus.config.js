// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const path = require('path');
const darkCodeTheme = require('prism-react-renderer/themes/dracula');
const lightCodeTheme = require('prism-react-renderer/themes/github');

const { screenshots } = require('./src/data/screenshots.js');
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
            label: 'Guides',
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
    screenshots,
  },
};

module.exports = config;
