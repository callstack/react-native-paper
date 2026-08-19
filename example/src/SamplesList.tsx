import { FlatList, StyleSheet, View } from 'react-native';

import { useNavigation } from '@react-navigation/native';
import { Avatar, Card, Chip } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import ArticleSample, { ArticleSampleConfig } from './Samples/ArticleSample';
import ContactsSample, { ContactsSampleConfig } from './Samples/ContactsSample';
import HelpCenterSample, {
  HelpCenterSampleConfig,
} from './Samples/HelpCenterSample';
import OrdersSample, { OrdersSampleConfig } from './Samples/OrdersSample';
import PlayerSample, { PlayerSampleConfig } from './Samples/PlayerSample';
import SettingsSample, { SettingsSampleConfig } from './Samples/SettingsSample';
import SignUpSample, { SignUpSampleConfig } from './Samples/SignUpSample';
import WorkspaceSample, {
  WorkspaceSampleConfig,
} from './Samples/WorkspaceSample';

export const samples = {
  SignUpSample: { ...SignUpSampleConfig, screen: SignUpSample },
  ContactsSample: { ...ContactsSampleConfig, screen: ContactsSample },
  ArticleSample: { ...ArticleSampleConfig, screen: ArticleSample },
  SettingsSample: { ...SettingsSampleConfig, screen: SettingsSample },
  PlayerSample: { ...PlayerSampleConfig, screen: PlayerSample },
  OrdersSample: { ...OrdersSampleConfig, screen: OrdersSample },
  HelpCenterSample: { ...HelpCenterSampleConfig, screen: HelpCenterSample },
  WorkspaceSample: { ...WorkspaceSampleConfig, screen: WorkspaceSample },
};

type SampleId = keyof typeof samples;

const data = (Object.keys(samples) as SampleId[]).map((id) => ({
  id,
  ...samples[id],
}));

export default function SamplesList() {
  const navigation = useNavigation('SamplesList');
  const safeArea = useSafeAreaInsets();

  return (
    <FlatList
      data={data}
      keyExtractor={({ id }) => id}
      contentContainerStyle={[
        styles.content,
        {
          paddingBottom: safeArea.bottom + 16,
          paddingLeft: safeArea.left + 16,
          paddingRight: safeArea.right + 16,
        },
      ]}
      showsVerticalScrollIndicator={false}
      renderItem={({ item }) => (
        <Card mode="outlined" onPress={() => navigation.navigate(item.id)}>
          <Card.Title
            title={item.title}
            left={({ size }) => <Avatar.Icon size={size} icon={item.icon} />}
          />
          <Card.Content>
            <View style={styles.tags}>
              {item.components.map((component) => (
                <Chip key={component} compact>
                  {component}
                </Chip>
              ))}
            </View>
          </Card.Content>
        </Card>
      )}
    />
  );
}

const styles = StyleSheet.create({
  content: {
    padding: 16,
    gap: 16,
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
});
