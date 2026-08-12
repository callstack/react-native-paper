import * as React from 'react';
import { StyleSheet, View } from 'react-native';

import {
  Icon,
  List,
  Modal,
  Portal,
  Text,
  TouchableRipple,
  useTheme,
} from 'react-native-paper';

import type { SampleConfig } from './types';
import ScreenWrapper from '../ScreenWrapper';

export const HelpCenterSampleConfig: SampleConfig = {
  title: 'Help center',
  icon: 'help-circle-outline',
  components: ['Icon', 'List', 'Modal', 'Portal', 'Text', 'TouchableRipple'],
};

const TOPICS = [
  {
    id: 'getting-started',
    title: 'Getting started',
    icon: 'rocket-launch-outline',
    answers: ['Install the app', 'Create your first workspace'],
  },
  {
    id: 'billing',
    title: 'Billing',
    icon: 'credit-card-outline',
    answers: ['Update your payment method', 'Download past invoices'],
  },
  {
    id: 'privacy',
    title: 'Privacy',
    icon: 'shield-lock-outline',
    answers: ['Manage data sharing', 'Delete your account'],
  },
];

const HelpCenterSample = () => {
  const { colors } = useTheme();
  const [contactVisible, setContactVisible] = React.useState(false);

  return (
    <>
      <ScreenWrapper>
        <List.AccordionGroup>
          <List.Section title="Frequently asked">
            {TOPICS.map((topic) => (
              <List.Accordion
                key={topic.id}
                id={topic.id}
                title={topic.title}
                left={(props) => <List.Icon {...props} icon={topic.icon} />}
              >
                {topic.answers.map((answer) => (
                  <List.Item key={answer} title={answer} onPress={() => {}} />
                ))}
              </List.Accordion>
            ))}
          </List.Section>
        </List.AccordionGroup>

        <TouchableRipple onPress={() => setContactVisible(true)}>
          <View style={styles.contact}>
            <Icon source="chat-question-outline" size={24} />
            <Text variant="bodyLarge">Still stuck? Contact support</Text>
          </View>
        </TouchableRipple>
      </ScreenWrapper>

      <Portal>
        <Modal
          visible={contactVisible}
          onDismiss={() => setContactVisible(false)}
          contentContainerStyle={[
            styles.modal,
            { backgroundColor: colors.surface },
          ]}
        >
          <Text variant="titleMedium">Contact support</Text>
          <Text variant="bodyMedium">
            Write to support@example.com and we will get back to you within one
            business day.
          </Text>
        </Modal>
      </Portal>
    </>
  );
};

const styles = StyleSheet.create({
  contact: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    padding: 16,
  },
  modal: {
    margin: 24,
    padding: 24,
    borderRadius: 28,
    gap: 8,
  },
});

export default HelpCenterSample;
