/* @flow */

import React from 'react';
import css from 'next/css';
import Mono from './Mono';
import Body from './Body';

const wrapper = css({
  padding: '24px 48px',
});

const name = css({
  fontSize: '36px',
  margin: '16px 0 16px -24px',
});

const propsHeader = css({
  fontWeight: '600',
  fontSize: '24px',
  color: '#000',
  margin: '36px 0 16px',
});

const propInfo = css({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
});

const propLabel = css({
  marginRight: '16px',
});

export default function ComponentDocs(props: any) {
  return (
    <div className={wrapper}>
      <Mono className={name}>{`<${props.name} />`}</Mono>
      <Body>{props.info.description}</Body>
      <Body className={propsHeader}>Props</Body>
      {Object.keys(props.info.props).map(prop => (
        <div className={propInfo} key={prop}>
          <Mono className={propLabel}>{prop}: {props.info.props[prop].flowType.name}</Mono>
          <Body>{props.info.props[prop].description}</Body>
        </div>
      ))}
    </div>
  );
}
