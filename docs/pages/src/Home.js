/* @flow */
/* eslint-disable import/no-commonjs */

import * as React from 'react';
import { css, styles, include } from 'linaria';
import { Link } from 'component-docs/components';

export default class Home extends React.Component<{}> {
  render() {
    return (
      <div {...styles(container)}>
        <div {...styles(cover)}>
          <h1 {...styles(title)}>React Native Paper</h1>
          <p>Cross-platform Material Design for React Native</p>
          <div {...styles(buttons)}>
            <Link {...styles(button, primary)} to="getting-started.html">
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
          <div {...styles(qrcodeContainer)}>
            <div>
              Scan with{' '}
              <a
                href="https://expo.io/"
                target="_blank"
                rel="noopener noreferrer"
              >
                Expo
              </a>{' '}
              to try it out
            </div>
            <a
              href="https://expo.io/@satya164/react-native-paper-example"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                {...styles(qrcode)}
                src="images/expo-qr.png"
                alt="Expo QR Code"
              />
            </a>
          </div>
        </div>
        <div {...styles(gallery)}>
          {// eslint-disable-next-line react/no-array-index-key
          screenshots.map((image, i) => <img key={i} src={image} alt="" />)}
        </div>
      </div>
    );
  }
}

const elevated = css`
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08), 0 1px 2px rgba(0, 0, 0, 0.24);
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
  min-height: 80vh;
  padding: 32px;
`;

const title = css`
  font-size: 48px;
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
  text-align: center;
  text-transform: uppercase;
  padding: 9px 16px;
  border: 0;
  border-radius: 3px;
  cursor: pointer;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12);
  transition: 0.3s;

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
  background-color: #fafafa;
  color: #222;
  font-weight: 600;

  &:hover,
  &:focus,
  &:active {
    color: #222;
  }
`;

const qrcode = css`
  display: block;
  width: 200px;
  height: 200px;
  margin: 16px;
`;

const qrcodeContainer = css`
  margin: 16px;
  text-align: center;
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
  'gallery/card.png',
  'gallery/input.png',
  'gallery/searchbar.png',
  'gallery/typography.png',
  'gallery/checkbox.png',
  'gallery/radio.png',
  'gallery/switch.png',
];
