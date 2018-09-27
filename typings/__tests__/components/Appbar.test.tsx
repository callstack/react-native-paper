import * as React from 'react';
import { Appbar } from '../../..';

class AppbarTest extends React.Component {
  handleOnPress = () => {
    console.log('Pressed');
  };
  render() {
    return (
      <Appbar>
        <Appbar.Action icon="archive" onPress={this.handleOnPress} />
        <Appbar.Action icon="mail" onPress={this.handleOnPress} />
        <Appbar.Action icon="label" onPress={this.handleOnPress} />
        <Appbar.Action icon="delete" onPress={this.handleOnPress} />
      </Appbar>
    );
  }
}

class AppbarComponentsTest extends React.Component {
  handler = () => {
    console.log('Pressed onBack');
  };
  render() {
    return (
      <Appbar.Header>
        <Appbar.BackAction onPress={this.handler} />
        <Appbar.Content title="Title" subtitle="Subtitle" />
        <Appbar.Action icon="search" onPress={this.handler} />
        <Appbar.Action icon="more-vert" onPress={this.handler} />
      </Appbar.Header>
    );
  }
}
