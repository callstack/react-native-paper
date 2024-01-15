import * as React from 'react';
import { Platform, StyleSheet, View, Image } from 'react-native';

import type { StackNavigationProp } from '@react-navigation/stack';
import {
  Appbar,
  Avatar,
  Banner,
  Chip,
  FAB,
  IconButton,
  List,
  ToggleButton,
  Tooltip,
  Card,
} from 'react-native-paper';

import { isWeb } from '../../utils';
import ScreenWrapper from '../ScreenWrapper';

type Props = {
  navigation: StackNavigationProp<{}>;
};

const MORE_ICON = Platform.OS === 'ios' ? 'dots-horizontal' : 'dots-vertical';

const DURATION_MEDIUM = 1500;
const DURATION_LONG = 3000;

const formOfTransport = [
  { title: 'Car - default delays' },
  { title: 'Airplane - default delays' },
  { title: 'Taxi - long enter delay', enterTouchDelay: DURATION_MEDIUM },
  { title: 'Train - long enter delay', enterTouchDelay: DURATION_MEDIUM },
  { title: 'Ferry - long leave delay', leaveTouchDelay: DURATION_MEDIUM },
  { title: 'Bus - long leave delay', leaveTouchDelay: DURATION_MEDIUM },
  {
    title: 'Walk - long both delays',
    enterTouchDelay: DURATION_MEDIUM,
    leaveTouchDelay: DURATION_LONG,
  },
];

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
        <List.Section title="Icon Buttons">
          <View style={styles.iconButtonContainer}>
            {formOfTransport.map((transport, index) => (
              <Tooltip
                key={index}
                title={transport.title}
                enterTouchDelay={transport.enterTouchDelay}
                leaveTouchDelay={transport.leaveTouchDelay}
              >
                <IconButton
                  icon={transport.title.split(' ')[0].toLowerCase()}
                  size={24}
                  onPress={() => {}}
                />
              </Tooltip>
            ))}
          </View>
        </List.Section>
        <List.Section title="Toggle Buttons">
          <ToggleButton.Row
            value="bold"
            style={styles.toggleButtonRow}
            onValueChange={() => {}}
          >
            <Tooltip title="Bold">
              <ToggleButton icon="format-bold" value="bold" />
            </Tooltip>
            <Tooltip title="Align center">
              <ToggleButton icon="format-align-center" value="align-center" />
            </Tooltip>
          </ToggleButton.Row>
        </List.Section>
        <List.Section title="Avatar">
          <View style={styles.avatarContainer}>
            <Tooltip title="Username">
              <Avatar.Text label="U" />
            </Tooltip>
          </View>
        </List.Section>
        <List.Section title="Chip">
          <View style={styles.chipContainer}>
            <Tooltip title="Copied">
              <Chip
                mode="outlined"
                avatar={
                  <Image
                    source={require('../../assets/images/avatar.png')}
                    accessibilityIgnoresInvertColors
                  />
                }
              >
                John Doe
              </Chip>
            </Tooltip>
          </View>
        </List.Section>
        <List.Section title="Card">
          <Tooltip title="Cafeteria, 1st floor">
            <Card style={styles.cardContainer}>
              <Card.Title
                title="Lunch break"
                subtitle="1:00-2:00 PM"
                left={(props) => (
                  <Avatar.Icon {...props} icon="food-fork-drink" />
                )}
              />
            </Card>
          </Tooltip>
        </List.Section>
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
    marginHorizontal: 16,
    width: 64,
  },
  chipContainer: {
    marginHorizontal: 16,
    alignItems: 'center',
    flexDirection: 'row',
  },
  fabContainer: {
    margin: 16,
    right: 0,
    position: 'absolute',
    bottom: 0,
  },
  cardContainer: {
    margin: 16,
  },
  toggleButtonRow: {
    paddingHorizontal: 16,
  },
  iconButtonContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
});
