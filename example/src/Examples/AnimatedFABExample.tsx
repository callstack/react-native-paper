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
  RadioButton,
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
  iconMode?: 'static' | 'dynamic';
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
  iconMode,
}: CustomFABProps) => {
  const [isExtended, setIsExtended] = React.useState(true);

  React.useEffect(() => {
    if (!isIOS) {
      animatedValue.addListener(({ value }: { value: number }) => {
        setIsExtended(value <= 0);
      });
    } else setIsExtended(extended);
  }, [animatedValue, extended]);

  const fabStyle = { [animateFrom]: 16 };

  return (
    <AnimatedFAB
      icon={'plus'}
      label={label}
      extended={isExtended}
      uppercase={true}
      onPress={() => console.log('Pressed')}
      visible={visible}
      animateFrom={animateFrom}
      iconMode={iconMode}
      style={[styles.fabStyle, style, fabStyle]}
    />
  );
};

const AnimatedFABExample = () => {
  const {
    colors: { background },
  } = useTheme();

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
    bottom: 16,
    position: 'absolute',
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
