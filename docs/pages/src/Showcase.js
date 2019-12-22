/* @flow */

import * as React from 'react';
import { styled } from 'linaria/react';
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
  {
    color: '#fff',
    name: 'Dark Hacker News',
    image: 'showcase/darkhackernews.png',
    ios: 'https://itunes.apple.com/us/app/dark-hacker-news/id1459946382?mt=8',
  },
  {
    color: '#0ba360',
    name: 'PandaDeals',
    image: 'showcase/pandadeals.png',
    android:
      'https://play.google.com/store/apps/details?id=com.mattkoboski.couponsapp',
    ios: 'https://apps.apple.com/pl/app/pandadeals/id1468755918',
  },
  {
    color: '#A11E1E',
    name: 'RaceCalendar',
    image: 'showcase/racecalendar.png',
    android:
      'https://play.google.com/store/apps/details?id=in.micy.racecalendar',
    ios: 'https://apps.apple.com/us/app/race-calendar/id1481539104',
  },
  {
    color: '#4439A1',
    name: 'Unicore',
    image: 'showcase/unicore.png',
    android: 'https://play.google.com/store/apps/details?id=com.atude.mywam',
  },
];

export default class Showcase extends React.Component<{}> {
  render() {
    return (
      <Container>
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
          <Gallery>
            {data.map(item => {
              const tintColor = color(item.color).isLight()
                ? '#000000'
                : '#FFFFFF';
              return (
                <div key={item.image}>
                  <ImageContainer>
                    <Image src={item.image} alt="" />
                    <Info style={{ backgroundColor: item.color }}>
                      <AppName
                        style={{
                          color: tintColor,
                        }}
                      >
                        {item.name}
                      </AppName>
                      <BadgeContainer>
                        <a
                          href={item.android || null}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ opacity: item.android ? 1 : 0.4 }}
                        >
                          <GooglePlayIcon color={tintColor} />
                        </a>
                        <Separation />
                        <a
                          href={item.ios || null}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ opacity: item.ios ? 1 : 0.4 }}
                        >
                          <IphoneIcon color={tintColor} />
                        </a>
                      </BadgeContainer>
                    </Info>
                  </ImageContainer>
                </div>
              );
            })}
          </Gallery>
        </Content>
      </Container>
    );
  }
}

const Container = styled.div`
  width: 100%;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
`;

const AppName = styled.h3`
  font-size: 16px;
  margin-top: 0;
  margin-bottom: 12px;
`;

const Gallery = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  min-width: 0;
  margin: 32px -16px;

  @media (max-width: 680px) {
    justify-content: center;
  }
`;

const Info = styled.div`
  height: 96px;
  padding: 12px;
  transform: translateY(0);
  transition: 150ms;
`;

const ImageContainer = styled.div`
  overflow: hidden;
  margin: 16px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12);

  @media (min-width: 420px) {
    height: ${480 + 48}px;

    &:hover,
    &:focus {
      ${Info} {
        transform: translateY(-48px);
      }
    }
  }
`;

const Image = styled.img`
  display: block;
  max-height: 480px;
  width: auto;

  @media (min-width: 420px) {
    height: 480px;
    width: 270px;
  }
`;

const BadgeContainer = styled.div`
  display: flex;
  flex-direction: row;
  margin-top: 16px;
  padding-left: 3px;
`;

const Separation = styled.div`
  margin: 0 10px;
`;
