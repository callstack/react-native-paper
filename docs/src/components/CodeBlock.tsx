import type { ReactNode } from 'react';

type CodeBlockProps = {
  children: ReactNode;
  language?: string;
};

export default function CodeBlock({ children, language }: CodeBlockProps) {
  return (
    <pre>
      <code className={language ? `language-${language}` : undefined}>
        {children}
      </code>
    </pre>
  );
}
