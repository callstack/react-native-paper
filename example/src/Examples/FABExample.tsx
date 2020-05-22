import * as React from 'react';
import { View, StyleSheet } from 'react-native';
import { Colors, FAB, Portal, useTheme } from 'react-native-paper';

const ButtonExample = () => {
  const [visible, setVisible] = React.useState<boolean>(true);
  const [open, setOpen] = React.useState<boolean>(false);

  const {
    colors: { background },
  } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: background }]}>
      <View style={styles.row}>
        <FAB
          small
          icon={visible ? 'eye-off' : 'eye'}
          style={styles.fab}
          onPress={() => setVisible(!visible)}
        />
      </View>

      <View style={styles.row}>
        <FAB
          icon="heart"
          style={styles.fab}
          onPress={() => {}}
          visible={visible}
        />
        <FAB
          icon="check"
          label="Extended FAB"
          style={styles.fab}
          onPress={() => {}}
          visible={visible}
        />
        <FAB
          icon="cancel"
          label="Disabled FAB"
          style={styles.fab}
          onPress={() => {}}
          visible={visible}
          disabled
        />

        <FAB
          icon="cancel"
          label="Loading FAB"
          style={styles.fab}
          onPress={() => {}}
          visible={visible}
          loading
        />
        <Portal>
          <FAB.Group
            open={open}
            icon={open ? 'calendar-today' : 'plus'}
            actions={[
              { icon: 'plus', onPress: () => {} },
              { icon: 'star', label: 'Star', onPress: () => {} },
              { icon: 'email', label: 'Email', onPress: () => {} },
              { icon: 'bell', label: 'Remind', onPress: () => {} },
            ]}
            onStateChange={({ open }: { open: boolean }) => setOpen(open)}
            onPress={() => {
              if (open) {
                // do something if the speed dial is open
              }
            }}
            visible={visible}
          />
        </Portal>
      </View>
    </View>
  );
};

ButtonExample.title = 'Floating Action Button';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.grey200,
    padding: 4,
  },

  row: {
    justifyContent: 'center',
    alignItems: 'center',
  },

  fab: {
    margin: 8,
  },
});

export default ButtonExample;
