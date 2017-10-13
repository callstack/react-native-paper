/* @flow */

import React from 'react';
import { StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import withTheme from '../../core/withTheme';
import BottomNavigation, { Tab } from 'react-native-material-bottom-navigation';
import Icon from 'react-native-vector-icons/MaterialIcons';
import type { Theme } from '../../types/Theme';

type TabType = {
  /*
   * Label for tab tab
   */
  label: string,

  /*
   * Name of the icon from Material Icons
   * https://material.io/icons/
   */
  icon: string,
};

type Props = {
  /*
   * Wheter we color background of the navigation
   * If true, primary color is used, while icons and ripple is white
   * otherwise, color icons and ripple with primary color, keeping bg white
   */
  colorNavigationBackground: boolean,

  /*
   * Decides how tabs should look like
   */
  tabs: TabType[],

  /*
   * Invoked with `newTabIndex` and `oldTabIndex` when tab is switched
   */
  onTabChange: (newTabIndex: number, oldTabIndex: number) => mixed,
  theme: Theme,
};

class BottomTabs extends React.Component<void, Props, void> {
  static propTypes = {
    tabs: PropTypes.arrayOf(
      PropTypes.shape({
        label: PropTypes.string,
        icon: PropTypes.string,
      })
    ).isRequired,
    colorNavigationBackground: PropTypes.bool,
    onTabChange: PropTypes.func,
    theme: PropTypes.object.isRequired,
  };

  componentDidMount() {
    this._warnAboutTabNumber(this.props);
  }
  componentWillReceiveProps(nextProps) {
    this._warnAboutTabNumber(nextProps);
  }

  /*
   * We use Bottom Navigation only if tab number is between 3 and 5
   */
  _warnAboutTabNumber = ({ tabs }) => {
    if (tabs.length < 3 || tabs.length > 5) {
      throw new Error('Number of tabs in BottomTabs must be between 3 and 5.');
    }
  };

  /*
   * Create a Tab based on passed `tabs` props
   */
  _tabFactory = (tab: TabType, key: ?any) => {
    const { theme, colorNavigationBackground } = this.props;
    const activeColor = colorNavigationBackground
      ? '#fff'
      : theme.colors.primary;

    return (
      <Tab
        key={key}
        icon={<Icon color={activeColor} size={24} name={tab.icon} />}
        label={tab.label}
        activeLabelColor={activeColor}
      />
    );
  };

  /*
   *  If background color is used, keep icons and ripple white
   *  otherwise, use primary color on icons, keeping background white
   *  ref: https://material.io/guidelines/components/bottom-navigation.html#bottom-navigation-style
   */
  _getNavigationProps = () => {
    const { colorNavigationBackground, theme } = this.props;

    return {
      labelColor: colorNavigationBackground ? '#fff' : theme.colors.primary,
      rippleColor: colorNavigationBackground ? '#fff' : theme.colors.primary,
      backgroundColor: colorNavigationBackground
        ? theme.colors.primary
        : '#fff',
    };
  };

  render() {
    const makeTab = this._tabFactory;
    const { tabs } = this.props;
    return (
      <BottomNavigation
        {...this._getNavigationProps()}
        onTabChange={this.props.onTabChange}
        style={styles.mainNavigation}
      >
        {tabs.map((tab, i) => makeTab(tab, i))}
      </BottomNavigation>
    );
  }
}

const styles = StyleSheet.create({
  mainNavigation: {
    height: 56,
    elevation: 8,
    position: 'absolute',
    left: 0,
    bottom: 0,
    right: 0,
  },
});

export default withTheme(BottomTabs);
