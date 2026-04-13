import * as React from 'react';
import { Platform, StyleSheet, View } from 'react-native';

import type { StackNavigationProp } from '@react-navigation/stack';
import {
  Appbar,
  FAB,
  List,
  MD3Colors,
  RadioButton,
  Snackbar,
  Switch,
  Text,
} from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useExampleTheme } from '../hooks/useExampleTheme';
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
  const [showSnackbar, setShowSnackbar] = React.useState(false);

  const theme = useExampleTheme();
  const { bottom, left, right } = useSafeAreaInsets();
  const height = 80;

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
            onPress={() => setShowSnackbar(true)}
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

  const renderFAB = () => {
    return (
      <FAB
        mode="flat"
        size="medium"
        icon="plus"
        onPress={() => {}}
        style={[styles.fab, { top: (height - MEDIUM_FAB_HEIGHT) / 2 }]}
      />
    );
  };

  const renderDefaultOptions = () => (
    <>
      <View style={styles.row}>
        <Text>Left icon</Text>
        <Switch value={showLeftIcon} onValueChange={setShowLeftIcon} />
      </View>
      <View style={styles.row}>
        <Text>Subtitle</Text>
        <Switch value={showSubtitle} onValueChange={setShowSubtitle} />
      </View>
      <View style={styles.row}>
        <Text>Search icon</Text>
        <Switch value={showSearchIcon} onValueChange={setShowSearchIcon} />
      </View>
      <View style={styles.row}>
        <Text>More icon</Text>
        <Switch value={showMoreIcon} onValueChange={setShowMoreIcon} />
      </View>
      <View style={styles.row}>
        <Text>Calendar icon</Text>
        <Switch
          value={isCenterAlignedMode ? false : showCalendarIcon}
          disabled={isCenterAlignedMode}
          onValueChange={setShowCalendarIcon}
        />
      </View>
      <View style={styles.row}>
        <Text>Custom Color</Text>
        <Switch value={showCustomColor} onValueChange={setShowCustomColor} />
      </View>
      <View style={styles.row}>
        <Text>Exact Dark Theme</Text>
        <Switch value={showExactTheme} onValueChange={setShowExactTheme} />
      </View>
      <View style={styles.row}>
        <Text>Elevated</Text>
        <Switch value={showElevated} onValueChange={setShowElevated} />
      </View>
    </>
  );

  return (
    <>
      <ScreenWrapper
        style={{ marginBottom: height + bottom }}
        contentContainerStyle={styles.contentContainer}
      >
        <List.Section title="Default options">
          {renderDefaultOptions()}
        </List.Section>
        <List.Section title="Appbar Modes">
          <RadioButton.Group
            value={appbarMode}
            onValueChange={(value: string) =>
              setAppbarMode(value as AppbarModes)
            }
          >
            <View style={styles.row}>
              <Text>Small (default)</Text>
              <RadioButton value="small" />
            </View>
            <View style={styles.row}>
              <Text>Medium</Text>
              <RadioButton value="medium" />
            </View>
            <View style={styles.row}>
              <Text>Large</Text>
              <RadioButton value="large" />
            </View>
            <View style={styles.row}>
              <Text>Center-aligned</Text>
              <RadioButton value="center-aligned" />
            </View>
          </RadioButton.Group>
        </List.Section>
      </ScreenWrapper>
      <Appbar
        style={[
          styles.bottom,
          {
            height: height + bottom,
          },
          {
            backgroundColor: theme.colors.elevation.level2,
          },
        ]}
        safeAreaInsets={{ bottom, left, right }}
        theme={{ mode: showExactTheme ? 'exact' : 'adaptive' }}
      >
        <Appbar.Action icon="archive" onPress={() => {}} />
        <Appbar.Action icon="email" onPress={() => {}} />
        <Appbar.Action icon="label" onPress={() => {}} />
        <Appbar.Action icon="delete" onPress={() => {}} />
        {renderFAB()}
      </Appbar>
      <Snackbar
        visible={showSnackbar}
        onDismiss={() => setShowSnackbar(false)}
        duration={Snackbar.DURATION_SHORT}
      >
        Heading pressed
      </Snackbar>
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
    backgroundColor: MD3Colors.secondary80,
  },
});
