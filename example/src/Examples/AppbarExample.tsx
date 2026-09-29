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
  Appbar,
  List,
  Palette,
  RadioButton,
  Snackbar,
  Switch,
  Text,
} from 'react-native-paper';
import type {
  AppbarFilledTrailingAction,
  AppbarHeadlineAlignment,
  AppbarLeadingButton,
  AppbarStandardTrailingAction,
  AppbarTrailingActions,
  AppbarVariant,
} from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import ScreenWrapper from '../ScreenWrapper';

type FilledTrailingActionVariant = AppbarFilledTrailingAction['variant'];
type FilledTrailingActionWidth = NonNullable<
  AppbarFilledTrailingAction['width']
>;

const MORE_ICON = Platform.OS === 'ios' ? 'dots-horizontal' : 'dots-vertical';

type SearchAppbarHeaderProps = {
  trailingActions: AppbarStandardTrailingAction[];
  isScrolled: boolean;
  leadingButton?: AppbarLeadingButton;
  showCustomColor: boolean;
};

const SearchAppbarHeader = ({
  trailingActions,
  isScrolled,
  leadingButton,
  showCustomColor,
}: SearchAppbarHeaderProps) => {
  const [searchQuery, setSearchQuery] = React.useState('');

  return (
    <Appbar
      variant="search"
      isScrolled={isScrolled}
      leadingButton={leadingButton}
      style={showCustomColor ? styles.customColor : null}
      trailingActions={trailingActions}
      searchBar={{
        placeholder: 'Search components',
        'aria-label': 'Search components',
        value: searchQuery,
        onChangeText: setSearchQuery,
      }}
    />
  );
};

