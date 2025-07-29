import * as React from 'react';

import { render } from '@testing-library/react-native';

import CircularProgressBar from '../CircularProgressBar';

it('renders animated circular progress bar with 100% progress', () => {
  const tree = render(
    <CircularProgressBar progress={1} animating={true} />
  ).toJSON();

  expect(tree).toMatchSnapshot();
});

it('renders circular progress bar with 100% progress', () => {
  const tree = render(
    <CircularProgressBar progress={1} animating={false} />
  ).toJSON();

  expect(tree).toMatchSnapshot();
});

it('renders animated circular progress bar and 70% progress', () => {
  const tree = render(
    <CircularProgressBar progress={0.7} animating={true} />
  ).toJSON();

  expect(tree).toMatchSnapshot();
});

it('renders circular progress bar with 70% progress', () => {
  const tree = render(
    <CircularProgressBar progress={0.7} animating={false} />
  ).toJSON();

  expect(tree).toMatchSnapshot();
});

it('renders animated circular progress bar with 40% progress', () => {
  const tree = render(
    <CircularProgressBar progress={0.4} animating={true} />
  ).toJSON();

  expect(tree).toMatchSnapshot();
});

it('renders circular progress bar with 40% progress', () => {
  const tree = render(
    <CircularProgressBar progress={0.4} animating={false} />
  ).toJSON();

  expect(tree).toMatchSnapshot();
});

it('renders animated circular progress bar with 0% progress', () => {
  const tree = render(
    <CircularProgressBar progress={0} animating={true} />
  ).toJSON();

  expect(tree).toMatchSnapshot();
});

it('renders circular progress bar with 0% progress', () => {
  const tree = render(
    <CircularProgressBar progress={0} animating={false} />
  ).toJSON();

  expect(tree).toMatchSnapshot();
});

it('renders large animated circular progress bar', () => {
  const tree = render(
    <CircularProgressBar progress={0.5} size="large" />
  ).toJSON();

  expect(tree).toMatchSnapshot();
});

it('renders colored animated circular progress bar', () => {
  const tree = render(
    <CircularProgressBar progress={0.5} color="#FF0000" />
  ).toJSON();

  expect(tree).toMatchSnapshot();
});
