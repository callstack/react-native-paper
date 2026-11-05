import AppbarComponent from './Appbar';
import AppbarAction from './AppbarAction';
import AppbarBackAction from './AppbarBackAction';
import AppbarContent from './AppbarContent';
import AppbarHeader from './AppbarHeader';
import AppbarImage from './AppbarImage';
import {
  useAppbarScrollBehavior,
  useTopAppBarScrollBehavior,
} from './useAppbarScrollBehavior';
import type {
  AppbarScrollBehavior,
  TopAppBarScrollBehavior,
  UseAppbarScrollBehaviorOptions,
} from './useAppbarScrollBehavior';

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
    // @component ./AppbarImage.tsx
    Image: AppbarImage,
  }
);

/**
 * Modernized MD3 alias for `Appbar`.
 */
const TopAppBar = Appbar;

export {
  Appbar,
  TopAppBar,
  AppbarAction,
  AppbarBackAction,
  AppbarContent,
  AppbarHeader,
  AppbarImage,
  useAppbarScrollBehavior,
  useTopAppBarScrollBehavior,
};

export type {
  AppbarScrollBehavior,
  TopAppBarScrollBehavior,
  UseAppbarScrollBehaviorOptions,
};

export default Appbar;
