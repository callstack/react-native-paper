import type { CSSProperties } from 'react';

import { Highlight, type PrismTheme } from 'prism-react-renderer';

import editorTheme from './editorTheme';

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
  numbered?: boolean;
};

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
