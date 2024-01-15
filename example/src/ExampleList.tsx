import * as React from 'react';
import { FlatList } from 'react-native';

import type { StackNavigationProp } from '@react-navigation/stack';
import { Divider, List } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import ActivityIndicatorExample from './Examples/ActivityIndicatorExample';
import AnimatedFABExample from './Examples/AnimatedFABExample';
import AppbarExample from './Examples/AppbarExample';
import AvatarExample from './Examples/AvatarExample';
import BadgeExample from './Examples/BadgeExample';
import BannerExample from './Examples/BannerExample';
import BottomNavigationBarExample from './Examples/BottomNavigationBarExample';
import BottomNavigationExample from './Examples/BottomNavigationExample';
import ButtonExample from './Examples/ButtonExample';
import CardExample from './Examples/CardExample';
import CheckboxExample from './Examples/CheckboxExample';
import CheckboxItemExample from './Examples/CheckboxItemExample';
import ChipExample from './Examples/ChipExample';
import DataTableExample from './Examples/DataTableExample';
import DialogExample from './Examples/DialogExample';
import DividerExample from './Examples/DividerExample';
import FABExample from './Examples/FABExample';
import IconButtonExample from './Examples/IconButtonExample';
import IconExample from './Examples/IconExample';
import ListAccordionExample from './Examples/ListAccordionExample';
import ListAccordionExampleGroup from './Examples/ListAccordionGroupExample';
import ListItemExample from './Examples/ListItemExample';
import ListSectionExample from './Examples/ListSectionExample';
import MaterialBottomTabNavigatorExample from './Examples/MaterialBottomTabNavigatorExample';
import MenuExample from './Examples/MenuExample';
import ProgressBarExample from './Examples/ProgressBarExample';
import RadioButtonExample from './Examples/RadioButtonExample';
import RadioButtonGroupExample from './Examples/RadioButtonGroupExample';
import RadioButtonItemExample from './Examples/RadioButtonItemExample';
import SearchbarExample from './Examples/SearchbarExample';
import SegmentedButtonMultiselectRealCase from './Examples/SegmentedButtons/SegmentedButtonMultiselectRealCase';
import SegmentedButtonRealCase from './Examples/SegmentedButtons/SegmentedButtonRealCase';
import SegmentedButtonExample from './Examples/SegmentedButtonsExample';
import SnackbarExample from './Examples/SnackbarExample';
import SurfaceExample from './Examples/SurfaceExample';
import SwitchExample from './Examples/SwitchExample';
import TeamDetails from './Examples/TeamDetails';
import TeamsList from './Examples/TeamsList';
import TextExample from './Examples/TextExample';
import TextInputExample from './Examples/TextInputExample';
import ThemeExample from './Examples/ThemeExample';
import ThemingWithReactNavigation from './Examples/ThemingWithReactNavigation';
import ToggleButtonExample from './Examples/ToggleButtonExample';
import TooltipExample from './Examples/TooltipExample';
import TouchableRippleExample from './Examples/TouchableRippleExample';

import { useExampleTheme } from '.';

export const mainExamples: Record<
  string,
  React.ComponentType<any> & { title: string }
> = {
  animatedFab: AnimatedFABExample,
  activityIndicator: ActivityIndicatorExample,
  appbar: AppbarExample,
  avatar: AvatarExample,
  badge: BadgeExample,
  banner: BannerExample,
  bottomNavigationBarExample: BottomNavigationBarExample,
  bottomNavigation: BottomNavigationExample,
  button: ButtonExample,
  card: CardExample,
  checkbox: CheckboxExample,
  checkboxItem: CheckboxItemExample,
  chip: ChipExample,
  dataTable: DataTableExample,
  dialog: DialogExample,
  divider: DividerExample,
  fab: FABExample,
  iconButton: IconButtonExample,
  icon: IconExample,
  listAccordion: ListAccordionExample,
  listAccordionGroup: ListAccordionExampleGroup,
  listSection: ListSectionExample,
  listItem: ListItemExample,
  materialBottomTabNavigator: MaterialBottomTabNavigatorExample,
  menu: MenuExample,
  progressbar: ProgressBarExample,
  radio: RadioButtonExample,
  radioGroup: RadioButtonGroupExample,
  radioItem: RadioButtonItemExample,
  searchbar: SearchbarExample,
  segmentedButton: SegmentedButtonExample,
  snackbar: SnackbarExample,
  surface: SurfaceExample,
  switch: SwitchExample,
  text: TextExample,
  textInput: TextInputExample,
  toggleButton: ToggleButtonExample,
  tooltipExample: TooltipExample,
  touchableRipple: TouchableRippleExample,
  theme: ThemeExample,
  themingWithReactNavigation: ThemingWithReactNavigation,
};

export const nestedExamples: Record<
  string,
  React.ComponentType<any> & { title: string }
> = {
  themingWithReactNavigation: ThemingWithReactNavigation,
  teamDetails: TeamDetails,
  teamsList: TeamsList,
  segmentedButtonRealCase: SegmentedButtonRealCase,
  segmentedButtonMultiselectRealCase: SegmentedButtonMultiselectRealCase,
};

export const examples: Record<
  string,
  React.ComponentType<any> & { title: string }
> = {
  ...mainExamples,
  ...nestedExamples,
};

type Props = {
  navigation: StackNavigationProp<{ [key: string]: undefined }>;
};

type Item = {
  id: string;
  data: (typeof mainExamples)[string];
};

const data = Object.keys(mainExamples).map(
  (id): Item => ({ id, data: mainExamples[id] })
);

export default function ExampleList({ navigation }: Props) {
  const keyExtractor = (item: { id: string }) => item.id;

  const { colors, isV3 } = useExampleTheme();
  const safeArea = useSafeAreaInsets();

  const renderItem = ({ item }: { item: Item }) => {
    const { data, id } = item;

    if (!isV3 && data.title === mainExamples.themingWithReactNavigation.title) {
      return null;
    }

    return (
      <List.Item
        unstable_pressDelay={65}
        title={data.title}
        onPress={() => navigation.navigate(id)}
      />
    );
  };

  return (
    <FlatList
      contentContainerStyle={{
        backgroundColor: colors.background,
        paddingBottom: safeArea.bottom,
        paddingLeft: safeArea.left,
        paddingRight: safeArea.right,
      }}
      style={{
        backgroundColor: colors.background,
      }}
      showsVerticalScrollIndicator={false}
      ItemSeparatorComponent={Divider}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      data={data}
    />
  );
}
