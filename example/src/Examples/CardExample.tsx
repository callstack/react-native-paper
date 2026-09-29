import { Alert, Platform, StyleSheet, View } from 'react-native';

import {
  Avatar,
  Button,
  Card,
  DarkTheme,
  IconButton,
  LightTheme,
  Text,
  ThemeProvider,
  useTheme,
} from 'react-native-paper';
import type { CardCoverProps, Theme } from 'react-native-paper';

import CardRenderCountExample from './CardRenderCountExample';
import ScreenWrapper from '../ScreenWrapper';

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
      <Text variant="bodySmall">Neutral container, independent actions</Text>
    </View>
  </View>
);

const ResponsiveCover = ({
  aspectRatio = 16 / 9,
  ...props
}: Omit<CardCoverProps, 'style'> & { aspectRatio?: number }) => (
  <View style={[styles.mediaFrame, { aspectRatio }]}>
    <Card.Cover {...props} style={styles.mediaFill} />
  </View>
);

const ThemePreview = ({ name }: { name: string }) => {
  const theme = useTheme();

  return (
    <View
      style={[
        styles.themePreview,
        {
          backgroundColor: theme.colors.background,
          borderColor: theme.colors.outlineVariant,
        },
      ]}
    >
      <Text variant="titleMedium">{name}</Text>
      <Card
        testID={`card-theme-${name.toLowerCase()}-filled`}
        onPress={() => showMessage(`${name} filled Card pressed`)}
        onLongPress={() => showMessage(`${name} filled Card long pressed`)}
        title="Filled interaction"
        subtitle="Tab, hover, press, or long press"
        content={
          <Card.Content>
            <Text variant="bodySmall">
              State layers and keyboard focus stay inside the shape.
            </Text>
          </Card.Content>
        }
      />
      <Card
        variant="elevated"
        dragged
        title="Elevated · dragged"
        content={
          <Card.Content>
            <Text variant="bodySmall">Compare the raised surface.</Text>
          </Card.Content>
        }
      />
      <Card
        variant="outlined"
        borderTopLeftRadius={4}
        borderTopRightRadius={28}
        borderBottomRightRadius={4}
        borderBottomLeftRadius={28}
        media={
          <ResponsiveCover
            aspectRatio={2}
            accessible={false}
            aria-hidden
            source={require('../../assets/images/forest.jpg')}
          />
        }
        title="Outlined clipping"
      />
    </View>
  );
};

const ThemedPreview = ({ name, theme }: { name: string; theme: Theme }) => (
  <ThemeProvider theme={theme}>
    <ThemePreview name={name} />
  </ThemeProvider>
);

