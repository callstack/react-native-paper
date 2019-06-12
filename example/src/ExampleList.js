/* @flow */

import * as React from 'react';
import { FlatList } from 'react-native';
import { List, Divider, withTheme, type Theme } from 'react-native-paper';
import ActivityIndicatorExample from './Examples/ActivityIndicatorExample';

import AppbarExample from './Examples/AppbarExample';
import AvatarExample from './Examples/AvatarExample';
import BadgeExample from './Examples/BadgeExample';
import BannerExample from './Examples/BannerExample';
import BottomNavigationExample from './Examples/BottomNavigationExample';
import ButtonExample from './Examples/ButtonExample';
import CardExample from './Examples/CardExample';
import CheckboxExample from './Examples/CheckboxExample';
import ChipExample from './Examples/ChipExample';
import DataTableExample from './Examples/DataTableExample';
import DialogExample from './Examples/DialogExample';
import DividerExample from './Examples/DividerExample';
import FABExample from './Examples/FABExample';
import IconButtonExample from './Examples/IconButtonExample';
import ListAccordionExample from './Examples/ListAccordionExample';
import ListSectionExample from './Examples/ListSectionExample';
import MenuExample from './Examples/MenuExample';
import ProgressBarExample from './Examples/ProgressBarExample';
import RadioButtonExample from './Examples/RadioButtonExample';
import RadioButtonGroupExample from './Examples/RadioButtonGroupExample';
import SearchbarExample from './Examples/SearchbarExample';
import SnackbarExample from './Examples/SnackbarExample';
import SurfaceExample from './Examples/SurfaceExample';
import SwitchExample from './Examples/SwitchExample';
import TextExample from './Examples/TextExample';
import TextInputExample from './Examples/TextInputExample';
import ToggleButtonExample from './Examples/ToggleButtonExample';
import TouchableRippleExample from './Examples/TouchableRippleExample';

type Props = {
  theme: Theme,
  navigation: any,
};

export const examples = {
  activityIndicator: ActivityIndicatorExample,
  appbar: AppbarExample,
  avatar: AvatarExample,
  badge: BadgeExample,
  banner: BannerExample,
  bottomNavigation: BottomNavigationExample,
  button: ButtonExample,
  card: CardExample,
  checkbox: CheckboxExample,
  chip: ChipExample,
  dataTable: DataTableExample,
  dialog: DialogExample,
  divider: DividerExample,
  fab: FABExample,
  iconButton: IconButtonExample,
  listAccordion: ListAccordionExample,
  listSection: ListSectionExample,
  menu: MenuExample,
  progressbar: ProgressBarExample,
  radio: RadioButtonExample,
  radioGroup: RadioButtonGroupExample,
  searchbar: SearchbarExample,
  snackbar: SnackbarExample,
  surface: SurfaceExample,
  switch: SwitchExample,
  text: TextExample,
  textInput: TextInputExample,
  toggleButton: ToggleButtonExample,
  touchableRipple: TouchableRippleExample,
};

const data = Object.keys(examples).map(id => ({ id, data: examples[id] }));

class ExampleList extends React.Component<Props> {
  static navigationOptions = {
    title: 'Examples',
  };

  _renderItem = ({ item }) => (
    <List.Item
      title={item.data.title}
      onPress={() => this.props.navigation.navigate(item.id)}
    />
  );

  _keyExtractor = item => item.id;

  render() {
    const {
      theme: {
        colors: { background },
      },
    } = this.props;

    return (
      <FlatList
        contentContainerStyle={{ backgroundColor: background }}
        ItemSeparatorComponent={Divider}
        renderItem={this._renderItem}
        keyExtractor={this._keyExtractor}
        data={data}
      />
    );
  }
}

export default withTheme(ExampleList);
