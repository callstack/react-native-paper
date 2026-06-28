import { withCallstackPreset } from '@callstack/rspress-preset';
import { defineConfig } from '@rspress/core';
import { createRequire } from 'node:module';
import path from 'node:path';

const REPO_NAME = 'react-native-paper';
const REPO_ORG = 'callstack';

const src = path.resolve(__dirname, 'src');

const require = createRequire(import.meta.url);
const resolve = (packageName: string) =>
  path.dirname(require.resolve(`${packageName}/package.json`));

const paper = path.resolve(__dirname, '..', 'src');

export default withCallstackPreset(
  {
    context: __dirname,
    docs: {
      title: 'React Native Paper',
      description: 'Material Design for React Native',
      editUrl: `https://github.com/${REPO_ORG}/${REPO_NAME}/edit/main/docs`,
      rootUrl: `https://${REPO_ORG}.github.io/${REPO_NAME}`,
      icon: 'public/images/favicon.ico',
      logoLight: `/${REPO_NAME}/images/sidebar-logo.svg`,
      logoDark: `/${REPO_NAME}/images/sidebar-logo.svg`,
      rootDir: '.',
      socials: {
        github: `https://github.com/${REPO_ORG}/${REPO_NAME}`,
        discord: 'https://discord.gg/zwR2Cdh',
        x: 'https://twitter.com/rn_paper',
      },
    },
    theme: {
      content: {
        docFooterCTAHeadline: '',
        docFooterCTAButtonText: '',
        homeBannerHeadline: '',
        homeBannerDescription: '',
        homeBannerButtonText: '',
        outlineCTAHeadline: '',
        outlineCTADescription: '',
        outlineCTAButtonText: '',
      },
      links: {
        docFooterCTA: '',
        homeBanner: '',
        homeFooter: 'https://www.callstack.com',
        outlineCTA: '',
      },
    },
    vercelAnalytics: false,
  },
  defineConfig({
    base: '/react-native-paper/',
    outDir: 'build',
    globalStyles: path.join(src, 'css', 'custom.css'),
    multiVersion: {
      default: '5.x',
      versions: ['5.x', '6.x'],
    },
    route: {
      cleanUrls: true,
      extensions: ['.md', '.mdx'],
      include: ['5.x/**/*.{md,mdx}', '6.x/**/*.{md,mdx}'],
      exclude: [
        'src/**',
        'scripts/**',
        'public/**',
        'build/**',
        'test-results/**',
        'tests/**',
        'visual/**',
        'component-docs-plugin/**',
        'README.md',
      ],
    },
    search: {
      versioned: true,
      codeBlocks: true,
    },
    i18nSource: (source) => ({
      ...source,
      outlineTitle: {
        ...source.outlineTitle,
        en: 'Contents',
      },
      searchNoResultsText: {
        ...source.searchNoResultsText,
        en: 'No results found, try something different than',
      },
      searchSuggestedQueryText: {
        ...source.searchSuggestedQueryText,
        en: '',
      },
      'overview.filterNameText': {
        ...source['overview.filterNameText'],
        en: '',
      },
    }),
    builderConfig: {
      source: {
        exclude: [paper],
      },
      resolve: {
        extensions: [
          '.web.tsx',
          '.web.ts',
          '.web.jsx',
          '.web.js',
          '.tsx',
          '.ts',
          '.jsx',
          '.js',
          '.json',
        ],
        alias: {
          '@docs': src,
          react: resolve('react'),
          'react-dom': resolve('react-dom'),
          'react-native$': resolve('react-native-web'),
          'react-native-web/dist/exports/StyleSheet/compiler/createReactDOMStyle':
            path.resolve(
              resolve('react-native-web'),
              'dist/exports/StyleSheet/compiler/createReactDOMStyle.js'
            ),
          'react-native-web/dist/exports/StyleSheet/preprocess': path.resolve(
            resolve('react-native-web'),
            'dist/exports/StyleSheet/preprocess.js'
          ),
          'react-native-paper': paper,
        },
      },
      tools: {
        rspack(config, { isDev, rspack }) {
          config.module.rules = [
            ...(config.module.rules ?? []),
            {
              test: /\.[jt]sx?$/,
              include: [paper],
              use: {
                loader: require.resolve('babel-loader'),
                options: {
                  babelrc: false,
                  configFile: false,
                  presets: [require.resolve('@react-native/babel-preset')],
                  plugins: [require.resolve('react-native-reanimated/plugin')],
                },
              },
            },
          ];

          config.plugins.push(
            new rspack.DefinePlugin({
              __DEV__: JSON.stringify(isDev),
              'process.env.JEST_WORKER_ID': 'undefined',
              'process.env.NODE_ENV': JSON.stringify(
                isDev ? 'development' : 'production'
              ),
            })
          );

          config.ignoreWarnings = [
            ...(config.ignoreWarnings ?? []),
            /Can't resolve '@react-native-vector-icons\/get-image'/,
          ];
        },
      },
    },
  })
);
