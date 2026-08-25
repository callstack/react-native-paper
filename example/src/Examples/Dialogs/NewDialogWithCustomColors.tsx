import { StyleSheet } from 'react-native';

import { Dialog, Palette, Portal, Text } from 'react-native-paper';

const NewDialogWithCustomColors = ({
  visible,
  close,
}: {
  visible: boolean;
  close: () => void;
}) => (
  <Portal>
    <Dialog
      onDismiss={close}
      visible={visible}
      style={styles.dialog}
      title={
        <Text variant="headlineSmall" style={styles.text}>
          Alert
        </Text>
      }
      content={
        <Text variant="bodyMedium" style={styles.text}>
          This is a dialog with custom colors
        </Text>
      }
      actions={[
        {
          label: 'Ok',
          onPress: close,
          textColor: Palette.primary95,
        },
      ]}
    />
  </Portal>
);

const styles = StyleSheet.create({
  dialog: {
    backgroundColor: Palette.primary10,
  },
  text: {
    color: Palette.primary95,
  },
});

export default NewDialogWithCustomColors;
