import React from 'react';
import { StyleSheet, View, FlatList } from 'react-native';
import { Colors, Paragraph, RadioButton } from 'react-native-paper';

export type IconMode = 'static' | 'dynamic';
export type AnimateFrom = 'left' | 'right';

export type Controls = {
  iconMode: IconMode;
  animateFrom: AnimateFrom;
};

export const initialControls: Controls = {
  iconMode: 'static',
  animateFrom: 'right',
};

type Props = {
  controls: Controls;
  setControls(controls: React.SetStateAction<Controls>): void;
};

type CustomControlProps = {
  name: string;
  options: IconMode[] | AnimateFrom[];
  value: IconMode | AnimateFrom;
  onChange(newValue: IconMode | AnimateFrom): void;
};

const CustomControl = ({
  name,
  options,
  value,
  onChange,
}: CustomControlProps) => {
  const _renderItem = React.useCallback(
    ({ item }) => (
      <View style={styles.controlItem}>
        <Paragraph>{item}</Paragraph>

        <RadioButton
          value="dynamic"
          status={value === item ? 'checked' : 'unchecked'}
          onPress={() => onChange(item)}
        />
      </View>
    ),
    [value, onChange]
  );

  const _keyExtractor = React.useCallback(({ item }) => item, []);

  return (
    <View style={styles.controlWrapper}>
      <Paragraph>{name}</Paragraph>

      <FlatList
        horizontal
        data={options}
        renderItem={_renderItem}
        keyExtractor={_keyExtractor}
        contentContainerStyle={styles.controlItemsList}
      />
    </View>
  );
};

const CustomFABControls = ({
  setControls,
  controls: { animateFrom, iconMode },
}: Props) => {
  const setIconMode = (newIconMode: IconMode) =>
    setControls((state) => ({ ...state, iconMode: newIconMode }));

  const setAnimateFrom = (newAnimateFrom: AnimateFrom) =>
    setControls((state) => ({ ...state, animateFrom: newAnimateFrom }));

  return (
    <View style={styles.controlsWrapper}>
      <CustomControl
        name="iconMode"
        options={['static', 'dynamic']}
        value={iconMode}
        onChange={setIconMode}
      />

      <CustomControl
        name="animateFrom"
        options={['left', 'right']}
        value={animateFrom}
        onChange={setAnimateFrom}
      />
    </View>
  );
};

export default CustomFABControls;

const styles = StyleSheet.create({
  controlsWrapper: {
    flex: 1,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.white,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  controlWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  controlItemsList: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  controlItem: {
    marginLeft: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
});
