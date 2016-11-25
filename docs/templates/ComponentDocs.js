/* @flow */

import React from 'react';
import { style } from 'glamor';
import mono from './styles/mono';
import body from './styles/body';

const wrapper = style({
  padding: '24px 48px',
});

const name = style({
  fontSize: '36px',
  margin: '24px 0 8px -24px',
});

const propsHeader = style({
  fontSize: '24px',
  lineHeight: 1,
  color: '#000',
  margin: '48px 0 16px',
});

const propInfo = style({
  position: 'relative',
  margin: '24px 0',
});

const propRequired = style({
  position: 'absolute',
  left: -24,
  fontSize: '22px',
  lineHeight: 1.5,
  color: '#aaa',

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
    background: '#333',
    zIndex: 10,
  },
});

const propLabel = style({
  backgroundColor: '#f0f0f0',
  borderRadius: '3px',
  padding: '4px 8px',
  margin: '4px 16px 4px 0',
  textDecoration: 'none',
  whiteSpace: 'nowrap',
});

const propDetails = style({
  margin: '8px 0',

  '@media(min-width: 960px)': {
    display: 'inline-block',
  },
});

export default function ComponentDocs(props: any) {
  return (
    <div {...wrapper}>
      <h1 {...mono} {...name}>{`<${props.name} />`}</h1>
      <p {...body}>{props.info.description}</p>
      <h2 {...mono} {...propsHeader}>Props</h2>
      {Object.keys(props.info.props).map(prop => {
        const { flowType, type, required } = props.info.props[prop];
        return (
          <div {...propInfo} key={prop}>
            <span
              {...mono}
              {...propRequired}
              data-hint='required'
            >
              {required ? '*' : ''}
            </span>
            <a
              {...mono}
              {...propLabel}
              name={prop}
              href={`#${prop}`}
            >
              {prop}: {flowType.name === 'any' && type ? (type.raw || type.name) : (flowType.raw || flowType.name)}
            </a>
            <p {...body} {...propDetails}>
              {props.info.props[prop].description}
            </p>
          </div>
        );
      })}
    </div>
  );
}
