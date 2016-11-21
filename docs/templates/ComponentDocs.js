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
  margin: '16px 0 16px -24px',
});

const propsHeader = style({
  fontSize: '24px',
  color: '#000',
  margin: '36px 0 16px',
});

const propInfo = style({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
});

const propLabel = style({
  backgroundColor: '#f0f0f0',
  borderRadius: '3px',
  padding: '0 8px',
  margin: '8px 16px 8px 0',
  textDecoration: 'none',
});

export default function ComponentDocs(props: any) {
  return (
    <div {...wrapper}>
      <h1 {...mono} {...name}>{`<${props.name} />`}</h1>
      <p {...body}>{props.info.description}</p>
      <h2 {...mono} {...propsHeader}>Props</h2>
      {Object.keys(props.info.props).map(prop => {
        const { flowType } = props.info.props[prop];
        return (
          <div {...propInfo} key={prop}>
            <a
              {...mono}
              {...propLabel}
              name={prop}
              href={`#${prop}`}
            >
              {prop}: {flowType.raw || flowType.name}
            </a>
            <span {...body}>{props.info.props[prop].description}</span>
          </div>
        );
      })}
    </div>
  );
}
