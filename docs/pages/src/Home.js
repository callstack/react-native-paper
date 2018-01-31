/* @flow */
/* eslint-disable import/no-commonjs */

import * as React from 'react';
import { css, styles, include } from 'linaria';

const transition = css`
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
`;

const elevated = css`
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
`;

const container = css`
  width: 100%;
  overflow-y: scroll;
`;

const cover = css`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 180px 32px;
`;

const title = css`
  font-size: 48px;
`;

const description = css`
  font-size: 16px;
`;

const buttons = css`
  display: flex;
  flex-direction: row;
  margin: 16px 0;
`;

const button = css`
  appearance: none;
  margin: 8px;
  font-size: 15px;
  font-weight: bold;
  padding: 12px 24px;
  border: 0;
  border-radius: 3px;
  cursor: pointer;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12);

  ${include(transition)};

  &:hover {
    ${include(elevated)};
  }
`;

const primary = css`
  background-color: #3748ac;
  color: #fff;

  &:hover,
  &:focus,
  &:active {
    color: #fff;
  }
`;

const secondary = css`
  background-color: #f9f9f9;
  color: #222;

  &:hover,
  &:focus,
  &:active {
    color: #222;
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
  'assets/button.png',
  'assets/card.png',
  'assets/checkbox.png',
  'assets/radio.png',
  'assets/searchbar.png',
  'assets/switch.png',
  'assets/typography.png',
];

export default class Home extends React.Component<{}> {
  render() {
    return (
      <div {...styles(container)}>
        <div {...styles(cover)}>
          <h1 {...styles(title)}>React Native Paper</h1>
          <p {...styles(description)}>
            Cross-platform Material Design for React Native
          </p>
          <div {...styles(buttons)}>
            <a {...styles(button, primary)} href="getting-started.html">
              Get started
            </a>
            <a
              {...styles(button, secondary)}
              href="https://github.com/callstack/react-native-paper"
            >
              GitHub
            </a>
          </div>
        </div>
        <div {...styles(gallery)}>
          {screenshots.map((image, i) => <img key={i} src={image} />)}
        </div>
      </div>
    );
  }
}
