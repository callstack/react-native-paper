import * as React from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  Animated,
  Platform,
  StyleProp,
  ViewStyle,
} from 'react-native';
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
  label: string;
  animateFrom: 'left' | 'right';
  style?: StyleProp<ViewStyle>;
};

const isIOS = Platform.OS === 'ios';

const CustomFAB = ({
  animatedValue,
  visible,
  extended,
  label,
  animateFrom,
  style,
}: CustomFABProps) => {
  const [isExtended, setIsExtended] = React.useState(true);

  React.useEffect(() => {
    if (!isIOS) {
      animatedValue.addListener(({ value }: { value: number }) => {
        setIsExtended(value <= 0);
      });
    } else setIsExtended(extended);
  }, [animatedValue, extended]);

  return (
    <AnimatedFAB
      icon={'plus'}
      label={label}
      extended={isExtended}
      uppercase={true}
      onPress={() => console.log('Pressed')}
      visible={visible}
      animateFrom={animateFrom}
      iconMode="dynamic"
      style={[styles.fabStyle, style]}
    />
  );
};

const AnimatedFABExample = () => {
  const {
    colors: { background },
  } = useTheme();

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
    const currentScrollPosition =
      Math.floor(nativeEvent?.contentOffset?.y) ?? 0;

    if (!isIOS) {
      return velocity.setValue(currentScrollPosition);
    }

    setExtended(currentScrollPosition <= 0);
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
        label={'From Left'}
        animateFrom="left"
        style={{ bottom: 76, left: 16, right: undefined }}
      />

      <CustomFAB
        visible={visible}
        animatedValue={velocity}
        extended={extended}
        label={'From Right'}
        animateFrom="right"
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
    bottom: 16,
    position: 'absolute',
  },
});

export default AnimatedFABExample;
