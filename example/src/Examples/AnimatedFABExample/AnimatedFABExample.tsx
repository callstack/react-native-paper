import * as React from 'react';
import { View, StyleSheet, FlatList, Animated, Platform } from 'react-native';
import type { NativeSyntheticEvent, NativeScrollEvent } from 'react-native';
import {
  Colors,
  useTheme,
  Avatar,
  Paragraph,
  RadioButton,
} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { animatedFABExampleData } from '../../../utils';
import CustomFAB from './CustomFAB';

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
  const {
    colors: { background },
  } = useTheme();

  const isIOS = Platform.OS === 'ios';

  const [extended, setExtended] = React.useState<boolean>(true);
  const [visible, setVisible] = React.useState<boolean>(true);

  const [animateFrom, setAnimateFrom] = React.useState<'left' | 'right'>(
    'right'
  );
  const [iconMode, setIconMode] = React.useState<'static' | 'dynamic'>(
    'static'
  );

  const { current: velocity } = React.useRef<Animated.Value>(
    new Animated.Value(0)
  );

  const renderItem = React.useCallback(
    ({ item }: { item: Item }) => (
      <View style={styles.itemContainer}>
        <Avatar.Text
          style={[styles.avatar, { backgroundColor: item.bgColor }]}
          label={item.initials}
          color={Colors.white}
          size={40}
        />
        <View style={styles.itemTextContentContainer}>
          <View style={styles.itemHeaderContainer}>
            <Paragraph
              style={[styles.header, !item.read && styles.read]}
              ellipsizeMode="tail"
              numberOfLines={1}
            >
              {item.sender}
            </Paragraph>
            <Paragraph style={[styles.date, !item.read && styles.read]}>
              {item.date}
            </Paragraph>
          </View>

          <View style={styles.itemMessageContainer}>
            <View style={styles.flex}>
              <Paragraph
                ellipsizeMode="tail"
                numberOfLines={1}
                style={!item.read && styles.read}
              >
                {item.header}
              </Paragraph>
              <Paragraph numberOfLines={1} ellipsizeMode="tail">
                {item.message}
              </Paragraph>
            </View>

            <Icon
              name={item.favorite ? 'star' : 'star-outline'}
              color={item.favorite ? Colors.orange500 : Colors.grey500}
              size={20}
              onPress={() => setVisible(!visible)}
              style={styles.icon}
            />
          </View>
        </View>
      </View>
    ),
    []
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

  return (
    <>
      <FlatList
        data={animatedFABExampleData}
        renderItem={renderItem}
        keyExtractor={_keyExtractor}
        onEndReachedThreshold={0}
        scrollEventThrottle={16}
        style={[styles.flex, { backgroundColor: background }]}
        contentContainerStyle={[
          styles.container,
          { backgroundColor: background },
        ]}
        onScroll={onScroll}
      />

      <View style={styles.controlsWrapper}>
        <View
          style={{
            flex: 1,
            width: '100%',
            display: 'flex',
            flexDirection: 'row',
          }}
        >
          <Paragraph>iconMode</Paragraph>

          <View
            style={{
              marginLeft: 'auto',
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
            }}
          >
            <Paragraph>static</Paragraph>

            <RadioButton
              value="static"
              status={iconMode === 'static' ? 'checked' : 'unchecked'}
              onPress={() => setIconMode('static')}
            />
          </View>

          <View
            style={{
              marginLeft: 16,
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
            }}
          >
            <Paragraph>dynamic</Paragraph>

            <RadioButton
              value="dynamic"
              status={iconMode === 'dynamic' ? 'checked' : 'unchecked'}
              onPress={() => setIconMode('dynamic')}
            />
          </View>
        </View>

        <View
          style={{
            marginTop: 8,
            flex: 1,
            width: '100%',
            display: 'flex',
            flexDirection: 'row',
          }}
        >
          <Paragraph>animateFrom</Paragraph>

          <View
            style={{
              marginLeft: 'auto',
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
            }}
          >
            <Paragraph>left</Paragraph>

            <RadioButton
              value="left"
              status={animateFrom === 'left' ? 'checked' : 'unchecked'}
              onPress={() => setAnimateFrom('left')}
            />
          </View>

          <View
            style={{
              marginLeft: 16,
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
            }}
          >
            <Paragraph>right</Paragraph>

            <RadioButton
              value="right"
              status={animateFrom === 'right' ? 'checked' : 'unchecked'}
              onPress={() => setAnimateFrom('right')}
            />
          </View>
        </View>
      </View>

      <CustomFAB
        visible={visible}
        animatedValue={velocity}
        extended={extended}
        label={'New Message'}
        animateFrom={animateFrom}
        iconMode={iconMode}
        isIOS={isIOS}
      />
    </>
  );
};

AnimatedFABExample.title = 'Animated Floating Action Button';

const styles = StyleSheet.create({
  container: {
    padding: 16,
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
  controlsWrapper: {
    flex: 1,
    display: 'flex',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: 'white',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
});

export default AnimatedFABExample;
