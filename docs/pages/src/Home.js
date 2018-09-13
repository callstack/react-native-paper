/* @flow */
/* eslint-disable import/no-commonjs */

import * as React from 'react';
import { css, styles, include } from 'linaria';
import { Link } from 'component-docs/components';

export default class Home extends React.Component<{}> {
  render() {
    return (
      <div {...styles(container)}>
        <p {...styles(banner)}>
          Looking for the documentation for version 1.0? You can find it{' '}
          <a href="1.0">here</a>.
        </p>
        <div {...styles(cover)}>
          <img
            {...styles(logo)}
            src="images/paper-logo.svg"
            alt="React Native Paper"
          />
          <p>Cross-platform Material Design for React Native</p>
          <div {...styles(buttons)}>
            <Link {...styles(button, primary)} to="getting-started">
              Get started
            </Link>
            <a
              {...styles(button, secondary)}
              href="https://github.com/callstack/react-native-paper"
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub
            </a>
          </div>
          <a
            href="https://snack.expo.io/@satya164/github.com-callstack-react-native-paper:example"
            target="_blank"
            rel="noopener noreferrer"
          >
            Try it out with Snack
          </a>
        </div>
        <div {...styles(gallery)}>
          {// eslint-disable-next-line react/no-array-index-key
          screenshots.map((image, i) => <img key={i} src={image} alt="" />)}
        </div>
      </div>
    );
  }
}

const banner = css`
  margin: 0;
  padding: 10px 16px;
  text-align: center;
  border-bottom: 1px solid rgba(0, 0, 0, 0.08);
`;

const logo = css`
  max-height: 125px;
  width: auto;
`;

const elevated = css`
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.08), 0 3px 6px rgba(0, 0, 0, 0.24);
`;

const container = css`
  width: 100%;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
`;

const cover = css`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 80vh;
  padding: 32px;
  text-align: center;
`;

const buttons = css`
  display: flex;
  flex-direction: row;
  margin: 16px 0;
`;

const button = css`
  appearance: none;
  margin: 8px;
  min-width: 120px;
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
    ${include(elevated)};

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

const gallery = css`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
  padding: 10px;
  min-width: 0;

  > img {
    ${include(elevated)};

    display: block;
    height: 640px;
    width: auto;
    margin: 10px;
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
