import { Appbar as _Appbar } from './Appbar';

import AppbarContent from './AppbarContent';
import AppbarAction from './AppbarAction';
import AppbarBackAction from './AppbarBackAction';
import AppbarHeader from './AppbarHeader';

import { withTheme } from '../../core/theming';

export class Appbar extends _Appbar {
  // @component ./AppbarContent.tsx
  static Content = AppbarContent;
  // @component ./AppbarAction.tsx
  static Action = AppbarAction;
  // @component ./AppbarBackAction.tsx
  static BackAction = AppbarBackAction;
  // @component ./AppbarHeader
  static Header = AppbarHeader;
}

export default withTheme(Appbar);
