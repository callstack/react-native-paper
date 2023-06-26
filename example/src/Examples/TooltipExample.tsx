import * as React from 'react';
import { Platform, StyleSheet, View } from 'react-native';

import type { StackNavigationProp } from '@react-navigation/stack';
import {
  Appbar,
  Avatar,
  Banner,
  FAB,
  List,
  ToggleButton,
  Tooltip,
} from 'react-native-paper';

import { isWeb } from '../../utils';
import ScreenWrapper from '../ScreenWrapper';

type Props = {
  navigation: StackNavigationProp<{}>;
};

const MORE_ICON = Platform.OS === 'ios' ? 'dots-horizontal' : 'dots-vertical';

const TooltipExample = ({ navigation }: Props) => {
  React.useLayoutEffect(() => {
    navigation.setOptions({
      header: () => (
        <Appbar.Header elevated>
          <Tooltip title="Go back">
            <Appbar.BackAction onPress={() => navigation.goBack()} />
          </Tooltip>
          <Appbar.Content title="Tooltips" />
          <Tooltip title="Print ⌘ + P">
            <Appbar.Action icon="printer" onPress={() => {}} />
          </Tooltip>
          <Tooltip title="Search">
            <Appbar.Action icon="magnify" onPress={() => {}} />
          </Tooltip>
          <Tooltip title="More options">
            <Appbar.Action icon={MORE_ICON} onPress={() => {}} />
          </Tooltip>
        </Appbar.Header>
      ),
    });
  });

  return (
    <>
      <ScreenWrapper>
        <Banner visible>
          A tooltip is displayed upon
          {!isWeb
            ? ' tapping and holding a screen element or component'
            : ' hovering over a screen element or component'}
          . Continuously display the tooltip as long as the user long-presses or
          hovers over the element.
        </Banner>
        <List.Section title="Toggle Buttons">
          <ToggleButton.Row
            value="bold"
            style={styles.toggleButtonRow}
            onValueChange={() => {}}
          >
            <ToggleButton icon="format-bold" value="bold" />
            <Tooltip title="Align center">
              <ToggleButton icon="format-align-center" value="align-center" />
            </Tooltip>
          </ToggleButton.Row>
        </List.Section>

        <View style={styles.avatarContainer}>
          <Tooltip title="Username">
            <Avatar.Text label="U" />
          </Tooltip>
        </View>
      </ScreenWrapper>

      <View style={styles.fabContainer}>
        <Tooltip title="Press Me">
          <FAB size="medium" icon="plus" onPress={() => {}} />
        </Tooltip>
      </View>
    </>
  );
};

TooltipExample.title = 'Tooltip';

export default TooltipExample;

const styles = StyleSheet.create({
  avatarContainer: {
    margin: 16,
    width: 64,
  },
  fabContainer: {
    margin: 16,
    right: 0,
    position: 'absolute',
    bottom: 0,
  },
  toggleButtonRow: {
    paddingHorizontal: 16,
  },
});
