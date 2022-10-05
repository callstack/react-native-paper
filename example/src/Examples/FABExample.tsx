import * as React from 'react';
import { StyleSheet, View } from 'react-native';

import { FAB, Portal, Text } from 'react-native-paper';

import { useExampleTheme } from '..';
import ScreenWrapper from '../ScreenWrapper';

type FABVariant = 'primary' | 'secondary' | 'tertiary' | 'surface';
type FABSize = 'small' | 'medium' | 'large';
type FABMode = 'flat' | 'elevated';

const FABExample = () => {
  const [visible, setVisible] = React.useState<boolean>(true);
  const [open, setOpen] = React.useState<boolean>(false);
  const { isV3 } = useExampleTheme();

  const variants = ['primary', 'secondary', 'tertiary', 'surface'];
  const sizes = ['small', 'medium', 'large'];
  const modes = ['flat', 'elevated'];

  return (
    <ScreenWrapper style={styles.container}>
      <View style={styles.column}>
        <FAB
          icon={visible ? 'eye-off' : 'eye'}
          size="small"
          style={styles.fab}
          onPress={() => setVisible(!visible)}
        />
      </View>
      {isV3 && (
        <>
          <View style={styles.row}>
            {variants.map((variant) => (
              <View style={styles.fabVariant} key={variant}>
                <FAB
                  icon="pencil"
                  style={styles.fab}
                  onPress={() => {}}
                  visible={visible}
                  variant={variant as FABVariant}
                />
                {visible && <Text variant="bodyMedium">{variant}</Text>}
              </View>
            ))}
          </View>
          <View style={styles.row}>
            {sizes.map((size) => (
              <View style={styles.fabVariant} key={size}>
                <FAB
                  icon="pencil"
                  style={styles.fab}
                  onPress={() => {}}
                  visible={visible}
                  size={size as FABSize}
                />
                {visible && <Text variant="bodyMedium">{size}</Text>}
              </View>
            ))}
          </View>
          <View style={styles.row}>
            {modes.map((mode) => (
              <View style={styles.fabVariant} key={mode}>
                <FAB
                  icon="pencil"
                  style={styles.fab}
                  onPress={() => {}}
                  visible={visible}
                  mode={mode as FABMode}
                />
                {visible && <Text variant="bodyMedium">{mode}</Text>}
              </View>
            ))}
          </View>
        </>
      )}
      <View style={styles.column}>
        {!isV3 && (
          <>
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
            />
          </>
        )}
        <FAB
          icon="map"
          style={styles.fab}
          customSize={64}
          onPress={() => {}}
          visible={visible}
        />
        <FAB
          icon="map"
          label="Extended FAB with custom size"
          style={styles.fab}
          customSize={64}
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
                size: isV3 ? 'small' : 'medium',
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
    marginBottom: 8,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  column: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  fab: {
    margin: 8,
  },
  fabVariant: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});

export default FABExample;
