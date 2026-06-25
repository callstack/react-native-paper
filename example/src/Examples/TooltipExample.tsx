import * as React from 'react';
import { Platform, StyleSheet, View, Image } from 'react-native';

import { useNavigation } from '@react-navigation/native';
import {
  Appbar,
  Avatar,
  Banner,
  Button,
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

const TooltipExample = () => {
  const navigation = useNavigation('TooltipExample');

  const [textAlign, setTextAlign] = React.useState('bold');
  React.useLayoutEffect(() => {
    navigation.setOptions({
      header: () => (
        <Appbar.Header elevated>
          <Tooltip title="Go back">
            {(props) => (
              <Appbar.BackAction
                {...props}
                onPress={() => navigation.goBack()}
              />
            )}
          </Tooltip>
          <Appbar.Content title="Tooltips" />
          <Tooltip title="Print ⌘ + P">
            {(props) => (
              <Appbar.Action {...props} icon="printer" onPress={() => {}} />
            )}
          </Tooltip>
          <Tooltip title="Search">
            {(props) => (
              <Appbar.Action {...props} icon="magnify" onPress={() => {}} />
            )}
          </Tooltip>
          <Tooltip title="More options">
            {(props) => (
              <Appbar.Action {...props} icon={MORE_ICON} onPress={() => {}} />
            )}
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
                {(props) => (
                  <IconButton
                    {...props}
                    icon={transport.title.split(' ')[0].toLowerCase()}
                    size={24}
                    onPress={() => {}}
                  />
                )}
              </Tooltip>
            ))}
          </View>
        </List.Section>
        <List.Section title="Toggle Buttons">
          <ToggleButton.Row
            value={textAlign}
            style={styles.toggleButtonRow}
            onValueChange={setTextAlign}
          >
            <Tooltip title="Align left">
              {(props) => (
                <ToggleButton
                  {...props}
                  icon="format-align-left"
                  value="left"
                />
              )}
            </Tooltip>
            <Tooltip title="Align center">
              {(props) => (
                <ToggleButton
                  {...props}
                  icon="format-align-center"
                  value="center"
                />
              )}
            </Tooltip>
            <Tooltip title="Align right">
              {(props) => (
                <ToggleButton
                  {...props}
                  icon="format-align-right"
                  value="right"
                  disabled
                />
              )}
            </Tooltip>
          </ToggleButton.Row>
        </List.Section>
        <List.Section title="Avatar">
          <View style={styles.avatarContainer}>
            <Tooltip title="Username">
              {(props) => <Avatar.Text {...props} label="U" />}
            </Tooltip>
          </View>
        </List.Section>
        <List.Section title="Chip">
          <View style={styles.chipContainer}>
            <Tooltip title="Copied">
              {(props) => (
                <Chip
                  {...props}
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
              )}
            </Tooltip>
          </View>
        </List.Section>
        <List.Section title="Card">
          <Tooltip title="Cafeteria, 1st floor">
            {(props) => (
              <Card {...props} style={styles.cardContainer}>
                <Card.Title
                  title="Lunch break"
                  subtitle="1:00-2:00 PM"
                  left={(leftProps) => (
                    <Avatar.Icon {...leftProps} icon="food-fork-drink" />
                  )}
                />
              </Card>
            )}
          </Tooltip>
        </List.Section>
        <List.Section title="Rich tooltips">
          <View style={styles.iconButtonContainer}>
            <Tooltip.Rich
              title="Add to library"
              content="Save this item to read it later from any of your devices."
              actions={({ dismiss }) => (
                <>
                  <Button compact onPress={dismiss}>
                    Learn more
                  </Button>
                  <Button compact mode="contained" onPress={dismiss}>
                    Add
                  </Button>
                </>
              )}
            >
              {(props) => <IconButton {...props} icon="plus" size={24} />}
            </Tooltip.Rich>
            <Tooltip.Rich content="A rich tooltip with body text only — no title or actions.">
              {(props) => (
                <IconButton {...props} icon="information" size={24} />
              )}
            </Tooltip.Rich>
          </View>
        </List.Section>
      </ScreenWrapper>
      <View style={styles.fabContainer}>
        <Tooltip title="Press Me">
          {(props) => <FAB {...props} icon="plus" onPress={() => {}} />}
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
