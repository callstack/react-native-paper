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
  NewDialogWithCustomColors,
  NewDialogWithDismissableBackButton,
  NewDialogWithIcon,
  NewDialogWithLoadingIndicator,
  NewDialogWithLongText,
  NewDialogWithRadioBtns,
  NewUndismissableDialog,
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
      <Button
        mode="outlined"
        onPress={_toggleDialog('dialog8')}
        style={styles.button}
      >
        Long text (props)
      </Button>
      <Button
        mode="outlined"
        onPress={_toggleDialog('dialog9')}
        style={styles.button}
      >
        Radio buttons (props)
      </Button>
      <Button
        mode="outlined"
        onPress={_toggleDialog('dialog10')}
        style={styles.button}
      >
        Progress indicator (props)
      </Button>
      <Button
        mode="outlined"
        onPress={_toggleDialog('dialog11')}
        style={styles.button}
      >
        Undismissable Dialog (props)
      </Button>
      <Button
        mode="outlined"
        onPress={_toggleDialog('dialog12')}
        style={styles.button}
      >
        Custom colors (props)
      </Button>
      <Button
        mode="outlined"
        onPress={_toggleDialog('dialog13')}
        style={styles.button}
      >
        With icon (props)
      </Button>
      {Platform.OS === 'android' && (
        <Button
          mode="outlined"
          onPress={_toggleDialog('dialog14')}
          style={styles.button}
        >
          Dismissable back button (props)
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
      {Platform.OS === 'android' && (
        <DialogWithDismissableBackButton
          visible={_getVisible('dialog7')}
          close={_toggleDialog('dialog7')}
        />
      )}
      <NewDialogWithLongText
        visible={_getVisible('dialog8')}
        close={_toggleDialog('dialog8')}
      />
      <NewDialogWithRadioBtns
        visible={_getVisible('dialog9')}
        close={_toggleDialog('dialog9')}
      />
      <NewDialogWithLoadingIndicator
        visible={_getVisible('dialog10')}
        close={_toggleDialog('dialog10')}
      />
      <NewUndismissableDialog
        visible={_getVisible('dialog11')}
        close={_toggleDialog('dialog11')}
      />
      <NewDialogWithCustomColors
        visible={_getVisible('dialog12')}
        close={_toggleDialog('dialog12')}
      />
      <NewDialogWithIcon
        visible={_getVisible('dialog13')}
        close={_toggleDialog('dialog13')}
      />
      {Platform.OS === 'android' && (
        <NewDialogWithDismissableBackButton
          visible={_getVisible('dialog14')}
          close={_toggleDialog('dialog14')}
        />
      )}
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
