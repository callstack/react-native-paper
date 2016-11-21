/* @flow */

import React from 'react';
import styled from 'styled-components';
import Mono from './Mono';
import Body from './Body';

const Wrapper = styled.div`
  padding: 24px 48px;
`;

const ComponentName = styled(Mono)`
  font-size: 36px;
  margin: 16px 0 16px -24px;
`;

const ComponentDesc = styled(Body)`
`;

const ComponentPropsHeader = styled(Body)`
  font-weight: 600;
  font-size: 24px;
  color: #000;
  margin: 36px 0 16px;
`;

const ComponentPropInfo = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const ComponentPropLabel = styled(Mono)`
  margin-right: 16px;
`;

const ComponentPropDesc = styled(Body)`
`;

export default function ComponentDocs(props: any) {
  return (
    <Wrapper>
      <ComponentName>{`<${props.name} />`}</ComponentName>
      <ComponentDesc>{props.info.description}</ComponentDesc>
      <ComponentPropsHeader>Props</ComponentPropsHeader>
      {Object.keys(props.info.props).map(prop => (
        <ComponentPropInfo key={prop}>
          <ComponentPropLabel>{prop}: {props.info.props[prop].flowType.name}</ComponentPropLabel>
          <ComponentPropDesc>{props.info.props[prop].description}</ComponentPropDesc>
        </ComponentPropInfo>
      ))}
    </Wrapper>
  );
}
