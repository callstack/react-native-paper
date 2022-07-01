import * as React from 'react';
import { View, StyleSheet } from 'react-native';
import { BottomSheetModal, Button } from 'react-native-paper';

const BottomSheetModalExample = () => {
  const [visible, setVisible] = React.useState(false);

  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);
  return (
    <View style={styles.container}>
      <Button onPress={showModal}>Toggle Modal</Button>
      <BottomSheetModal
        label="Your modal"
        visible={visible}
        onDismiss={hideModal}
      />
    </View>
  );
};

BottomSheetModalExample.title = 'Bottom Sheet Modal';

export default BottomSheetModalExample;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
