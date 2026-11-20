import * as React from 'react';
import { Alert, Platform, StyleSheet, View } from 'react-native';

import {
  Avatar,
  Button,
  Card,
  Chip,
  IconButton,
  Text,
  useTheme,
} from 'react-native-paper';

import { PreferencesContext } from '../PreferencesContext';
import ScreenWrapper from '../ScreenWrapper';

type Variant = 'filled' | 'elevated' | 'outlined';

const variants: Variant[] = ['filled', 'elevated', 'outlined'];

const showMessage = (message: string) => {
  if (Platform.OS === 'web') {
    alert(message);
  } else {
    Alert.alert(message);
  }
};

const CustomHeader = () => (
  <View style={styles.customHeader}>
    <Avatar.Icon icon="leaf" size={40} />
    <View style={styles.customHeaderText}>
      <Text variant="titleMedium">Custom header</Text>
      <Text variant="bodySmall">Any React node in the header slot</Text>
    </View>
  </View>
);

const CardExample = () => {
  const { colors } = useTheme();
  const [variant, setVariant] = React.useState<Variant>('filled');
  const [isFavorite, setIsFavorite] = React.useState(false);
  const preferences = React.useContext(PreferencesContext);

  return (
    <ScreenWrapper contentContainerStyle={styles.screen}>
      <View style={styles.variants}>
        {variants.map((item) => (
          <Chip
            key={item}
            selected={variant === item}
            mode="outlined"
            onPress={() => setVariant(item)}
          >
            {item}
          </Chip>
        ))}
      </View>

      <Card
        variant={variant}
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
        variant={variant}
        media={
          <Card.Cover
            source={require('../../assets/images/bridge.jpg')}
            aspectRatio={16 / 9}
          />
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
              A responsive 16:9 cover with a title and subtitle in custom
              variants.
            </Text>
          </Card.Content>
        }
      />

      <Card
        variant={variant}
        title="Berries that are trimmed at the end"
        subtitle="Omega Ruby"
        leading={(props) => <Avatar.Icon {...props} icon="folder" />}
        trailing={(props) => (
          <IconButton
            {...props}
            accessibilityLabel="More options"
            icon="dots-vertical"
            onPress={() => showMessage('More options')}
          />
        )}
        content={
          <Card.Content>
            <Text variant="bodyMedium">
              Dotted around the Hoenn region, you will find loamy soil, many of
              which are housing berries. Once you have picked the berries, then
              you have the ability to use that loamy soil to grow your own
              berries.
            </Text>
          </Card.Content>
        }
      />

      <Card
        variant={variant}
        media={
          <Card.Cover
            source={require('../../assets/images/restaurant-1.jpg')}
          />
        }
        title="Custom Button styles"
        actions={
          <Card.Actions>
            <Button
              mode="outlined"
              shape="square"
              theme={{ shapes: { corner: { medium: 12 } } }}
              onPress={() => showMessage('Shared')}
            >
              Share
            </Button>
            <Button
              mode="filled"
              shape="square"
              theme={{ shapes: { corner: { medium: 12 } } }}
              onPress={() => showMessage('Explored')}
            >
              Explore
            </Button>
          </Card.Actions>
        }
      />

      <Card
        variant={variant}
        theme={{ shapes: { corner: { medium: 24 } } }}
        media={
          <Card.Cover source={require('../../assets/images/artist-2.jpg')} />
        }
        title="Custom border radius"
        subtitle="The cover follows the Card's shape"
      />

      <Card
        variant={variant}
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
            accessibilityLabel={
              isFavorite ? 'Remove from favorites' : 'Add to favorites'
            }
            icon={isFavorite ? 'heart' : 'heart-outline'}
            onPress={() => setIsFavorite(!isFavorite)}
          />
        )}
      />

      <Card
        variant={variant}
        accessibilityLabel="Pressable Chameleon"
        onPress={() => showMessage('The Chameleon is Pressed')}
        media={
          <Card.Cover source={require('../../assets/images/chameleon.jpg')} />
        }
        title="Pressable Chameleon"
        content={
          <Card.Content>
            <Text variant="bodyMedium">
              The whole Card is one target. If you press me, I will alert.
            </Text>
          </Card.Content>
        }
      />

      <Card
        variant={variant}
        accessibilityLabel="Long Pressable City"
        onLongPress={() => showMessage('The City is Long Pressed')}
        media={<Card.Cover source={require('../../assets/images/city.jpg')} />}
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
        variant={variant}
        accessibilityLabel="Switch the theme"
        onPress={() => preferences?.toggleTheme()}
        title="Pressable Theme Change"
        leading={(props) => <Avatar.Icon {...props} icon="format-paint" />}
        content={
          <Card.Content>
            <Text variant="bodyMedium">
              This is a pressable Card. If you press me, I will switch the
              theme.
            </Text>
          </Card.Content>
        }
      />

      <Text variant="titleMedium" style={styles.sectionTitle}>
        States and customization
      </Text>

      <Card
        variant={variant}
        media={
          <Card.Cover source={require('../../assets/images/forest.jpg')} />
        }
        actions={
          <Card.Actions>
            <Button mode="outlined" onPress={() => showMessage('Shared')}>
              Share
            </Button>
            <Button mode="filled" onPress={() => showMessage('Explored')}>
              Explore
            </Button>
          </Card.Actions>
        }
      />

      <Card
        variant={variant}
        disabled
        onPress={() => showMessage('Disabled Card pressed')}
        title="Disabled"
        content={
          <Card.Content>
            <Text variant="bodyMedium">Not focusable or pressable.</Text>
          </Card.Content>
        }
      />

      <Card
        variant={variant}
        dragged
        title="Dragged"
        content={
          <Card.Content>
            <Text variant="bodyMedium">
              The dragged look is controlled by the app.
            </Text>
          </Card.Content>
        }
      />

      <Card
        variant="elevated"
        elevation={3}
        title="Custom elevation"
        content={
          <Card.Content>
            <Text variant="bodyMedium">
              Set with the elevation prop. Only elevated Cards accept it.
            </Text>
          </Card.Content>
        }
      />

      <Card
        variant="outlined"
        borderColor={colors.primary}
        title="Custom outline color"
        content={
          <Card.Content>
            <Text variant="bodyMedium">Set with the borderColor prop.</Text>
          </Card.Content>
        }
      />

      <Card
        variant={variant}
        borderTopLeftRadius={4}
        borderTopRightRadius={32}
        borderBottomRightRadius={8}
        borderBottomLeftRadius={24}
        media={
          <Card.Cover
            source={require('../../assets/images/beach.jpg')}
            aspectRatio={2}
          />
        }
        title="Asymmetric shape"
      />

      <Card
        variant={variant}
        contentStyle={styles.horizontal}
        media={
          <Card.Cover
            source={require('../../assets/images/forest.jpg')}
            style={styles.horizontalCover}
          />
        }
        title="Horizontal layout"
        subtitle="Set flexDirection in contentStyle"
      />

      <Card
        variant={variant}
        header={<CustomHeader />}
        content={
          <Card.Content>
            <Text variant="bodyMedium">
              A neutral Card with independent actions.
            </Text>
          </Card.Content>
        }
        actions={
          <Card.Actions>
            <IconButton
              accessibilityLabel="Save"
              icon="bookmark-outline"
              onPress={() => showMessage('Saved')}
            />
            <Button mode="tonal" onPress={() => showMessage('Opened')}>
              Open
            </Button>
          </Card.Actions>
        }
      />
    </ScreenWrapper>
  );
};

CardExample.title = 'Card';

const styles = StyleSheet.create({
  screen: {
    gap: 8,
    padding: 8,
  },
  variants: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    paddingVertical: 4,
  },
  sectionTitle: {
    marginTop: 16,
  },
  horizontal: {
    flexDirection: 'row',
  },
  horizontalCover: {
    height: 80,
    width: 80,
  },
  customHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  customHeaderText: {
    flex: 1,
  },
});

export default CardExample;
