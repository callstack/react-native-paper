import { Dialog, Palette } from 'react-native-paper';

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

export default UndismissableDialog;
