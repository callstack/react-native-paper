/* @flow */

import * as React from 'react';
import Home from './src/Home';

export default class Index extends React.Component<{}> {
  static meta = {
    title: 'Home',
    description: 'Material design for React Native',
    permalink: 'index',
  };

  render() {
    return <Home />;
  }
}
