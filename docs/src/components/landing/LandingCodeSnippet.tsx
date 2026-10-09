import type { CSSProperties } from 'react';

import { Highlight, type PrismTheme } from 'prism-react-renderer';

import editorTheme from './editorTheme';

/**
 * `customStyles` from the source, plus the typographic half of its theme's
 * `plain` - prism's own theme type carries colour only.
 */
const customStyles: CSSProperties = {
  padding: 20,
  overflowY: 'auto',
  fontFamily: '"Roboto Mono", monospace',
  fontSize: '16px',
  borderRadius: 5,
};

type Props = {
  code: string;
  theme?: PrismTheme;
  /**
   * Renders as the live editor rather than a snippet: a line-number gutter,
   * wrapped long lines, and none of `seb0k0g`'s dots ornament.
   */
  numbered?: boolean;
};

/**
 * editor/CodeSnippet.js. `seb0k0g` carries the dots ornament the source draws
 * through a `::before`; prism applies `theme.plain` as an inline style and
 * `customStyles` adds the padding on top.
 */
export default function LandingCodeSnippet({ code, theme, numbered }: Props) {
  return (
    <Highlight code={code} language="jsx" theme={theme ?? editorTheme}>
      {({ className, style, tokens, getLineProps, getTokenProps }) => (
        <pre
          className={
            numbered
              ? `landing-code--numbered ${className}`
              : `seb0k0g ${className}`
          }
          style={{ ...style, ...customStyles }}
        >
          {tokens.map((line, index) => (
            <div key={index} {...getLineProps({ line })}>
              {line.map((token, key) => (
                <span key={key} {...getTokenProps({ token })} />
              ))}
            </div>
          ))}
        </pre>
      )}
    </Highlight>
  );
}
