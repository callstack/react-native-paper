import * as React from 'react';

import MaterialCommunityIcon, {
  IconProps,
} from '../components/MaterialCommunityIcon';

export type Settings = {
  icon?: ({
    name,
    color,
    size,
    direction,
    testID,
  }: IconProps) => React.ReactNode;
  rippleEffectEnabled?: boolean;
};

export const SettingsContext = React.createContext<Settings>({
  icon: MaterialCommunityIcon,
  rippleEffectEnabled: true,
});

export const { Provider, Consumer } = SettingsContext;
