import * as React from 'react';
import { StyleSheet, View } from 'react-native';

import { Snackbar, Button, List, Text, Switch } from 'react-native-paper';

import { PreferencesContext } from '../PreferencesContext';
import ScreenWrapper from '../ScreenWrapper';

const SHORT_MESSAGE = 'Single-line snackbar';
const LONG_MESSAGE =
  'Snackbar with longer message which does not fit in one line';

const SnackbarExample = () => {
  const preferences = React.useContext(PreferencesContext);

  const [options, setOptions] = React.useState({
    showSnackbar: false,
    showAction: true,
    showCloseIcon: false,
    showLongerMessage: false,
    showLongerAction: false,
    showInPortal: true,
  });

  const {
    showSnackbar,
    showAction,
    showCloseIcon,
    showLongerMessage,
    showLongerAction,
    showInPortal,
  } = options;

  const toggleOption = (option: keyof typeof options) =>
    setOptions({ ...options, [option]: !options[option] });

  return (
    <>
      <ScreenWrapper contentContainerStyle={styles.container}>
        <List.Section title="Snackbar options">
          <View style={styles.row}>
            <Text>Action button</Text>
            <Switch
              value={showAction}
              onValueChange={() => toggleOption('showAction')}
            />
          </View>
          <View style={styles.row}>
            <Text>Close icon button</Text>
            <Switch
              value={showCloseIcon}
              onValueChange={() => toggleOption('showCloseIcon')}
            />
          </View>
          <View style={styles.row}>
            <Text>Longer message</Text>
            <Switch
              value={showLongerMessage}
              onValueChange={() => toggleOption('showLongerMessage')}
            />
          </View>
          <View style={styles.row}>
            <Text>Longer action</Text>
            <Switch
              value={showLongerAction}
              onValueChange={() => toggleOption('showLongerAction')}
            />
          </View>
          <View style={styles.row}>
            <Text>Render in portal</Text>
            <Switch
              value={showInPortal}
              onValueChange={() => toggleOption('showInPortal')}
            />
          </View>
        </List.Section>

        <View style={styles.wrapper}>
          <Button mode="outlined" onPress={() => toggleOption('showSnackbar')}>
            {showSnackbar ? 'Hide' : 'Show'}
          </Button>
        </View>
      </ScreenWrapper>
      <Snackbar
        visible={showSnackbar}
        onDismiss={() => toggleOption('showSnackbar')}
        message={showLongerMessage ? LONG_MESSAGE : SHORT_MESSAGE}
        action={
          showAction
            ? {
                label: showLongerAction ? 'Toggle theme' : 'Action',
                onPress: () => {
                  preferences?.toggleTheme();
                },
              }
            : undefined
        }
        onIconPress={
          showCloseIcon ? () => toggleOption('showSnackbar') : undefined
        }
        portal={showInPortal}
        duration={Snackbar.DURATION_MEDIUM}
      />
    </>
  );
};

SnackbarExample.title = 'Snackbar';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  wrapper: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
});

export default SnackbarExample;
