import * as React from 'react';

import { default as _Appbar } from './Appbar';
import { AppbarHeader } from './AppbarHeader';
import { withTheme } from '../../core/theming';


type Props = Partial<React.ComponentProps<typeof _Appbar>>

export class Appbar extends _Appbar<Props> {
  static Header = AppbarHeader;
}

export default withTheme(Appbar);
