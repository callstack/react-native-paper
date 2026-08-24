import * as React from 'react';
import { Platform, StyleSheet, useWindowDimensions, View } from 'react-native';
import type { NativeScrollEvent, NativeSyntheticEvent } from 'react-native';

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
  AppbarV3Actions,
  AppbarV3FilledAction,
  AppbarV3StandardAction,
  AppbarV3TitleAlignment,
  AppbarV3Variant,
} from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import ScreenWrapper from '../ScreenWrapper';

type FilledActionVariant = AppbarV3FilledAction['variant'];
type FilledActionWidth = NonNullable<AppbarV3FilledAction['width']>;

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
    React.useState<AppbarV3Variant>('small');
  const [isTitleCentered, setIsTitleCentered] = React.useState(false);
  const [showCalendarIcon, setShowCalendarIcon] = React.useState(false);
  const [showFilledAction, setShowFilledAction] = React.useState(false);
  const [filledActionVariant, setFilledActionVariant] =
    React.useState<FilledActionVariant>('filled');
  const [filledActionWidth, setFilledActionWidth] =
    React.useState<FilledActionWidth>('default');
  const [isScrolled, setIsScrolled] = React.useState(false);
  const [showSnackbar, setShowSnackbar] = React.useState(false);

  const theme = useTheme();
  const { bottom, left, right } = useSafeAreaInsets();
  const { height: windowHeight } = useWindowDimensions();
  const titleAlignment: AppbarV3TitleAlignment = isTitleCentered
    ? 'center'
    : 'leading';

  React.useLayoutEffect(() => {
    const standardActions: AppbarV3StandardAction[] = [];

    if (showCalendarIcon) {
      standardActions.push({
        key: 'calendar',
        icon: 'calendar',
        'aria-label': 'Calendar',
        onPress: () => {},
      });
    }

    if (showSearchIcon) {
      standardActions.push({
        key: 'search',
        icon: 'magnify',
        'aria-label': 'Search',
        onPress: () => {},
      });
    }

    if (showMoreIcon) {
      standardActions.push({
        key: 'more',
        icon: MORE_ICON,
        'aria-label': 'More options',
        onPress: () => {},
      });
    }

    const actions: AppbarV3Actions = showFilledAction
      ? [
          {
            key: 'share',
            icon: 'share-variant',
            'aria-label': 'Share',
            variant: filledActionVariant,
            width: filledActionWidth,
            onPress: () => {},
          },
        ]
      : standardActions;

    navigation.setOptions({
      header: () => (
        <AppbarV3
          style={showCustomColor ? styles.customColor : null}
          variant={appbarConfiguration}
          titleAlignment={titleAlignment}
          title="Title V3"
          subtitle={showSubtitle ? 'Subtitle' : undefined}
          onTitlePress={() => setShowSnackbar(true)}
          isScrolled={isScrolled}
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
    appbarConfiguration,
    filledActionVariant,
    filledActionWidth,
    navigation,
    showCalendarIcon,
    showCustomColor,
    showFilledAction,
    showLeftIcon,
    showMoreIcon,
    isScrolled,
    showSearchIcon,
    showSubtitle,
    titleAlignment,
  ]);

  const handleScroll = React.useCallback(
    ({ nativeEvent }: NativeSyntheticEvent<NativeScrollEvent>) => {
      const nextIsScrolled = nativeEvent.contentOffset.y > 1;

      setIsScrolled((currentIsScrolled) =>
        currentIsScrolled === nextIsScrolled
          ? currentIsScrolled
          : nextIsScrolled
      );
    },
    []
  );

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
        <Text>Center title and subtitle</Text>
        <Switch value={isTitleCentered} onValueChange={setIsTitleCentered} />
      </View>
      <View style={styles.row}>
        <Text>Filled trailing action</Text>
        <Switch value={showFilledAction} onValueChange={setShowFilledAction} />
      </View>
      <View style={styles.row}>
        <Text>Search icon</Text>
        <Switch
          value={showSearchIcon}
          disabled={showFilledAction}
          onValueChange={setShowSearchIcon}
        />
      </View>
      <View style={styles.row}>
        <Text>More icon</Text>
        <Switch
          value={showMoreIcon}
          disabled={showFilledAction}
          onValueChange={setShowMoreIcon}
        />
      </View>
      <View style={styles.row}>
        <Text>Calendar icon</Text>
        <Switch
          value={showCalendarIcon}
          disabled={showFilledAction}
          onValueChange={setShowCalendarIcon}
        />
      </View>
      <View style={styles.row}>
        <Text>Custom Color</Text>
        <Switch value={showCustomColor} onValueChange={setShowCustomColor} />
      </View>
    </>
  );

  return (
    <>
      <ScreenWrapper
        style={{ marginBottom: BOTTOM_APPBAR_HEIGHT + bottom }}
        contentContainerStyle={[
          styles.contentContainer,
          { minHeight: windowHeight },
        ]}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        <List.Section title="Scroll behavior">
          <List.Item
            title="Scroll to change the appbar color"
            description={
              isScrolled ? 'Scrolled: surfaceContainer' : 'Flat: surface'
            }
          />
        </List.Section>
        <List.Section title="Default options">
          {renderDefaultOptions()}
        </List.Section>
        {showFilledAction ? (
          <List.Section title="Filled action options">
            <List.Subheader>Style</List.Subheader>
            <RadioButton.Group
              value={filledActionVariant}
              onValueChange={(value: string) => {
                if (value === 'filled' || value === 'tonal') {
                  setFilledActionVariant(value);
                }
              }}
            >
              <View style={styles.row}>
                <Text>Primary filled</Text>
                <RadioButton value="filled" />
              </View>
              <View style={styles.row}>
                <Text>Tonal filled</Text>
                <RadioButton value="tonal" />
              </View>
            </RadioButton.Group>
            <List.Subheader>Width</List.Subheader>
            <RadioButton.Group
              value={filledActionWidth}
              onValueChange={(value: string) => {
                if (value === 'default' || value === 'wide') {
                  setFilledActionWidth(value);
                }
              }}
            >
              <View style={styles.row}>
                <Text>Default</Text>
                <RadioButton value="default" />
              </View>
              <View style={styles.row}>
                <Text>Wide</Text>
                <RadioButton value="wide" />
              </View>
            </RadioButton.Group>
          </List.Section>
        ) : null}
        <List.Section title="Appbar variants">
          <RadioButton.Group
            value={appbarConfiguration}
            onValueChange={(value: string) => {
              if (
                value === 'small' ||
                value === 'medium-flexible' ||
                value === 'large-flexible'
              ) {
                setAppbarConfiguration(value);
              }
            }}
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
