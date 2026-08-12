import * as React from 'react';
import { StyleSheet } from 'react-native';

import {
  Button,
  Dialog,
  Divider,
  List,
  Portal,
  RadioButton,
  Switch,
  Text,
} from 'react-native-paper';

import type { SampleConfig } from './types';
import ScreenWrapper from '../ScreenWrapper';

export const SettingsSampleConfig: SampleConfig = {
  title: 'Settings',
  icon: 'cog-outline',
  components: [
    'Button',
    'Dialog',
    'Divider',
    'List',
    'Portal',
    'RadioButton',
    'Switch',
    'Text',
  ],
};

const SettingsSample = () => {
  const [notifications, setNotifications] = React.useState(true);
  const [backgroundSync, setBackgroundSync] = React.useState(false);
  const [density, setDensity] = React.useState('comfortable');
  const [dialogVisible, setDialogVisible] = React.useState(false);

  const hideDialog = () => setDialogVisible(false);

  return (
    <ScreenWrapper>
      <List.Section title="Notifications">
        <List.Item
          title="Push notifications"
          description="Alerts about mentions and replies"
          right={() => (
            <Switch value={notifications} onValueChange={setNotifications} />
          )}
        />
        <List.Item
          title="Background sync"
          description="Keep content up to date while closed"
          right={() => (
            <Switch value={backgroundSync} onValueChange={setBackgroundSync} />
          )}
        />
      </List.Section>

      <Divider />

      <List.Section title="List density">
        <RadioButton.Group value={density} onValueChange={setDensity}>
          <RadioButton.Item label="Comfortable" value="comfortable" />
          <RadioButton.Item label="Compact" value="compact" />
        </RadioButton.Group>
      </List.Section>

      <Divider />

      <List.Section title="Account">
        <List.Item
          title="Sign out"
          left={(props) => <List.Icon {...props} icon="logout" />}
          onPress={() => setDialogVisible(true)}
        />
      </List.Section>

      <Portal>
        <Dialog visible={dialogVisible} onDismiss={hideDialog}>
          <Dialog.Icon icon="logout" />
          <Dialog.Title style={styles.dialogTitle}>Sign out?</Dialog.Title>
          <Dialog.Content>
            <Text variant="bodyMedium">
              You will need to sign in again to access your workspace.
            </Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={hideDialog}>Cancel</Button>
            <Button onPress={hideDialog}>Sign out</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  dialogTitle: {
    textAlign: 'center',
  },
});

export default SettingsSample;
