/* @flow */

import React from 'react';
import { style, merge } from 'glamor';
import Markdown from './Markdown';

const name = style({
  fontSize: '36px',
  margin: '24px 0 8px -24px',
});

const markdown = style({
  '& p:first-child': {
    marginTop: 0,
  },

  '& p:last-child': {
    marginBottom: 0,
  },
});

const propsHeader = style({
  fontSize: '24px',
  lineHeight: 1,
  color: '#000',
  margin: '48px 0 16px',
});

const propInfo = merge(markdown, {
  position: 'relative',
  margin: '16px 0',
});

const propRequired = style({
  position: 'absolute',
  left: -24,
  fontSize: '22px',
  lineHeight: 1.5,
  color: '#C1C2CA',

  '&:hover:after': {
    content: 'attr(data-hint)',
    display: 'inline-block',
    position: 'absolute',
    left: 0,
    borderRadius: '3px',
    bottom: '32px',
    padding: '2px 8px',
    fontSize: '12px',
    color: '#fff',
    background: '#262939',
    zIndex: 10,
  },
});

const propLabel = style({
  backgroundColor: '#F3F3F7',
  borderRadius: '3px',
  padding: '4px 8px',
  margin: '4px 16px 4px 0',
  textDecoration: 'none',
  whiteSpace: 'nowrap',
  border: '1px solid rgba(0, 0, 0, .04)',
});

const propDetails = style({
  margin: '8px 0',

  '@media(min-width: 960px)': {
    display: 'inline-block',
  },
});

const rest = style({
  color: '#1976D2',
});

export default function ComponentDocs(props: any) {
  const restProps = [];
  const description = props.info.description.split('\n').filter(line => {
    if (line.startsWith('@extends ')) {
      const parts = line.split(' ').slice(1);
      const link = parts.pop();
      restProps.push({
        name: parts.join(' '),
        link,
      });
      return false;
    }
    return true;
  }).join('\n');

  return (
    <div>
      <h1 {...name}><code>{`<${props.name} />`}</code></h1>
      <Markdown
        {...markdown}
        source={description} options={{ linkify: true }}
      />
      <h2 {...propsHeader}>Props</h2>
      {Object.keys(props.info.props).map(prop => {
        const { flowType, type, required } = props.info.props[prop];
        return (
          <div {...propInfo} key={prop}>
            <span>
              <code
                {...propRequired}
                data-hint='required'
              >
                {required ? '*' : ''}
              </code>
              <a
                {...propLabel}
                name={prop}
                href={`#${prop}`}
              >
                <code>
                  {prop}: {flowType.name === 'any' && type ? (type.raw || type.name) : (flowType.raw || flowType.name)}
                </code>
              </a>
            </span>
            <Markdown
              {...propDetails}
              source={props.info.props[prop].description}
            />
          </div>
        );
      })}
      {restProps && restProps.length ? restProps.map(prop => (
        <a
          {...propLabel}
          {...rest}
          key={prop.name}
          href={prop.link}
        >
          <code>
            ...{prop.name}
          </code>
        </a>
      )) : null}
    </div>
  );
}