const CardExample = () => {
  const theme = useTheme();

  return (
    <ScreenWrapper contentContainerStyle={styles.screen}>
      <View style={styles.intro}>
        <Text variant="headlineSmall">Expressive Card gallery</Text>
        <Text variant="bodyMedium">
          Filled is the default. Whole-Card actions are shown without nested
          controls; neutral Cards own any independent actions.
        </Text>
      </View>

      <View style={styles.section}>
        <Text variant="titleLarge">Variants and composition</Text>
        <View style={styles.gallery}>
          <Card
            style={styles.galleryCard}
            testID="card-gallery-filled"
            accessibilityLabel="Open the default filled Card example"
            onPress={() => showMessage('Default filled Card pressed')}
            onLongPress={() => showMessage('Default filled Card long pressed')}
            media={
              <ResponsiveCover
                accessible={false}
                aria-hidden
                source={require('../../assets/images/wrecked-ship.jpg')}
              />
            }
            title="Filled (default)"
            subtitle="Actionable Card"
            content={
              <Card.Content>
                <Text variant="bodyMedium">
                  One coherent target with direct title and content slots.
                </Text>
              </Card.Content>
            }
          />

          <Card
            style={styles.galleryCard}
            variant="elevated"
            header={<CustomHeader />}
            content={
              <Card.Content>
                <Text variant="bodyMedium">
                  Card.Actions preserves each control&apos;s own presentation.
                </Text>
              </Card.Content>
            }
            actions={
              <Card.Actions>
                <IconButton
                  accessibilityLabel="Save custom header example"
                  icon="bookmark-outline"
                  onPress={() => showMessage('Saved')}
                />
                <Button
                  mode="contained-tonal"
                  onPress={() => showMessage('Opened')}
                >
                  Open
                </Button>
              </Card.Actions>
            }
          />

          <Card
            style={styles.galleryCard}
            variant="outlined"
            media={
              <ResponsiveCover
                accessible
                accessibilityRole="image"
                accessibilityLabel="A bridge crossing a green valley"
                source={require('../../assets/images/bridge.jpg')}
              />
            }
            title="Outlined"
            subtitle="Responsive informative media"
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text variant="titleLarge">States, shapes, and omitted slots</Text>
        <View style={styles.gallery}>
          <Card
            style={styles.compactCard}
            variant="outlined"
            disabled
            onPress={() => showMessage('Disabled Card pressed')}
            title="Disabled action"
            content={
              <Card.Content>
                <Text variant="bodySmall">Not focusable or pressable.</Text>
              </Card.Content>
            }
          />
          <Card
            style={styles.compactCard}
            variant="elevated"
            dragged
            title="Dragged presentation"
            content={
              <Card.Content>
                <Text variant="bodySmall">Controlled visual state.</Text>
              </Card.Content>
            }
          />
          <Card
            style={styles.compactCard}
            borderTopLeftRadius={4}
            borderTopRightRadius={32}
            borderBottomRightRadius={8}
            borderBottomLeftRadius={24}
            media={
              <ResponsiveCover
                accessible={false}
                aria-hidden
                source={require('../../assets/images/strawberries.jpg')}
              />
            }
            content={
              <Card.Content>
                <Text variant="bodyMedium">Asymmetric shape, no header.</Text>
              </Card.Content>
            }
          />
          <Card
            style={styles.compactCard}
            header={
              <Card.Title
                title="Header only"
                subtitle="Media, content, and actions omitted"
                titleVariant="headlineSmall"
                subtitleVariant="bodyMedium"
                left={(props) => <Avatar.Icon {...props} icon="folder" />}
                right={(props) => (
                  <IconButton
                    {...props}
                    accessibilityLabel="More header-only options"
                    icon="dots-vertical"
                    onPress={() => showMessage('More options')}
                  />
                )}
              />
            }
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text variant="titleLarge">Light and dark verification</Text>
        <Text variant="bodyMedium">
          Compare surfaces, outlines, elevation, clipping, and interaction
          feedback without changing the application theme.
        </Text>
        <View style={styles.gallery}>
          <ThemedPreview name="Light" theme={LightTheme} />
          <ThemedPreview name="Dark" theme={DarkTheme} />
        </View>
      </View>

      <View
        style={[
          styles.verification,
          { borderColor: theme.colors.outlineVariant },
        ]}
      >
        <Text variant="titleMedium">Platform verification</Text>
        <Text variant="bodySmall">
          Android · iOS · web: compare layout, both themes, surface roles,
          outlines, clipping, and elevation.
        </Text>
        <Text variant="bodySmall">
          Web: use Tab and hover on actionable Cards to inspect focus and state
          layers.
        </Text>
        <Text variant="bodySmall">
          Native: touch actionable Cards to inspect bounded ripple, clipping,
          and elevation. Current platform: {Platform.OS}.
        </Text>
      </View>

      <View style={styles.section}>
        <CardRenderCountExample />
      </View>
    </ScreenWrapper>
  );
};

CardExample.title = 'Card';

const styles = StyleSheet.create({
  screen: {
    gap: 28,
    padding: 16,
  },
  intro: {
    gap: 8,
  },
  section: {
    gap: 12,
  },
  gallery: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  galleryCard: {
    minWidth: 260,
    flexBasis: 300,
    flexGrow: 1,
  },
  compactCard: {
    minWidth: 220,
    flexBasis: 250,
    flexGrow: 1,
  },
  mediaFrame: {
    overflow: 'hidden',
    width: '100%',
  },
  mediaFill: {
    height: '100%',
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
  themePreview: {
    borderWidth: 1,
    flexBasis: 300,
    flexGrow: 1,
    gap: 12,
    minWidth: 260,
    padding: 16,
  },
  verification: {
    borderLeftWidth: 4,
    gap: 6,
    paddingLeft: 12,
  },
});

export default CardExample;
