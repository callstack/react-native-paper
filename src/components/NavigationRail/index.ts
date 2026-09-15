import NavigationRailComponent from './NavigationRail';
import NavigationRailItem from './NavigationRailItem';
import NavigationRailModal from './NavigationRailModal';

const NavigationRail = Object.assign(
  // @component ./NavigationRail.tsx
  NavigationRailComponent,
  {
    // @component ./NavigationRailItem.tsx
    Item: NavigationRailItem,
    // @component ./NavigationRailModal.tsx
    Modal: NavigationRailModal,
  }
);

export default NavigationRail;
