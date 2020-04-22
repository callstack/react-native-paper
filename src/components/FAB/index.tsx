import { FAB as _FAB } from './FAB';

import FABGroup from './FABGroup';

import { withTheme } from '../../core/theming';

export class FAB extends _FAB {
  // @component ./FABGroup.tsx
  static Group = FABGroup;
}

export default withTheme(FAB);
