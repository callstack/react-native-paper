import { Button, Dialog, Palette } from 'react-native-paper';

const UndismissableDialog = ({
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
    title="Alert"
    content="This is an undismissable dialog!!"
    actions={[
      <Button
        mode="text"
        key="disagree-btn"
        onPress={close}
        disabled
        textColor={Palette.tertiary50}
      >
        Disagree
      </Button>,
      <Button mode="text" key="agree-btn" onPress={close}>
        Agree
      </Button>,
    ]}
  />
);

export default UndismissableDialog;
