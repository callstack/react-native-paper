/* @flow */

import * as React from 'react';
import { Alert, ScrollView, StyleSheet } from 'react-native';
import {
  Avatar,
  Paragraph,
  Card,
  Button,
  IconButton,
  withTheme,
  type Theme,
} from 'react-native-paper';

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
        <Card style={styles.card}>
          <Card.Cover
            source={require('../../assets/images/wrecked-ship.jpg')}
          />
          <Card.Title title="Abandoned Ship" />
          <Card.Content>
            <Paragraph>
              The Abandoned Ship is a wrecked ship located on Route 108 in
              Hoenn, originally being a ship named the S.S. Cactus. The second
              part of the ship can only be accessed by using Dive and contains
              the Scanner.
            </Paragraph>
          </Card.Content>
        </Card>
        <Card style={styles.card}>
          <Card.Cover source={require('../../assets/images/forest.jpg')} />
          <Card.Actions>
            <Button onPress={() => {}}>Share</Button>
            <Button onPress={() => {}}>Explore</Button>
          </Card.Actions>
        </Card>
        <Card style={styles.card}>
          <Card.Title
            title="Berries that are trimmed at the end"
            subtitle="Omega Ruby"
            left={props => <Avatar.Icon {...props} icon="folder" />}
            right={props => (
              <IconButton {...props} icon="more-vert" onPress={() => {}} />
            )}
          />
          <Card.Content>
            <Paragraph>
              Dotted around the Hoenn region, you will find loamy soil, many of
              which are housing berries. Once you have picked the berries, then
              you have the ability to use that loamy soil to grow your own
              berries. These can be any berry and will require attention to get
              the best crop.
            </Paragraph>
          </Card.Content>
        </Card>
        <Card style={styles.card}>
          <Card.Cover
            source={require('../../assets/images/strawberries.jpg')}
          />
          <Card.Title
            title="Just Strawberries"
            subtitle="... and only Strawberries"
            right={props => (
              <IconButton {...props} icon="expand-more" onPress={() => {}} />
            )}
          />
        </Card>
        <Card
          style={styles.card}
          onPress={() => {
            Alert.alert('The Chameleon is Pressed');
          }}
        >
          <Card.Cover source={require('../../assets/images/chameleon.jpg')} />
          <Card.Title title="Pressable Chameleon" />
          <Card.Content>
            <Paragraph>
              This is a pressable chameleon. If you press me, I will alert.
            </Paragraph>
          </Card.Content>
        </Card>
        <Card
          style={styles.card}
          onLongPress={() => {
            Alert.alert('The City is Long Pressed');
          }}
        >
          <Card.Cover source={require('../../assets/images/city.jpg')} />
          <Card.Title
            title="Long Pressable City"
            left={props => <Avatar.Icon {...props} icon="location-city" />}
          />
          <Card.Content>
            <Paragraph>
              This is a long press only city. If you long press me, I will
              alert.
            </Paragraph>
          </Card.Content>
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
  card: {
    margin: 4,
  },
});

export default withTheme(CardExample);
