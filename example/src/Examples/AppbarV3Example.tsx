import * as React from 'react';
import {
  Image,
  Platform,
  StyleSheet,
  useWindowDimensions,
  View,
} from 'react-native';
import type { NativeScrollEvent, NativeSyntheticEvent } from 'react-native';

import { useNavigation } from '@react-navigation/native';
import {
  AppbarV3,
  List,
  Palette,
  RadioButton,
  Snackbar,
  Switch,
  Text,
} from 'react-native-paper';
import type {
  AppbarV3Actions,
  AppbarV3FilledAction,
  AppbarV3LeadingAction,
  AppbarV3StandardAction,
  AppbarV3TitleAlignment,
  AppbarV3Variant,
} from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import ScreenWrapper from '../ScreenWrapper';

type FilledActionVariant = AppbarV3FilledAction['variant'];
type FilledActionWidth = NonNullable<AppbarV3FilledAction['width']>;

const MORE_ICON = Platform.OS === 'ios' ? 'dots-horizontal' : 'dots-vertical';

type SearchAppbarHeaderProps = {
  actions: AppbarV3StandardAction[];
  isScrolled: boolean;
  leadingAction?: AppbarV3LeadingAction;
  showCustomColor: boolean;
};

const SearchAppbarHeader = ({
  actions,
  isScrolled,
  leadingAction,
  showCustomColor,
}: SearchAppbarHeaderProps) => {
  const [searchQuery, setSearchQuery] = React.useState('');

  return (
    <AppbarV3
      variant="search"
      actions={actions}
      isScrolled={isScrolled}
      leadingAction={leadingAction}
      style={showCustomColor ? styles.customColor : null}
      searchBar={{
        placeholder: 'Search components',
        'aria-label': 'Search components',
        value: searchQuery,
        onChangeText: setSearchQuery,
      }}
    />
  );
};

const AppbarV3Example = () => {
  const navigation = useNavigation('AppbarV3');

  const [showLeftIcon, setShowLeftIcon] = React.useState(true);
  const [showSubtitle, setShowSubtitle] = React.useState(true);
  const [showTitleImage, setShowTitleImage] = React.useState(false);
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

  const { bottom } = useSafeAreaInsets();
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

    if (showSearchIcon && appbarConfiguration !== 'search') {
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

    const leadingAction = showLeftIcon
      ? {
          type: 'back' as const,
          onPress: () => navigation.goBack(),
        }
      : undefined;
    const titleImage = (
      <Image
        source={require('../../assets/images/paper-icon.png')}
        resizeMode="contain"
        style={styles.titleImage}
        accessibilityIgnoresInvertColors
      />
    );
    const commonProps = {
      actions,
      isScrolled,
      leadingAction,
      onTitlePress: () => setShowSnackbar(true),
      style: showCustomColor ? styles.customColor : null,
      titleAlignment,
    };

    navigation.setOptions({
      header: () => {
        if (appbarConfiguration === 'search') {
          return (
            <SearchAppbarHeader
              actions={standardActions.slice(0, 2)}
              isScrolled={isScrolled}
              leadingAction={leadingAction}
              showCustomColor={showCustomColor}
            />
          );
        }

        if (appbarConfiguration === 'small') {
          return showTitleImage ? (
            <AppbarV3
              {...commonProps}
              variant="small"
              title="React Native Paper"
              titleImage={titleImage}
            />
          ) : (
            <AppbarV3
              {...commonProps}
              variant="small"
              title="React Native Paper"
              subtitle={
                showSubtitle ? 'Material Design for React Native' : undefined
              }
            />
          );
        }

        return showTitleImage ? (
          <AppbarV3
            {...commonProps}
            variant={appbarConfiguration}
            title="React Native Paper"
            titleImage={titleImage}
            subtitle={
              showSubtitle ? 'Material Design for React Native' : undefined
            }
          />
        ) : (
          <AppbarV3
            {...commonProps}
            variant={appbarConfiguration}
            title="React Native Paper"
            subtitle={
              showSubtitle ? 'Material Design for React Native' : undefined
            }
          />
        );
      },
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
    showTitleImage,
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

  const renderDefaultOptions = () => (
    <>
      <View style={styles.row}>
        <Text>Left icon</Text>
        <Switch value={showLeftIcon} onValueChange={setShowLeftIcon} />
      </View>
      <View style={styles.row}>
        <Text>Subtitle</Text>
        <Switch
          value={showSubtitle}
          disabled={
            appbarConfiguration === 'search' ||
            (showTitleImage && appbarConfiguration === 'small')
          }
          onValueChange={setShowSubtitle}
        />
      </View>
      <View style={styles.row}>
        <Text>Title image</Text>
        <Switch
          value={showTitleImage}
          disabled={appbarConfiguration === 'search'}
          onValueChange={setShowTitleImage}
        />
      </View>
      <View style={styles.row}>
        <Text>Center title and subtitle</Text>
        <Switch
          value={isTitleCentered}
          disabled={appbarConfiguration === 'search'}
          onValueChange={setIsTitleCentered}
        />
      </View>
      <View style={styles.row}>
        <Text>Filled trailing action</Text>
        <Switch
          value={showFilledAction}
          disabled={appbarConfiguration === 'search'}
          onValueChange={setShowFilledAction}
        />
      </View>
      <View style={styles.row}>
        <Text>Search icon</Text>
        <Switch
          value={showSearchIcon}
          disabled={showFilledAction || appbarConfiguration === 'search'}
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
        style={{ marginBottom: bottom }}
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
                value === 'search' ||
                value === 'medium-flexible' ||
                value === 'large-flexible'
              ) {
                setAppbarConfiguration(value);
              }
            }}
          >
            <View style={styles.row}>
              <Text>Search</Text>
              <RadioButton value="search" />
            </View>
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
  customColor: {
    backgroundColor: Palette.secondary80,
  },
  titleImage: {
    width: 32,
    height: 32,
  },
});
