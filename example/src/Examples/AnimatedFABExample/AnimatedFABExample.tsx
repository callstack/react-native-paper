import * as React from 'react';
import type { NativeScrollEvent, NativeSyntheticEvent } from 'react-native';
import { Animated, FlatList, Platform, StyleSheet, View } from 'react-native';

import Icon from '@expo/vector-icons/MaterialCommunityIcons';
import { Avatar, Colors, Text, useTheme } from 'react-native-paper';

import CustomFAB from './CustomFAB';
import CustomFABControls, {
  Controls,
  initialControls,
} from './CustomFABControls';
import { animatedFABExampleData } from '../../../utils';

type Item = {
  id: string;
  sender: string;
  header: string;
  message: string;
  initials: string;
  date: string;
  read: boolean;
  favorite: boolean;
  bgColor: string;
};

const AnimatedFABExample = () => {
  const { colors } = useTheme();

  const isIOS = Platform.OS === 'ios';

  const [extended, setExtended] = React.useState(true);
  const [visible, setVisible] = React.useState(true);
  const [controls, setControls] = React.useState<Controls>(initialControls);

  const { current: velocity } = React.useRef<Animated.Value>(
    new Animated.Value(0)
  );

  const renderItem = React.useCallback(
    ({ item }: { item: Item }) => {
      return (
        <View style={styles.itemContainer}>
          <Avatar.Text
            style={[styles.avatar, { backgroundColor: item.bgColor }]}
            label={item.initials}
            color={Colors.primary100}
            size={40}
          />
          <View style={styles.itemTextContentContainer}>
            <View style={styles.itemHeaderContainer}>
              <Text
                variant="labelLarge"
                style={[styles.header, !item.read && styles.read]}
                ellipsizeMode="tail"
                numberOfLines={1}
              >
                {item.sender}
              </Text>
              <Text
                variant="labelLarge"
                style={[styles.date, !item.read && styles.read]}
              >
                {item.date}
              </Text>
            </View>

            <View style={styles.itemMessageContainer}>
              <View style={styles.flex}>
                <Text
                  variant="labelLarge"
                  ellipsizeMode="tail"
                  numberOfLines={1}
                  style={!item.read && styles.read}
                >
                  {item.header}
                </Text>
                <Text
                  variant="labelLarge"
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  {item.message}
                </Text>
              </View>

              <Icon
                name={item.favorite ? 'star' : 'star-outline'}
                color={item.favorite ? Colors.error70 : Colors.neutralVariant70}
                size={20}
                onPress={() => setVisible(!visible)}
                style={styles.icon}
              />
            </View>
          </View>
        </View>
      );
    },
    [visible]
  );

  const onScroll = ({
    nativeEvent,
  }: NativeSyntheticEvent<NativeScrollEvent>) => {
    const currentScrollPosition =
      Math.floor(nativeEvent?.contentOffset?.y) ?? 0;

    if (!isIOS) {
      return velocity.setValue(currentScrollPosition);
    }

    setExtended(currentScrollPosition <= 0);
  };

  const _keyExtractor = React.useCallback(
    (item: { id: string }) => item.id,
    []
  );

  const { animateFrom, iconMode } = controls;

  return (
    <>
      <CustomFABControls controls={controls} setControls={setControls} />
      <FlatList
        data={animatedFABExampleData}
        renderItem={renderItem}
        keyExtractor={_keyExtractor}
        onEndReachedThreshold={0}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        style={[
          styles.flex,
          {
            backgroundColor: colors?.background,
          },
        ]}
        contentContainerStyle={styles.container}
        onScroll={onScroll}
      />

      <CustomFAB
        visible={visible}
        animatedValue={velocity}
        extended={extended}
        label={'New Message'}
        animateFrom={animateFrom}
        iconMode={iconMode}
      />
    </>
  );
};

AnimatedFABExample.title = 'Animated Floating Action Button';

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingBottom: 60,
  },
  avatar: {
    marginRight: 16,
    marginTop: 8,
  },
  flex: {
    flex: 1,
  },
  itemContainer: {
    marginBottom: 16,
    flexDirection: 'row',
  },
  itemTextContentContainer: {
    flexDirection: 'column',
    flex: 1,
  },
  itemHeaderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  itemMessageContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexGrow: 1,
  },
  read: {
    fontWeight: 'bold',
  },
  icon: {
    marginLeft: 16,
    alignSelf: 'flex-end',
  },
  date: {
    fontSize: 12,
  },
  header: {
    fontSize: 14,
    marginRight: 8,
    flex: 1,
  },
});

export default AnimatedFABExample;
