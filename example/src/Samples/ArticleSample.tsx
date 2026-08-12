import * as React from 'react';
import { StyleSheet, View } from 'react-native';

import {
  Button,
  Card,
  Chip,
  FAB,
  IconButton,
  Text,
  Tooltip,
} from 'react-native-paper';

import type { SampleConfig } from './types';
import ScreenWrapper from '../ScreenWrapper';

export const ArticleSampleConfig: SampleConfig = {
  title: 'Article',
  icon: 'newspaper-variant-outline',
  components: [
    'Button',
    'Card',
    'Chip',
    'FAB',
    'IconButton',
    'Text',
    'Tooltip',
  ],
};

const TOPICS = ['Material 3', 'Design systems', 'React Native'];

const ArticleSample = () => {
  const [liked, setLiked] = React.useState(false);
  const [bookmarked, setBookmarked] = React.useState(false);
  const [menuExpanded, setMenuExpanded] = React.useState(false);

  return (
    <>
      <ScreenWrapper contentContainerStyle={styles.content}>
        <Card>
          <Card.Cover source={require('../../assets/images/bridge.jpg')} />
          <Card.Title
            title="Designing with Paper"
            subtitle="8 min read · Updated today"
          />
          <Card.Content style={styles.cardContent}>
            <Text variant="bodyMedium">
              Material Design 3 leans on tonal color, larger corner radii and
              motion to express hierarchy. Paper ships those decisions as
              components, so a screen built from the defaults already follows
              the spec.
            </Text>
            <View style={styles.topics}>
              {TOPICS.map((topic) => (
                <Chip key={topic} compact>
                  {topic}
                </Chip>
              ))}
            </View>
          </Card.Content>
          <Card.Actions>
            <Tooltip title={liked ? 'Remove like' : 'Like'}>
              <IconButton
                icon={liked ? 'heart' : 'heart-outline'}
                selected={liked}
                onPress={() => setLiked(!liked)}
              />
            </Tooltip>
            <Tooltip title={bookmarked ? 'Remove bookmark' : 'Bookmark'}>
              <IconButton
                icon={bookmarked ? 'bookmark' : 'bookmark-outline'}
                selected={bookmarked}
                onPress={() => setBookmarked(!bookmarked)}
              />
            </Tooltip>
            <Button mode="contained" onPress={() => {}}>
              Read
            </Button>
          </Card.Actions>
        </Card>
      </ScreenWrapper>

      <FAB.Menu
        expanded={menuExpanded}
        onDismiss={() => setMenuExpanded(false)}
        trigger={{
          icon: 'share-variant',
          onPress: () => setMenuExpanded(true),
        }}
        items={[
          { icon: 'link', label: 'Copy link', onPress: () => {} },
          { icon: 'email', label: 'Send by email', onPress: () => {} },
          { icon: 'comment-outline', label: 'Comment', onPress: () => {} },
        ]}
      />
    </>
  );
};

const styles = StyleSheet.create({
  content: {
    padding: 16,
  },
  cardContent: {
    gap: 16,
  },
  topics: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
});

export default ArticleSample;
