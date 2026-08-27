import { Dialog, Palette } from 'react-native-paper';

const DialogWithDismissableBackButton = ({
  visible,
  close,
}: {
  visible: boolean;
  close: () => void;
}) => (
  <Dialog
    onDismiss={close}
    visible={visible}
    dismissable={false}
    dismissableBackButton
    title="Alert"
    content="This is an undismissable dialog, however you can use hardware back button to close it!"
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
);

export default DialogWithDismissableBackButton;
