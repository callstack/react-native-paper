import { ActivityIndicator, Platform, StyleSheet, View } from 'react-native';

import { Dialog, Palette, Portal, Text, useTheme } from 'react-native-paper';

const DialogWithLoadingIndicator = ({
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
              size={Platform.OS === 'ios' ? 'large' : 48}
              style={styles.marginRight}
            />
            <Text variant="bodyMedium" style={textColor}>
              Loading.....
            </Text>
          </View>
        }
      />
    </Portal>
  );
};

const styles = StyleSheet.create({
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  marginRight: {
    marginRight: 16,
  },
});

export default DialogWithLoadingIndicator;
