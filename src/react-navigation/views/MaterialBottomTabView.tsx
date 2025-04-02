import * as React from 'react';
import { I18nManager, Platform, StyleSheet, ColorValue } from 'react-native';

import {
  CommonActions,
  Link,
  ParamListBase,
  Route,
  TabNavigationState,
  useLinkBuilder,
} from '@react-navigation/native';

import BottomNavigation from '../../components/BottomNavigation/BottomNavigation';
import MaterialCommunityIcon from '../../components/MaterialCommunityIcon';
import type {
  MaterialBottomTabDescriptorMap,
  MaterialBottomTabNavigationConfig,
  MaterialBottomTabNavigationHelpers,
} from '../types';

type Props = MaterialBottomTabNavigationConfig & {
  state: TabNavigationState<ParamListBase>;
  navigation: MaterialBottomTabNavigationHelpers;
  descriptors: MaterialBottomTabDescriptorMap;
};

type RenderTouchableProps = {
  onPress?: (e: any) => void;
  route: Route<string, object | undefined>;
  style?: any;
  rippleColor?: string | ColorValue;
  children?: React.ReactNode;
  [key: string]: any;
};

export default function MaterialBottomTabView({
  state,
  navigation,
  descriptors,
  ...rest
}: Props) {
  const buildHref = useLinkBuilder();

  return (
    <BottomNavigation
      {...rest}
      onIndexChange={noop}
      navigationState={state}
      renderScene={({ route }) => descriptors[route.key].render()}
      renderTouchable={
        Platform.OS === 'web'
          ? (props: RenderTouchableProps) => {
              const {
                onPress,
                route,
                style,
                rippleColor,
                children,
                ...restProps
              } = props;

              // Fallback to an empty string if buildHref returns undefined
              const href = buildHref(route.name, route.params) ?? '';

              return (
                <Link
                  {...restProps}
                  to={href}
                  accessibilityRole="link"
                  onPress={(e: any) => {
                    if (
                      !(e.metaKey || e.altKey || e.ctrlKey || e.shiftKey) &&
                      (e.button == null || e.button === 0)
                    ) {
                      e.preventDefault();
                      onPress?.(e);
                    }
                  }}
                  // Apply rippleColor so it's actually used
                  style={[
                    styles.touchable,
                    style,
                    rippleColor ? { backgroundColor: rippleColor } : null,
                  ]}
                >
                  {children}
                </Link>
              );
            }
          : undefined
      }
      renderIcon={({ route, focused, color }) => {
        const { options } = descriptors[route.key];

        if (typeof options.tabBarIcon === 'string') {
          return (
            <MaterialCommunityIcon
              direction={I18nManager.getConstants().isRTL ? 'rtl' : 'ltr'}
              name={options.tabBarIcon}
              color={color}
              size={24}
            />
          );
        }

        if (typeof options.tabBarIcon === 'function') {
          return options.tabBarIcon({ focused, color });
        }

        return null;
      }}
      getLabelText={({ route }) => {
        const { options } = descriptors[route.key];
        return options.tabBarLabel ?? options.title ?? route.name;
      }}
      getColor={({ route }) => descriptors[route.key].options.tabBarColor}
      getBadge={({ route }) => descriptors[route.key].options.tabBarBadge}
      getAccessibilityLabel={({ route }) =>
        descriptors[route.key].options.tabBarAccessibilityLabel
      }
      getTestID={({ route }) =>
        descriptors[route.key].options.tabBarButtonTestID
      }
      onTabPress={({ route, preventDefault }) => {
        const event = navigation.emit({
          type: 'tabPress',
          target: route.key,
          canPreventDefault: true,
        });

        if (event.defaultPrevented) {
          preventDefault();
        } else {
          navigation.dispatch({
            ...CommonActions.navigate(route.name, route.params),
            target: state.key,
          });
        }
      }}
      onTabLongPress={({ route }) =>
        navigation.emit({
          type: 'tabLongPress',
          target: route.key,
        })
      }
    />
  );
}

const styles = StyleSheet.create({
  touchable: {
    display: 'flex',
    justifyContent: 'center',
  },
});

function noop() {}
