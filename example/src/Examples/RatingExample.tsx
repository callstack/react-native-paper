import * as React from 'react';
import { View, StyleSheet, Text, ScrollView } from 'react-native';
import { withTheme, Theme, List } from 'react-native-paper';
import { Rating } from 'react-native-paper';

type Props = {
  theme: Theme;
};

type State = {
  /**
   * Editable rating value.
   */
  editableValue: number;
};

class RatingExample extends React.Component<Props, State> {
  static title = 'Rating';
  constructor(props: Props) {
    super(props);
    this.state = {
      editableValue: 1,
    };
  }

  onRatingChanged(changedValue: number) {
    this.setState({ editableValue: changedValue });
  }

  render() {
    const { colors } = this.props.theme;
    const { editableValue } = this.state;
    return (
      <>
        <ScrollView
          style={[styles.container, { backgroundColor: colors.background }]}
        >
          <List.Section title="Read Only">
            <View
              style={[styles.container, { backgroundColor: colors.background }]}
            >
              <Rating value={4} max={5} />
            </View>
          </List.Section>
          <List.Section title="Editable (Half Input Allowed)">
            <View
              style={[styles.container, { backgroundColor: colors.background }]}
            >
              <Text style={styles.monitorText}>
                Current Value: {editableValue}
              </Text>
              <Rating
                value={editableValue}
                max={5}
                editable={true}
                onRatingChanged={this.onRatingChanged.bind(this)}
              />
            </View>
          </List.Section>
          <List.Section title="Editable (No Half Input)">
            <View
              style={[styles.container, { backgroundColor: colors.background }]}
            >
              <Rating
                value={editableValue}
                max={5}
                editable={true}
                allowHalfInput={false}
              />
            </View>
          </List.Section>
          <List.Section title="Custom Color">
            <View
              style={[styles.container, { backgroundColor: colors.background }]}
            >
              <Rating value={3} max={5} color={'red'} />
              <Rating value={3} max={5} color={'#0c6cc1'} />
            </View>
          </List.Section>
          <List.Section title="Custom Size">
            <View
              style={[styles.container, { backgroundColor: colors.background }]}
            >
              <Rating value={6.5} max={10} size={24} />
              <Rating value={1} max={3} size={48} />
            </View>
          </List.Section>
          <List.Section title="Custom Styles">
            <View
              style={[styles.container, { backgroundColor: colors.background }]}
            >
              <Rating
                value={1.5}
                max={5}
                size={48}
                color={'magenta'}
                customStyles={styles.fullWidth}
              />
              <View style={styles.monitorText}>
                <Text>This will make the component take full width.</Text>
              </View>
            </View>
          </List.Section>
        </ScrollView>
      </>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    padding: 8,
  },
  monitorText: {
    textAlign: 'center',
    padding: 4,
  },
  fullWidth: {
    flex: 1,
    alignItems: 'center',
  },
});

export default withTheme(RatingExample);
