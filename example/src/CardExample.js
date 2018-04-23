/* @flow */

import * as React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import {
  Title,
  Caption,
  Paragraph,
  Card,
  CardCover,
  CardActions,
  CardContent,
  Button,
  withTheme,
} from 'react-native-paper';
import type { Theme } from 'react-native-paper/types';

type Props = {
  theme: Theme,
};

class CardExample extends React.Component<Props> {
  static title = 'Card';

  render() {
    const {
      theme: {
        colors: { background },
      },
    } = this.props;
    return (
      <ScrollView
        style={[styles.container, { backgroundColor: background }]}
        contentContainerStyle={styles.content}
      >
        <Card>
          <CardCover source={require('../assets/wrecked-ship.jpg')} />
          <CardContent>
            <Title>Abandoned Ship</Title>
            <Paragraph>
              The Abandoned Ship is a wrecked ship located on Route 108 in
              Hoenn, originally being a ship named the S.S. Cactus. The second
              part of the ship can only be accessed by using Dive and contains
              the Scanner.
            </Paragraph>
          </CardContent>
        </Card>
        <Card>
          <CardCover source={require('../assets/forest.jpg')} />
          <CardActions>
            <Button primary onPress={() => {}}>
              Share
            </Button>
            <Button primary onPress={() => {}}>
              Explore
            </Button>
          </CardActions>
        </Card>
        <Card>
          <CardContent>
            <Title>Berries</Title>
            <Caption>Omega Ruby</Caption>
            <Paragraph>
              Dotted around the Hoenn region, you will find loamy soil, many of
              which are housing berries. Once you have picked the berries, then
              you have the ability to use that loamy soil to grow your own
              berries. These can be any berry and will require attention to get
              the best crop.
            </Paragraph>
          </CardContent>
        </Card>
        <Card>
          <CardCover source={require('../assets/strawberries.jpg')} />
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
    padding: 4,
  },
});

export default withTheme(CardExample);