const AppbarExample = () => {
  const navigation = useNavigation('Appbar');

  const [showLeadingButton, setShowLeadingButton] = React.useState(true);
  const [showSubtitle, setShowSubtitle] = React.useState(true);
  const [showHeadlineImage, setShowHeadlineImage] = React.useState(false);
  const [showSearchIcon, setShowSearchIcon] = React.useState(true);
  const [showMoreIcon, setShowMoreIcon] = React.useState(true);
  const [showCustomColor, setShowCustomColor] = React.useState(false);
  const [appbarConfiguration, setAppbarConfiguration] =
    React.useState<AppbarVariant>('small');
  const [isHeadlineCentered, setIsHeadlineCentered] = React.useState(false);
  const [showCalendarIcon, setShowCalendarIcon] = React.useState(false);
  const [showFilledTrailingAction, setShowFilledTrailingAction] =
    React.useState(false);
  const [filledTrailingActionVariant, setFilledTrailingActionVariant] =
    React.useState<FilledTrailingActionVariant>('filled');
  const [filledTrailingActionWidth, setFilledTrailingActionWidth] =
    React.useState<FilledTrailingActionWidth>('default');
  const [isScrolled, setIsScrolled] = React.useState(false);
  const [showSnackbar, setShowSnackbar] = React.useState(false);

  const { bottom } = useSafeAreaInsets();
  const { height: windowHeight } = useWindowDimensions();
  const headlineAlignment: AppbarHeadlineAlignment = isHeadlineCentered
    ? 'center'
    : 'leading';

  React.useLayoutEffect(() => {
    const standardTrailingActions: AppbarStandardTrailingAction[] = [];

    if (showCalendarIcon) {
      standardTrailingActions.push({
        key: 'calendar',
        icon: 'calendar',
        'aria-label': 'Calendar',
        onPress: () => {},
      });
    }

    if (showSearchIcon && appbarConfiguration !== 'search') {
      standardTrailingActions.push({
        key: 'search',
        icon: 'magnify',
        'aria-label': 'Search',
        onPress: () => {},
      });
    }

    if (showMoreIcon) {
      standardTrailingActions.push({
        key: 'more',
        icon: MORE_ICON,
        'aria-label': 'More options',
        onPress: () => {},
      });
    }

    const trailingActions: AppbarTrailingActions = showFilledTrailingAction
      ? [
          {
            key: 'share',
            icon: 'share-variant',
            'aria-label': 'Share',
            variant: filledTrailingActionVariant,
            width: filledTrailingActionWidth,
            onPress: () => {},
          },
        ]
      : standardTrailingActions;

    const leadingButton = showLeadingButton
      ? {
          type: 'back' as const,
          onPress: () => navigation.goBack(),
        }
      : undefined;
    const headlineImage = (
      <Image
        source={require('../../assets/images/paper-icon.png')}
        resizeMode="contain"
        style={styles.headlineImage}
        accessibilityIgnoresInvertColors
      />
    );
    const commonProps = {
      headlineAlignment,
      isScrolled,
      leadingButton,
      onHeadlinePress: () => setShowSnackbar(true),
      style: showCustomColor ? styles.customColor : null,
      trailingActions,
    };

    navigation.setOptions({
      header: () => {
        if (appbarConfiguration === 'search') {
          return (
            <SearchAppbarHeader
              isScrolled={isScrolled}
              leadingButton={leadingButton}
              showCustomColor={showCustomColor}
              trailingActions={standardTrailingActions.slice(0, 2)}
            />
          );
        }

        if (appbarConfiguration === 'small') {
          return showHeadlineImage ? (
            <Appbar
              {...commonProps}
              variant="small"
              headline="React Native Paper"
              headlineImage={headlineImage}
            />
          ) : (
            <Appbar
              {...commonProps}
              variant="small"
              headline="React Native Paper"
              subtitle={
                showSubtitle ? 'Material Design for React Native' : undefined
              }
            />
          );
        }

        return showHeadlineImage ? (
          <Appbar
            {...commonProps}
            variant={appbarConfiguration}
            headline="React Native Paper"
            headlineImage={headlineImage}
            subtitle={
              showSubtitle ? 'Material Design for React Native' : undefined
            }
          />
        ) : (
          <Appbar
            {...commonProps}
            variant={appbarConfiguration}
            headline="React Native Paper"
            subtitle={
              showSubtitle ? 'Material Design for React Native' : undefined
            }
          />
        );
      },
    });
  }, [
    appbarConfiguration,
    filledTrailingActionVariant,
    filledTrailingActionWidth,
    navigation,
    showCalendarIcon,
    showCustomColor,
    showFilledTrailingAction,
    showLeadingButton,
    showMoreIcon,
    isScrolled,
    showSearchIcon,
    showSubtitle,
    showHeadlineImage,
    headlineAlignment,
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
        <Text>Leading button</Text>
        <Switch
          value={showLeadingButton}
          onValueChange={setShowLeadingButton}
        />
      </View>
      <View style={styles.row}>
        <Text>Subtitle</Text>
        <Switch
          value={showSubtitle}
          disabled={
            appbarConfiguration === 'search' ||
            (showHeadlineImage && appbarConfiguration === 'small')
          }
          onValueChange={setShowSubtitle}
        />
      </View>
      <View style={styles.row}>
        <Text>Headline image</Text>
        <Switch
          value={showHeadlineImage}
          disabled={appbarConfiguration === 'search'}
          onValueChange={setShowHeadlineImage}
        />
      </View>
      <View style={styles.row}>
        <Text>Center headline and subtitle</Text>
        <Switch
          value={isHeadlineCentered}
          disabled={appbarConfiguration === 'search'}
          onValueChange={setIsHeadlineCentered}
        />
      </View>
      <View style={styles.row}>
        <Text>Filled trailing action</Text>
        <Switch
          value={showFilledTrailingAction}
          disabled={appbarConfiguration === 'search'}
          onValueChange={setShowFilledTrailingAction}
        />
      </View>
      <View style={styles.row}>
        <Text>Search icon</Text>
        <Switch
          value={showSearchIcon}
          disabled={
            showFilledTrailingAction || appbarConfiguration === 'search'
          }
          onValueChange={setShowSearchIcon}
        />
      </View>
      <View style={styles.row}>
        <Text>More icon</Text>
        <Switch
          value={showMoreIcon}
          disabled={showFilledTrailingAction}
          onValueChange={setShowMoreIcon}
        />
      </View>
      <View style={styles.row}>
        <Text>Calendar icon</Text>
        <Switch
          value={showCalendarIcon}
          disabled={showFilledTrailingAction}
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
        {showFilledTrailingAction ? (
          <List.Section title="Filled trailing action options">
            <List.Subheader>Style</List.Subheader>
            <RadioButton.Group
              value={filledTrailingActionVariant}
              onValueChange={(value: string) => {
                if (value === 'filled' || value === 'tonal') {
                  setFilledTrailingActionVariant(value);
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
              value={filledTrailingActionWidth}
              onValueChange={(value: string) => {
                if (value === 'default' || value === 'wide') {
                  setFilledTrailingActionWidth(value);
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
        Headline pressed
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
  customColor: {
    backgroundColor: Palette.secondary80,
  },
  headlineImage: {
    width: 32,
    height: 32,
  },
});
