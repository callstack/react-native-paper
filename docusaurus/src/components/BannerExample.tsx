import { useColorMode } from '@docusaurus/theme-common';
import * as React from 'react';
import { View } from 'react-native';
import {
  Avatar,
  Button,
  FAB,
  MD3DarkTheme as DarkTheme,
  MD3LightTheme as DefaultTheme,
  ProgressBar,
  Provider,
  RadioButton,
  Switch,
  Text,
  TextInput,
  useTheme,
} from 'react-native-paper';

const Stack: React.FC<
  React.PropsWithChildren<{
    direction?: 'row' | 'column';
    spacing?: number;
    style?: any;
  }>
> = ({ direction = 'column', spacing = 0, style, children }) => {
  return (
    <View style={[{ flexDirection: direction, margin: -spacing }, style]}>
      {React.Children.map(children, (child, index) => (
        <View key={index} style={{ flexDirection: direction, margin: spacing }}>
          {child}
        </View>
      ))}
    </View>
  );
};

const BannerExample = () => {
  const theme = useTheme();

  const [isSwitchOn, setIsSwitchOn] = React.useState(false);
  const [text, setText] = React.useState('');
  const [checked, setChecked] = React.useState('first');

  const onToggleSwitch = () => setIsSwitchOn(!isSwitchOn);

  return (
    <View
      style={{
        padding: 28,
        backgroundColor: theme.colors.surface,
        borderWidth: 1,
        borderColor: theme.colors.surfaceVariant,
        borderRadius: 16,
        marginTop: 16,
        marginBottom: 32,
      }}
    >
      <Stack spacing={16}>
        <Stack direction="row" spacing={16}>
          <Stack
            direction="row"
            spacing={8}
            style={{ alignItems: 'flex-start' }}
          >
            <Button loading onPress={() => {}}>
              Loading
            </Button>
            <Button mode="contained-tonal" icon="camera" onPress={() => {}}>
              Icon
            </Button>
            <Button icon="camera" mode="contained" onPress={() => {}}>
              Press me
            </Button>
          </Stack>
          <Stack
            direction="row"
            spacing={8}
            style={{ alignItems: 'flex-start' }}
          >
            <FAB icon="plus" size="small" onPress={() => {}} />
            <FAB icon="plus" size="medium" onPress={() => {}} />
            <FAB icon="plus" size="large" onPress={() => {}} />
          </Stack>
          <Stack direction="row" spacing={8}>
            <Avatar.Text label="XD" />
            <Avatar.Icon icon="folder" />
          </Stack>
        </Stack>
        <ProgressBar indeterminate />
        <Stack spacing={8}>
          <Text variant="displayLarge">Display Large</Text>
          <Text variant="displayMedium">Display Medium</Text>
          <Text>
            Lorem ipsum dolor, sit amet consectetur adipisicing elit. Est
            tenetur neque laudantium, repellendus at excepturi quasi qui culpa.
            Incidunt nesciunt unde perspiciatis atque rerum blanditiis sint
            ratione, sequi totam temporibus.
          </Text>
        </Stack>
        <Stack direction="row" spacing={8}>
          <Switch value={!isSwitchOn} onValueChange={onToggleSwitch} />
          <Switch value={isSwitchOn} onValueChange={onToggleSwitch} />
        </Stack>

        <Stack direction="row" spacing={8}>
          <TextInput
            label="Email"
            value={text}
            onChangeText={(text) => setText(text)}
          />
          <TextInput
            label="Email"
            mode="outlined"
            value={text}
            onChangeText={(text) => setText(text)}
          />
        </Stack>

        <Stack direction="row" spacing={8}>
          <RadioButton
            value="first"
            status={checked === 'first' ? 'checked' : 'unchecked'}
            onPress={() => setChecked('first')}
          />
          <RadioButton
            value="second"
            status={checked === 'second' ? 'checked' : 'unchecked'}
            onPress={() => setChecked('second')}
          />
          <RadioButton
            value="third"
            status={checked === 'third' ? 'checked' : 'unchecked'}
            onPress={() => setChecked('third')}
          />
        </Stack>
      </Stack>
    </View>
  );
};

export default function WithProvider() {
  const colorMode = useColorMode();
  colorMode.isDarkTheme;
  return (
    <Provider theme={colorMode.isDarkTheme ? DarkTheme : DefaultTheme}>
      <BannerExample />
    </Provider>
  );
}
