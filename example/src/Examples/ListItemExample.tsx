import { List, Divider, Checkbox, Avatar, Switch } from 'react-native-paper';

import ScreenWrapper from '../ScreenWrapper';

const ListItemExample = () => {
  return (
    <ScreenWrapper>
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
          right={(props) => <Checkbox status="checked" style={props.style} />}
        />
        <List.Item
          title="Headline"
          description="Supporting text"
          right={(props) => <Checkbox status="checked" style={props.style} />}
        />
        <List.Item
          title="Headline"
          description="Supporting text that is long enough to fill up multiple lines in the item"
          right={(props) => <Checkbox status="checked" style={props.style} />}
        />
        <Divider />
      </List.Section>

      <List.Section title="With icon">
        <List.Item
          title="Headline"
          left={(props) => <List.Icon {...props} icon="account-outline" />}
        />
        <List.Item
          title="Headline"
          description="Supporting text"
          left={(props) => <List.Icon {...props} icon="account-outline" />}
        />
        <List.Item
          title="Headline"
          description="Supporting text that is long enough to fill up multiple lines in the item"
          left={(props) => <List.Icon {...props} icon="account-outline" />}
        />
        <Divider />
        <List.Item
          title="Headline"
          left={(props) => <List.Icon {...props} icon="account-outline" />}
          right={(props) => <Checkbox status="checked" style={props.style} />}
        />
        <List.Item
          title="Headline"
          description="Supporting text"
          left={(props) => <List.Icon {...props} icon="account-outline" />}
          right={(props) => <Checkbox status="checked" style={props.style} />}
        />
        <List.Item
          title="Headline"
          description="Supporting text that is long enough to fill up multiple lines in the item"
          left={(props) => <List.Icon {...props} icon="account-outline" />}
          right={(props) => <Checkbox status="checked" style={props.style} />}
        />
        <Divider />
      </List.Section>

      <List.Section title="With avatar">
        <List.Item
          title="Headline"
          left={(props) => (
            <Avatar.Text style={props.style} label="A" size={40} />
          )}
        />
        <List.Item
          title="Headline"
          description="Supporting text"
          left={(props) => (
            <Avatar.Text style={props.style} label="A" size={40} />
          )}
        />
        <List.Item
          title="Headline"
          description="Supporting text that is long enough to fill up multiple lines in the item"
          left={(props) => (
            <Avatar.Text style={props.style} label="A" size={40} />
          )}
        />
        <Divider />
        <List.Item
          title="Headline"
          left={(props) => (
            <Avatar.Text style={props.style} label="A" size={40} />
          )}
          right={(props) => <Checkbox status="checked" style={props.style} />}
        />
        <List.Item
          title="Headline"
          description="Supporting text"
          left={(props) => (
            <Avatar.Text style={props.style} label="A" size={40} />
          )}
          right={(props) => <Checkbox status="checked" style={props.style} />}
        />
        <List.Item
          title="Headline"
          description="Supporting text that is long enough to fill up multiple lines in the item"
          left={(props) => (
            <Avatar.Text style={props.style} label="A" size={40} />
          )}
          right={(props) => <Checkbox status="checked" style={props.style} />}
        />
        <Divider />
      </List.Section>

      <List.Section title="With image">
        <List.Item
          title="Headline"
          left={(props) => (
            <List.Image
              style={props.style}
              source={require('../../../example/assets/images/strawberries.jpg')}
            />
          )}
        />
        <List.Item
          title="Headline"
          description="Supporting text"
          left={(props) => (
            <List.Image
              style={props.style}
              source={require('../../../example/assets/images/strawberries.jpg')}
            />
          )}
        />
        <List.Item
          title="Headline"
          description="Supporting text that is long enough to fill up multiple lines in the item"
          left={(props) => (
            <List.Image
              style={props.style}
              source={require('../../../example/assets/images/strawberries.jpg')}
            />
          )}
        />
        <Divider />
        <List.Item
          title="Headline"
          left={(props) => (
            <List.Image
              style={props.style}
              source={require('../../../example/assets/images/strawberries.jpg')}
            />
          )}
          right={(props) => <Checkbox status="checked" style={props.style} />}
        />
        <List.Item
          title="Headline"
          description="Supporting text"
          left={(props) => (
            <List.Image
              style={props.style}
              source={require('../../../example/assets/images/strawberries.jpg')}
            />
          )}
          right={(props) => <Checkbox status="checked" style={props.style} />}
        />
        <List.Item
          title="Headline"
          description="Supporting text that is long enough to fill up multiple lines in the item"
          left={(props) => (
            <List.Image
              style={props.style}
              source={require('../../../example/assets/images/strawberries.jpg')}
            />
          )}
          right={(props) => <Checkbox status="checked" style={props.style} />}
        />
        <Divider />
      </List.Section>

      <List.Section title="With video">
        <List.Item
          title="Headline"
          left={(props) => (
            <List.Image
              variant="video"
              style={props.style}
              source={require('../../../example/assets/images/strawberries.jpg')}
            />
          )}
        />
        <List.Item
          title="Headline"
          description="Supporting text"
          left={(props) => (
            <List.Image
              variant="video"
              style={props.style}
              source={require('../../../example/assets/images/strawberries.jpg')}
            />
          )}
        />
        <List.Item
          title="Headline"
          description="Supporting text that is long enough to fill up multiple lines in the item"
          left={(props) => (
            <List.Image
              variant="video"
              style={props.style}
              source={require('../../../example/assets/images/strawberries.jpg')}
            />
          )}
        />
        <Divider />
        <List.Item
          title="Headline"
          left={(props) => (
            <List.Image
              variant="video"
              style={props.style}
              source={require('../../../example/assets/images/strawberries.jpg')}
            />
          )}
          right={(props) => <Checkbox status="checked" style={props.style} />}
        />
        <List.Item
          title="Headline"
          description="Supporting text"
          left={(props) => (
            <List.Image
              variant="video"
              style={props.style}
              source={require('../../../example/assets/images/strawberries.jpg')}
            />
          )}
          right={(props) => <Checkbox status="checked" style={props.style} />}
        />
        <List.Item
          title="Headline"
          description="Supporting text that is long enough to fill up multiple lines in the item"
          left={(props) => (
            <List.Image
              variant="video"
              style={props.style}
              source={require('../../../example/assets/images/strawberries.jpg')}
            />
          )}
          right={(props) => <Checkbox status="checked" style={props.style} />}
        />
        <Divider />
      </List.Section>

      <List.Section title="With switch">
        <List.Item
          title="Headline"
          right={(props) => <Switch disabled style={props.style} />}
        />
        <List.Item
          title="Headline"
          description="Supporting text"
          right={(props) => <Switch disabled style={props.style} />}
        />
        <List.Item
          title="Headline"
          description="Supporting text that is long enough to fill up multiple lines in the item"
          right={(props) => <Switch disabled style={props.style} />}
        />
        <Divider />
        <List.Item
          title="Headline"
          left={(props) => <List.Icon {...props} icon="account-outline" />}
          right={(props) => <Switch disabled style={props.style} />}
        />
        <List.Item
          title="Headline"
          description="Supporting text"
          left={(props) => <List.Icon {...props} icon="account-outline" />}
          right={(props) => <Switch disabled style={props.style} />}
        />
        <List.Item
          title="Headline"
          description="Supporting text that is long enough to fill up multiple lines in the item"
          left={(props) => <List.Icon {...props} icon="account-outline" />}
          right={(props) => <Switch disabled style={props.style} />}
        />
        <Divider />
      </List.Section>
    </ScreenWrapper>
  );
};

ListItemExample.title = 'List.Item';

export default ListItemExample;
