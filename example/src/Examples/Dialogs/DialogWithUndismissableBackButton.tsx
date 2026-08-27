import { Dialog, Palette } from 'react-native-paper';

const DialogWithUndismissableBackButton = ({
  visible,
  close,
}: {
  visible: boolean;
  close: () => void;
}) => (
  <Dialog
    onDismiss={close}
    visible={visible}
    dismissableBackButton={false}
    title="Alert"
    content="This dialog can be dismissed by tapping outside, however the hardware back button will not close it!"
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

export default DialogWithUndismissableBackButton;
