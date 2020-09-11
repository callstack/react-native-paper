import { Snackbar, Colors, Button, useTheme } from 'react-native-paper';
import * as React from 'react';
import { StyleSheet, View } from 'react-native';

const SnackbarExample = () => {
  const [visible, setVisible] = React.useState<boolean>(false);

  const {
    colors: { background },
  } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: background }]}>
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
    </View>
  );
};

SnackbarExample.title = 'Snackbar';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.grey200,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default SnackbarExample;
