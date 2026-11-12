import { StyleSheet } from 'react-native';

import { Button, Dialog, Palette, Text } from 'react-native-paper';

const DialogWithCustomColors = ({
  visible,
  close,
}: {
  visible: boolean;
  close: () => void;
}) => {
  return (
    <Dialog
      onDismiss={close}
      visible={visible}
      aria-label="Alert"
      theme={{
        colors: {
          surfaceContainerHigh: Palette.primary10,
        },
      }}
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
        <Button key="ok-btn" onPress={close} textColor={Palette.primary95}>
          Ok
        </Button>,
      ]}
    />
  );
};

const styles = StyleSheet.create({
  text: {
    color: Palette.primary95,
  },
});

export default DialogWithCustomColors;
