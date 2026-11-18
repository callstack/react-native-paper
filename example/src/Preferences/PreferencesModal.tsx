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
  Modal,
  Portal,
  Switch,
  Text,
  useTheme,
} from 'react-native-paper';

import { usePreferences } from './usePreferences';
import { dynamicThemeSupported } from '../../utils';

export default function PreferencesModal() {
  const [showRTLDialog, setShowRTLDialog] = useState(false);
  const theme = useTheme();
  const { height: windowHeight } = useWindowDimensions();

  const expoGoExecution =
    Constants.executionEnvironment === ExecutionEnvironment.StoreClient;
  const rtlToggleUnavailable = Platform.OS !== 'web' && expoGoExecution;
  const rippleEffectLabel = `${Platform.OS === 'ios' ? 'Highlight' : 'Ripple'} effect`;

  const {
    toggleShouldUseDynamicTheme,
    toggleTheme,
    toggleRtl,
    toggleCustomFont,
    toggleRippleEffect,
    togglePreferences,
    resetPreferences,
    preferencesVisible,
    customFontLoaded,
    rippleEffectEnabled,
    rtl,
    theme: { dark: isDarkTheme },
    shouldUseDynamicTheme,
  } = usePreferences();

  const _handleToggleRTL = () => {
    if (rtlToggleUnavailable) {
      setShowRTLDialog(true);
      return;
    }

    toggleRtl();
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
          aria-label="Preferences"
          dismissAccessibilityLabel="Close preferences"
          contentBorderRadius={28}
          contentBackgroundColor={theme.colors.elevation.level2}
          contentContainerStyle={styles.modalContent}
        >
          <ScrollView
            style={[styles.scrollView, { maxHeight: windowHeight * 0.7 }]}
            contentContainerStyle={styles.scrollViewContent}
            showsVerticalScrollIndicator={false}
            alwaysBounceVertical={false}
          >
            {dynamicThemeSupported ? (
              <View style={styles.preference}>
                <Text variant="labelLarge">Use Dynamic Theme</Text>
                <Switch
                  value={shouldUseDynamicTheme}
                  onValueChange={toggleShouldUseDynamicTheme}
                  aria-label="Use dynamic theme"
                />
              </View>
            ) : null}
            <View style={styles.preference}>
              <Text variant="labelLarge">Dark Theme</Text>
              <Switch
                value={isDarkTheme}
                onValueChange={toggleTheme}
                aria-label="Dark theme"
              />
            </View>

            <View style={styles.preference}>
              <Text variant="labelLarge">RTL</Text>
              <Switch
                value={rtl}
                onValueChange={_handleToggleRTL}
                aria-label="Right-to-left layout"
              />
            </View>

            <View style={styles.preference}>
              <Text variant="labelLarge">Custom font *</Text>
              <Switch
                value={customFontLoaded}
                onValueChange={toggleCustomFont}
                aria-label="Custom font"
              />
            </View>

            <View style={styles.preference}>
              <Text variant="labelLarge">{rippleEffectLabel} *</Text>
              <Switch
                value={rippleEffectEnabled}
                onValueChange={toggleRippleEffect}
                aria-label={rippleEffectLabel}
              />
            </View>

            <Button
              mode="tonal"
              onPress={resetPreferences}
              aria-label="Reset all preferences"
              style={styles.resetButton}
            >
              Reset
            </Button>

            <Text
              variant="bodySmall"
              style={styles.annotation}
              aria-label="Preferences marked with an asterisk are optional example toggles"
            >
              * - optional example toggles
            </Text>
            <Text variant="bodySmall" style={styles.annotation}>
              React Native Paper Version{' '}
              {require('react-native-paper/package.json').version}
            </Text>
          </ScrollView>
        </Modal>
      </Portal>
      <Dialog
        visible={showRTLDialog}
        onDismiss={_handleDismissRTLDialog}
        title="Changing to RTL"
        content={
          <Text variant="bodyMedium">
            Due to Expo Go limitations it is impossible to change RTL
            dynamically. To do so, you need to create a development build of
            Example app or change it statically by setting{' '}
            <Text variant="labelMedium">forcesRTL</Text> property to true in{' '}
            <Text variant="labelMedium">app.json</Text> within{' '}
            <Text variant="labelMedium">example</Text> directory.
          </Text>
        }
        actions={[
          <Button mode="text" key="ok-btn" onPress={_handleDismissRTLDialog}>
            Ok
          </Button>,
        ]}
      />
    </>
  );
}

const styles = StyleSheet.create({
  modalContent: {
    marginHorizontal: 24,
    width: '100%',
    maxWidth: 360,
    alignSelf: 'center',
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
    height: 56,
    paddingVertical: 12,
    paddingHorizontal: 28,
  },
  resetButton: {
    marginHorizontal: 28,
    marginVertical: 12,
  },
  annotation: {
    marginHorizontal: 24,
    marginVertical: 6,
  },
});
