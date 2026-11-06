import { Text } from 'react-native';

import { describe, expect, it, jest } from '@jest/globals';

import { render, screen, userEvent } from '../../../test-utils';
import NavigationRail from '../../NavigationRail';

const items = (
  <>
    <NavigationRail.Item icon="inbox" label="Inbox" active badge={3} />
    <NavigationRail.Item icon="send" label="Sent" badge />
    <NavigationRail.Item icon="delete" label="Trash" disabled />
  </>
);

describe('NavigationRail render', () => {
  it('renders collapsed', async () => {
    expect(
      (await render(<NavigationRail>{items}</NavigationRail>)).toJSON()
    ).toMatchSnapshot();
  });

  it('renders expanded', async () => {
    expect(
      (await render(<NavigationRail expanded>{items}</NavigationRail>)).toJSON()
    ).toMatchSnapshot();
  });

  it('renders header and alignment', async () => {
    expect(
      (
        await render(
          <NavigationRail alignment="bottom" header={<Text>Header</Text>}>
            {items}
          </NavigationRail>
        )
      ).toJSON()
    ).toMatchSnapshot();
  });

  it('renders icon-only items', async () => {
    expect(
      (
        await render(
          <NavigationRail>
            <NavigationRail.Item icon="inbox" active />
          </NavigationRail>
        )
      ).toJSON()
    ).toMatchSnapshot();
  });

  it('renders behind a scrim in overlay mode', async () => {
    expect(
      (
        await render(
          <NavigationRail overlay expanded>
            {items}
          </NavigationRail>
        )
      ).toJSON()
    ).toMatchSnapshot();
  });

  it('renders the active icon for the active destination', async () => {
    expect(
      (
        await render(
          <NavigationRail>
            <NavigationRail.Item
              icon="inbox-outline"
              activeIcon="inbox"
              label="Inbox"
              active
            />
            <NavigationRail.Item
              icon="send-outline"
              activeIcon="send"
              label="Sent"
            />
          </NavigationRail>
        )
      ).toJSON()
    ).toMatchSnapshot();
  });
});

describe('NavigationRail layout', () => {
  it('uses collapsed width by default', async () => {
    await render(<NavigationRail testID="rail">{items}</NavigationRail>);

    expect(screen.getByTestId('rail')).toHaveStyle({ width: 96 });
  });

  it('fades the scrim in and dismisses on press in overlay mode', async () => {
    const onDismiss = jest.fn();
    const { rerender } = await render(
      <NavigationRail testID="rail" overlay onDismiss={onDismiss}>
        {items}
      </NavigationRail>
    );

    expect(screen.getByLabelText('Close navigation rail')).toHaveStyle({
      opacity: 0,
    });

    await rerender(
      <NavigationRail testID="rail" overlay expanded onDismiss={onDismiss}>
        {items}
      </NavigationRail>
    );

    expect(screen.getByTestId('rail')).toHaveStyle({ width: 220 });
    expect(screen.getByLabelText('Close navigation rail')).toHaveStyle({
      opacity: 0.32,
    });

    await userEvent
      .setup()
      .press(screen.getByLabelText('Close navigation rail'));

    expect(onDismiss).toHaveBeenCalledTimes(1);
  });

  it('clamps the expanded width to the spec range', async () => {
    await render(
      <NavigationRail testID="rail" expanded expandedWidth={500}>
        {items}
      </NavigationRail>
    );

    expect(screen.getByTestId('rail')).toHaveStyle({ width: 360 });
  });
});

describe('NavigationRail.Item', () => {
  it('marks only the active destination as selected', async () => {
    await render(
      <NavigationRail>
        <NavigationRail.Item icon="inbox" label="Inbox" active />
        <NavigationRail.Item icon="send" label="Sent" />
      </NavigationRail>
    );

    expect(screen.getByRole('tab', { name: 'Inbox' })).toBeSelected();
    expect(screen.getByRole('tab', { name: 'Sent' })).not.toBeSelected();
  });

  it('exposes a single label in both layouts', async () => {
    const { rerender } = await render(
      <NavigationRail>
        <NavigationRail.Item icon="inbox" label="Inbox" />
      </NavigationRail>
    );

    expect(screen.getAllByText('Inbox')).toHaveLength(1);

    await rerender(
      <NavigationRail expanded>
        <NavigationRail.Item icon="inbox" label="Inbox" />
      </NavigationRail>
    );

    expect(screen.getAllByText('Inbox')).toHaveLength(1);
  });

  it('uses the label as accessibility label', async () => {
    await render(
      <NavigationRail>
        <NavigationRail.Item icon="inbox" label="Inbox" />
      </NavigationRail>
    );

    expect(screen.getByRole('tab', { name: 'Inbox' })).toBeOnTheScreen();
  });

  it('calls onPress', async () => {
    const user = userEvent.setup();
    const onPress = jest.fn();
    await render(
      <NavigationRail>
        <NavigationRail.Item icon="inbox" label="Inbox" onPress={onPress} />
      </NavigationRail>
    );

    await user.press(screen.getByRole('tab'));

    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('does not call onPress when disabled', async () => {
    const user = userEvent.setup();
    const onPress = jest.fn();
    await render(
      <NavigationRail>
        <NavigationRail.Item
          icon="inbox"
          label="Inbox"
          disabled
          onPress={onPress}
        />
      </NavigationRail>
    );

    await user.press(screen.getByRole('tab'));

    expect(onPress).not.toHaveBeenCalled();
    expect(screen.getByRole('tab')).toBeDisabled();
  });

  it('renders badge text', async () => {
    await render(
      <NavigationRail>
        <NavigationRail.Item icon="inbox" label="Inbox" badge={12} />
      </NavigationRail>
    );

    expect(screen.getByText('12')).toBeOnTheScreen();
  });
});
