import { useState } from 'react';
import {
  Platform,
  ScrollView,
  StyleSheet,
  useWindowDimensions,
  View,
} from 'react-native';

import Constants, { ExecutionEnvironment } from 'expo-constants';
import {
  Button,
  Dialog,
  Portal,
  Switch,
  Text,
  TouchableRipple,
  useTheme,
} from 'react-native-paper';
import { Modal } from 'react-native-paper';

import { usePreferences } from './usePreferences';
import { dynamicThemeSupported, isWeb } from '../../utils';

export default function PreferencesModal() {
  const [showRTLDialog, setShowRTLDialog] = useState(false);
  const theme = useTheme();
  const { height: windowHeight } = useWindowDimensions();

  const isIOS = Platform.OS === 'ios';
  const expoGoExecution =
    Constants.executionEnvironment === ExecutionEnvironment.StoreClient;

  const {
    toggleShouldUseDynamicTheme,
    toggleTheme,
    toggleRtl: toggleRTL,
    toggleCustomFont,
    toggleRippleEffect,
    togglePreferences,
    resetPreferences,
    preferencesVisible,
    customFontLoaded,
    rippleEffectEnabled,
    rtl: isRTL,
    theme: { dark: isDarkTheme },
    shouldUseDynamicTheme,
  } = usePreferences();

  const _handleToggleRTL = () => {
    if (!isWeb && expoGoExecution) {
      setShowRTLDialog(true);
      return;
    }

    toggleRTL();
  };

  const _handleDismissRTLDialog = () => {
    setShowRTLDialog(false);
  };

  return (
    <>
      <Portal>
        <Modal
          visible={preferencesVisible}
          onDismiss={togglePreferences}
          contentContainerStyle={[
            styles.modalContent,
            { backgroundColor: theme.colors.elevation.level2 },
          ]}
        >
          <ScrollView
            style={[styles.scrollView, { maxHeight: windowHeight * 0.7 }]}
            contentContainerStyle={styles.scrollViewContent}
            showsVerticalScrollIndicator={false}
            alwaysBounceVertical={false}
          >
            {dynamicThemeSupported ? (
              <TouchableRipple onPress={toggleShouldUseDynamicTheme}>
                <View style={[styles.preference, styles.v3Preference]}>
                  <Text variant="labelLarge">Use Dynamic Theme</Text>
                  <View pointerEvents="none">
                    <Switch value={shouldUseDynamicTheme} />
                  </View>
                </View>
              </TouchableRipple>
            ) : null}
            <TouchableRipple onPress={toggleTheme}>
              <View style={[styles.preference, styles.v3Preference]}>
                <Text variant="labelLarge">Dark Theme</Text>
                <View pointerEvents="none">
                  <Switch value={isDarkTheme} />
                </View>
              </View>
            </TouchableRipple>

            <TouchableRipple onPress={_handleToggleRTL}>
              <View style={[styles.preference, styles.v3Preference]}>
                <Text variant="labelLarge">RTL</Text>
                <View pointerEvents="none">
                  <Switch value={isRTL} />
                </View>
              </View>
            </TouchableRipple>

            <TouchableRipple onPress={toggleCustomFont}>
              <View style={[styles.preference, styles.v3Preference]}>
                <Text variant="labelLarge">Custom font *</Text>
                <View pointerEvents="none">
                  <Switch value={customFontLoaded} />
                </View>
              </View>
            </TouchableRipple>

            <TouchableRipple onPress={toggleRippleEffect}>
              <View style={[styles.preference, styles.v3Preference]}>
                <Text variant="labelLarge">
                  {isIOS ? 'Highlight' : 'Ripple'} effect *
                </Text>
                <View pointerEvents="none">
                  <Switch value={rippleEffectEnabled} />
                </View>
              </View>
            </TouchableRipple>

            <Button
              mode="contained-tonal"
              onPress={resetPreferences}
              style={styles.resetButton}
            >
              Reset
            </Button>

            <Text variant="bodySmall" style={styles.annotation}>
              * - optional example toggles
            </Text>
            <Text variant="bodySmall" style={styles.annotation}>
              React Native Paper Version{' '}
              {require('react-native-paper/package.json').version}
            </Text>
          </ScrollView>
        </Modal>
      </Portal>
      <Portal>
        <Dialog visible={showRTLDialog} onDismiss={_handleDismissRTLDialog}>
          <Dialog.Title>Changing to RTL</Dialog.Title>
          <Dialog.Content>
            <Text variant="bodyMedium">
              Due to Expo Go limitations it is impossible to change RTL
              dynamically. To do so, you need to create a development build of
              Example app or change it statically by setting{' '}
              <Text variant="labelMedium">forcesRTL</Text> property to true in{' '}
              <Text variant="labelMedium">app.json</Text> within{' '}
              <Text variant="labelMedium">example</Text> directory.
            </Text>
            <Dialog.Actions>
              <Button onPress={_handleDismissRTLDialog}>Ok</Button>
            </Dialog.Actions>
          </Dialog.Content>
        </Dialog>
      </Portal>
    </>
  );
}

const styles = StyleSheet.create({
  modalContent: {
    marginHorizontal: 24,
    borderRadius: 28,
  },
  scrollView: {
    flexGrow: 0,
    flexShrink: 1,
  },
  scrollViewContent: {
    paddingVertical: 12,
  },
  preference: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  v3Preference: {
    height: 56,
    paddingHorizontal: 28,
  },
  resetButton: {
    marginHorizontal: 28,
    marginTop: 12,
  },
  annotation: {
    marginHorizontal: 24,
    marginVertical: 6,
  },
});
