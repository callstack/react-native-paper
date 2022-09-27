/* @flow */

import * as React from 'react';

import Home from './src/Home';

export default class Index extends React.Component<{}> {
  render() {
    return <Home />;
  }
}

export const meta = {
  title: 'Home',
  description: 'Material design for React Native',
  link: 'index',
};
