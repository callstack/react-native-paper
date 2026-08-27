import { Button, Dialog, Palette } from 'react-native-paper';

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
      <Button
        key="disagree-btn"
        onPress={close}
        disabled
        textColor={Palette.tertiary50}
      >
        Disagree
      </Button>,
      <Button key="agree-btn" onPress={close}>
        Agree
      </Button>,
    ]}
  />
);

export default DialogWithUndismissableBackButton;
