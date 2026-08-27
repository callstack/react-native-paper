import { Dialog, Palette, Text } from 'react-native-paper';

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
      theme={{
        colors: {
          surfaceContainerHigh: Palette.primary10,
        },
      }}
      visible={visible}
      title={<Text style={{ color: Palette.primary95 }}>Alert</Text>}
      content={
        <Text variant="bodyMedium" style={{ color: Palette.primary95 }}>
          This is a dialog with custom colors
        </Text>
      }
      actions={[{ label: 'Ok', onPress: close, textColor: Palette.primary95 }]}
    />
  );
};

export default DialogWithCustomColors;
