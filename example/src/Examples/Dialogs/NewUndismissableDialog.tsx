import { Dialog, Palette, Portal } from 'react-native-paper';

const NewUndismissableDialog = ({
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
      dismissable={false}
      title="Alert"
      content="This is an undismissable dialog!!"
      actions={[
        {
          label: 'Disagree',
          onPress: close,
          disabled: true,
          textColor: Palette.tertiary50,
        },
        { label: 'Agree', onPress: close },
      ]}
    />
  </Portal>
);

export default NewUndismissableDialog;
