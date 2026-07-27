import { Portal, Dialog } from 'react-native-paper';

const DialogWithDeclarativeApi = ({
  visible,
  close,
}: {
  visible: boolean;
  close: () => void;
}) => {
  return (
    <Portal>
      <Dialog
        onDismiss={close}
        visible={visible}
        icon="alert"
        title="Delete item"
        content="Are you sure you want to delete this item? This action cannot be undone."
        actions={[
          { label: 'Cancel', onPress: close },
          { label: 'Delete', onPress: close, mode: 'contained' },
        ]}
      />
    </Portal>
  );
};

export default DialogWithDeclarativeApi;
