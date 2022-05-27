import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import { Button } from 'react-native-paper';

const MODES = {
  WHEN_AND_WHERE: 'when and where',
  WHEN: 'when',
  WHERE: 'where',
};

const ModeButton = ({ isSelected, label, onPress }) => {
  return (
    <Button
      compact
      mode={isSelected ? 'elevated' : 'outlined'}
      onPress={onPress}
      style={{ borderRadius: 24, marginRight: 8 }}
    >
      {label}
    </Button>
  );
};

const App = () => {
  const [mode, setMode] = React.useState(MODES.WHEN_AND_WHERE);

  return (
    <View style={styles.root}>
      <View style={styles.modesContainer}>
        <ModeButton
          isSelected={mode === MODES.WHEN_AND_WHERE}
          label={MODES.WHEN_AND_WHERE}
          onPress={() => setMode(MODES.WHEN_AND_WHERE)}
        />
        <ModeButton
          isSelected={mode === MODES.WHEN}
          label={MODES.WHEN}
          onPress={() => setMode(MODES.WHEN)}
        />
        <ModeButton
          isSelected={mode === MODES.WHERE}
          label={MODES.WHERE}
          onPress={() => setMode(MODES.WHERE)}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modesContainer: {
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 16,
    width: '100%',
  },
});

export default App;
