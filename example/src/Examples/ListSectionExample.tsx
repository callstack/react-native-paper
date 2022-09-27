import * as React from 'react';
import { StyleSheet, Image, View } from 'react-native';

import { Caption, List, Text, Chip, Divider } from 'react-native-paper';

import ScreenWrapper from '../ScreenWrapper';
const ListSectionExample = () => {
  return (
    <ScreenWrapper>
      <List.Section>
        <List.Subheader>Single line</List.Subheader>
        <List.Item
          left={(props) => <List.Icon {...props} icon="calendar" />}
          title="List item 1"
        />
        <List.Item
          left={(props) => <List.Icon {...props} icon="wallet-giftcard" />}
          title="List item 2"
        />
        <List.Item
          title="List item 3"
          left={(props) => <List.Icon {...props} icon="folder" />}
          right={(props) => <List.Icon {...props} icon="equal" />}
        />
      </List.Section>
      <Divider />
      <List.Section>
        <List.Subheader>Two line</List.Subheader>
        <List.Item
          left={() => (
            <Image
              source={require('../../assets/images/email-icon.png')}
              style={styles.image}
              accessibilityIgnoresInvertColors
            />
          )}
          title="List item 1"
          description="Describes item 1"
        />
        <List.Item
          left={() => (
            <Image
              source={require('../../assets/images/email-icon.png')}
              style={styles.image}
              accessibilityIgnoresInvertColors
            />
          )}
          right={(props) => <List.Icon {...props} icon="information" />}
          title="List item 2"
          description="Describes item 2"
        />
      </List.Section>
      <Divider />
      <List.Section>
        <List.Subheader>Three line</List.Subheader>
        <List.Item
          left={() => (
            <Image
              source={require('../../assets/images/email-icon.png')}
              style={styles.image}
              accessibilityIgnoresInvertColors
            />
          )}
          title="List item 1"
          description="Describes item 1. Example of a very very long description."
        />
        <List.Item
          left={() => (
            <Image
              source={require('../../assets/images/email-icon.png')}
              style={styles.image}
              accessibilityIgnoresInvertColors
            />
          )}
          right={(props) => <List.Icon {...props} icon="star-outline" />}
          title="List item 2"
          description="Describes item 2. Example of a very very long description."
        />
      </List.Section>
      <Divider />
      <List.Section>
        <List.Subheader>Custom title and description</List.Subheader>
        <List.Item
          left={() => (
            <Image
              source={require('../../assets/images/email-icon.png')}
              style={styles.image}
              accessibilityIgnoresInvertColors
            />
          )}
          right={(props) => <List.Icon {...props} icon="star-outline" />}
          title={({ ellipsizeMode, color: titleColor, fontSize }) => (
            <View style={[styles.container, styles.row, styles.customTitle]}>
              <Text
                ellipsizeMode={ellipsizeMode}
                style={{ color: titleColor, fontSize }}
              >
                List Item
              </Text>
              <Caption>Yesterday</Caption>
            </View>
          )}
          description={({
            ellipsizeMode,
            color: descriptionColor,
            fontSize,
          }) => (
            <View style={[styles.container, styles.column]}>
              <Text
                numberOfLines={2}
                ellipsizeMode={ellipsizeMode}
                style={{ color: descriptionColor, fontSize }}
              >
                React Native Paper is a high-quality, standard-compliant
                Material Design library that has you covered in all major
                use-cases.
              </Text>
              <View
                style={[styles.container, styles.row, styles.additionalPadding]}
              >
                <Chip icon="file-pdf" onPress={() => {}}>
                  DOCS.pdf
                </Chip>
              </View>
            </View>
          )}
        />
      </List.Section>
    </ScreenWrapper>
  );
};

ListSectionExample.title = 'List.Section';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  image: {
    height: 40,
    width: 40,
    margin: 8,
  },
  row: {
    flexDirection: 'row',
  },
  column: {
    flexDirection: 'column',
  },
  customTitle: {
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  additionalPadding: {
    paddingTop: 8,
  },
});

export default ListSectionExample;
