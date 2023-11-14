import React from 'react';

import color from 'color';

import AppStoreIcon from './AppStoreIcon';
import GithubIcon from './GithubIcon';
import GooglePlayIcon from './GooglePlayIcon';

type Data = {
  color: string;
  name: string;
  image: string;
  android?: string;
  ios?: string;
  github?: string;
};

const data: Data[] = [
  {
    color: '#6200EE',
    name: 'Paper Example App',
    image: '/react-native-paper/showcase/paper.png',
    android:
      'https://play.google.com/store/apps/details?id=com.callstack.reactnativepaperexample',
    ios: 'https://apps.apple.com/app/react-native-paper/id1548934513',
    github: 'https://github.com/callstack/react-native-paper/tree/main/example',
  },
  {
    color: '#2979FF',
    name: 'Bluebirding',
    image: '/react-native-paper/showcase/bluebirding.png',
    android:
      'https://play.google.com/store/apps/details?id=com.bitzllc.bluebird',
    ios: 'https://apps.apple.com/us/app/bluebirding/id1553837668',
  },
  {
    color: '#696AC3',
    name: 'Weather Forecast',
    image: '/react-native-paper/showcase/weatherforecast.png',
    android:
      'https://play.google.com/store/apps/details?id=com.rehankhalil462.WeatherApp',
  },
  {
    color: '#696AC3',
    name: 'YumMeals',
    image: '/react-native-paper/showcase/yummeals.png',
    github: 'https://github.com/BernStrom/YumMeals',
  },
  {
    color: '#673AB7',
    name: 'Showman',
    image: '/react-native-paper/showcase/showman.png',
  },
  {
    color: '#F73942',
    name: 'AppnGO',
    image: '/react-native-paper/showcase/appngo.png',
    android:
      'https://play.google.com/store/apps/details?id=com.helsedesign.appngo',
    ios: 'https://itunes.apple.com/us/app/appngo/id1439585129',
  },
  {
    color: '#fff',
    name: 'Dark Hacker News',
    image: '/react-native-paper/showcase/darkhackernews.png',
    ios: 'https://itunes.apple.com/us/app/dark-hacker-news/id1459946382?mt=8',
  },
  {
    color: '#0ba360',
    name: 'PandaDeals',
    image: '/react-native-paper/showcase/pandadeals.png',
    android:
      'https://play.google.com/store/apps/details?id=com.mattkoboski.couponsapp',
    ios: 'https://apps.apple.com/pl/app/pandadeals/id1468755918',
  },
  {
    color: '#A11E1E',
    name: 'RaceCalendar',
    image: '/react-native-paper/showcase/racecalendar.png',
    android:
      'https://play.google.com/store/apps/details?id=in.micy.racecalendar',
    ios: 'https://apps.apple.com/us/app/race-calendar/id1481539104',
  },
  {
    color: '#4439A1',
    name: 'Unicore',
    image: '/react-native-paper/showcase/unicore.png',
    android: 'https://play.google.com/store/apps/details?id=com.atude.mywam',
  },
  {
    color: '#19402E',
    name: 'TracksNZ',
    image: '/react-native-paper/showcase/tracksnz.png',
    android: 'https://play.google.com/store/apps/details?id=in.micy.tracksnz',
    ios: 'https://apps.apple.com/nz/app/tracks-nz/id1488245855',
  },
  {
    color: '#b985fc',
    name: 'Astrale',
    image: '/react-native-paper/showcase/astrale.png',
    github: 'https://github.com/jvidalv/astrale',
    android: 'https://play.google.com/store/apps/details?id=josep.astrale',
  },
  {
    color: '#29337a',
    name: 'Lyra Collect',
    image: '/react-native-paper/showcase/lyracollect.png',
    android:
      'https://play.google.com/store/apps/details?id=com.lyra.lyracollect',
    ios: 'https://apps.apple.com/fr/app/lyra-collect/id1469527737',
  },
  {
    color: '#673AB7',
    name: 'Rozy - Stay connected',
    image: '/react-native-paper/showcase/rozy.png',
    ios: 'https://apps.apple.com/us/app/rozy/id1511264722',
    android: 'https://play.google.com/store/apps/details?id=com.rozy_app.rozy',
  },
  {
    color: '#CC0E00',
    name: 'Zoomapto - Find Nearby Restaurants',
    image: '/react-native-paper/showcase/zoomapto.png',
    github: 'https://github.com/frederic11/Zoomapto',
    android:
      'https://play.google.com/store/apps/details?id=com.frederictech.zoomapto',
  },
  {
    color: '#1DE9B6',
    name: 'Groovy - Build Habits Together',
    image: '/react-native-paper/showcase/groovy.png',
    ios: 'https://apps.apple.com/us/app/groovy-set-your-goals/id1562352498',
    android:
      'https://play.google.com/store/apps/details?id=com.gabrieldierks.groovy',
  },
  {
    color: '#673AB7',
    name: 'Vibemap - Find Your Vibe',
    image: '/react-native-paper/showcase/vibemap.png',
    ios: 'https://apps.apple.com/us/app/vibemap/id1496385897#?platform=iphone',
    android:
      'https://play.google.com/store/apps/details?id=com.vibemap.hotspots',
  },
  {
    color: '#6200EE',
    name: 'Clutch - Transmission Remote',
    image: '/react-native-paper/showcase/clutch.png',
    android: 'https://play.google.com/store/apps/details?id=eu.tmdpw.clutch',
  },
  {
    color: '#111827',
    name: 'Quakemap',
    image: '/react-native-paper/showcase/quakemap.png',
    android: 'https://play.google.com/store/apps/details?id=com.sal.quakemap',
  },
  {
    color: '#5222d0',
    name: 'Homework Helper - Find HW Answers',
    image: '/react-native-paper/showcase/homeworkhelper.png',
    ios: 'https://apps.apple.com/app/homework-helper-app/id1632652122',
    android:
      'https://play.google.com/store/apps/details?id=com.kylehoell.homeworkhelper',
  },
  {
    color: '#E1352F',
    name: 'CrazyThursday',
    image: '/react-native-paper/showcase/crazythursday.jpg',
    github: 'https://github.com/shensven/Crazy-Thursday',
    android:
      'https://play.google.com/store/apps/details?id=com.shensven.crazythursday',
  },
  {
    color: '#566193',
    name: 'Moon Meet',
    image: '/react-native-paper/showcase/moonmeet.png',
    github: 'https://github.com/MoonMeet/MoonMeet-CrossPlatform',
  },
];

const getOpacity = (item?: string) => (item ? 1 : 0.4);

export default function Showcase() {
  return (
    <div className="showcase-gallery">
      {data.map((item) => {
        const tintColor = color(item.color).isLight() ? '#000000' : '#FFFFFF';
        return (
          <div key={item.image}>
            <div className="showcase-image-container">
              <img className="showcase-image" src={item.image} alt="" />
              <div
                className="showcase-info"
                style={{ backgroundColor: item.color }}
              >
                <h3
                  className="showcase-app-name"
                  style={{
                    color: tintColor,
                  }}
                >
                  {item.name}
                </h3>
                <div className="showcase-badge-container">
                  <a
                    href={item.android}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ opacity: getOpacity(item.android) }}
                  >
                    <GooglePlayIcon color={tintColor} />
                  </a>
                  <div className="showcase-separation" />
                  <a
                    href={item.ios}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ opacity: getOpacity(item.ios) }}
                  >
                    <AppStoreIcon color={tintColor} />
                  </a>
                  <div className="showcase-separation" />
                  <a
                    href={item.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ opacity: getOpacity(item.github) }}
                  >
                    <GithubIcon color={tintColor} />
                  </a>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
