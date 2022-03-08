import * as React from 'react';
import { StyleSheet } from 'react-native';
import renderer from 'react-test-renderer';
import Button from '../Button/Button.tsx';
import { pink500 } from '../../styles/themes/v2/colors';

const styles = StyleSheet.create({
  flexing: {
    flexDirection: 'row-reverse',
  },
});

it('renders text button by default', () => {
  const tree = renderer.create(<Button>Text Button</Button>).toJSON();

  expect(tree).toMatchSnapshot();
});

it('renders text button with mode', () => {
  const tree = renderer
    .create(<Button mode="text">Text Button</Button>)
    .toJSON();

  expect(tree).toMatchSnapshot();
});

it('renders outlined button with mode', () => {
  const tree = renderer
    .create(<Button mode="outlined">Outlined Button</Button>)
    .toJSON();

  expect(tree).toMatchSnapshot();
});

it('renders contained contained with mode', () => {
  const tree = renderer
    .create(<Button mode="contained">Contained Button</Button>)
    .toJSON();

  expect(tree).toMatchSnapshot();
});

it('renders button with icon', () => {
  const tree = renderer
    .create(<Button icon="camera">Icon Button</Button>)
    .toJSON();

  expect(tree).toMatchSnapshot();
});

it('renders button with icon in reverse order', () => {
  const tree = renderer
    .create(
      <Button icon="chevron-right" contentStyle={styles.flexing}>
        Right Icon
      </Button>
    )
    .toJSON();

  expect(tree).toMatchSnapshot();
});

it('renders loading button', () => {
  const tree = renderer
    .create(<Button loading>Loading Button</Button>)
    .toJSON();

  expect(tree).toMatchSnapshot();
});

it('renders disabled button', () => {
  const tree = renderer
    .create(<Button disabled>Disabled Button</Button>)
    .toJSON();

  expect(tree).toMatchSnapshot();
});

it('renders button with color', () => {
  const tree = renderer
    .create(<Button color={pink500}>Custom Button</Button>)
    .toJSON();

  expect(tree).toMatchSnapshot();
});

it('renders button with custom testID', () => {
  const tree = renderer
    .create(<Button testID={'custom:testID'}>Button with custom testID</Button>)
    .toJSON();

  expect(tree).toMatchSnapshot();
});

it('renders button with an accessibility label', () => {
  const tree = renderer
    .create(
      <Button accessibilityLabel={'label'}>
        Button with accessibility label
      </Button>
    )
    .toJSON();

  expect(tree).toMatchSnapshot();
});

it('renders button with an accessibility hint', () => {
  const tree = renderer
    .create(
      <Button accessibilityHint={'hint'}>Button with accessibility hint</Button>
    )
    .toJSON();

  expect(tree).toMatchSnapshot();
});
