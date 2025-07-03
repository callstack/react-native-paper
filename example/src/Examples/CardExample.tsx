import * as React from 'react';
import { Alert, ScrollView, StyleSheet, View } from 'react-native';

import {
  Avatar,
  Button,
  Card,
  Chip,
  IconButton,
  Paragraph,
  Text,
} from 'react-native-paper';

import { isWeb } from '../../utils';
import { useExampleTheme } from '../hooks/useExampleTheme';
import { PreferencesContext } from '../PreferencesContext';
import ScreenWrapper from '../ScreenWrapper';

type Mode = 'elevated' | 'outlined' | 'contained';

const CardExample = () => {
  const { colors, isV3 } = useExampleTheme();
  const [selectedMode, setSelectedMode] = React.useState('elevated' as Mode);
  const [isSelected, setIsSelected] = React.useState(false);
  const preferences = React.useContext(PreferencesContext);

  const modes = isV3
    ? ['elevated', 'outlined', 'contained']
    : ['elevated', 'outlined'];

  const TextComponent = isV3 ? Text : Paragraph;

  return (
    <ScreenWrapper contentContainerStyle={styles.content}>
      <View style={styles.preference}>
        {(modes as Mode[]).map((mode) => (
          <Chip
            key={mode}
            selected={selectedMode === mode}
            mode="outlined"
            onPress={() => setSelectedMode(mode)}
            style={styles.chip}
          >
            {mode}
          </Chip>
        ))}
      </View>
      <ScrollView
        style={[styles.container, { backgroundColor: colors?.background }]}
        contentContainerStyle={styles.content}
      >
        <Card style={styles.card} mode={selectedMode}>
          <Card.Cover
            source={require('../../assets/images/wrecked-ship.jpg')}
          />
          <Card.Title title="Abandoned Ship" />
          <Card.Content>
            <TextComponent variant="bodyMedium">
              The Abandoned Ship is a wrecked ship located on Route 108 in
              Hoenn, originally being a ship named the S.S. Cactus. The second
              part of the ship can only be accessed by using Dive and contains
              the Scanner.
            </TextComponent>
          </Card.Content>
        </Card>
        {isV3 && (
          <Card style={styles.card} mode={selectedMode}>
            <Card.Cover source={require('../../assets/images/bridge.jpg')} />
            <Card.Title
              title="Title variant"
              subtitle="Subtitle variant"
              titleVariant="headlineMedium"
              subtitleVariant="bodyLarge"
            />
            <Card.Content>
              <TextComponent variant="bodyMedium">
                This is a card using title and subtitle with specified variants.
              </TextComponent>
            </Card.Content>
          </Card>
        )}
        <Card style={styles.card} mode={selectedMode}>
          <Card.Cover source={require('../../assets/images/forest.jpg')} />
          <Card.Actions>
            <Button onPress={() => {}}>Share</Button>
            <Button onPress={() => {}}>Explore</Button>
          </Card.Actions>
        </Card>
        <Card style={styles.card} mode={selectedMode}>
          <Card.Title
            title="Berries that are trimmed at the end"
            subtitle="Omega Ruby"
            left={(props: any) => <Avatar.Icon {...props} icon="folder" />}
            right={(props: any) => (
              <IconButton {...props} icon="dots-vertical" onPress={() => {}} />
            )}
          />
          <Card.Content>
            <TextComponent variant="bodyMedium">
              Dotted around the Hoenn region, you will find loamy soil, many of
              which are housing berries. Once you have picked the berries, then
              you have the ability to use that loamy soil to grow your own
              berries. These can be any berry and will require attention to get
              the best crop.
            </TextComponent>
          </Card.Content>
        </Card>
        <Card style={styles.card} mode={selectedMode}>
          <Card.Cover
            source={require('../../assets/images/restaurant-1.jpg')}
          />
          <Card.Title title="Custom Button styles" />
          <Card.Actions>
            <Button style={styles.button} onPress={() => {}}>
              Share
            </Button>
            <Button style={styles.button} onPress={() => {}}>
              Explore
            </Button>
          </Card.Actions>
        </Card>
        <Card
          style={[styles.card, styles.customCardRadius]}
          mode={selectedMode}
        >
          <Card.Title
            title="Custom border radius"
            subtitle="... for card and cover"
          />
          <Card.Cover
            source={require('../../assets/images/artist-2.jpg')}
            style={styles.customCoverRadius}
          />
        </Card>
        <Card style={styles.card} mode={selectedMode}>
          <Card.Cover
            source={require('../../assets/images/strawberries.jpg')}
          />
          <Card.Title
            title="Just Strawberries"
            subtitle="... and only Strawberries"
            right={(props: any) => (
              <IconButton
                {...props}
                icon={isSelected ? 'heart' : 'heart-outline'}
                onPress={() => setIsSelected(!isSelected)}
              />
            )}
          />
        </Card>
        <Card
          style={styles.card}
          onPress={() => {
            isWeb
              ? alert('The Chameleon is Pressed')
              : Alert.alert('The Chameleon is Pressed');
          }}
          mode={selectedMode}
        >
          <Card.Cover source={require('../../assets/images/chameleon.jpg')} />
          <Card.Title title="Pressable Chameleon" />
          <Card.Content>
            <TextComponent variant="bodyMedium">
              This is a pressable chameleon. If you press me, I will alert.
            </TextComponent>
          </Card.Content>
        </Card>
        <Card
          style={styles.card}
          onLongPress={() => {
            isWeb
              ? alert('The City is Long Pressed')
              : Alert.alert('The City is Long Pressed');
          }}
          mode={selectedMode}
        >
          <Card.Cover source={require('../../assets/images/city.jpg')} />
          <Card.Title
            title="Long Pressable City"
            left={(props) => <Avatar.Icon {...props} icon="city" />}
          />
          <Card.Content>
            <TextComponent variant="bodyMedium">
              This is a long press only city. If you long press me, I will
              alert.
            </TextComponent>
          </Card.Content>
        </Card>
        <Card
          style={styles.card}
          onPress={() => {
            preferences?.toggleTheme();
          }}
          mode={selectedMode}
        >
          <Card.Title
            title="Pressable Theme Change"
            left={(props) => <Avatar.Icon {...props} icon="format-paint" />}
          />
          <Card.Content>
            <TextComponent variant="bodyMedium">
              This is pressable card. If you press me, I will switch the theme.
            </TextComponent>
          </Card.Content>
        </Card>
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
  chip: {
    margin: 4,
  },
  preference: {
    alignItems: 'center',
    flexDirection: 'row',
    paddingVertical: 12,
    paddingHorizontal: 8,
  },
  button: {
    borderRadius: 12,
  },
  customCardRadius: {
    borderTopLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  customCoverRadius: {
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    borderBottomRightRadius: 24,
  },
});

export default CardExample;
