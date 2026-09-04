import { useContext } from 'react';

import { PreferencesContext } from './PreferencesContext';

export function usePreferences() {
  const preferences = useContext(PreferencesContext);

  if (!preferences) throw new Error('PreferencesContext not provided');

  return preferences;
}
