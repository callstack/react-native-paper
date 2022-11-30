import * as React from 'react';
import { FlatList } from 'react-native';

import type { StackNavigationProp } from '@react-navigation/stack';
import { Divider, List } from 'react-native-paper';
import { useSafeArea } from 'react-native-safe-area-context';

import { useExampleTheme } from '..';
import AnimatedFABExample from '../Examples/AnimatedFABExample';
import AppbarExample from '../Examples/AppbarExample';
import BannerExample from '../Examples/BannerExample';
import BottomNavigationExample from '../Examples/BottomNavigationExample';
import ButtonExample from '../Examples/ButtonExample';
import FABExample from '../Examples/FABExample';
import MenuExample from '../Examples/MenuExample';
import ThemeExample from '../Examples/ThemeExample';
import ThemingWithReactNavigation from '../Examples/ThemingWithReactNavigation';
import TooltipExample from '../Examples/TooltipExample';
import SegmentedButtonExample from './SegmentedButtonsExample';

const starredExamples: Record<
  string,
  React.ComponentType<any> & { title: string }
> = {
  animatedFab: AnimatedFABExample,
  appbar: AppbarExample,
  banner: BannerExample,
  bottomNavigation: BottomNavigationExample,
  button: ButtonExample,
  fab: FABExample,
  menu: MenuExample,
  segmentedButton: SegmentedButtonExample,
  tooltipExample: TooltipExample,
  theme: ThemeExample,
  themingWithReactNavigation: ThemingWithReactNavigation,
};

type Props = {
  navigation: StackNavigationProp<{ [key: string]: undefined }>;
};

type Item = {
  id: string;
  data: typeof starredExamples[string];
};

const data = Object.keys(starredExamples).map(
  (id): Item => ({ id, data: starredExamples[id] })
);

function StarredExample({ navigation }: Props) {
  const renderItem = ({ item }: { item: Item }) => (
    <List.Item
      title={item.data.title}
      onPress={() => navigation.navigate(item.id)}
    />
  );

  const keyExtractor = (item: { id: string }) => item.id;

  const { colors } = useExampleTheme();
  const safeArea = useSafeArea();

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

export default StarredExample;
