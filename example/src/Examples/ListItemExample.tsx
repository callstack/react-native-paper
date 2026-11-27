import { useState } from 'react';

import { List, Divider, Checkbox, Avatar, Switch } from 'react-native-paper';

import ScreenWrapper from '../ScreenWrapper';

const SelectableSection = () => {
  const [selected, setSelected] = useState(0);

  return (
    <List.Section title="Selected">
      {[0, 1, 2].map((index) => (
        <List.Item
          key={index}
          title="Headline"
          description="Supporting text"
          selected={index === selected}
          onPress={() => setSelected(index)}
          leading={<List.Icon icon="account-outline" />}
        />
      ))}
      <Divider />
    </List.Section>
  );
};

const ListItemExample = () => {
  return (
    <ScreenWrapper>
      <SelectableSection />

      <List.Section title="Disabled">
        <List.Item
          title="Headline"
          description="Supporting text"
          disabled
          onPress={() => {}}
          leading={<List.Icon icon="account-outline" />}
          trailing={<List.Icon icon="chevron-right" />}
        />
        <List.Item
          title="Headline"
          description="Selected"
          selected
          disabled
          onPress={() => {}}
          leading={<List.Icon icon="account-outline" />}
          trailing={<List.Icon icon="chevron-right" />}
        />
        <Divider />
      </List.Section>

      <List.Section title="Text-only">
        <List.Item title="Headline" />
        <List.Item title="Headline" description="Supporting text" />
        <List.Item
          title="Headline"
          description="Supporting text that is long enough to fill up multiple lines in the item"
        />
        <Divider />
        <List.Item
          title="Headline"
          trailing={<Checkbox status="checked" aria-label="Headline" />}
        />
        <List.Item
          title="Headline"
          description="Supporting text"
          trailing={<Checkbox status="checked" aria-label="Headline" />}
        />
        <List.Item
          title="Headline"
          description="Supporting text that is long enough to fill up multiple lines in the item"
          trailing={<Checkbox status="checked" aria-label="Headline" />}
        />
        <Divider />
      </List.Section>

      <List.Section title="With icon">
        <List.Item
          title="Headline"
          leading={<List.Icon icon="account-outline" />}
        />
        <List.Item
          title="Headline"
          description="Supporting text"
          leading={<List.Icon icon="account-outline" />}
        />
        <List.Item
          title="Headline"
          description="Supporting text that is long enough to fill up multiple lines in the item"
          leading={<List.Icon icon="account-outline" />}
        />
        <Divider />
        <List.Item
          title="Headline"
          leading={<List.Icon icon="account-outline" />}
          trailing={<Checkbox status="checked" aria-label="Headline" />}
        />
        <List.Item
          title="Headline"
          description="Supporting text"
          leading={<List.Icon icon="account-outline" />}
          trailing={<Checkbox status="checked" aria-label="Headline" />}
        />
        <List.Item
          title="Headline"
          description="Supporting text that is long enough to fill up multiple lines in the item"
          leading={<List.Icon icon="account-outline" />}
          trailing={<Checkbox status="checked" aria-label="Headline" />}
        />
        <Divider />
      </List.Section>

      <List.Section title="With avatar">
        <List.Item
          title="Headline"
          leading={<Avatar.Text label="A" size={40} />}
        />
        <List.Item
          title="Headline"
          description="Supporting text"
          leading={<Avatar.Text label="A" size={40} />}
        />
        <List.Item
          title="Headline"
          description="Supporting text that is long enough to fill up multiple lines in the item"
          leading={<Avatar.Text label="A" size={40} />}
        />
        <Divider />
        <List.Item
          title="Headline"
          leading={<Avatar.Text label="A" size={40} />}
          trailing={<Checkbox status="checked" aria-label="Headline" />}
        />
        <List.Item
          title="Headline"
          description="Supporting text"
          leading={<Avatar.Text label="A" size={40} />}
          trailing={<Checkbox status="checked" aria-label="Headline" />}
        />
        <List.Item
          title="Headline"
          description="Supporting text that is long enough to fill up multiple lines in the item"
          leading={<Avatar.Text label="A" size={40} />}
          trailing={<Checkbox status="checked" aria-label="Headline" />}
        />
        <Divider />
      </List.Section>

      <List.Section title="With image">
        <List.Item
          title="Headline"
          leading={
            <List.Image
              source={require('../../../example/assets/images/strawberries.jpg')}
            />
          }
        />
        <List.Item
          title="Headline"
          description="Supporting text"
          leading={
            <List.Image
              source={require('../../../example/assets/images/strawberries.jpg')}
            />
          }
        />
        <List.Item
          title="Headline"
          description="Supporting text that is long enough to fill up multiple lines in the item"
          leading={
            <List.Image
              source={require('../../../example/assets/images/strawberries.jpg')}
            />
          }
        />
        <Divider />
        <List.Item
          title="Headline"
          leading={
            <List.Image
              source={require('../../../example/assets/images/strawberries.jpg')}
            />
          }
          trailing={<Checkbox status="checked" aria-label="Headline" />}
        />
        <List.Item
          title="Headline"
          description="Supporting text"
          leading={
            <List.Image
              source={require('../../../example/assets/images/strawberries.jpg')}
            />
          }
          trailing={<Checkbox status="checked" aria-label="Headline" />}
        />
        <List.Item
          title="Headline"
          description="Supporting text that is long enough to fill up multiple lines in the item"
          leading={
            <List.Image
              source={require('../../../example/assets/images/strawberries.jpg')}
            />
          }
          trailing={<Checkbox status="checked" aria-label="Headline" />}
        />
        <Divider />
      </List.Section>

      <List.Section title="With video">
        <List.Item
          title="Headline"
          leading={
            <List.Image
              variant="video"
              source={require('../../../example/assets/images/strawberries.jpg')}
            />
          }
        />
        <List.Item
          title="Headline"
          description="Supporting text"
          leading={
            <List.Image
              variant="video"
              source={require('../../../example/assets/images/strawberries.jpg')}
            />
          }
        />
        <List.Item
          title="Headline"
          description="Supporting text that is long enough to fill up multiple lines in the item"
          leading={
            <List.Image
              variant="video"
              source={require('../../../example/assets/images/strawberries.jpg')}
            />
          }
        />
        <Divider />
        <List.Item
          title="Headline"
          leading={
            <List.Image
              variant="video"
              source={require('../../../example/assets/images/strawberries.jpg')}
            />
          }
          trailing={<Checkbox status="checked" aria-label="Headline" />}
        />
        <List.Item
          title="Headline"
          description="Supporting text"
          leading={
            <List.Image
              variant="video"
              source={require('../../../example/assets/images/strawberries.jpg')}
            />
          }
          trailing={<Checkbox status="checked" aria-label="Headline" />}
        />
        <List.Item
          title="Headline"
          description="Supporting text that is long enough to fill up multiple lines in the item"
          leading={
            <List.Image
              variant="video"
              source={require('../../../example/assets/images/strawberries.jpg')}
            />
          }
          trailing={<Checkbox status="checked" aria-label="Headline" />}
        />
        <Divider />
      </List.Section>

      <List.Section title="With switch">
        <List.Item title="Headline" trailing={<Switch disabled />} />
        <List.Item
          title="Headline"
          description="Supporting text"
          trailing={<Switch disabled />}
        />
        <List.Item
          title="Headline"
          description="Supporting text that is long enough to fill up multiple lines in the item"
          trailing={<Switch disabled />}
        />
        <Divider />
        <List.Item
          title="Headline"
          leading={<List.Icon icon="account-outline" />}
          trailing={<Switch disabled />}
        />
        <List.Item
          title="Headline"
          description="Supporting text"
          leading={<List.Icon icon="account-outline" />}
          trailing={<Switch disabled />}
        />
        <List.Item
          title="Headline"
          description="Supporting text that is long enough to fill up multiple lines in the item"
          leading={<List.Icon icon="account-outline" />}
          trailing={<Switch disabled />}
        />
        <Divider />
      </List.Section>
    </ScreenWrapper>
  );
};

ListItemExample.title = 'List.Item';

export default ListItemExample;
