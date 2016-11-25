/* @flow */

import React from 'react';
import Remarkable from 'react-remarkable';
import hljs from 'highlight.js';
import { style } from 'glamor';

const markdown = style({
  '& pre': {
    whitespace: 'nowrap',
    backgroundColor: '#f0f0f0',
    borderRadius: '3px',
    padding: '8px 12px',
    overflowX: 'auto',
  },

  '& .hljs-comment': {
    color: '#ABB0B6',
  },

  '& .hljs-keyword': {
    color: '#F26129',
  },

  '& .hljs-string, & .hljs-value, & .hljs-inheritance, & .hljs-header, & .hljs-class, & .hljs-attr': {
    color: '#86B326',
  },

  '& .hljs-function .hljs-title': {
    color: '#F59D19',
  },

  '& .hljs-number, & .hljs-preprocessor, & .hljs-built_in, & .hljs-literal, & .hljs-params, & .hljs-constant': {
    color: '#A37ACC',
  },

  '& .hljs-variable, & .hljs-attr, & .hljs-tag, & .hljs-regexp, & .hljs-doctype, & .hljs-id, & .hljs-class, & .hljs-pseudo, & .hljs-tag .hljs-name, & .hljs-built_in': {
    color: '#41A6D9',
  },
});

function highlight(text, lang) {
  const language = lang === 'jsx' ? 'xml' : lang;
  if (language) {
    if (hljs.getLanguage(language)) {
      try {
        return hljs.highlight(language, text).value;
      } catch (err) {
        // Do nothing
      }
    }
  } else {
    try {
      return hljs.highlightAuto(text).value;
    } catch (err) {
      // Do nothing
    }
  }

  return '';
}

export default function Markdown(props: any) {
  const { source, ...rest } = props;
  return (
    <div {...markdown} {...rest}>
      <Remarkable
        source={source}
        options={{
          linkify: true,
          highlight,
        }}
      />
    </div>
  );
}
