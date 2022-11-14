import React from 'react';
import { FlatList, ListRenderItemInfo, StyleSheet, View } from 'react-native';

import { TouchableOpacity } from 'react-native-gesture-handler';
import type {
  AnimatedFABAnimateFrom,
  AnimatedFABIconMode,
} from 'react-native-paper';
import { Paragraph, RadioButton, Text } from 'react-native-paper';

import { useExampleTheme } from '../..';

export type Controls = {
  iconMode: AnimatedFABIconMode;
  animateFrom: AnimatedFABAnimateFrom;
};

export const initialControls: Controls = {
  iconMode: 'static',
  animateFrom: 'right',
};

type Props = {
  controls: Controls;
  setControls(controls: React.SetStateAction<Controls>): void;
};

type ControlValue = AnimatedFABIconMode | AnimatedFABAnimateFrom;

type CustomControlProps = {
  name: string;
  options: ControlValue[];
  value: ControlValue;
  onChange(newValue: ControlValue): void;
};

const CustomControl = ({
  name,
  options,
  value,
  onChange,
}: CustomControlProps) => {
  const { isV3 } = useExampleTheme();

  const _renderItem = React.useCallback(
    ({ item }: ListRenderItemInfo<typeof options[number]>) => {
      const TextComponent = isV3 ? Text : Paragraph;

      return (
        <TouchableOpacity
          accessibilityRole="button"
          onPress={() => onChange(item)}
          style={styles.controlItem}
        >
          <TextComponent variant="labelLarge">{item}</TextComponent>

          <RadioButton
            value="dynamic"
            status={value === item ? 'checked' : 'unchecked'}
          />
        </TouchableOpacity>
      );
    },
    [value, onChange, isV3]
  );

  const _keyExtractor = React.useCallback(
    (item: typeof options[number]) => item,
    []
  );
  const TextComponent = isV3 ? Text : Paragraph;

  return (
    <View style={styles.controlWrapper}>
      <TextComponent variant="labelLarge">{name}</TextComponent>

      <FlatList
        horizontal
        scrollEnabled={false}
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
  const { colors } = useExampleTheme();

  const setIconMode = (newIconMode: AnimatedFABIconMode) =>
    setControls((state) => ({ ...state, iconMode: newIconMode }));

  const setAnimateFrom = (newAnimateFrom: AnimatedFABAnimateFrom) =>
    setControls((state) => ({ ...state, animateFrom: newAnimateFrom }));

  return (
    <View
      style={[
        styles.controlsWrapper,
        {
          backgroundColor: colors.background,
        },
      ]}
    >
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
