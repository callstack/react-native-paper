import { Appbar as AppbarComponent } from './Appbar';
import AppbarContent from './AppbarContent';
import AppbarAction from './AppbarAction';
import AppbarBackAction from './AppbarBackAction';
import AppbarHeader from './AppbarHeader';

const Appbar = Object.assign(AppbarComponent, {
  // @component ./AppbarContent.tsx
  Content: AppbarContent,
  // @component ./AppbarAction.tsx
  Action: AppbarAction,
  // @component ./AppbarBackAction.tsx
  BackAction: AppbarBackAction,
  // @component ./AppbarHeader.tsx
  Header: AppbarHeader,
});

export default Appbar;
