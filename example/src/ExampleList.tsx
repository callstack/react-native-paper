import { FlatList } from 'react-native';

import { useNavigation } from '@react-navigation/native';
import { Divider, List, useTheme } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import ActivityIndicatorExample from './Examples/ActivityIndicatorExample';
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

export const mainExamples = {
  ActivityIndicator: ActivityIndicatorExample,
  Appbar: AppbarExample,
  Avatar: AvatarExample,
  Badge: BadgeExample,
  Banner: BannerExample,
  BottomNavigationBarExample,
  BottomNavigation: BottomNavigationExample,
  Button: ButtonExample,
  Card: CardExample,
  Checkbox: CheckboxExample,
  CheckboxItem: CheckboxItemExample,
  Chip: ChipExample,
  DataTable: DataTableExample,
  Dialog: DialogExample,
  Divider: DividerExample,
  FAB: FABExample,
  IconButton: IconButtonExample,
  Icon: IconExample,
  ListAccordion: ListAccordionExample,
  ListAccordionGroup: ListAccordionExampleGroup,
  ListSection: ListSectionExample,
  ListItem: ListItemExample,
  Menu: MenuExample,
  Progressbar: ProgressBarExample,
  Radio: RadioButtonExample,
  RadioGroup: RadioButtonGroupExample,
  RadioItem: RadioButtonItemExample,
  Searchbar: SearchbarExample,
  SegmentedButton: SegmentedButtonExample,
  Snackbar: SnackbarExample,
  Surface: SurfaceExample,
  Switch: SwitchExample,
  Text: TextExample,
  TextInput: TextInputExample,
  ToggleButton: ToggleButtonExample,
  TooltipExample,
  TouchableRipple: TouchableRippleExample,
  Theme: ThemeExample,
  ThemingWithReactNavigation,
};

export const nestedExamples = {
  ThemingWithReactNavigation,
  TeamDetails,
  TeamsList,
  SegmentedButtonRealCase,
  SegmentedButtonMultiselectRealCase,
};

export const examples = {
  ...mainExamples,
  ...nestedExamples,
};

type MainExampleId = keyof typeof mainExamples;

const data = (Object.keys(mainExamples) as MainExampleId[]).map((id) => ({
  id,
  data: mainExamples[id],
}));

export default function ExampleList() {
  const navigation = useNavigation('ExampleList');

  const { colors } = useTheme();
  const safeArea = useSafeAreaInsets();

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
      renderItem={({ item }) => (
        <List.Item
          unstable_pressDelay={65}
          title={item.data.title}
          onPress={() => {
            // @ts-expect-error TypeScript can't call overloaded functions with union arguments.
            // https://github.com/microsoft/TypeScript/issues/40803
            navigation.navigate(item.id);
          }}
        />
      )}
      keyExtractor={({ id }) => id}
      data={data}
    />
  );
}
