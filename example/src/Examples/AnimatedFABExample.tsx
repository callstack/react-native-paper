import * as React from 'react';
import { View, StyleSheet, FlatList, Animated, Platform } from 'react-native';
import type { NativeSyntheticEvent, NativeScrollEvent } from 'react-native';
import {
  Colors,
  AnimatedFAB,
  useTheme,
  Avatar,
  Paragraph,
} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { animatedFABExampleData } from '../../utils';

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

type CustomFABProps = {
  animatedValue: Animated.Value;
  visible: boolean;
  extended: boolean;
};

const isIOS = Platform.OS === 'ios';

const CustomFAB = ({ animatedValue, visible, extended }: CustomFABProps) => {
  const [isExtended, setIsExtended] = React.useState(true);

  React.useEffect(() => {
    if (!isIOS) {
      animatedValue.addListener(({ value }: { value: number }) =>
        setIsExtended(value > 0 ? true : false)
      );
    } else setIsExtended(extended);
  }, [animatedValue, extended]);

  return (
    <AnimatedFAB
      icon={'pencil'}
      label={'Create'}
      extended={isExtended}
      uppercase={false}
      onPress={() => console.log('Pressed')}
      visible={visible}
      animateFrom="right"
      iconMode="dynamic"
      style={styles.fabStyle}
    />
  );
};

const AnimatedFABExample = () => {
  const {
    colors: { background },
  } = useTheme();

  const [scrollPosition, setScrollPosition] = React.useState<number>(0);
  const [extended, setExtended] = React.useState<boolean>(false);
  const [visible, setVisible] = React.useState<boolean>(true);

  const { current: velocity } = React.useRef<Animated.Value>(
    new Animated.Value(0)
  );

  const renderItem = ({ item }: { item: Item }) => {
    return (
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
    );
  };

  const onScroll = ({
    nativeEvent,
  }: NativeSyntheticEvent<NativeScrollEvent>) => {
    if (!isIOS) {
      return velocity.setValue(nativeEvent?.velocity?.y ?? 0);
    }

    const currentScrollPosition = Math.floor(nativeEvent.contentOffset.y);

    const scrollHeight =
      nativeEvent.contentSize.height - nativeEvent.layoutMeasurement.height;

    setScrollPosition(currentScrollPosition);

    if (currentScrollPosition > scrollPosition && scrollPosition > 0) {
      setExtended(false);
    } else if (
      currentScrollPosition < scrollPosition &&
      scrollPosition < scrollHeight
    ) {
      setExtended(true);
    }
  };

  return (
    <>
      <FlatList
        data={animatedFABExampleData}
        renderItem={renderItem}
        keyExtractor={(item: { id: string }) => item.id}
        onEndReachedThreshold={0}
        scrollEventThrottle={16}
        style={[styles.flex, { backgroundColor: background }]}
        contentContainerStyle={[
          styles.container,
          { backgroundColor: background },
        ]}
        onScroll={onScroll}
      />
      <CustomFAB
        visible={visible}
        animatedValue={velocity}
        extended={extended}
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
  fabStyle: {
    right: 16,
    bottom: 32,
    position: 'absolute',
  },
});

export default AnimatedFABExample;
