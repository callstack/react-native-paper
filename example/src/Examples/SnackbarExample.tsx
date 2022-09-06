import { Snackbar, Button } from 'react-native-paper';
import * as React from 'react';
import { StyleSheet } from 'react-native';
import ScreenWrapper from '../ScreenWrapper';

const SnackbarExample = () => {
  const [visible, setVisible] = React.useState<boolean>(false);

  return (
    <ScreenWrapper contentContainerStyle={styles.container}>
      <Button mode="outlined" onPress={() => setVisible(!visible)}>
        {visible ? 'Hide' : 'Show'}
      </Button>
      <Snackbar
        visible={visible}
        onDismiss={() => setVisible(false)}
        action={{
          label: 'Undo',
          onPress: () => {
            // Do something
          },
        }}
        duration={Snackbar.DURATION_MEDIUM}
      >
        Hey there! I&apos;m a Snackbar.
      </Snackbar>
    </ScreenWrapper>
  );
};

SnackbarExample.title = 'Snackbar';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default SnackbarExample;
