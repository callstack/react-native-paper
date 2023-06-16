import * as React from 'react';
import { StyleSheet, View } from 'react-native';

import { Snackbar, Button, List, Text, Switch } from 'react-native-paper';

import { PreferencesContext, useExampleTheme } from '..';
import ScreenWrapper from '../ScreenWrapper';

const SHORT_MESSAGE = 'Single-line snackbar';
const LONG_MESSAGE =
  'Snackbar with longer message which does not fit in one line';

const SnackbarExample = () => {
  const preferences = React.useContext(PreferencesContext);
  const theme = useExampleTheme();

  const [options, setOptions] = React.useState({
    showSnackbar: false,
    showAction: true,
    showCloseIcon: false,
    showLongerMessage: false,
    showLongerAction: false,
  });

  const {
    showSnackbar,
    showAction,
    showCloseIcon,
    showLongerMessage,
    showLongerAction,
  } = options;

  const action = {
    label: showLongerAction ? 'Toggle Theme' : 'Action',
    onPress: () => {
      preferences?.toggleTheme();
    },
  };

  return (
    <>
      <ScreenWrapper contentContainerStyle={styles.container}>
        <List.Section title="Snackbar options">
          <View style={styles.row}>
            <Text>Action button</Text>
            <Switch
              value={showAction}
              onValueChange={() =>
                setOptions({ ...options, showAction: !showAction })
              }
            />
          </View>
          {theme.isV3 && (
            <View style={styles.row}>
              <Text>Close icon button</Text>
              <Switch
                value={showCloseIcon}
                onValueChange={() =>
                  setOptions({ ...options, showCloseIcon: !showCloseIcon })
                }
              />
            </View>
          )}
          <View style={styles.row}>
            <Text>Longer message</Text>
            <Switch
              value={showLongerMessage}
              onValueChange={() =>
                setOptions({
                  ...options,
                  showLongerMessage: !showLongerMessage,
                })
              }
            />
          </View>
          <View style={styles.row}>
            <Text>Longer action</Text>
            <Switch
              value={showLongerAction}
              onValueChange={() =>
                setOptions({
                  ...options,
                  showLongerAction: !showLongerAction,
                })
              }
            />
          </View>
        </List.Section>

        <View style={styles.wrapper}>
          <Button
            mode="outlined"
            onPress={() =>
              setOptions({ ...options, showSnackbar: !showSnackbar })
            }
          >
            {showSnackbar ? 'Hide' : 'Show'}
          </Button>
        </View>
      </ScreenWrapper>
      <Snackbar
        visible={showSnackbar}
        onDismiss={() => setOptions({ ...options, showSnackbar: false })}
        action={showAction ? action : undefined}
        onIconPress={
          showCloseIcon
            ? () => setOptions({ ...options, showSnackbar: false })
            : undefined
        }
        duration={Snackbar.DURATION_MEDIUM}
        style={showLongerAction && styles.longerAction}
      >
        {showLongerMessage ? LONG_MESSAGE : SHORT_MESSAGE}
      </Snackbar>
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
  longerAction: {
    flexDirection: 'column',
  },
});

export default SnackbarExample;
