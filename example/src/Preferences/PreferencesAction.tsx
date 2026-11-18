import { Appbar } from 'react-native-paper';

import { usePreferences } from './usePreferences';

export default function PreferencesAction() {
  const { togglePreferences } = usePreferences();

  return (
    <Appbar.Action
      icon="cog"
      aria-label="preferences"
      onPress={togglePreferences}
    />
  );
}
