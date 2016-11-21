/* @flow */

import React from 'react';
import Mono from './Mono';
import styled from 'styled-components';

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  height: 100vh;
`;

const Sidebar = styled.div`
  width: 240px;
  padding: 16px;
  background-color: #f9f9f9;
`;

const Content = styled.div`
  flex: 1;
`;

const Link = styled.a`
  display: block;
  margin: 8px;
  text-decoration: none;
  opacity: ${props => props.active ? 0.64 : 0.32};

  &:hover {
    opacity: 1;
  }
`;

export default function Body({ pages, children }: any) {
  const pathname = global.location && global.location.pathname;
  return (
    <Wrapper>
      <Sidebar>
        <Link href='/' active={pathname === '/'}>
          <Mono>Home</Mono>
        </Link>
        {pages.map(page =>
          <Link
            key={page}
            href={`/${page.toLowerCase()}`}
            active={pathname === `/${page.toLowerCase()}`}
          >
            <Mono>{page}</Mono>
          </Link>
        )}
      </Sidebar>
      <Content>
        {children}
      </Content>
    </Wrapper>
  );
}
