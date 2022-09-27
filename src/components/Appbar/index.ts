import AppbarComponent from './Appbar';
import AppbarAction from './AppbarAction';
import AppbarBackAction from './AppbarBackAction';
import AppbarContent from './AppbarContent';
import AppbarHeader from './AppbarHeader';

const Appbar = Object.assign(
  // @component ./Appbar.tsx
  AppbarComponent,
  {
    // @component ./AppbarContent.tsx
    Content: AppbarContent,
    // @component ./AppbarAction.tsx
    Action: AppbarAction,
    // @component ./AppbarBackAction.tsx
    BackAction: AppbarBackAction,
    // @component ./AppbarHeader.tsx
    Header: AppbarHeader,
  }
);

export default Appbar;
