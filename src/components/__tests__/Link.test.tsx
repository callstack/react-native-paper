import * as React from 'react';

import { render } from '@testing-library/react-native';

import Link from '../Link';

it('renders link', () => {
  const tree = render(
    <Link href="https://callstack.github.io/react-native-paper/">
      React native paper
    </Link>
  ).toJSON();
  expect(tree).toMatchSnapshot();
});

it('renders link with underline', () => {
  const tree = render(
    <Link href="https://callstack.github.io/react-native-paper/" underline>
      React native paper
    </Link>
  ).toJSON();
  expect(tree).toMatchSnapshot();
});

it('renders link to the right', () => {
  const tree = render(
    <Link
      href="https://callstack.github.io/react-native-paper/"
      position="right"
    >
      React native paper
    </Link>
  ).toJSON();
  expect(tree).toMatchSnapshot();
});

it('renders link to the center', () => {
  const tree = render(
    <Link
      href="https://callstack.github.io/react-native-paper/"
      position="center"
    >
      React native paper
    </Link>
  ).toJSON();
  expect(tree).toMatchSnapshot();
});

it('renders link in different size (displayLarge)', () => {
  const tree = render(
    <Link
      href="https://callstack.github.io/react-native-paper/"
      size="displayLarge"
    >
      React native paper
    </Link>
  ).toJSON();
  expect(tree).toMatchSnapshot();
});
it('renders link in different size (displayMedium)', () => {
  const tree = render(
    <Link
      href="https://callstack.github.io/react-native-paper/"
      size="displayMedium"
    >
      React native paper
    </Link>
  ).toJSON();
  expect(tree).toMatchSnapshot();
});
it('renders link in different size (displaySmall)', () => {
  const tree = render(
    <Link
      href="https://callstack.github.io/react-native-paper/"
      size="displaySmall"
    >
      React native paper
    </Link>
  ).toJSON();
  expect(tree).toMatchSnapshot();
});

it('renders link in different size (titleLarge)', () => {
  const tree = render(
    <Link
      href="https://callstack.github.io/react-native-paper/"
      size="titleLarge"
    >
      React native paper
    </Link>
  ).toJSON();
  expect(tree).toMatchSnapshot();
});
it('renders link in different size (titleMedium)', () => {
  const tree = render(
    <Link
      href="https://callstack.github.io/react-native-paper/"
      size="titleMedium"
    >
      React native paper
    </Link>
  ).toJSON();
  expect(tree).toMatchSnapshot();
});
it('renders link in different size (titleSmall)', () => {
  const tree = render(
    <Link
      href="https://callstack.github.io/react-native-paper/"
      size="titleSmall"
    >
      React native paper
    </Link>
  ).toJSON();
  expect(tree).toMatchSnapshot();
});

it('renders link in different size (bodyLarge)', () => {
  const tree = render(
    <Link
      href="https://callstack.github.io/react-native-paper/"
      size="bodyLarge"
    >
      React native paper
    </Link>
  ).toJSON();
  expect(tree).toMatchSnapshot();
});
it('renders link in different size (bodyMedium)', () => {
  const tree = render(
    <Link
      href="https://callstack.github.io/react-native-paper/"
      size="bodyMedium"
    >
      React native paper
    </Link>
  ).toJSON();
  expect(tree).toMatchSnapshot();
});
it('renders link in different size (bodySmall)', () => {
  const tree = render(
    <Link
      href="https://callstack.github.io/react-native-paper/"
      size="bodySmall"
    >
      React native paper
    </Link>
  ).toJSON();
  expect(tree).toMatchSnapshot();
});
