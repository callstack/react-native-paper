import * as React from 'react';
import { View, StyleSheet } from 'react-native';
import { FAB, Portal, useTheme } from 'react-native-paper';
import ScreenWrapper from '../ScreenWrapper';

const FABExample = () => {
  const [visible, setVisible] = React.useState<boolean>(true);
  const [open, setOpen] = React.useState<boolean>(false);
  const { isV3, md } = useTheme();

  return (
    <ScreenWrapper style={styles.container}>
      <View style={styles.row}>
        <FAB
          size="small"
          icon={visible ? 'eye-off' : 'eye'}
          style={styles.fab}
          onPress={() => setVisible(!visible)}
        />
        <FAB
          icon="heart"
          style={styles.fab}
          onPress={() => {}}
          visible={visible}
        />
        <FAB
          icon="heart"
          style={styles.fab}
          onPress={() => {}}
          visible={visible}
          size="large"
          mode="flat"
        />
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
          icon="format-letter-case"
          label="Mixed case"
          style={styles.fab}
          onPress={() => {}}
          visible={visible}
          uppercase
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
              {
                icon: 'bell',
                label: 'Remind',
                onPress: () => {},
              },
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
    </ScreenWrapper>
  );
};

FABExample.title = 'Floating Action Button';

const styles = StyleSheet.create({
  container: {
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

export default FABExample;
