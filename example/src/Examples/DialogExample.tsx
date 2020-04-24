import * as React from 'react';
import { View, StyleSheet } from 'react-native';
import { Colors, Button, useTheme } from 'react-native-paper';
import {
  DialogWithCustomColors,
  DialogWithLoadingIndicator,
  DialogWithLongText,
  DialogWithRadioBtns,
  UndismissableDialog,
} from './Dialogs';

type ButtonVisibility = {
  [key: string]: boolean | undefined;
};

const DialogExample = () => {
  const [visible, setVisible] = React.useState<ButtonVisibility>({});

  const _toggleDialog = (name: string) => () =>
    setVisible({ ...visible, [name]: !visible[name] });

  const _getVisible = (name: string) => !!visible[name];

  const {
    colors: { background },
  } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: background }]}>
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
    </View>
  );
};

DialogExample.title = 'Dialog';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.grey200,
    padding: 12,
  },
  button: {
    margin: 4,
  },
});

export default DialogExample;
