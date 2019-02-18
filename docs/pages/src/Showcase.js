/* @flow */

import * as React from 'react';
import { css } from 'linaria';
import color from 'color';

import GooglePlayIcon from '../../components/google-play-icon';
import IphoneIcon from '../../components/iphone-icon';
import Content from './components/Content';

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
  {
    color: '#F73942',
    name: 'AppnGO',
    image: 'showcase/appngo.png',
    android:
      'https://play.google.com/store/apps/details?id=com.helsedesign.appngo',
    ios: 'https://itunes.apple.com/us/app/appngo/id1439585129',
  },
];

export default class Showcase extends React.Component<{}> {
  render() {
    return (
      <Content>
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
        <div className={gallery}>
          {data.map(item => {
            const tintColor = color(item.color).light() ? '#000000' : '#FFFFFF';
            return (
              <div key={item.image}>
                <div className={imageContainer}>
                  <img className={image} src={item.image} alt="" />
                  <div className={info} style={{ backgroundColor: item.color }}>
                    <h3
                      className={appName}
                      style={{
                        color: tintColor,
                      }}
                    >
                      {item.name}
                    </h3>
                    <div className={badgeContainer}>
                      <a
                        href={item.android || null}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ opacity: item.android ? 1 : 0.4 }}
                      >
                        <GooglePlayIcon color={tintColor} />
                      </a>
                      <div className={separation} />
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
      </Content>
    );
  }
}

const appName = css`
  font-size: 16px;
  margin-top: 0;
  margin-bottom: 12px;
`;

const gallery = css`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  min-width: 0;
  margin: 32px -16px;

  @media (max-width: 680px) {
    justify-content: center;
  }
`;

const info = css`
  height: 96px;
  padding: 12px;
  transform: translateY(0);
  transition: 150ms;
`;

const imageContainer = css`
  overflow: hidden;
  margin: 16px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08), 0 1px 2px rgba(0, 0, 0, 0.24);

  @media (min-width: 420px) {
    height: ${480 + 48}px;

    &:hover,
    &:focus {
      .${info} {
        transform: translateY(-48px);
      }
    }
  }
`;

const image = css`
  display: block;
  max-height: 480px;
  width: auto;

  @media (min-width: 420px) {
    height: 480px;
    width: 270px;
  }
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
