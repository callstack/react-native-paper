import * as React from 'react';
import { StyleSheet, View } from 'react-native';

import {
  Badge,
  IconButton,
  List,
  MD2Colors,
  MD3Colors,
  Text,
  Switch,
} from 'react-native-paper';

import { useExampleTheme } from '../hooks/useExampleTheme';
import ScreenWrapper from '../ScreenWrapper';

const BadgeExample = () => {
  const [visible, setVisible] = React.useState<boolean>(true);
  const { isV3 } = useExampleTheme();

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
            <Badge visible={visible} style={styles.badge}>
              12
            </Badge>
          </View>
          <View style={styles.item}>
            <IconButton icon="inbox" size={36} style={styles.button} />
            <Badge
              visible={visible}
              style={[
                styles.badge,
                {
                  backgroundColor: isV3
                    ? MD3Colors.primary80
                    : MD2Colors.blue500,
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
            <Badge visible={visible} style={styles.badge} size={isV3 ? 6 : 8} />
          </View>
          <View style={styles.item}>
            <IconButton icon="receipt" size={36} style={styles.button} />
            <Badge visible={visible} style={styles.badge} size={isV3 ? 6 : 8} />
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
