import * as React from 'react';
import { Platform, StyleSheet, View } from 'react-native';

import { useNavigation } from '@react-navigation/native';
import {
  Appbar,
  FAB,
  List,
  Palette,
  RadioButton,
  Snackbar,
  Switch,
  Text,
  useTheme,
} from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import ScreenWrapper from '../ScreenWrapper';

type AppbarModes =
  | 'small'
  | 'medium'
  | 'large'
  | 'center-aligned'
  | 'medium-flexible'
  | 'large-flexible';

const MORE_ICON = Platform.OS === 'ios' ? 'dots-horizontal' : 'dots-vertical';
const MEDIUM_FAB_HEIGHT = 56;

const AppbarExample = () => {
  const navigation = useNavigation('Appbar');

  const [showLeftIcon, setShowLeftIcon] = React.useState(true);
  const [showSubtitle, setShowSubtitle] = React.useState(true);
  const [showLogo, setShowLogo] = React.useState(false);
  const [showSearchIcon, setShowSearchIcon] = React.useState(true);
  const [showMoreIcon, setShowMoreIcon] = React.useState(true);
  const [showFilledAction, setShowFilledAction] = React.useState(false);
  const [showTonalAction, setShowTonalAction] = React.useState(false);
  const [showCustomColor, setShowCustomColor] = React.useState(false);
  const [appbarMode, setAppbarMode] = React.useState<AppbarModes>('small');
  const [centerTitle, setCenterTitle] = React.useState(false);
  const [collapsed, setCollapsed] = React.useState(false);
  const [showCalendarIcon, setShowCalendarIcon] = React.useState(false);
  const [showElevated, setShowElevated] = React.useState(false);
  const [showSnackbar, setShowSnackbar] = React.useState(false);

  const theme = useTheme();
  const { bottom, left, right } = useSafeAreaInsets();
  const height = 80;

  const isCenterAlignedMode = appbarMode === 'center-aligned' || centerTitle;

  React.useLayoutEffect(() => {
    navigation.setOptions({
      header: () => (
        <Appbar.Header
          style={showCustomColor ? styles.customColor : null}
          mode={appbarMode}
          titleAlignment={centerTitle ? 'center' : 'start'}
          elevated={showElevated}
          collapsed={collapsed}
        >
          {showLeftIcon && (
            <Appbar.BackAction onPress={() => navigation.goBack()} />
          )}
          {showLogo && (
            <Appbar.Image
              source={require('../../assets/images/paper-icon.png')}
              size={36}
            />
          )}
          <Appbar.Content
            title="Title"
            subtitle={showSubtitle ? 'Supporting subtitle' : undefined}
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
          {showFilledAction && (
            <Appbar.Action icon="plus" mode="contained" onPress={() => {}} />
          )}
          {showTonalAction && (
            <Appbar.Action
              icon="bookmark"
              mode="contained-tonal"
              onPress={() => {}}
            />
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
    showLogo,
    showSearchIcon,
    showMoreIcon,
    showFilledAction,
    showTonalAction,
    showCustomColor,
    appbarMode,
    centerTitle,
    collapsed,
    showCalendarIcon,
    isCenterAlignedMode,
    showElevated,
  ]);

  const renderFAB = () => {
    return (
      <FAB
        icon="plus"
        onPress={() => {}}
        style={[styles.fab, { top: (height - MEDIUM_FAB_HEIGHT) / 2 }]}
      />
    );
  };

  const renderDefaultOptions = () => (
    <>
      <View style={styles.row}>
        <Text>Left back action</Text>
        <Switch value={showLeftIcon} onValueChange={setShowLeftIcon} />
      </View>
      <View style={styles.row}>
        <Text>Appbar logo (Appbar.Image)</Text>
        <Switch value={showLogo} onValueChange={setShowLogo} />
      </View>
      <View style={styles.row}>
        <Text>Subtitle</Text>
        <Switch value={showSubtitle} onValueChange={setShowSubtitle} />
      </View>
      <View style={styles.row}>
        <Text>Center title alignment</Text>
        <Switch value={centerTitle} onValueChange={setCenterTitle} />
      </View>
      <View style={styles.row}>
        <Text>Collapsed state</Text>
        <Switch value={collapsed} onValueChange={setCollapsed} />
      </View>
      <View style={styles.row}>
        <Text>Search action</Text>
        <Switch value={showSearchIcon} onValueChange={setShowSearchIcon} />
      </View>
      <View style={styles.row}>
        <Text>Filled trailing action (Primary)</Text>
        <Switch value={showFilledAction} onValueChange={setShowFilledAction} />
      </View>
      <View style={styles.row}>
        <Text>Tonal trailing action</Text>
        <Switch value={showTonalAction} onValueChange={setShowTonalAction} />
      </View>
      <View style={styles.row}>
        <Text>More action</Text>
        <Switch value={showMoreIcon} onValueChange={setShowMoreIcon} />
      </View>
      <View style={styles.row}>
        <Text>Calendar action</Text>
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
              // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion
              setAppbarMode(value as AppbarModes)
            }
          >
            <View style={styles.row}>
              <Text>Small (default)</Text>
              <RadioButton value="small" />
            </View>
            <View style={styles.row}>
              <Text>Medium Flexible (MD3 Expressive)</Text>
              <RadioButton value="medium-flexible" />
            </View>
            <View style={styles.row}>
              <Text>Large Flexible (MD3 Expressive)</Text>
              <RadioButton value="large-flexible" />
            </View>
            <View style={styles.row}>
              <Text>Center-aligned</Text>
              <RadioButton value="center-aligned" />
            </View>
            <View style={styles.row}>
              <Text>Medium (Baseline, deprecated)</Text>
              <RadioButton value="medium" />
            </View>
            <View style={styles.row}>
              <Text>Large (Baseline, deprecated)</Text>
              <RadioButton value="large" />
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
            backgroundColor: theme.colors.surfaceContainerHigh,
          },
        ]}
        safeAreaInsets={{ bottom, left, right }}
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
    backgroundColor: Palette.secondary80,
  },
});
