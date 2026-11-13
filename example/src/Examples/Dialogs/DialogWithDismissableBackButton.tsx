import { Button, Dialog, Palette } from 'react-native-paper';

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
      <Button key="disagree-btn" onPress={close} textColor={Palette.tertiary50}>
        Disagree
      </Button>,
      <Button key="agree-btn" onPress={close}>
        Agree
      </Button>,
    ]}
  />
);

export default DialogWithDismissableBackButton;
