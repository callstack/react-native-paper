import * as React from 'react';
import { StyleSheet, View } from 'react-native';

import {
  Badge,
  IconButton,
  List,
  Palette,
  Text,
  Switch,
} from 'react-native-paper';

import ScreenWrapper from '../ScreenWrapper';

const BadgeExample = () => {
  const [visible, setVisible] = React.useState<boolean>(true);

  return (
    <ScreenWrapper>
      <View style={[styles.row, styles.item]}>
        <Text style={styles.label} variant="bodyMedium">
          Show badges
        </Text>
        <Switch
          value={visible}
          onValueChange={(visible) => setVisible(visible)}
        />
      </View>
      <List.Section title="Text">
        <View style={styles.row}>
          <View style={styles.item}>
            <IconButton icon="palette-swatch" size={36} style={styles.button} />
            <Badge visible={visible} style={styles.textBadge}>
              12
            </Badge>
          </View>
          <View style={styles.item}>
            <IconButton icon="inbox" size={36} style={styles.button} />
            <Badge
              visible={visible}
              style={[
                styles.textBadge,
                {
                  backgroundColor: Palette.primary80,
                },
              ]}
            >
              999+
            </Badge>
          </View>
        </View>
      </List.Section>
      <List.Section title="Dot">
        <View style={styles.row}>
          <View style={styles.item}>
            <IconButton icon="book-open" size={36} style={styles.button} />
            <Badge visible={visible} style={styles.dotBadge} />
          </View>
          <View style={styles.item}>
            <IconButton icon="receipt" size={36} style={styles.button} />
            <Badge visible={visible} style={styles.dotBadge} />
          </View>
        </View>
      </List.Section>
    </ScreenWrapper>
  );
};

BadgeExample.title = 'Badge';

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  item: {
    margin: 16,
  },
  button: {
    opacity: 0.6,
  },
  textBadge: {
    position: 'absolute',
    top: 12,
    left: 38,
  },
  dotBadge: {
    position: 'absolute',
    top: 14,
    right: 14,
  },
  label: {
    flex: 1,
  },
});

export default BadgeExample;
