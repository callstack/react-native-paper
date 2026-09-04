import * as React from 'react';
import { Alert, Platform, ScrollView, StyleSheet } from 'react-native';

import {
  Avatar,
  Button,
  Card,
  IconButton,
  Text,
  useTheme,
} from 'react-native-paper';

import { PreferencesContext } from '../PreferencesContext';
import ScreenWrapper from '../ScreenWrapper';

const CardExample = () => {
  const { colors } = useTheme();
  const [isSelected, setIsSelected] = React.useState(false);
  const preferences = React.useContext(PreferencesContext);

  return (
    <ScreenWrapper contentContainerStyle={styles.content}>
      <ScrollView
        style={[styles.container, { backgroundColor: colors?.background }]}
        contentContainerStyle={styles.content}
      >
        <Card
          style={styles.card}
          media={
            <Card.Cover
              source={require('../../assets/images/wrecked-ship.jpg')}
            />
          }
          title="Abandoned Ship"
          content={
            <Card.Content>
              <Text variant="bodyMedium">
                The Abandoned Ship is a wrecked ship located on Route 108 in
                Hoenn, originally being a ship named the S.S. Cactus. The second
                part of the ship can only be accessed by using Dive and contains
                the Scanner.
              </Text>
            </Card.Content>
          }
        />
        <Card
          style={styles.card}
          media={
            <Card.Cover source={require('../../assets/images/bridge.jpg')} />
          }
          header={
            <Card.Title
              title="Title variant"
              subtitle="Subtitle variant"
              titleVariant="headlineMedium"
              subtitleVariant="bodyLarge"
            />
          }
          content={
            <Card.Content>
              <Text variant="bodyMedium">
                This is a card using title and subtitle with specified variants.
              </Text>
            </Card.Content>
          }
        />
        <Card
          style={styles.card}
          media={
            <Card.Cover source={require('../../assets/images/forest.jpg')} />
          }
          actions={
            <Card.Actions>
              <Button onPress={() => {}}>Share</Button>
              <Button onPress={() => {}}>Explore</Button>
            </Card.Actions>
          }
        />
        <Card
          style={styles.card}
          title="Berries that are trimmed at the end"
          subtitle="Omega Ruby"
          leading={(props) => <Avatar.Icon {...props} icon="folder" />}
          trailing={(props) => (
            <IconButton {...props} icon="dots-vertical" onPress={() => {}} />
          )}
          content={
            <Card.Content>
              <Text variant="bodyMedium">
                Dotted around the Hoenn region, you will find loamy soil, many
                of which are housing berries. Once you have picked the berries,
                then you have the ability to use that loamy soil to grow your
                own berries. These can be any berry and will require attention
                to get the best crop.
              </Text>
            </Card.Content>
          }
        />
        <Card
          style={styles.card}
          media={
            <Card.Cover
              source={require('../../assets/images/restaurant-1.jpg')}
            />
          }
          title="Custom Button styles"
          actions={
            <Card.Actions>
              <Button
                theme={{ shapes: { corner: { largeIncreased: 12 } } }}
                onPress={() => {}}
              >
                Share
              </Button>
              <Button
                theme={{ shapes: { corner: { largeIncreased: 12 } } }}
                onPress={() => {}}
              >
                Explore
              </Button>
            </Card.Actions>
          }
        />
        <Card
          style={styles.card}
          theme={{ shapes: { corner: { medium: 24 } } }}
          media={
            <Card.Cover
              source={require('../../assets/images/artist-2.jpg')}
              style={styles.customCoverRadius}
            />
          }
          title="Custom border radius"
          subtitle="... for card and cover"
        />
        <Card
          style={styles.card}
          media={
            <Card.Cover
              source={require('../../assets/images/strawberries.jpg')}
            />
          }
          title="Just Strawberries"
          subtitle="... and only Strawberries"
          trailing={(props) => (
            <IconButton
              {...props}
              icon={isSelected ? 'heart' : 'heart-outline'}
              onPress={() => setIsSelected(!isSelected)}
            />
          )}
        />
        <Card
          style={styles.card}
          onPress={() => {
            Platform.OS === 'web'
              ? alert('The Chameleon is Pressed')
              : Alert.alert('The Chameleon is Pressed');
          }}
          media={
            <Card.Cover source={require('../../assets/images/chameleon.jpg')} />
          }
          title="Pressable Chameleon"
          content={
            <Card.Content>
              <Text variant="bodyMedium">
                This is a pressable chameleon. If you press me, I will alert.
              </Text>
            </Card.Content>
          }
        />
        <Card
          style={styles.card}
          onLongPress={() => {
            Platform.OS === 'web'
              ? alert('The City is Long Pressed')
              : Alert.alert('The City is Long Pressed');
          }}
          media={
            <Card.Cover source={require('../../assets/images/city.jpg')} />
          }
          title="Long Pressable City"
          leading={(props) => <Avatar.Icon {...props} icon="city" />}
          content={
            <Card.Content>
              <Text variant="bodyMedium">
                This is a long press only city. If you long press me, I will
                alert.
              </Text>
            </Card.Content>
          }
        />
        <Card
          style={styles.card}
          onPress={() => {
            preferences?.toggleTheme();
          }}
          title="Pressable Theme Change"
          leading={(props) => <Avatar.Icon {...props} icon="format-paint" />}
          content={
            <Card.Content>
              <Text variant="bodyMedium">
                This is pressable card. If you press me, I will switch the
                theme.
              </Text>
            </Card.Content>
          }
        />
      </ScrollView>
    </ScreenWrapper>
  );
};

CardExample.title = 'Card';

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
  customCoverRadius: {
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    borderBottomRightRadius: 24,
  },
});

export default CardExample;
