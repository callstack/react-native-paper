import { withCallstackPreset } from '@callstack/rspress-preset';
import { defineConfig } from '@rspress/core';
import path from 'path';

const base = process.env.RSPRESS_BASE_URL ?? '/react-native-paper/';
const repoUrl = 'https://github.com/callstack/react-native-paper';

const rootDir = __dirname;
const srcDir = path.join(rootDir, 'src');
const compatDir = path.join(srcDir, 'rspress-compat');

export default withCallstackPreset(
  {
    context: rootDir,
    docs: {
      title: 'React Native Paper',
      description: 'Material Design for React Native',
      editUrl: `${repoUrl}/edit/main/docs`,
      rootUrl: 'https://callstack.github.io/react-native-paper',
      icon: 'public/images/favicon.ico',
      logoLight: '/react-native-paper/images/sidebar-logo.svg',
      logoDark: '/react-native-paper/images/sidebar-logo.svg',
      rootDir: '.',
      socials: {
        github: repoUrl,
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
    base,
    outDir: 'build',
    globalStyles: path.join(srcDir, 'css', 'custom.css'),
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
        'static/**',
        'build/**',
        'test-results/**',
        'tests/**',
        'visual/**',
        'component-docs-plugin/**',
        'versioned_docs/**',
        'versioned_sidebars/**',
        'README.md',
      ],
    },
    search: {
      versioned: true,
      codeBlocks: true,
    },
    builderConfig: {
      html: {
        tags: [
          {
            tag: 'script',
            children: `window.process = window.process || { env: {} };
window.process.env = window.process.env || {};
window.process.env.NODE_ENV = window.process.env.NODE_ENV || '${
              process.env.NODE_ENV ?? 'development'
            }';
globalThis.process = window.process;`,
          },
        ],
      },
      resolve: {
        alias: {
          '@site': rootDir,
          '@theme/Admonition': path.join(compatDir, 'Admonition.tsx'),
          '@theme/CodeBlock': path.join(compatDir, 'CodeBlock.tsx'),
          '@theme/TabItem': path.join(compatDir, 'TabItem.tsx'),
          '@theme/Tabs': path.join(compatDir, 'Tabs.tsx'),
          '@docusaurus/BrowserOnly': path.join(compatDir, 'BrowserOnly.tsx'),
          '@docusaurus/Link': path.join(compatDir, 'Link.tsx'),
          '@docusaurus/theme-common': path.join(compatDir, 'theme-common.ts'),
          '@react-native-vector-icons/get-image': path.join(
            compatDir,
            'empty-module.ts'
          ),
          'react-native-reanimated': path.join(
            compatDir,
            'react-native-reanimated.ts'
          ),
          'react-native-safe-area-context': path.join(
            compatDir,
            'react-native-safe-area-context.tsx'
          ),
          'react-native$': path.join(
            rootDir,
            'node_modules',
            'react-native-web'
          ),
          'react-native-paper': path.join(
            rootDir,
            '..',
            'lib',
            'module',
            'index.js'
          ),
          react: path.join(rootDir, 'node_modules', 'react'),
          'react-dom': path.join(rootDir, 'node_modules', 'react-dom'),
        },
      },
      source: {
        define: {
          __DEV__: JSON.stringify(process.env.NODE_ENV !== 'production'),
          'process.env.NODE_ENV': JSON.stringify(
            process.env.NODE_ENV ?? 'development'
          ),
        },
      },
    },
    themeConfig: {
      outlineTitle: 'Contents',
      overview: { filterNameText: '' },
      searchNoResultsText: 'No results found, try something different than',
      searchSuggestedQueryText: '',
    } as any,
  })
);
