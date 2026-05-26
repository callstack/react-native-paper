import * as React from 'react';
import { StyleSheet, View } from 'react-native';

import { Button, List, Modal, Portal, Text } from 'react-native-paper';

import { useExampleTheme } from '../hooks/useExampleTheme';
import ScreenWrapper from '../ScreenWrapper';

const ModalExample = () => {
  const theme = useExampleTheme();

  const [visibleModal1, setVisibleModal1] = React.useState(false);
  const [visibleModal2, setVisibleModal2] = React.useState(false);
  const [visibleModal3, setVisibleModal3] = React.useState(false);

  return (
    <ScreenWrapper>
      <List.Section title="Simple">
        <View style={styles.row}>
          <Portal>
            <Modal
              visible={visibleModal1}
              onDismiss={() => setVisibleModal1(false)}
              contentContainerStyle={[
                styles.modal,
                { backgroundColor: theme.colors.background },
              ]}
            >
              <Text>Example Modal. Click outside this area to dismiss.</Text>
            </Modal>
          </Portal>
          <Button mode="outlined" onPress={() => setVisibleModal1(true)}>
            Open Modal
          </Button>
        </View>
      </List.Section>
      <List.Section title="Disable Animations">
        <View style={styles.row}>
          <Portal>
            <Modal
              disableAnimations={true}
              visible={visibleModal2}
              onDismiss={() => setVisibleModal2(false)}
              contentContainerStyle={[
                styles.modal,
                { backgroundColor: theme.colors.background },
              ]}
            >
              <Text>
                Example Modal with animations disabled. Click outside this area
                to dismiss.
              </Text>
            </Modal>
          </Portal>
          <Button mode="outlined" onPress={() => setVisibleModal2(true)}>
            Open Modal
          </Button>
        </View>
      </List.Section>
      <List.Section title="Handle escape (web)">
        <View style={styles.row}>
          <Portal>
            <Modal
              handleEscape={true}
              visible={visibleModal3}
              onDismiss={() => setVisibleModal3(false)}
              contentContainerStyle={[
                styles.modal,
                { backgroundColor: theme.colors.background },
              ]}
            >
              <Text>Example Modal with escape handling.</Text>
            </Modal>
          </Portal>
          <Button mode="outlined" onPress={() => setVisibleModal3(true)}>
            Open Modal
          </Button>
        </View>
      </List.Section>
    </ScreenWrapper>
  );
};

ModalExample.title = 'Modal';

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    margin: 8,
  },
  modal: {
    padding: 20,
  },
});

export default ModalExample;
