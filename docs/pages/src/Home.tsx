import * as React from 'react';
import { useState } from 'react';
import { styled } from 'linaria/react';
// @ts-ignore
import { Link, Header } from 'component-docs/components';
import ThemeIcon from '../../components/theme-icon';
import Content from './components/Content';

export default function Home() {
  const [isDark, setIsDark] = useState(false);

  return (
    <Container>
      <Header logo="images/sidebar-logo.svg" />
      <Content>
        <h1>
          Cross-platform{' '}
          <Highlighted target="_blank" href="https://material.io/design">
            Material Design
          </Highlighted>{' '}
          for React Native.
        </h1>
        <p>
          Paper is a collection of customizable and production-ready components
          for React Native, following Google’s Material Design guidelines.
        </p>
        <p>
          Try the demo on{' '}
          <a
            href="https://snack.expo.io/@react-native-paper/github.com-callstack-react-native-paper:example"
            target="_blank"
            rel="noopener noreferrer"
          >
            Snack
          </a>
          ,{' '}
          <a
            href="https://apps.apple.com/app/react-native-paper/id1548934513"
            target="_blank"
            rel="noopener noreferrer"
          >
            iOS
          </a>{' '}
          or{' '}
          <a
            href="https://play.google.com/store/apps/details?id=com.callstack.reactnativepaperexample"
            target="_blank"
            rel="noopener noreferrer"
          >
            Android
          </a>
          .
        </p>
        <Buttons>
          {/* @ts-ignore */}
          <Button className="primary" as={Link} to="getting-started">
            Get started
          </Button>
          <Button
            href="https://github.com/callstack/react-native-paper"
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub
          </Button>
        </Buttons>
        <ThemeSwitch>
          <Label
            className="switch-wrap"
            style={{ backgroundColor: isDark ? '#000' : '#6200ee' }}
          >
            <Input
              type="checkbox"
              checked={isDark}
              onChange={() => setIsDark((prevState) => !prevState)}
            />
            <Switch className="switch" />
          </Label>
          <ThemeIcon type={isDark ? 'dark' : 'light'} />
        </ThemeSwitch>
        {isDark ? (
          <Gallery>
            {screenshotsDark.map((image, i) => (
              // eslint-disable-next-line react/no-array-index-key
              <img
                style={{ boxShadow: ' 0 0 0 #fff' }}
                key={i}
                src={image}
                alt=""
              />
            ))}
          </Gallery>
        ) : (
          <Gallery>
            {screenshots.map((image, i) => (
              // eslint-disable-next-line react/no-array-index-key
              <img key={i} src={image} alt="" />
            ))}
          </Gallery>
        )}
      </Content>
    </Container>
  );
}

const PRIMARY_COLOR = '#6200ee';
const RESTING_SHADOW = '0 1px 3px rgba(0, 0, 0, 0.12)';

const Highlighted = styled.a`
  color: ${PRIMARY_COLOR};

  &:hover,
  &:focus,
  &:active {
    color: ${PRIMARY_COLOR};
  }
`;

const Container = styled.div`
  flex: 1;
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

const Button = styled.a`
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

  background-color: transparent;
  border-color: rgba(0, 0, 0, 0.24);
  color: ${PRIMARY_COLOR};

  &:hover,
  &:focus,
  &:active {
    background-color: rgba(98, 0, 238, 0.08);
    color: ${PRIMARY_COLOR};
  }

  &.primary {
    box-shadow: ${RESTING_SHADOW};
    background-color: ${PRIMARY_COLOR};
    border-color: ${PRIMARY_COLOR};
    color: #fff;

    &:hover,
    &:focus,
    &:active {
      background-color: ${PRIMARY_COLOR};
      color: #fff;
      box-shadow: 0 1px 2px rgba(0, 0, 0, 0.08), 0 3px 6px rgba(0, 0, 0, 0.24);
    }
  }
`;

const Gallery = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: flex-start;
  margin: 0px -16px;
  min-width: 0;

  > img {
    box-shadow: ${RESTING_SHADOW};
    display: block;
    max-height: 480px;
    width: auto;
    margin: 16px;
  }
`;

const Label = styled.label`
  cursor: pointer;
  background: #6200ee;
  padding: 3px;
  width: 33px;
  height: 20px;
  border-radius: 33.5px;
  display: grid;
  margin-right: 5px;
`;
const ThemeSwitch = styled.div`
  display: flex;
  flex-direction: row;
`;
const Input = styled.input`
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
  &:checked + .switch {
    grid-template-columns: 1fr 1fr 0fr;
  }
`;
const Switch = styled.div`
  height: 14px;
  width: 26px;
  display: grid;
  grid-template-columns: 0fr 1fr 1fr;
  transition: 0.2s;
  &:after {
    content: '';
    border-radius: 50%;
    background: #fff;
    grid-column: 2;
    transition: background 0.2s;
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
const screenshotsDark = [
  'gallery/button-dark.png',
  'gallery/input-dark.png',
  'gallery/card-dark.png',
  'gallery/appbar-dark.png',
  'gallery/searchbar-dark.png',
  'gallery/snackbar-dark.png',
  'gallery/chip-dark.png',
  'gallery/list-dark.png',
  'gallery/list-accordion-dark.png',
  'gallery/typography-dark.png',
  'gallery/bottom-navigation-dark.png',
  'gallery/fab-dark.png',
];
