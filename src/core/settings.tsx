import * as React from 'react';
import MaterialCommunityIcon, {
  IconProps,
} from '../components/MaterialCommunityIcon';

export type Settings = {
  icon: React.FC<IconProps>;
};

export const { Provider, Consumer } = React.createContext<Settings>({
  icon: MaterialCommunityIcon,
});
