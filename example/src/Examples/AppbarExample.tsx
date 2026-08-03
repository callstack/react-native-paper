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
  const [showSearchIcon, setShowSearchIcon] = React.useState(true);
  const [showMoreIcon, setShowMoreIcon] = React.useState(true);
  const [showCustomColor, setShowCustomColor] = React.useState(false);
  const [appbarMode, setAppbarMode] = React.useState<AppbarModes>('small');
  const [showCalendarIcon, setShowCalendarIcon] = React.useState(false);
  const [showElevated, setShowElevated] = React.useState(false);
  const [titleAlignCenter, setTitleAlignCenter] = React.useState(false);
  const [showFilledAction, setShowFilledAction] = React.useState(false);
  const [showLogo, setShowLogo] = React.useState(false);
  const [showSnackbar, setShowSnackbar] = React.useState(false);

  const theme = useTheme();
  const { bottom, left, right } = useSafeAreaInsets();
  const height = 80;

  const isCenterAlignedMode =
    appbarMode === 'center-aligned' ||
    (appbarMode === 'small' && titleAlignCenter);
  const isFlexible =
    appbarMode === 'medium-flexible' || appbarMode === 'large-flexible';

  React.useLayoutEffect(() => {
    navigation.setOptions({
      header: () => (
        <Appbar.Header
          style={showCustomColor ? styles.customColor : null}
          mode={appbarMode}
          titleAlign={titleAlignCenter ? 'center' : 'start'}
          elevated={showElevated}
          scrollProgress={showElevated ? 1 : 0}
        >
          {showLeftIcon && (
            <Appbar.BackAction onPress={() => navigation.goBack()} />
          )}
          <Appbar.Content
            title="Title"
            subtitle={
              showSubtitle && isFlexible ? 'MD3 flexible subtitle' : undefined
            }
            logo={
              showLogo && isFlexible
                ? {
                    uri: 'https://callstack.github.io/react-native-paper/images/favicon.ico',
                  }
                : undefined
            }
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
            <Appbar.Action icon="plus" mode="filled" onPress={() => {}} />
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
    appbarMode,
    showCalendarIcon,
    isCenterAlignedMode,
    showElevated,
    titleAlignCenter,
    showFilledAction,
    showLogo,
    isFlexible,
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
        <Text>Scrolled container (surfaceContainer)</Text>
        <Switch value={showElevated} onValueChange={setShowElevated} />
      </View>
      <View style={styles.row}>
        <Text>Title align center (small)</Text>
        <Switch
          value={titleAlignCenter}
          onValueChange={setTitleAlignCenter}
          disabled={appbarMode !== 'small' && appbarMode !== 'center-aligned'}
        />
      </View>
      <View style={styles.row}>
        <Text>Filled trailing action</Text>
        <Switch value={showFilledAction} onValueChange={setShowFilledAction} />
      </View>
      <View style={styles.row}>
        <Text>Logo (flexible modes)</Text>
        <Switch
          value={showLogo}
          onValueChange={setShowLogo}
          disabled={
            !isFlexible && appbarMode !== 'medium' && appbarMode !== 'large'
          }
        />
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
        <List.Section title="TopAppBar modes (MD3)">
          <RadioButton.Group
            value={appbarMode}
            onValueChange={(value: string) =>
              setAppbarMode(value as AppbarModes)
            }
          >
            {/* RadioButton.Item makes the whole row the press target (same pattern as RadioButtonGroupExample). */}
            <RadioButton.Item label="Small (default)" value="small" />
            <RadioButton.Item label="Medium flexible" value="medium-flexible" />
            <RadioButton.Item label="Large flexible" value="large-flexible" />
            <RadioButton.Item label="Medium (legacy baseline)" value="medium" />
            <RadioButton.Item label="Large (legacy baseline)" value="large" />
            <RadioButton.Item
              label="Center-aligned (legacy)"
              value="center-aligned"
            />
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
