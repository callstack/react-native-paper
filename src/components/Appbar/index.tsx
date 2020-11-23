import Appbar from './Appbar';
import AppbarAction from './AppbarAction';
import AppbarBackAction from './AppbarBackAction';
import AppbarContent from './AppbarContent';
import AppbarHeader from './AppbarHeader';

export default Object.assign(Appbar, {
  Content: AppbarContent,
  Action: AppbarAction,
  BackAction: AppbarBackAction,
  Header: AppbarHeader,
});
