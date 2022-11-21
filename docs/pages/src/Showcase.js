/* @flow */

import * as React from 'react';

import color from 'color';
import { Header } from 'component-docs/components';
import { styled } from 'linaria/react';

import GithubIcon from '../../components/github-icon';
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
    color: '#6200EE',
    name: 'Paper Example App',
    image: 'showcase/paper.png',
    android:
      'https://play.google.com/store/apps/details?id=com.callstack.reactnativepaperexample',
    ios: 'https://apps.apple.com/app/react-native-paper/id1548934513',
    github: 'https://github.com/callstack/react-native-paper/tree/main/example',
  },
  {
    color: '#696AC3',
    name: 'YumMeals',
    image: 'showcase/yummeals.png',
    github: 'https://github.com/BernStrom/YumMeals',
  },
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
  {
    color: '#19402E',
    name: 'TracksNZ',
    image: 'showcase/tracksnz.png',
    android: 'https://play.google.com/store/apps/details?id=in.micy.tracksnz',
    ios: 'https://apps.apple.com/nz/app/tracks-nz/id1488245855',
  },
  {
    color: '#b985fc',
    name: 'Astrale',
    image: 'showcase/astrale.png',
    github: 'https://github.com/jvidalv/astrale',
    android: 'https://play.google.com/store/apps/details?id=josep.astrale',
  },
  {
    color: '#29337a',
    name: 'Lyra Collect',
    image: 'showcase/lyracollect.png',
    android:
      'https://play.google.com/store/apps/details?id=com.lyra.lyracollect',
    ios: 'https://apps.apple.com/fr/app/lyra-collect/id1469527737',
  },
  {
    color: '#673AB7',
    name: 'Rozy - Stay connected',
    image: 'showcase/rozy.png',
    ios: 'https://apps.apple.com/us/app/rozy/id1511264722',
    android: 'https://play.google.com/store/apps/details?id=com.rozy_app.rozy',
  },
  {
    color: '#CC0E00',
    name: 'Zoomapto - Find Nearby Restaurants',
    image: 'showcase/zoomapto.png',
    github: 'https://github.com/frederic11/Zoomapto',
    android:
      'https://play.google.com/store/apps/details?id=com.frederictech.zoomapto',
  },
  {
    color: '#1DE9B6',
    name: 'Groovy - Build Habits Together',
    image: 'showcase/groovy.png',
    ios: 'https://apps.apple.com/us/app/groovy-set-your-goals/id1562352498',
    android:
      'https://play.google.com/store/apps/details?id=com.gabrieldierks.groovy',
  },
  {
    color: '#673AB7',
    name: 'Vibemap - Find Your Vibe',
    image: 'showcase/vibemap.png',
    ios: 'https://apps.apple.com/us/app/vibemap/id1496385897#?platform=iphone',
    android:
      'https://play.google.com/store/apps/details?id=com.vibemap.hotspots',
  },
  {
    color: '#6200EE',
    name: 'Clutch - Transmission Remote',
    image: 'showcase/clutch.png',
    android: 'https://play.google.com/store/apps/details?id=eu.tmdpw.clutch',
  },
  {
    color: '#111827',
    name: 'Quakemap',
    image: 'showcase/quakemap.png',
    android: 'https://play.google.com/store/apps/details?id=com.sal.quakemap',
  },
  {
    color: '#5222d0',
    name: 'Homework Helper - Find HW Answers',
    image: 'showcase/homeworkhelper.png',
    ios: 'https://apps.apple.com/app/homework-helper-app/id1632652122',
    android:
      'https://play.google.com/store/apps/details?id=com.kylehoell.homeworkhelper',
  },
  {
    color: '#E1352F',
    name: 'CrazyThursday',
    image: 'showcase/crazythursday.jpg',
    github: 'https://github.com/shensven/Crazy-Thursday',
    android:
      'https://play.google.com/store/apps/details?id=com.shensven.crazythursday',
  },
  {
    color: '#566193',
    name: 'Moon Meet',
    image: 'showcase/moonmeet.png',
    github: 'https://github.com/MoonMeet/MoonMeet-CrossPlatform',
  },
  {
    color: '#850E35',
    name: 'Pharmacies On Duty Turkey',
    image: 'showcase/pharmaciesondutyturkey.png',
    android:
      'https://play.google.com/store/apps/details?id=com.tarikfp.pharmacyfinder',
    ios: 'https://apps.apple.com/us/app/n%C3%B6bet%C3%A7i-eczane-t%C3%BCm-t%C3%BCrkiye/id6443454675',
  },
  {
    color: '#0984e3',
    name: 'Kuroga: Make GIF by sketching',
    image: 'showcase/kurogahome.png',
    android:
      'https://play.google.com/store/apps/details?id=com.personal.butterfly',
  },
  {
    color: '#262a33',
    name: 'Prodigy IoT',
    image: 'showcase/prodigyiot.png',
    github: 'https://github.com/lcsjunior/prodigy-rn-app-v2',
  },
];

export default class Showcase extends React.Component<{}> {
  render() {
    return (
      <Container>
        <Header logo="images/sidebar-logo.svg" />
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
            {data.map((item) => {
              const tintColor = color(item.color).isLight()
                ? '#000000'
                : '#FFFFFF';
              return (
                <div key={item.image}>
                  <ImageContainer>
                    <Image
                      src={item.image}
                      alt=""
                      accessibilityIgnoresInvertColors
                    />
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
                        <Separation />
                        <a
                          href={item.github || null}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ opacity: item.github ? 1 : 0.4 }}
                        >
                          <GithubIcon color={tintColor} />
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
  flex: 1;
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
