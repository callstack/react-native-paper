import * as React from 'react';
import { Platform, StyleSheet } from 'react-native';

import { Button } from 'react-native-paper';

import {
  DialogWithCustomColors,
  DialogWithDismissableBackButton,
  DialogWithIcon,
  DialogWithLoadingIndicator,
  DialogWithLongText,
  DialogWithRadioBtns,
  UndismissableDialog,
} from './Dialogs';
import ScreenWrapper from '../ScreenWrapper';

type ButtonVisibility = {
  [key: string]: boolean | undefined;
};

const DialogExample = () => {
  const [visible, setVisible] = React.useState<ButtonVisibility>({});

  const _toggleDialog = (name: string) => () =>
    setVisible({ ...visible, [name]: !visible[name] });

  const _getVisible = (name: string) => !!visible[name];

  return (
    <ScreenWrapper style={styles.container}>
      <Button
        mode="outlined"
        onPress={_toggleDialog('dialog1')}
        style={styles.button}
      >
        Long text
      </Button>
      <Button
        mode="outlined"
        onPress={_toggleDialog('dialog2')}
        style={styles.button}
      >
        Radio buttons
      </Button>
      <Button
        mode="outlined"
        onPress={_toggleDialog('dialog3')}
        style={styles.button}
      >
        Progress indicator
      </Button>
      <Button
        mode="outlined"
        onPress={_toggleDialog('dialog4')}
        style={styles.button}
      >
        Undismissable Dialog
      </Button>
      <Button
        mode="outlined"
        onPress={_toggleDialog('dialog5')}
        style={styles.button}
      >
        Custom colors
      </Button>
      <Button
        mode="outlined"
        onPress={_toggleDialog('dialog6')}
        style={styles.button}
      >
        With icon
      </Button>
      {Platform.OS === 'android' && (
        <Button
          mode="outlined"
          onPress={_toggleDialog('dialog7')}
          style={styles.button}
        >
          Dismissable back button
        </Button>
      )}
      <DialogWithLongText
        visible={_getVisible('dialog1')}
        close={_toggleDialog('dialog1')}
      />
      <DialogWithRadioBtns
        visible={_getVisible('dialog2')}
        close={_toggleDialog('dialog2')}
      />
      <DialogWithLoadingIndicator
        visible={_getVisible('dialog3')}
        close={_toggleDialog('dialog3')}
      />
      <UndismissableDialog
        visible={_getVisible('dialog4')}
        close={_toggleDialog('dialog4')}
      />
      <DialogWithCustomColors
        visible={_getVisible('dialog5')}
        close={_toggleDialog('dialog5')}
      />
      <DialogWithIcon
        visible={_getVisible('dialog6')}
        close={_toggleDialog('dialog6')}
      />
      <DialogWithDismissableBackButton
        visible={_getVisible('dialog7')}
        close={_toggleDialog('dialog7')}
      />
    </ScreenWrapper>
  );
};

DialogExample.title = 'Dialog';

const styles = StyleSheet.create({
  container: {
    padding: 12,
  },
  button: {
    margin: 4,
  },
});

export default DialogExample;
