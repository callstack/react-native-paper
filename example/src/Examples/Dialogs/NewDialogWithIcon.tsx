import { Dialog, Palette, Portal } from 'react-native-paper';

const NewDialogWithIcon = ({
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
      icon="alert"
      title="Dialog with Icon"
      content="This is a dialog with a component called DialogIcon. When the icon is displayed, the title is centered automatically."
      actions={[
        {
          label: 'Disagree',
          onPress: close,
          textColor: Palette.error50,
        },
        { label: 'Agree', onPress: close },
      ]}
    />
  </Portal>
);

export default NewDialogWithIcon;
