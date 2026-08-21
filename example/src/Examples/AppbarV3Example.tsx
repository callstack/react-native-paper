import * as React from 'react';
import { Platform, StyleSheet, View } from 'react-native';

import { useNavigation } from '@react-navigation/native';
import {
  AppbarV3,
  FAB,
  IconButton,
  List,
  Palette,
  RadioButton,
  Snackbar,
  Surface,
  Switch,
  Text,
  useTheme,
} from 'react-native-paper';
import type {
  AppbarV3StandardAction,
  AppbarV3TitleAlignment,
  AppbarV3Variant,
} from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import ScreenWrapper from '../ScreenWrapper';

type AppbarConfiguration = AppbarV3Variant | 'small-centered';

const MORE_ICON = Platform.OS === 'ios' ? 'dots-horizontal' : 'dots-vertical';
const BOTTOM_APPBAR_HEIGHT = 80;
const MEDIUM_FAB_HEIGHT = 56;

const AppbarV3Example = () => {
  const navigation = useNavigation('AppbarV3');

  const [showLeftIcon, setShowLeftIcon] = React.useState(true);
  const [showSubtitle, setShowSubtitle] = React.useState(true);
  const [showSearchIcon, setShowSearchIcon] = React.useState(true);
  const [showMoreIcon, setShowMoreIcon] = React.useState(true);
  const [showCustomColor, setShowCustomColor] = React.useState(false);
  const [appbarConfiguration, setAppbarConfiguration] =
    React.useState<AppbarConfiguration>('small');
  const [showCalendarIcon, setShowCalendarIcon] = React.useState(false);
  const [showScrolled, setShowScrolled] = React.useState(false);
  const [showSnackbar, setShowSnackbar] = React.useState(false);

  const theme = useTheme();
  const { bottom, left, right } = useSafeAreaInsets();
  const isCentered = appbarConfiguration === 'small-centered';
  const variant: AppbarV3Variant = isCentered ? 'small' : appbarConfiguration;
  const titleAlignment: AppbarV3TitleAlignment = isCentered
    ? 'center'
    : 'leading';

  React.useLayoutEffect(() => {
    const actions: AppbarV3StandardAction[] = [];

    if (!isCentered && showCalendarIcon) {
      actions.push({
        icon: 'calendar',
        'aria-label': 'Calendar',
        onPress: () => {},
      });
    }

    if (showSearchIcon) {
      actions.push({
        icon: 'magnify',
        'aria-label': 'Search',
        onPress: () => {},
      });
    }

    if (showMoreIcon) {
      actions.push({
        icon: MORE_ICON,
        'aria-label': 'More options',
        onPress: () => {},
      });
    }

    navigation.setOptions({
      header: () => (
        <AppbarV3
          style={showCustomColor ? styles.customColor : null}
          variant={variant}
          titleAlignment={titleAlignment}
          title="Title"
          subtitle={showSubtitle ? 'Subtitle' : undefined}
          onTitlePress={() => setShowSnackbar(true)}
          isScrolled={showScrolled}
          leadingAction={
            showLeftIcon
              ? {
                  type: 'back',
                  onPress: () => navigation.goBack(),
                }
              : undefined
          }
          actions={actions}
        />
      ),
    });
  }, [
    isCentered,
    navigation,
    showCalendarIcon,
    showCustomColor,
    showLeftIcon,
    showMoreIcon,
    showScrolled,
    showSearchIcon,
    showSubtitle,
    titleAlignment,
    variant,
  ]);

  const renderFAB = () => (
    <FAB
      icon="plus"
      onPress={() => {}}
      style={[
        styles.fab,
        {
          right: 16 + right,
          top: (BOTTOM_APPBAR_HEIGHT - MEDIUM_FAB_HEIGHT) / 2,
        },
      ]}
    />
  );

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
          value={isCentered ? false : showCalendarIcon}
          disabled={isCentered}
          onValueChange={setShowCalendarIcon}
        />
      </View>
      <View style={styles.row}>
        <Text>Custom Color</Text>
        <Switch value={showCustomColor} onValueChange={setShowCustomColor} />
      </View>
      <View style={styles.row}>
        <Text>Scrolled</Text>
        <Switch value={showScrolled} onValueChange={setShowScrolled} />
      </View>
    </>
  );

  return (
    <>
      <ScreenWrapper
        style={{ marginBottom: BOTTOM_APPBAR_HEIGHT + bottom }}
        contentContainerStyle={styles.contentContainer}
      >
        <List.Section title="Default options">
          {renderDefaultOptions()}
        </List.Section>
        <List.Section title="Appbar variants">
          <RadioButton.Group
            value={appbarConfiguration}
            onValueChange={(value: string) =>
              setAppbarConfiguration(value as AppbarConfiguration)
            }
          >
            <View style={styles.row}>
              <Text>Small (default)</Text>
              <RadioButton value="small" />
            </View>
            <View style={styles.row}>
              <Text>Medium flexible</Text>
              <RadioButton value="medium-flexible" />
            </View>
            <View style={styles.row}>
              <Text>Large flexible</Text>
              <RadioButton value="large-flexible" />
            </View>
            <View style={styles.row}>
              <Text>Small (centered)</Text>
              <RadioButton value="small-centered" />
            </View>
          </RadioButton.Group>
        </List.Section>
      </ScreenWrapper>
      <Surface
        elevation={0}
        style={[
          styles.bottom,
          {
            height: BOTTOM_APPBAR_HEIGHT + bottom,
            paddingBottom: bottom,
            paddingLeft: left,
            paddingRight: right,
            backgroundColor: theme.colors.surfaceContainerHigh,
          },
        ]}
      >
        <View style={styles.bottomActions}>
          <IconButton icon="archive" aria-label="Archive" onPress={() => {}} />
          <IconButton icon="email" aria-label="Email" onPress={() => {}} />
          <IconButton icon="label" aria-label="Label" onPress={() => {}} />
          <IconButton icon="delete" aria-label="Delete" onPress={() => {}} />
        </View>
        {renderFAB()}
      </Surface>
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

AppbarV3Example.title = 'Appbar V3';

export default AppbarV3Example;

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
  bottomActions: {
    height: BOTTOM_APPBAR_HEIGHT,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  fab: {
    position: 'absolute',
  },
  customColor: {
    backgroundColor: Palette.secondary80,
  },
});
