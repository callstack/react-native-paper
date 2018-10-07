/* @flow */

import * as React from 'react';
import { css, styles, include } from 'linaria';
import color from 'color';

import GooglePlayIcon from '../../components/google-play-icon';
import IphoneIcon from '../../components/iphone-icon';

type Data = {
  color: string,
  name: string,
  image: string,
  android?: string,
  ios?: string,
};

const data: Data[] = [
  {
    color: '#673AB7',
    name: 'Showman',
    image: 'showcase/showman.png',
  },
];

export default class Showcase extends React.Component<{}> {
  render() {
    return (
      <div {...styles(container)}>
        <div {...styles(content)}>
          <h1>Who&apos;s using Paper?</h1>
          <p>
            Check out these apps built using Paper. Send us a{' '}
            <a
              href="https://github.com/callstack/react-native-paper/pulls"
              target="_blank"
              rel="noopener noreferrer"
            >
              pull request
            </a>{' '}
            to add your app to this list.
          </p>
        </div>
        <div {...styles(gallery)}>
          {data.map(item => {
            const tintColor = color(item.color).light() ? '#000000' : '#FFFFFF';
            return (
              <div key={item.image}>
                <div {...styles(imageContainer)}>
                  <img {...styles(image)} src={item.image} alt="" />
                  <div
                    {...styles(info)}
                    style={{ backgroundColor: item.color }}
                  >
                    <h3
                      {...styles(appName)}
                      style={{
                        color: tintColor,
                      }}
                    >
                      {item.name}
                    </h3>
                    <div {...styles(badgeContainer)}>
                      <a
                        href={item.android || null}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ opacity: item.android ? 1 : 0.4 }}
                      >
                        <GooglePlayIcon color={tintColor} />
                      </a>
                      <div {...styles(separation)} />
                      <a
                        href={item.ios || null}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ opacity: item.ios ? 1 : 0.4 }}
                      >
                        <IphoneIcon color={tintColor} />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }
}

const container = css`
  padding: 24px 0;
  width: 100%;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
`;

const content = css`
  padding: 0 48px;

  @media (max-width: 680px) {
    padding: 0 16px;
  }
`;

const elevated = css`
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08), 0 1px 2px rgba(0, 0, 0, 0.24);
`;

const appName = css`
  font-size: 16px;
  margin-top: 0;
  margin-bottom: 12px;
`;

const gallery = css`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  padding: 8px 38px;
  min-width: 0;

  @media (max-width: 680px) {
    justify-content: center;
    padding: 8px 16px;
  }
`;

const info = css`
  height: 96px;
  padding: 12px;
  transform: translateY(0);
  transition: 150ms;
`;

const imageContainer = css`
  ${include(elevated)};

  height: ${480 + 48}px;
  width: auto;
  overflow: hidden;
  margin: 10px;

  &:hover,
  &:focus {
    .${info} {
      transform: translateY(-48px);
    }
  }

  @media (max-width: 680px) {
    margin: 10px 0;
  }
`;

const image = css`
  display: block;
  max-height: 480px;
  width: auto;
`;

const badgeContainer = css`
  display: flex;
  flex-direction: row;
  margin-top: 16px;
  padding-left: 3px;
`;

const separation = css`
  margin: 0 10px;
`;
