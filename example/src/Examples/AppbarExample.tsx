import * as React from 'react';
import { View, Platform, StyleSheet } from 'react-native';
import type { StackNavigationProp } from '@react-navigation/stack';
import {
  Appbar,
  FAB,
  Switch,
  Paragraph,
  Text,
  useTheme,
  RadioButton,
} from 'react-native-paper';
import ScreenWrapper from '../ScreenWrapper';
import { yellowA200 } from '../../../src/styles/themes/v2/colors';

type Props = {
  navigation: StackNavigationProp<{}>;
};

type AppbarModes = 'small' | 'medium' | 'large' | 'center-aligned';

const MORE_ICON = Platform.OS === 'ios' ? 'dots-horizontal' : 'dots-vertical';

const AppbarExample = ({ navigation }: Props) => {
  const [showLeftIcon, setShowLeftIcon] = React.useState(true);
  const [showSubtitle, setShowSubtitle] = React.useState(true);
  const [showSearchIcon, setShowSearchIcon] = React.useState(true);
  const [showMoreIcon, setShowMoreIcon] = React.useState(true);
  const [showCustomColor, setShowCustomColor] = React.useState(false);
  const [showExactTheme, setShowExactTheme] = React.useState(false);
  const [appbarMode, setAppbarMode] = React.useState<AppbarModes>('small');
  const [showCalendarIcon, setShowCalendarIcon] = React.useState(false);

  const { isV3 } = useTheme();

  const isCenterAlignedMode = appbarMode === 'center-aligned';

  React.useLayoutEffect(() => {
    navigation.setOptions({
      header: () => (
        <Appbar.Header
          style={showCustomColor ? styles.customColor : null}
          theme={{
            mode: showExactTheme ? 'exact' : 'adaptive',
          }}
          mode={appbarMode}
        >
          {showLeftIcon && (
            <Appbar.BackAction onPress={() => navigation.goBack()} />
          )}
          <Appbar.Content
            title="Title"
            subtitle={showSubtitle ? 'Subtitle' : null}
          />
          {isCenterAlignedMode
            ? false
            : showCalendarIcon && (
                <Appbar.Action icon="calendar" onPress={() => {}} />
              )}
          {showSearchIcon && (
            <Appbar.Action icon="magnify" onPress={() => {}} />
          )}
          {showMoreIcon && (
            <Appbar.Action icon={MORE_ICON} onPress={() => {}} />
          )}
        </Appbar.Header>
      ),
    });
  }, [
    navigation,
    showLeftIcon,
    showSubtitle,
    showSearchIcon,
    showMoreIcon,
    showCustomColor,
    showExactTheme,
    appbarMode,
    showCalendarIcon,
    isCenterAlignedMode,
  ]);

  const TextComponent = isV3 ? Text : Paragraph;

  return (
    <>
      <ScreenWrapper
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
      >
        <View style={styles.row}>
          <TextComponent variant="label-large">Left icon</TextComponent>
          <Switch value={showLeftIcon} onValueChange={setShowLeftIcon} />
        </View>
        {!isV3 && (
          <View style={styles.row}>
            <TextComponent variant="label-large">Subtitle</TextComponent>
            <Switch value={showSubtitle} onValueChange={setShowSubtitle} />
          </View>
        )}
        <View style={styles.row}>
          <TextComponent variant="label-large">Search icon</TextComponent>
          <Switch value={showSearchIcon} onValueChange={setShowSearchIcon} />
        </View>
        <View style={styles.row}>
          <TextComponent variant="label-large">More icon</TextComponent>
          <Switch value={showMoreIcon} onValueChange={setShowMoreIcon} />
        </View>
        {isV3 && (
          <View style={styles.row}>
            <TextComponent variant="label-large">Calendar icon</TextComponent>
            <Switch
              value={isCenterAlignedMode ? false : showCalendarIcon}
              disabled={isCenterAlignedMode}
              onValueChange={setShowCalendarIcon}
            />
          </View>
        )}
        <View style={styles.row}>
          <TextComponent variant="label-large">Custom Color</TextComponent>
          <Switch value={showCustomColor} onValueChange={setShowCustomColor} />
        </View>
        <View style={styles.row}>
          <TextComponent variant="label-large">Exact Dark Theme</TextComponent>
          <Switch value={showExactTheme} onValueChange={setShowExactTheme} />
        </View>
        {isV3 && (
          <RadioButton.Group
            value={appbarMode}
            onValueChange={(value: string) =>
              setAppbarMode(value as AppbarModes)
            }
          >
            <TextComponent variant="label-large" style={styles.appbarMode}>
              Appbar Mode
            </TextComponent>
            <View style={styles.row}>
              <TextComponent variant="label-large">
                Small (default)
              </TextComponent>
              <RadioButton value="small" />
            </View>
            <View style={styles.row}>
              <TextComponent variant="label-large">Medium</TextComponent>
              <RadioButton value="medium" />
            </View>
            <View style={styles.row}>
              <TextComponent variant="label-large">Large</TextComponent>
              <RadioButton value="large" />
            </View>
            <View style={styles.row}>
              <TextComponent variant="label-large">
                Center-aligned
              </TextComponent>
              <RadioButton value="center-aligned" />
            </View>
          </RadioButton.Group>
        )}
      </ScreenWrapper>
      <Appbar
        style={styles.bottom}
        theme={{ mode: showExactTheme ? 'exact' : 'adaptive' }}
      >
        <Appbar.Action icon="archive" onPress={() => {}} />
        <Appbar.Action icon="email" onPress={() => {}} />
        <Appbar.Action icon="label" onPress={() => {}} />
        <Appbar.Action icon="delete" onPress={() => {}} />
      </Appbar>
      <FAB icon="reply" onPress={() => {}} style={styles.fab} />
    </>
  );
};

AppbarExample.title = 'Appbar';

export default AppbarExample;

const styles = StyleSheet.create({
  container: {
    marginBottom: 56,
  },
  contentContainer: {
    paddingVertical: 8,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  bottom: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
  },
  fab: {
    position: 'absolute',
    right: 16,
    bottom: 28,
  },
  customColor: {
    backgroundColor: yellowA200,
  },
  appbarMode: {
    textAlign: 'center',
  },
});
