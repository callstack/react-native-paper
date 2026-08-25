import { ActivityIndicator, Platform, StyleSheet, View } from 'react-native';

import { Dialog, Palette, Portal, Text, useTheme } from 'react-native-paper';

const isIOS = Platform.OS === 'ios';

const NewDialogWithLoadingIndicator = ({
  visible,
  close,
}: {
  visible: boolean;
  close: () => void;
}) => {
  const theme = useTheme();
  const textColor = { color: theme.colors.onSurfaceVariant };

  return (
    <Portal>
      <Dialog
        onDismiss={close}
        visible={visible}
        title="Progress Dialog"
        content={
          <View style={styles.content}>
            <ActivityIndicator
              color={Palette.tertiary30}
              size={isIOS ? 'large' : 48}
              style={styles.indicator}
            />
            <Text variant="bodyMedium" style={textColor}>
              Loading.....
            </Text>
          </View>
        }
        actions={[]}
      />
    </Portal>
  );
};

const styles = StyleSheet.create({
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  indicator: {
    marginRight: 16,
  },
});

export default NewDialogWithLoadingIndicator;
