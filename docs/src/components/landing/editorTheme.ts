import type { PrismTheme } from 'prism-react-renderer';

/** utils/editorTheme.js. `plain` is applied inline by prism-react-renderer. */
const editorTheme: PrismTheme = {
  // The source also puts the font, size and radius here; `PrismThemeEntry`
  // only carries colour, so they live in the snippet's own styles instead.
  plain: {
    backgroundColor: '#202C32',
    color: 'rgb(170, 176, 179)',
  },
  styles: [
    {
      types: [
        'prolog',
        'doctype',
        'cdata',
        'variable',
        'function-variable',
        'tag',
        'operator',
      ],
      style: { color: '#F92F5F' },
    },
    { types: ['property', 'attr-name'], style: { color: '#d7ad58' } },
    { types: ['comment'], style: { color: '#8295b6' } },
    { types: ['punctuation'], style: { color: 'rgb(170, 176, 179)' } },
    {
      types: ['attr-value', 'script', 'function'],
      style: { color: 'rgb(100, 172, 144)' },
    },
    {
      types: [
        'tag-id',
        'selector',
        'atrule-id',
        'keyword',
        'boolean',
        'string',
        'entity',
        'url',
        'control',
        'directive',
        'unit',
        'statement',
        'regex',
        'at-rule',
        'placeholder',
        'number',
      ],
      style: { color: 'rgb(173, 119, 215)' },
    },
    { types: ['deleted'], style: { textDecorationLine: 'line-through' } },
    { types: ['inserted'], style: { textDecorationLine: 'underline' } },
    { types: ['italic'], style: { fontStyle: 'italic' } },
    { types: ['important', 'bold'], style: { fontWeight: 'bold' } },
  ],
};

/** The monochrome variant the "Standard React code" panel uses. */
export const grayTheme: PrismTheme = {
  plain: { ...editorTheme.plain },
  styles: [
    {
      types: [
        'prolog',
        'doctype',
        'cdata',
        'variable',
        'function-variable',
        'tag',
        'operator',
        'boolean',
        'string',
        'entity',
        'url',
        'attr-value',
        'keyword',
        'control',
        'directive',
        'unit',
        'statement',
        'regex',
        'at-rule',
        'placeholder',
      ],
      style: { color: 'rgb(170, 176, 179)' },
    },
  ],
};

export default editorTheme;
