/* @flow */
/* eslint-disable import/no-commonjs */

import * as React from 'react';
import { css, cx } from 'linaria';
import { styled } from 'linaria/react';
import { Link } from 'component-docs/components';

import Content from './components/Content';

export default class Home extends React.Component<{}> {
  render() {
    return (
      <div className={container}>
        <Banner>
          Looking for the documentation for version 1.0? You can find it{' '}
          <a href="1.0">here</a>.
        </Banner>
        <Content>
          <h1>
            Cross-platform <Highlighted>Material Design</Highlighted> for React
            Native.
          </h1>
          <p>
            Paper is a collection of customizable and production-ready
            components for React Native, following Google’s Material Design
            guidelines.
          </p>
          <a
            href="https://snack.expo.io/@satya164/github.com-callstack-react-native-paper:example"
            target="_blank"
            rel="noopener noreferrer"
          >
            Try the demo on Snack
          </a>
          <Buttons>
            <Link className={cx(button, primary)} to="getting-started">
              Get started
            </Link>
            <a
              className={cx(button, secondary)}
              href="https://github.com/callstack/react-native-paper"
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub
            </a>
          </Buttons>
          <Gallery>
            {screenshots.map((image, i) => (
              // eslint-disable-next-line react/no-array-index-key
              <img key={i} src={image} alt="" />
            ))}
          </Gallery>
        </Content>
      </div>
    );
  }
}

const elevated = `
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.08), 0 3px 6px rgba(0, 0, 0, 0.24);
`;

const Banner = styled.p`
  margin: 0;
  padding: 16px;
  margin: 0 24px;
  text-align: center;
  border-bottom: 1px solid rgba(0, 0, 0, 0.04);
`;

const Highlighted = styled.span`
  color: #6221ea;
`;

const container = css`
  width: 100%;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
`;

const Buttons = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  margin: 16px -8px;
  min-width: 0;
`;

const button = css`
  appearance: none;
  margin: 8px;
  min-width: 120px;
  white-space: nowrap;
  font-size: 13px;
  font-weight: 600;
  text-align: center;
  text-transform: uppercase;
  letter-spacing: 1px;
  padding: 8px 16px;
  border-width: 1px;
  border-style: solid;
  border-radius: 3px;
  cursor: pointer;
  transition: 0.3s;

  &:hover {
    text-decoration: none;
  }
`;

const primary = css`
  background-color: #6200ee;
  border-color: #6200ee;
  color: #fff;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12);

  &:hover,
  &:focus,
  &:active {
    ${elevated};

    color: #fff;
  }
`;

const secondary = css`
  background-color: transparent;
  border-color: rgba(0, 0, 0, 0.24);
  color: #6200ee;

  &:hover,
  &:focus,
  &:active {
    background-color: rgba(98, 0, 238, 0.08);
    color: #6200ee;
  }
`;

const Gallery = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: flex-start;
  margin: 48px -16px;
  min-width: 0;

  > img {
    ${elevated};

    display: block;
    max-height: 480px;
    width: auto;
    margin: 16px;
  }
`;

const screenshots = [
  'gallery/button.png',
  'gallery/input.png',
  'gallery/card.png',
  'gallery/appbar.png',
  'gallery/searchbar.png',
  'gallery/snackbar.png',
  'gallery/chip.png',
  'gallery/list.png',
  'gallery/list-accordion.png',
  'gallery/typography.png',
  'gallery/bottom-navigation.png',
  'gallery/fab.png',
];
