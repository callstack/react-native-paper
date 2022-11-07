import React from 'react';

const { marked } = require('marked');

interface MarkdownProps {
  content: string;
}

export default function Markdown({ content }: MarkdownProps) {
  const html = marked(content);

  return (
    <div
      dangerouslySetInnerHTML={{
        __html: html,
      }}
    />
  );
}
