import FABComponent from './FAB';
import FABGroup from './FABGroup';

const FAB = Object.assign(
  // @component ./FAB.tsx
  FABComponent,
  {
    // @component ./FABGroup.tsx
    Group: FABGroup,
  }
);

export default FAB;
