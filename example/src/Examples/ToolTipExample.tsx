import * as React from 'react';
import { Platform, SafeAreaView, StyleSheet, View } from 'react-native';

import type { StackNavigationProp } from '@react-navigation/stack';
import { Appbar, Button, ToolTip } from 'react-native-paper';

import ScreenWrapper from '../ScreenWrapper';

type Props = {
  navigation: StackNavigationProp<{}>;
};

const MORE_ICON = Platform.OS === 'ios' ? 'dots-horizontal' : 'dots-vertical';
type ToolTipVisibility = {
  [key: string]: boolean | undefined;
};

const ToolTipExample = ({ navigation }: Props) => {
  const [visible, setVisible] = React.useState<ToolTipVisibility>({});

  const _toggleToolTip = (name: string) => () =>
    setVisible({ ...visible, [name]: !visible[name] });

  const _getVisible = (name: string) => !!visible[name];

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.screen}>
        <Appbar.Header elevated>
          <ToolTip
            visible={_getVisible('back1')}
            onDismiss={_toggleToolTip('back1')}
            anchor={<Appbar.BackAction onPress={_toggleToolTip('back1')} />}
          />
          <ToolTip
            visible={_getVisible('back2')}
            onDismiss={_toggleToolTip('back2')}
            anchor={<Appbar.BackAction onPress={_toggleToolTip('back2')} />}
          />
          {/* <Appbar.BackAction onPress={() => navigation.goBack()} /> */}
          <Appbar.Content title="ToolTip" />
          <ToolTip
            visible={_getVisible('menu1')}
            onDismiss={_toggleToolTip('menu1')}
            anchor={
              <Appbar.Action
                icon={MORE_ICON}
                onPress={_toggleToolTip('menu1')}
              />
            }
          />
          <ToolTip
            visible={_getVisible('menu2')}
            onDismiss={_toggleToolTip('menu2')}
            anchor={
              <Appbar.Action
                icon={MORE_ICON}
                onPress={_toggleToolTip('menu2')}
              />
            }
          />
          <ToolTip
            visible={_getVisible('menu3')}
            onDismiss={_toggleToolTip('menu3')}
            anchor={
              <Appbar.Action
                icon={MORE_ICON}
                onPress={_toggleToolTip('menu3')}
              />
            }
          />
        </Appbar.Header>
        <ScreenWrapper
          contentContainerStyle={{
            justifyContent: 'space-between',
            flex: 1,
          }}
          style={styles.container}
        >
          <ToolTip
            visible={_getVisible('button6')}
            onDismiss={_toggleToolTip('button6')}
            anchor={
              <Button mode="outlined" onPress={_toggleToolTip('button6')}>
                Show Tool Tip
              </Button>
            }
          />

          <View
            style={{ flexDirection: 'row', justifyContent: 'space-between' }}
          >
            <ToolTip
              visible={_getVisible('button2')}
              onDismiss={_toggleToolTip('button2')}
              anchor={
                <Button
                  style={{ width: 90 }}
                  mode="outlined"
                  onPress={_toggleToolTip('button2')}
                >
                  Show Tool Tip
                </Button>
              }
            />

            <ToolTip
              visible={_getVisible('button3')}
              onDismiss={_toggleToolTip('button3')}
              anchor={
                <Button
                  style={{ width: 90 }}
                  mode="outlined"
                  onPress={_toggleToolTip('button3')}
                >
                  Show Tool Tip
                </Button>
              }
            />

            <ToolTip
              visible={_getVisible('button4')}
              onDismiss={_toggleToolTip('button4')}
              anchor={
                <Button
                  style={{ width: 90 }}
                  mode="outlined"
                  onPress={_toggleToolTip('button4')}
                >
                  Show Tool Tip
                </Button>
              }
            />
          </View>

          <ToolTip
            visible={_getVisible('button5')}
            onDismiss={_toggleToolTip('button5')}
            anchor={
              <Button mode="outlined" onPress={_toggleToolTip('button5')}>
                Show Tool Tip
              </Button>
            }
          />
        </ScreenWrapper>
      </View>
    </SafeAreaView>
  );
};

ToolTipExample.title = 'ToolTip';

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  container: {
    paddingTop: 48,
  },
});

export default ToolTipExample;
