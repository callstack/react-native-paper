import * as React from 'react';
import { Platform, StyleSheet, View } from 'react-native';

import type { StackNavigationProp } from '@react-navigation/stack';
import {
  Appbar,
  FAB,
  List,
  Paragraph,
  RadioButton,
  Switch,
  Text,
} from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useExampleTheme } from '..';
import { yellowA200 } from '../../../src/styles/themes/v2/colors';
import ScreenWrapper from '../ScreenWrapper';

type Props = {
  navigation: StackNavigationProp<{}>;
};

type AppbarModes = 'small' | 'medium' | 'large' | 'center-aligned';

const MORE_ICON = Platform.OS === 'ios' ? 'dots-horizontal' : 'dots-vertical';
const MEDIUM_FAB_HEIGHT = 56;

const AppbarExample = ({ navigation }: Props) => {
  const [showLeftIcon, setShowLeftIcon] = React.useState(true);
  const [showSubtitle, setShowSubtitle] = React.useState(true);
  const [showSearchIcon, setShowSearchIcon] = React.useState(true);
  const [showMoreIcon, setShowMoreIcon] = React.useState(true);
  const [showCustomColor, setShowCustomColor] = React.useState(false);
  const [showExactTheme, setShowExactTheme] = React.useState(false);
  const [appbarMode, setAppbarMode] = React.useState<AppbarModes>('small');
  const [showCalendarIcon, setShowCalendarIcon] = React.useState(false);
  const [showElevated, setShowElevated] = React.useState(false);

  const theme = useExampleTheme();
  const { bottom, left, right } = useSafeAreaInsets();
  const height = theme.isV3 ? 80 : 56;

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
          elevated={showElevated}
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
    showElevated,
  ]);

  const TextComponent = theme.isV3 ? Text : Paragraph;

  const renderFAB = () => {
    return (
      <FAB
        mode={theme.isV3 ? 'flat' : 'elevated'}
        size="medium"
        icon="plus"
        onPress={() => {}}
        style={[
          styles.fab,
          theme.isV3
            ? { top: (height - MEDIUM_FAB_HEIGHT) / 2 }
            : { bottom: height / 2 + bottom },
        ]}
      />
    );
  };

  const renderDefaultOptions = () => (
    <>
      <View style={styles.row}>
        <TextComponent>Left icon</TextComponent>
        <Switch value={showLeftIcon} onValueChange={setShowLeftIcon} />
      </View>
      {!theme.isV3 && (
        <View style={styles.row}>
          <TextComponent>Subtitle</TextComponent>
          <Switch value={showSubtitle} onValueChange={setShowSubtitle} />
        </View>
      )}
      <View style={styles.row}>
        <TextComponent>Search icon</TextComponent>
        <Switch value={showSearchIcon} onValueChange={setShowSearchIcon} />
      </View>
      <View style={styles.row}>
        <TextComponent>More icon</TextComponent>
        <Switch value={showMoreIcon} onValueChange={setShowMoreIcon} />
      </View>
      {theme.isV3 && (
        <View style={styles.row}>
          <TextComponent>Calendar icon</TextComponent>
          <Switch
            value={isCenterAlignedMode ? false : showCalendarIcon}
            disabled={isCenterAlignedMode}
            onValueChange={setShowCalendarIcon}
          />
        </View>
      )}
      <View style={styles.row}>
        <TextComponent>Custom Color</TextComponent>
        <Switch value={showCustomColor} onValueChange={setShowCustomColor} />
      </View>
      <View style={styles.row}>
        <TextComponent>Exact Dark Theme</TextComponent>
        <Switch value={showExactTheme} onValueChange={setShowExactTheme} />
      </View>
      {theme.isV3 && (
        <View style={styles.row}>
          <TextComponent>Elevated</TextComponent>
          <Switch value={showElevated} onValueChange={setShowElevated} />
        </View>
      )}
    </>
  );

  return (
    <>
      <ScreenWrapper
        style={{ marginBottom: height + bottom }}
        contentContainerStyle={styles.contentContainer}
      >
        {theme.isV3 ? (
          <List.Section title="Default options">
            {renderDefaultOptions()}
          </List.Section>
        ) : (
          renderDefaultOptions()
        )}
        {theme.isV3 && (
          <List.Section title="Appbar Modes">
            <RadioButton.Group
              value={appbarMode}
              onValueChange={(value: string) =>
                setAppbarMode(value as AppbarModes)
              }
            >
              <View style={styles.row}>
                <TextComponent>Small (default)</TextComponent>
                <RadioButton value="small" />
              </View>
              <View style={styles.row}>
                <TextComponent>Medium</TextComponent>
                <RadioButton value="medium" />
              </View>
              <View style={styles.row}>
                <TextComponent>Large</TextComponent>
                <RadioButton value="large" />
              </View>
              <View style={styles.row}>
                <TextComponent>Center-aligned</TextComponent>
                <RadioButton value="center-aligned" />
              </View>
            </RadioButton.Group>
          </List.Section>
        )}
      </ScreenWrapper>
      <Appbar
        style={[
          styles.bottom,
          {
            height: height + bottom,
            backgroundColor: theme.isV3
              ? theme.colors.elevation.level2
              : theme.colors.primary,
          },
        ]}
        safeAreaInsets={{ bottom, left, right }}
        theme={{ mode: showExactTheme ? 'exact' : 'adaptive' }}
      >
        <Appbar.Action icon="archive" onPress={() => {}} />
        <Appbar.Action icon="email" onPress={() => {}} />
        <Appbar.Action icon="label" onPress={() => {}} />
        <Appbar.Action icon="delete" onPress={() => {}} />
        {theme.isV3 && renderFAB()}
      </Appbar>
      {!theme.isV3 && renderFAB()}
    </>
  );
};

AppbarExample.title = 'Appbar';

export default AppbarExample;

const styles = StyleSheet.create({
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
  },
  customColor: {
    backgroundColor: yellowA200,
  },
});
