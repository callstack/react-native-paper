import { StyleSheet } from 'react-native';

import { Button, Dialog, Palette, Portal, Text } from 'react-native-paper';

const DialogWithCustomColors = ({
  visible,
  close,
}: {
  visible: boolean;
  close: () => void;
}) => {
  return (
    <Portal>
      <Dialog
        onDismiss={close}
        visible={visible}
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
    </Portal>
  );
};

const styles = StyleSheet.create({
  text: {
    color: Palette.primary95,
  },
});

export default DialogWithCustomColors;
