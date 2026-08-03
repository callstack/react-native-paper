import AppbarComponent from './Appbar';
import AppbarAction from './AppbarAction';
import AppbarBackAction from './AppbarBackAction';
import AppbarContent from './AppbarContent';
import AppbarHeader from './AppbarHeader';

/**
 * MD3 Top app bar (renamed public surface). Prefer `TopAppBar` in new code.
 * `Appbar` remains as a compatibility alias for the same compound component.
 */
const TopAppBar = Object.assign(
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

/** @deprecated Prefer `TopAppBar`. Same compound component. */
const Appbar = TopAppBar;

export default Appbar;
export { TopAppBar };
