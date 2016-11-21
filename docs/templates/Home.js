/* @flow */

import React from 'react';
import styled from 'styled-components';
import Mono from './Mono';
import Body from './Body';

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  padding: 24px 48px;
`;

const Inner = styled.div`
  text-align: center;
`;

const Heading = styled(Mono)`
  font-size: 36px;
  margin: 16px 0 16px -24px;
`;

const Description = styled(Body)`
  font-size: 24px;
`;

export default function Home() {
  return (
    <Wrapper>
      <Inner>
        <Heading>React Native Paper</Heading>
        <Description>Documentation</Description>
      </Inner>
    </Wrapper>
  );
}
