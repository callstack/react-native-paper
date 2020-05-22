import * as React from 'react';
import { View, StyleSheet } from 'react-native';
import {
  Badge,
  IconButton,
  List,
  Paragraph,
  Switch,
  Colors,
  useTheme,
} from 'react-native-paper';

const BadgeExample = () => {
  const [visible, setVisible] = React.useState<boolean>(true);
  const {
    colors: { background },
  } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: background }]}>
      <View style={[styles.row, styles.item]}>
        <Paragraph style={styles.label}>Show badges</Paragraph>
        <Switch
          value={visible}
          onValueChange={visible => setVisible(visible)}
        />
      </View>
      <List.Section title="Text">
        <View style={styles.row}>
          <View style={styles.item}>
            <IconButton icon="palette-swatch" size={36} style={styles.button} />
            <Badge visible={visible} style={styles.badge}>
              12
            </Badge>
          </View>
          <View style={styles.item}>
            <IconButton icon="inbox" size={36} style={styles.button} />
            <Badge
              visible={visible}
              style={[styles.badge, { backgroundColor: Colors.blue500 }]}
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
            <Badge visible={visible} style={styles.badge} size={8} />
          </View>
          <View style={styles.item}>
            <IconButton icon="receipt" size={36} style={styles.button} />
            <Badge visible={visible} style={styles.badge} size={8} />
          </View>
        </View>
      </List.Section>
    </View>
  );
};

BadgeExample.title = 'Badge';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
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
  badge: {
    position: 'absolute',
    top: 4,
    right: 0,
  },
  label: {
    flex: 1,
  },
});

export default BadgeExample;
