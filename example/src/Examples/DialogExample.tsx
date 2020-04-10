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

const DialogExample = () => {
  const [visible1, setVisible1] = React.useState<boolean>(false);
  const [visible2, setVisible2] = React.useState<boolean>(false);
  const [visible3, setVisible3] = React.useState<boolean>(false);
  const [visible4, setVisible4] = React.useState<boolean>(false);
  const [visible5, setVisible5] = React.useState<boolean>(false);

  const _openDialog1 = () => setVisible1(true);
  const _openDialog2 = () => setVisible2(true);
  const _openDialog3 = () => setVisible3(true);
  const _openDialog4 = () => setVisible4(true);
  const _openDialog5 = () => setVisible5(true);

  const _closeDialog1 = () => setVisible1(true);
  const _closeDialog2 = () => setVisible2(true);
  const _closeDialog3 = () => setVisible3(true);
  const _closeDialog4 = () => setVisible4(true);
  const _closeDialog5 = () => setVisible5(true);

  const {
    colors: { background },
  } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: background }]}>
      <Button mode="outlined" onPress={_openDialog1} style={styles.button}>
        Long text
      </Button>
      <Button mode="outlined" onPress={_openDialog2} style={styles.button}>
        Radio buttons
      </Button>
      <Button mode="outlined" onPress={_openDialog3} style={styles.button}>
        Progress indicator
      </Button>
      <Button mode="outlined" onPress={_openDialog4} style={styles.button}>
        Undismissable Dialog
      </Button>
      <Button mode="outlined" onPress={_openDialog5} style={styles.button}>
        Custom colors
      </Button>
      <DialogWithLongText visible={visible1} close={_closeDialog1} />
      <DialogWithRadioBtns visible={visible2} close={_closeDialog2} />
      <DialogWithLoadingIndicator visible={visible3} close={_closeDialog3} />
      <UndismissableDialog visible={visible4} close={_closeDialog4} />
      <DialogWithCustomColors visible={visible5} close={_closeDialog5} />
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
