import * as React from 'react';
import { Alert, ScrollView, StyleSheet, View } from 'react-native';
import {
  Avatar,
  Paragraph,
  Card,
  Button,
  IconButton,
  useTheme,
  Text,
  Switch,
  Chip,
} from 'react-native-paper';
import { PreferencesContext } from '..';
import ScreenWrapper from '../ScreenWrapper';

const CardExample = () => {
  const { colors, isV3 } = useTheme();
  const [isOutlined, setIsOutlined] = React.useState(false);
  const isV2mode = isOutlined ? 'outlined' : 'elevated';
  const [isV3mode, setIsV3Mode] = React.useState('elevated') as any;
  const preferences = React.useContext(PreferencesContext);
  const mode = isV3 ? isV3mode : isV2mode;

  return (
    <ScreenWrapper contentContainerStyle={styles.content}>
      <View style={styles.preference}>
        {isV3 ? (
          <>
            {['elevated', 'outlined', 'filled'].map((mode) => (
              <Chip
                key={mode}
                icon="heart"
                selected={isV3mode === mode}
                mode="outlined"
                onPress={() => setIsV3Mode(mode)}
                style={styles.chip}
              >
                {mode}
              </Chip>
            ))}
          </>
        ) : (
          <>
            <Text>Outlined</Text>
            <Switch
              value={isOutlined}
              onValueChange={() =>
                setIsOutlined((prevIsOutlined) => !prevIsOutlined)
              }
            />
          </>
        )}
      </View>
      <ScrollView
        style={[styles.container, { backgroundColor: colors?.background }]}
        contentContainerStyle={styles.content}
      >
        <Card style={styles.card} mode={mode}>
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
        <Card style={styles.card} mode={mode}>
          <Card.Cover source={require('../../assets/images/forest.jpg')} />
          <Card.Actions>
            <Button onPress={() => {}}>Share</Button>
            <Button onPress={() => {}}>Explore</Button>
          </Card.Actions>
        </Card>
        <Card style={styles.card} mode={mode}>
          <Card.Title
            title="Berries that are trimmed at the end"
            subtitle="Omega Ruby"
            left={(props: any) => <Avatar.Icon {...props} icon="folder" />}
            right={(props: any) => (
              <IconButton {...props} icon="dots-vertical" onPress={() => {}} />
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
        <Card style={styles.card} mode={mode}>
          <Card.Cover
            source={require('../../assets/images/strawberries.jpg')}
          />
          <Card.Title
            title="Just Strawberries"
            subtitle="... and only Strawberries"
            right={(props: any) => (
              <IconButton {...props} icon="chevron-down" onPress={() => {}} />
            )}
          />
        </Card>
        <Card
          style={styles.card}
          onPress={() => {
            Alert.alert('The Chameleon is Pressed');
          }}
          mode={mode}
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
          mode={mode}
        >
          <Card.Cover source={require('../../assets/images/city.jpg')} />
          <Card.Title
            title="Long Pressable City"
            left={(props) => <Avatar.Icon {...props} icon="city" />}
          />
          <Card.Content>
            <Paragraph>
              This is a long press only city. If you long press me, I will
              alert.
            </Paragraph>
          </Card.Content>
        </Card>
        <Card
          style={styles.card}
          onPress={() => {
            preferences.toggleTheme();
          }}
          mode={mode}
        >
          <Card.Title
            title="Pressable Theme Change"
            left={(props) => <Avatar.Icon {...props} icon="format-paint" />}
          />
          <Card.Content>
            <Paragraph>
              This is pressable card. If you press me, I will switch the theme.
            </Paragraph>
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
    width: 100,
  },
  preference: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 8,
  },
});

export default CardExample;
