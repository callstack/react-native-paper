import * as React from 'react';

import {
  Button,
  Dialog,
  Divider,
  List,
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
      <List.Section>
        <List.Subheader role="heading">Notifications</List.Subheader>
        <List.Item
          title="Push notifications"
          description="Alerts about mentions and replies"
          right={() => (
            <Switch
              value={notifications}
              onValueChange={setNotifications}
              aria-label="Push notifications"
            />
          )}
        />
        <List.Item
          title="Background sync"
          description="Keep content up to date while closed"
          right={() => (
            <Switch
              value={backgroundSync}
              onValueChange={setBackgroundSync}
              aria-label="Background sync"
            />
          )}
        />
      </List.Section>

      <Divider />

      <List.Section>
        <List.Subheader role="heading">List density</List.Subheader>
        <RadioButton.Group value={density} onValueChange={setDensity}>
          <RadioButton.Item label="Comfortable" value="comfortable" />
          <RadioButton.Item label="Compact" value="compact" />
        </RadioButton.Group>
      </List.Section>

      <Divider />

      <List.Section>
        <List.Subheader role="heading">Account</List.Subheader>
        <List.Item
          title="Sign out"
          left={(props) => <List.Icon {...props} icon="logout" />}
          onPress={() => setDialogVisible(true)}
          role="button"
          accessibilityHint="Opens a confirmation dialog"
        />
      </List.Section>

      <Dialog
        visible={dialogVisible}
        onDismiss={hideDialog}
        icon="logout"
        title="Sign out?"
        content={
          <Text variant="bodyMedium">
            You will need to sign in again to access your workspace.
          </Text>
        }
        actions={[
          <Button mode="text" key="cancel" onPress={hideDialog}>
            Cancel
          </Button>,
          <Button mode="text" key="sign-out" onPress={hideDialog}>
            Sign out
          </Button>,
        ]}
      />
    </ScreenWrapper>
  );
};

export default SettingsSample;
