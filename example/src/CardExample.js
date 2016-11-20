/* @flow */

import React, { Component } from 'react';
import {
  ScrollView,
  StyleSheet,
} from 'react-native';
import {
  Title,
  Caption,
  Paragraph,
  Colors,
  Card,
  Button,
} from 'react-native-paper';

export default class CardExample extends Component {

  static title = 'Card';

  render() {
    return (
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <Card>
          <Card.Cover source={require('../assets/wrecked-ship.jpg')} />
          <Card.Content>
            <Title>Abandoned Ship</Title>
            <Paragraph>
              The Abandoned Ship is a wrecked ship located on Route 108 in Hoenn, originally being a ship named the S.S. Cactus. The second part of the ship can only be accessed by using Dive and contains the Scanner.
            </Paragraph>
          </Card.Content>
        </Card>
        <Card>
          <Card.Cover source={require('../assets/forest.jpg')} />
          <Card.Actions>
            <Button primary>Cancel</Button>
            <Button primary>Ok</Button>
          </Card.Actions>
        </Card>
        <Card>
          <Card.Content>
            <Title>Berries</Title>
            <Caption>Omega Ruby</Caption>
            <Paragraph>
              Dotted around the Hoenn region, you will find loamy soil, many of which are housing berries. Once you have picked the berries, then you have the ability to use that loamy soil to grow your own berries. These can be any berry and will require attention to get the best crop.
            </Paragraph>
          </Card.Content>
        </Card>
        <Card>
          <Card.Cover source={require('../assets/strawberries.jpg')} />
        </Card>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    backgroundColor: Colors.grey200,
    padding: 4,
  },
});
