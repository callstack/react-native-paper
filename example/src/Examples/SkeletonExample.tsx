import * as React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Text, Skeleton, withTheme, Theme } from 'react-native-paper';

type Props = {
  theme: Theme;
};

class SkeletonExample extends React.Component<Props> {
  static title = 'Skeleton';

  render() {
    const {
      theme: {
        colors: { background },
      },
    } = this.props;

    return (
      <ScrollView
        style={[styles.container, { backgroundColor: background }]}
        contentContainerStyle={styles.content}
      >
        <View style={{ width: '100%' }}>
          <Text style={{ paddingBottom: 10 }}> Text </Text>
          <Skeleton.Text fontSize={24} />
          <Skeleton.Text
            width={'80%'}
            color={'#00ff00'}
            style={{ marginTop: 10 }}
          />
        </View>
        <View style={{ width: '100%', paddingTop: 30 }}>
          <Text style={{ paddingBottom: 10 }}> Rectangle </Text>
          <Skeleton.Rectangle />
        </View>
        <View style={{ width: '100%', paddingTop: 30 }}>
          <Text style={{ paddingBottom: 10 }}> Circle </Text>
          <Skeleton.Circle radius={50} />
        </View>
        <View style={{ width: '100%', paddingTop: 30 }}>
          <Text style={{ paddingBottom: 10 }}> Example : user details </Text>
          <View style={{ flexDirection: 'row' }}>
            <Skeleton.Circle radius={40} color={'#FF7F00'} />
            <View
              style={{
                flexDirection: 'column',
                paddingHorizontal: 20,
                paddingVertical: 5,
              }}
            >
              <Skeleton.Text fontSize={24} width={100} color={'#FF7F00'} />
              <Skeleton.Text
                width={200}
                style={{ marginTop: 10 }}
                color={'#FF7F00'}
              />
              <Skeleton.Text
                width={200}
                style={{ marginTop: 10 }}
                color={'#FF7F00'}
              />
            </View>
          </View>
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 10,
  },
});

export default withTheme(SkeletonExample);
