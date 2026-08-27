import { Button, Dialog, Palette } from 'react-native-paper';

const DialogWithIcon = ({
  visible,
  close,
}: {
  visible: boolean;
  close: () => void;
}) => (
  <Dialog
    onDismiss={close}
    visible={visible}
    icon="alert"
    title="Dialog with Icon"
    content="This is a dialog with a component called DialogIcon. When the icon is displayed, the title is centered automatically."
    actions={[
      <Button key="disagree-btn" onPress={close} textColor={Palette.error50}>
        Disagree
      </Button>,
      <Button key="agree-btn" onPress={close}>
        Agree
      </Button>,
    ]}
  />
);

export default DialogWithIcon;
