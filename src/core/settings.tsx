import * as React from 'react';

import MaterialCommunityIcon, {
  IconProps,
} from '../components/MaterialCommunityIcon';

export type Settings = {
  icon: ({ name, color, size, direction }: IconProps) => React.ReactNode;
  disableRippleEffect?: boolean;
};

export const { Provider, Consumer } = React.createContext<Settings>({
  icon: MaterialCommunityIcon,
  disableRippleEffect: false,
});
