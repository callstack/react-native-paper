import * as React from 'react';
import { AccessibilityInfo, Image, Platform, Text, View } from 'react-native';
import type { HostInstance } from 'react-native';

import {
  afterAll,
  afterEach,
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
  jest,
} from '@jest/globals';
import { act } from '@testing-library/react-native';
import * as Reanimated from 'react-native-reanimated';

import PaperProvider from '../../core/PaperProvider';
import { fireEvent, render, screen, userEvent } from '../../test-utils';
import Banner from '../Banner';
import type { Props as BannerProps } from '../Banner';
import PaperText from '../Typography/Text';

// a banner that mounts visible is part of the page and is not announced, so
// the tests that need an announcement mount it hidden and then show it
const showBanner = async (props: Omit<BannerProps, 'visible'>) => {
  const view = await render(<Banner {...props} visible={false} />);
  await view.rerender(<Banner {...props} visible />);
  return view;
};

jest.mock('react-native-reanimated', () => {
  const ReanimatedModule = jest.requireActual<
    typeof import('react-native-reanimated')
  >('react-native-reanimated');

  return {
    __esModule: true,
    ...ReanimatedModule,
    default: ReanimatedModule.default,
    withTiming: jest.fn(ReanimatedModule.withTiming),
  };
});

it('renders hidden banner, without action buttons and without image', async () => {
  const tree = (
    await render(
      <Banner visible={false}>
        Two line text string with two actions. One to two lines is preferable on
        mobile.
      </Banner>
    )
  ).toJSON();

  expect(tree).toMatchSnapshot();
});

it('renders visible banner, without action buttons and without image', async () => {
  const tree = (
    await render(
      <Banner visible>
        Two line text string with two actions. One to two lines is preferable on
        mobile.
      </Banner>
    )
  ).toJSON();

  expect(tree).toMatchSnapshot();
});

it('renders visible banner, with action buttons and without image', async () => {
  const tree = (
    await render(
      <Banner
        visible
        actions={[
          { label: 'first', onPress: () => {} },
          { label: 'second', onPress: () => {} },
        ]}
      >
        Two line text string with two actions. One to two lines is preferable on
        mobile.
      </Banner>
    )
  ).toJSON();

  expect(tree).toMatchSnapshot();
});

it('renders visible banner, without action buttons and with image', async () => {
  const tree = (
    await render(
      <Banner
        visible
        icon={({ size }) => (
          <Image
            source={{ uri: 'https://callstack.com/images/team/Satya.png' }}
            style={{ width: size, height: size }}
            accessibilityIgnoresInvertColors
          />
        )}
      >
        Two line text string with two actions. One to two lines is preferable on
        mobile.
      </Banner>
    )
  ).toJSON();

  expect(tree).toMatchSnapshot();
});

it('renders visible banner, with action buttons and with image', async () => {
  const tree = (
    await render(
      <Banner
        visible
        icon={({ size }) => (
          <Image
            source={{ uri: 'https://callstack.com/images/team/Satya.png' }}
            style={{ width: size, height: size }}
            accessibilityIgnoresInvertColors
          />
        )}
        actions={[{ label: 'first', onPress: () => {} }]}
      >
        Two line text string with two actions. One to two lines is preferable on
        mobile.
      </Banner>
    )
  ).toJSON();

  expect(tree).toMatchSnapshot();
});

it('render visible banner, with custom theme', async () => {
  const tree = (
    await render(
      <Banner
        visible
        theme={{
          colors: {
            onSurface: '#00f',
            surface: '#ccc',
            primary: '#043',
          },
        }}
        actions={[{ label: 'first', onPress: () => {} }]}
      >
        Custom theme
      </Banner>
    )
  ).toJSON();

  expect(tree).toMatchSnapshot();
});

describe('inert when hidden', () => {
  const ACTIONS = [{ label: 'Fix it', onPress: () => {} }];
  // queries are a11y-aware by default, so opt in explicitly to tell
  // "hidden from screen readers" apart from "not in the tree at all"
  const ALL = { includeHiddenElements: true };
  const originalPlatform = Platform.OS;

  afterEach(() => {
    Platform.OS = originalPlatform;
  });

  // the wrapper that gets marked inert sits a fixed four elements above the
  // message text: message wrapper, body row, content row, then the animated
  // content itself. inert is a web-dom attribute with no public jest query,
  // so a prop assertion on this ancestor is the least bad check
  const contentElement = (text: ReturnType<typeof screen.getByText>) => {
    let node: ReturnType<typeof screen.getByText> | null = text;
    for (let i = 0; i < 4; i++) {
      node = node.parent;
      if (!node) {
        throw new Error('message is not inside the animated content');
      }
    }
    return node;
  };

  it('marks the hidden content inert on web', async () => {
    Platform.OS = 'web';

    const view = await render(
      <Banner visible actions={ACTIONS}>
        Message
      </Banner>
    );
    await view.rerender(
      <Banner visible={false} actions={ACTIONS}>
        Message
      </Banner>
    );

    // animation still in flight, so the content is mounted; web must carry
    // the attribute that drops the subtree from the a11y tree and tab order
    expect(contentElement(screen.getByText('Message', ALL))).toHaveProp(
      'inert',
      true
    );
  });

  it('leaves inert off the hidden content on native', async () => {
    Platform.OS = 'android';

    const view = await render(
      <Banner visible actions={ACTIONS}>
        Message
      </Banner>
    );
    await view.rerender(
      <Banner visible={false} actions={ACTIONS}>
        Message
      </Banner>
    );

    // native ignores the unknown prop, so it must not be passed as inert
    expect(contentElement(screen.getByText('Message', ALL))).not.toHaveProp(
      'inert',
      true
    );
  });

  it('exposes the content while visible', async () => {
    await render(
      <Banner visible actions={ACTIONS}>
        Message
      </Banner>
    );
    await act(() => {
      jest.runAllTimers();
    });

    expect(screen.getByText('Message')).toBeOnTheScreen();
    expect(screen.getByRole('button', { name: 'Fix it' })).toBeOnTheScreen();
  });

  it('keeps the content mounted but inaccessible while the hide animation is running', async () => {
    const view = await render(
      <Banner visible actions={ACTIONS}>
        Message
      </Banner>
    );
    await act(() => {
      jest.runAllTimers();
    });

    await view.rerender(
      <Banner visible={false} actions={ACTIONS}>
        Message
      </Banner>
    );

    // animation still in flight, so the content is mounted but must be dead
    // to a11y-aware queries while still being in the tree
    expect(screen.queryByText('Message')).toBeNull();
    expect(screen.getByText('Message', ALL)).toBeOnTheScreen();
    expect(screen.queryByRole('button', { name: 'Fix it' })).toBeNull();
    expect(
      screen.getByRole('button', { name: 'Fix it', ...ALL })
    ).toBeOnTheScreen();
  });

  it('unmounts the content once the hide animation finishes', async () => {
    const view = await render(
      <Banner visible actions={ACTIONS}>
        Message
      </Banner>
    );
    await act(() => {
      jest.runAllTimers();
    });

    await view.rerender(
      <Banner visible={false} actions={ACTIONS}>
        Message
      </Banner>
    );
    await act(() => {
      jest.runAllTimers();
    });

    // ALL, so null means genuinely gone rather than merely hidden
    expect(screen.queryByText('Message', ALL)).toBeNull();
    expect(screen.queryByRole('button', { name: 'Fix it', ...ALL })).toBeNull();
  });

  it('keeps the content mounted when the hide animation is interrupted', async () => {
    // a hide interrupted by a re-show reports finished:false; acting on it
    // would unmount the content while the banner is on its way back in
    const view = await render(
      <Banner visible actions={ACTIONS}>
        Message
      </Banner>
    );
    await act(() => {
      jest.runAllTimers();
    });

    await view.rerender(
      <Banner visible={false} actions={ACTIONS}>
        Message
      </Banner>
    );
    // banner comes back before the hide finishes, so the interrupted hide
    // callback lands with finished:false and must not unmount anything
    await view.rerender(
      <Banner visible actions={ACTIONS}>
        Message
      </Banner>
    );
    await act(() => {
      jest.runAllTimers();
    });

    expect(screen.getByText('Message')).toBeOnTheScreen();
    expect(screen.getByRole('button', { name: 'Fix it' })).toBeOnTheScreen();
  });

  it('measures once then unmounts the content when mounted hidden', async () => {
    await render(
      <Banner visible={false} actions={ACTIONS}>
        Message
      </Banner>
    );

    // the measuring pass must not be reachable either
    expect(screen.queryByText('Message')).toBeNull();
    expect(screen.getByText('Message', ALL)).toBeOnTheScreen();

    // the layout event climbs to the content's onLayout
    await fireEvent(screen.getByText('Message', ALL), 'layout', {
      nativeEvent: { layout: { height: 80, width: 320 } },
    });

    // the spacer has its height now, so the content is gone for good
    expect(screen.queryByText('Message', ALL)).toBeNull();
  });

  it('remounts the content when shown again', async () => {
    const view = await render(
      <Banner visible={false} actions={ACTIONS}>
        Message
      </Banner>
    );

    // finish the mount-hidden measure pass so the content really leaves
    await fireEvent(screen.getByText('Message', ALL), 'layout', {
      nativeEvent: { layout: { height: 80, width: 320 } },
    });
    expect(screen.queryByText('Message', ALL)).toBeNull();

    await view.rerender(
      <Banner visible actions={ACTIONS}>
        Message
      </Banner>
    );
    await act(() => {
      jest.runAllTimers();
    });

    expect(screen.getByText('Message')).toBeOnTheScreen();
    expect(screen.getByRole('button', { name: 'Fix it' })).toBeOnTheScreen();
  });
});

describe('actions', () => {
  let warn: jest.SpiedFunction<typeof console.warn>;

  beforeEach(() => {
    warn = jest.spyOn(console, 'warn').mockImplementation(() => {});
    warn.mockClear();
  });

  afterEach(() => {
    warn.mockRestore();
  });

  it('renders every action up to the two the spec allows', async () => {
    await render(
      <Banner
        visible
        actions={[
          { label: 'first', onPress: () => {} },
          { label: 'second', onPress: () => {} },
        ]}
      >
        Message
      </Banner>
    );

    expect(screen.getByRole('button', { name: 'first' })).toBeOnTheScreen();
    expect(screen.getByRole('button', { name: 'second' })).toBeOnTheScreen();
    expect(warn).not.toHaveBeenCalled();
  });

  it('drops actions beyond the second one', async () => {
    await render(
      <Banner
        visible
        actions={[
          { label: 'first', onPress: () => {} },
          { label: 'second', onPress: () => {} },
          { label: 'third', onPress: () => {} },
        ]}
      >
        Message
      </Banner>
    );

    expect(screen.getByRole('button', { name: 'first' })).toBeOnTheScreen();
    expect(screen.getByRole('button', { name: 'second' })).toBeOnTheScreen();
    expect(screen.queryByRole('button', { name: 'third' })).toBeNull();
  });

  it('holds on to a consumer touchableRef across re-renders', async () => {
    // a callback rebuilt every render hands the consumer null between commits
    const nodes: Array<HostInstance | null> = [];
    const touchableRef = (node: HostInstance | null) => {
      nodes.push(node);
    };

    const view = await render(
      <Banner
        visible
        actions={[{ label: 'first', onPress: () => {}, touchableRef }]}
      >
        Message
      </Banner>
    );

    expect(nodes).toHaveLength(1);
    expect(nodes[0]).not.toBeNull();

    await view.rerender(
      <Banner
        visible
        actions={[{ label: 'first', onPress: () => {}, touchableRef }]}
      >
        Message
      </Banner>
    );

    expect(nodes).toHaveLength(1);
  });

  it('warns when given more actions than it can render', async () => {
    await render(
      <Banner
        visible
        actions={[
          { label: 'first', onPress: () => {} },
          { label: 'second', onPress: () => {} },
          { label: 'third', onPress: () => {} },
        ]}
      >
        Message
      </Banner>
    );

    expect(warn).toHaveBeenCalledWith(
      expect.stringContaining('Banner supports a maximum of 2 actions')
    );
  });
});

describe('live region', () => {
  const ALL = { includeHiddenElements: true };
  const originalPlatform = Platform.OS;

  // the preset runs as ios, which has no live region and announces by hand
  beforeEach(() => {
    Platform.OS = 'android';
  });

  afterEach(() => {
    Platform.OS = originalPlatform;
  });

  // the announcer empties itself first and fills on a later task, so the text
  // is never there on the render pass itself
  const flush = () =>
    act(() => {
      jest.advanceTimersByTime(1);
    });

  // the region is the Text the announcement lands in, so its accessible
  // name is that text: role plus name is the public check for "the region
  // currently carries this text"
  const regionHas = (text: string) =>
    screen.queryByRole('status', { name: text }) !== null ||
    screen.queryByRole('alert', { name: text }) !== null;

  it('is a polite status region by default', async () => {
    await render(<Banner visible>Message</Banner>);

    const region = screen.getByRole('status');
    expect(region).toHaveProp('aria-live', 'polite');
    expect(screen.queryByRole('alert')).toBeNull();
  });

  it('is an assertive alert region when urgent', async () => {
    await render(
      <Banner visible urgent>
        Message
      </Banner>
    );

    const region = screen.getByRole('alert');
    expect(region).toHaveProp('aria-live', 'assertive');
    expect(screen.queryByRole('status')).toBeNull();
  });

  it('stays mounted and empty while the banner is hidden', async () => {
    await render(<Banner visible={false}>Message</Banner>);
    await flush();

    expect(screen.getByRole('status')).toBeOnTheScreen();
    expect(regionHas('Message')).toBe(false);
  });

  const show = async (props: Omit<BannerProps, 'visible'>) => {
    const view = await showBanner(props);
    await flush();
    return view;
  };

  it('does not announce a banner that mounts visible', async () => {
    await render(<Banner visible>Message</Banner>);
    await flush();

    expect(regionHas('Message')).toBe(false);
    expect(screen.getByText('Message')).toBeOnTheScreen();
  });

  it('announces again every time the banner is shown', async () => {
    const view = await show({ children: 'Message' });
    expect(regionHas('Message')).toBe(true);

    await view.rerender(<Banner visible={false}>Message</Banner>);
    // finish the hide so the content really unmounts, which the bug needed
    await act(() => {
      jest.runAllTimers();
    });
    expect(screen.queryByText('Message', ALL)).toBeNull();
    expect(regionHas('Message')).toBe(false);

    await view.rerender(<Banner visible>Message</Banner>);
    await flush();
    expect(regionHas('Message')).toBe(true);
  });

  it('announces an unchanged message again on every show', async () => {
    const view = await render(<Banner visible={false}>Same text</Banner>);

    for (let i = 0; i < 2; i++) {
      await view.rerender(<Banner visible>Same text</Banner>);
      await flush();
      expect(regionHas('Same text')).toBe(true);

      await view.rerender(<Banner visible={false}>Same text</Banner>);
      await act(() => {
        jest.runAllTimers();
      });
      expect(regionHas('Same text')).toBe(false);
    }
  });

  it('does not announce a message that changes while visible', async () => {
    const view = await show({ children: 'First' });
    await act(() => {
      jest.runAllTimers();
    });
    expect(regionHas('First')).toBe(false);

    await view.rerender(<Banner visible>Second</Banner>);
    await flush();

    expect(regionHas('Second')).toBe(false);
  });

  it('switches the region but does not refill it when urgency changes while visible', async () => {
    const view = await show({ children: 'Message' });
    await act(() => {
      jest.runAllTimers();
    });
    expect(regionHas('Message')).toBe(false);

    await view.rerender(
      <Banner visible urgent>
        Message
      </Banner>
    );
    await flush();

    expect(screen.getByRole('alert')).toHaveProp('aria-live', 'assertive');
    expect(regionHas('Message')).toBe(false);
  });

  it('announces text nested inside elements', async () => {
    await show({
      children: (
        <>
          Your card <Text>ending 4242</Text> was declined
        </>
      ),
    });

    expect(regionHas('Your card ending 4242 was declined')).toBe(true);
  });

  it('drops the text again so it is not a second copy of the message', async () => {
    await show({ children: 'Message' });
    expect(regionHas('Message')).toBe(true);

    await act(() => {
      jest.runAllTimers();
    });

    expect(regionHas('Message')).toBe(false);
    expect(screen.getByText('Message')).toBeOnTheScreen();
  });

  it('carries the message only, so action labels never re-announce it', async () => {
    // status/alert imply aria-atomic, so anything inside the region is
    // re-announced whenever it changes - keep the buttons out of it
    await show({
      actions: [{ label: 'Fix it', onPress: () => {} }],
      children: 'Message',
    });

    // the region is the Text itself, so its exact text content is the
    // message: no action label can be inside it
    expect(screen.getByRole('status', { name: 'Message' })).toBeOnTheScreen();
    expect(screen.getByRole('status')).toHaveTextContent('Message', {
      exact: true,
    });
  });

  it('leaves the region off the message and its text', async () => {
    // the message is a focus target now, not a region
    await render(<Banner visible>Message</Banner>);

    const text = screen.getByText('Message');
    expect(text).not.toHaveProp('aria-live');
    expect(text).not.toHaveProp('role');
  });

  it('is left out on ios, which announces by hand instead', async () => {
    Platform.OS = 'ios';

    await render(<Banner visible>Message</Banner>);

    expect(screen.queryByRole('status', ALL)).toBeNull();
    expect(screen.queryByRole('alert', ALL)).toBeNull();
  });
});

describe('icon', () => {
  it('hides a decorative icon from screen readers', async () => {
    // an unlabelled icon reads as a bare "image"
    await render(
      <Banner visible icon="camera">
        Message
      </Banner>
    );

    // nothing anywhere in the tree announces itself as an image...
    expect(screen.queryByRole('img')).toBeNull();
    expect(
      screen.queryByRole('img', { includeHiddenElements: true })
    ).toBeNull();

    // ...and the wrapper around the icon is explicitly hidden. the wrapper
    // has no role or label to query on, since decorative means exactly
    // that it stays nameless, so the only handle is walking to it from the
    // icon itself; on native the inner icon also hides itself, which is
    // why the queries above alone would not notice this prop going away
    const wrapper = screen.getByText('camera', {
      includeHiddenElements: true,
    }).parent;
    expect(wrapper).toHaveProp('aria-hidden', true);
  });

  it('exposes the icon when it is given a label', async () => {
    await render(
      <Banner visible icon="camera" iconAccessibilityLabel="Payment failed">
        Message
      </Banner>
    );

    expect(
      screen.getByRole('img', { name: 'Payment failed' })
    ).toBeOnTheScreen();
  });
});

describe('message focus', () => {
  const originalPlatform = Platform.OS;

  afterEach(() => {
    Platform.OS = originalPlatform;
  });

  it('lets the message take programmatic focus on web', async () => {
    Platform.OS = 'web';

    await render(<Banner visible>Message</Banner>);

    // -1: a focus target for the rescue, never a tab stop
    expect(screen.getByText('Message')).toHaveProp('tabIndex', -1);
  });

  it('keeps nested text styling inside the focusable message', async () => {
    Platform.OS = 'web';

    await render(
      <Banner visible>
        Your card{' '}
        <PaperText style={{ fontWeight: 'bold' }}>ending 4242</PaperText> was
        declined
      </Banner>
    );

    // the nested part keeps its own style...
    expect(screen.getByText('ending 4242')).toHaveStyle({ fontWeight: 'bold' });
    // ...and the message around it keeps the banner's type and focus target
    const message = screen.getByText('Your card ending 4242 was declined');
    expect(message).toHaveStyle({ fontSize: 14, lineHeight: 20 });
    expect(message).toHaveProp('tabIndex', -1);
  });

  it.each(['ios', 'android'] as const)(
    'leaves the message out of the tab order on %s',
    async (os) => {
      Platform.OS = os;

      await render(<Banner visible>Message</Banner>);

      const text = screen.getByText('Message');
      expect(text).not.toHaveProp('tabIndex');
      expect(text).not.toHaveProp('focusable', true);
      const wrapper = text.parent;
      expect(wrapper).not.toHaveProp('tabIndex');
      expect(wrapper).not.toHaveProp('accessible', true);
      expect(wrapper).not.toHaveProp('focusable', true);
    }
  );
});

describe('announcements', () => {
  const originalPlatform = Platform.OS;
  let announce: jest.SpiedFunction<
    typeof AccessibilityInfo.announceForAccessibilityWithOptions
  >;

  beforeEach(() => {
    Platform.OS = 'ios';
    // the rn jest preset already mocks AccessibilityInfo, so spyOn hands back
    // that mock with every earlier test's calls still on it
    announce = jest
      .spyOn(AccessibilityInfo, 'announceForAccessibilityWithOptions')
      .mockImplementation(() => {});
    announce.mockClear();
  });

  afterEach(() => {
    Platform.OS = originalPlatform;
    announce.mockRestore();
  });

  it('does not announce on ios when mounted visible', async () => {
    await render(<Banner visible>Something went wrong</Banner>);

    expect(announce).not.toHaveBeenCalled();
  });

  it('announces on ios once the banner is shown', async () => {
    const view = await render(<Banner visible={false}>Quiet</Banner>);

    expect(announce).not.toHaveBeenCalled();

    await view.rerender(<Banner visible>Quiet</Banner>);
    expect(announce).toHaveBeenCalledTimes(1);
    // polite by default: queue behind whatever the screen reader is saying
    expect(announce).toHaveBeenCalledWith('Quiet', { queue: true });
  });

  it('announces on ios once per show', async () => {
    const view = await render(<Banner visible>Again</Banner>);

    // mounted visible: 0, then each hidden to visible adds exactly one
    for (const expected of [1, 2]) {
      await view.rerender(<Banner visible={false}>Again</Banner>);
      await act(() => {
        jest.runAllTimers();
      });
      await view.rerender(<Banner visible>Again</Banner>);
      expect(announce).toHaveBeenCalledTimes(expected);
    }
  });

  it('does not announce again on ios when the message changes while visible', async () => {
    const view = await showBanner({ children: 'First' });
    expect(announce).toHaveBeenCalledTimes(1);

    await view.rerender(<Banner visible>Second</Banner>);

    expect(announce).toHaveBeenCalledTimes(1);
  });

  it('does not announce again when an unrelated prop changes', async () => {
    const view = await showBanner({ children: 'Same' });
    expect(announce).toHaveBeenCalledTimes(1);

    await view.rerender(
      <Banner visible elevation={3}>
        Same
      </Banner>
    );

    expect(announce).toHaveBeenCalledTimes(1);
  });

  it('interrupts the screen reader on ios when urgent', async () => {
    await showBanner({ urgent: true, children: 'Your payment failed' });

    expect(announce).toHaveBeenCalledWith('Your payment failed', {
      queue: false,
    });
  });

  it('does not announce again on ios when urgency changes while visible', async () => {
    const view = await showBanner({ children: 'Same message' });
    expect(announce).toHaveBeenCalledTimes(1);

    await view.rerender(
      <Banner visible urgent>
        Same message
      </Banner>
    );

    expect(announce).toHaveBeenCalledTimes(1);
  });

  it('announces children that are not a plain string', async () => {
    const name = 'Ada';
    await showBanner({
      children: ['Hello ', name, ', your card was declined'],
    });

    expect(announce).toHaveBeenCalledWith('Hello Ada, your card was declined', {
      queue: true,
    });
  });

  it('leaves announcing to the live region off ios', async () => {
    Platform.OS = 'android';

    await showBanner({ children: 'Handled by the live region' });

    expect(announce).not.toHaveBeenCalled();
  });
});

describe('focus rescue', () => {
  const originalPlatform = Platform.OS;
  let sendEvent: jest.SpiedFunction<
    typeof AccessibilityInfo.sendAccessibilityEvent
  >;
  let screenReader: jest.SpiedFunction<
    typeof AccessibilityInfo.isScreenReaderEnabled
  >;
  let onPress: jest.Mock<(event: unknown) => void>;
  let retryRef: React.RefObject<HostInstance | null>;
  let dismissRef: React.RefObject<HostInstance | null>;

  beforeEach(() => {
    // jest/testSetup.js and the rn preset already mock both, so spyOn hands
    // back those mocks with every earlier test's calls still on them
    sendEvent = jest
      .spyOn(AccessibilityInfo, 'sendAccessibilityEvent')
      .mockImplementation(() => {});
    sendEvent.mockClear();
    screenReader = jest
      .spyOn(AccessibilityInfo, 'isScreenReaderEnabled')
      .mockResolvedValue(false);
    onPress = jest.fn();
    retryRef = React.createRef<HostInstance>();
    dismissRef = React.createRef<HostInstance>();
  });

  afterEach(() => {
    Platform.OS = originalPlatform;
    screenReader.mockResolvedValue(false);
  });

  // the consumer's touchableRef is merged with the banner's own, so it is the
  // public handle on the host the rescue has to land on
  const retry = () => ({ label: 'Retry', onPress, touchableRef: retryRef });
  const dismiss = () => ({
    label: 'Dismiss',
    onPress,
    touchableRef: dismissRef,
  });

  // the screen reader query resolves after mount
  const settle = () => act(async () => {});

  const press = (name: string) =>
    userEvent.press(screen.getByRole('button', { name }));

  // a host instance holds its whole fiber graph, and a failing matcher that
  // prints one runs jest out of memory, so targets are named before asserting.
  // the actions are named by the consumer's touchableRef; the message has no
  // public handle, so what it renders is the only tell
  const nameOf = (target: unknown) => {
    if (target == null) {
      return 'nothing';
    }
    if (target === retryRef.current) {
      return 'Retry';
    }
    if (target === dismissRef.current) {
      return 'Dismiss';
    }
    // a ref instance handed to the focus call, not a test instance that a
    // query could reach
    /* eslint-disable no-restricted-syntax, testing-library/no-node-access */
    const rendersMessage =
      typeof target === 'object' &&
      'props' in target &&
      typeof target.props === 'object' &&
      target.props !== null &&
      'children' in target.props &&
      target.props.children === 'Message';
    /* eslint-enable no-restricted-syntax, testing-library/no-node-access */
    return rendersMessage ? 'Message' : 'something else';
  };

  const rescues = () =>
    sendEvent.mock.calls.map(([target, event]) => `${nameOf(target)} ${event}`);

  describe.each(['ios', 'android'] as const)('on %s', (os) => {
    beforeEach(() => {
      Platform.OS = os;
    });

    it('moves the screen reader to the action now where the removed one was', async () => {
      screenReader.mockResolvedValue(true);
      const view = await render(
        <Banner visible actions={[retry(), dismiss()]}>
          Message
        </Banner>
      );
      await settle();

      await press('Retry');
      await view.rerender(
        <Banner visible actions={[dismiss()]}>
          Message
        </Banner>
      );

      expect(rescues()).toEqual(['Dismiss focus']);

      // still inside the window, but the press was used up by the rescue, so
      // a later commit must not pull the screen reader back again
      await view.rerender(
        <Banner visible elevation={3} actions={[dismiss()]}>
          Message
        </Banner>
      );
      expect(rescues()).toEqual(['Dismiss focus']);
    });

    it('moves the screen reader to the previous action when the last one goes', async () => {
      screenReader.mockResolvedValue(true);
      const view = await render(
        <Banner visible actions={[retry(), dismiss()]}>
          Message
        </Banner>
      );
      await settle();

      await press('Dismiss');
      await view.rerender(
        <Banner visible actions={[retry()]}>
          Message
        </Banner>
      );

      expect(rescues()).toEqual(['Retry focus']);
    });

    it('moves the screen reader to the message when no action is left', async () => {
      screenReader.mockResolvedValue(true);
      const view = await render(
        <Banner visible actions={[retry()]}>
          Message
        </Banner>
      );
      await settle();

      await press('Retry');
      await view.rerender(<Banner visible>Message</Banner>);

      expect(rescues()).toEqual(['Message focus']);
    });

    it('leaves focus alone without a screen reader', async () => {
      const view = await render(
        <Banner visible actions={[retry(), dismiss()]}>
          Message
        </Banner>
      );
      await settle();

      await press('Retry');
      await view.rerender(
        <Banner visible actions={[dismiss()]}>
          Message
        </Banner>
      );

      expect(rescues()).toEqual([]);
    });

    it('follows the screen reader being turned on later', async () => {
      const view = await render(
        <Banner visible actions={[retry(), dismiss()]}>
          Message
        </Banner>
      );
      await settle();

      // the last subscription is this banner's, every earlier one is from a
      // banner that is already unmounted
      const listener = jest
        .mocked(AccessibilityInfo.addEventListener)
        .mock.calls.filter(([event]) => event === 'screenReaderChanged')
        .at(-1)?.[1];
      await act(() => {
        listener?.(true);
      });

      await press('Retry');
      await view.rerender(
        <Banner visible actions={[dismiss()]}>
          Message
        </Banner>
      );

      expect(rescues()).toEqual(['Dismiss focus']);
    });

    it('leaves focus alone when the removed action was not pressed', async () => {
      screenReader.mockResolvedValue(true);
      const view = await render(
        <Banner visible actions={[retry(), dismiss()]}>
          Message
        </Banner>
      );
      await settle();

      await view.rerender(
        <Banner visible actions={[dismiss()]}>
          Message
        </Banner>
      );

      expect(rescues()).toEqual([]);
    });

    it('leaves focus alone when the action goes long after the press', async () => {
      screenReader.mockResolvedValue(true);
      const view = await render(
        <Banner visible actions={[retry(), dismiss()]}>
          Message
        </Banner>
      );
      await settle();

      await press('Retry');
      // past the one second a removal still counts as caused by the press
      // (performance.now is faked along with the timers)
      await act(() => {
        jest.advanceTimersByTime(1001);
      });
      await view.rerender(
        <Banner visible actions={[dismiss()]}>
          Message
        </Banner>
      );

      expect(rescues()).toEqual([]);
    });

    it('still moves the screen reader just inside the press window', async () => {
      screenReader.mockResolvedValue(true);
      const view = await render(
        <Banner visible actions={[retry(), dismiss()]}>
          Message
        </Banner>
      );
      await settle();

      await press('Retry');
      // onPress runs at the end of userEvent.press, so this is 999 ms after it
      await act(() => {
        jest.advanceTimersByTime(999);
      });
      await view.rerender(
        <Banner visible actions={[dismiss()]}>
          Message
        </Banner>
      );

      expect(rescues()).toEqual(['Dismiss focus']);
    });

    it('leaves focus alone when the banner hides', async () => {
      screenReader.mockResolvedValue(true);
      const view = await render(
        <Banner visible actions={[retry(), dismiss()]}>
          Message
        </Banner>
      );
      await settle();

      await press('Retry');
      await view.rerender(
        <Banner visible={false} actions={[retry(), dismiss()]}>
          Message
        </Banner>
      );

      expect(rescues()).toEqual([]);
    });

    it('leaves focus alone when the banner comes back without actions', async () => {
      screenReader.mockResolvedValue(true);
      const view = await render(
        <Banner visible actions={[retry(), dismiss()]}>
          Message
        </Banner>
      );
      await settle();

      await press('Retry');
      await view.rerender(
        <Banner visible={false} actions={[retry(), dismiss()]}>
          Message
        </Banner>
      );
      // still inside the press window, so a press kept across the hide
      // would look like the action going and pull the screen reader along
      await view.rerender(
        <Banner visible actions={[]}>
          Message
        </Banner>
      );

      expect(rescues()).toEqual([]);
    });

    it('still calls the consumer onPress', async () => {
      await render(
        <Banner visible actions={[retry()]}>
          Message
        </Banner>
      );

      await press('Retry');

      expect(onPress).toHaveBeenCalledTimes(1);
      // the press event is handed through, not swallowed by the wrapper
      expect(onPress).toHaveBeenCalledWith(
        expect.objectContaining({ nativeEvent: expect.anything() })
      );
    });

    it('stops listening for the screen reader once unmounted', async () => {
      const view = await render(<Banner visible>Message</Banner>);
      const { calls, results } = jest.mocked(
        AccessibilityInfo.addEventListener
      ).mock;
      // the last subscription is this banner's
      const subscription =
        results[
          calls.findLastIndex(([event]) => event === 'screenReaderChanged')
        ]?.value;

      // the preset mock's return type is untyped, so narrow it by hand
      const remove =
        typeof subscription === 'object' &&
        subscription !== null &&
        'remove' in subscription
          ? subscription.remove
          : undefined;

      await view.unmount();

      expect(remove).toHaveBeenCalledTimes(1);
    });
  });

  describe('on web', () => {
    class FakeElement {
      isConnected = true;
      focus = jest.fn();
      // whether this element sits inside the banner's own content
      inBanner: boolean;

      constructor(inBanner = false) {
        this.inBanner = inBanner;
      }
    }

    // just enough of the dom for the hide path, as in useOverlayFocus.test.
    // the banner's own host views stand in for its dom nodes: anything with
    // a contains method counts as an element, and a host View contains
    // exactly the fake elements flagged as inside the banner
    class FakeHTMLElement {
      static [Symbol.hasInstance](value: unknown) {
        return (
          value instanceof FakeElement ||
          (typeof value === 'object' && value !== null && 'contains' in value)
        );
      }
    }

    let activeElement: FakeElement | null = null;

    beforeAll(() => {
      Object.defineProperty(View.prototype, 'contains', {
        configurable: true,
        value: (element: unknown) =>
          element instanceof FakeElement && element.inBanner,
      });
      Object.defineProperty(global, 'HTMLElement', {
        configurable: true,
        value: FakeHTMLElement,
      });
      Object.defineProperty(global, 'document', {
        configurable: true,
        value: {
          get activeElement() {
            return activeElement;
          },
        },
      });
    });

    afterAll(() => {
      delete (global as { document?: unknown }).document;
      delete (global as { HTMLElement?: unknown }).HTMLElement;
      Reflect.deleteProperty(View.prototype, 'contains');
    });

    beforeEach(() => {
      Platform.OS = 'web';
      activeElement = null;
    });

    // Button puts onFocus and onBlur on its outer Surface, not on the
    // pressable that has the button role (that one has pressability's own).
    // so fire on the button's parent: fireEvent walks up from there to the
    // nearest handler, which is the Surface's
    const surfaceOf = (name: string) => {
      const node = screen.getByRole('button', { name }).parent;
      if (!node) {
        throw new Error(`no element above ${name}`);
      }
      return node;
    };

    const focusAction = (name: string) => fireEvent(surfaceOf(name), 'focus');

    // the hosts are shared jest mocks, so spy on the one instance asked for
    const spyFocus = (ref: React.RefObject<HostInstance | null>) => {
      if (!ref.current) {
        throw new Error('action is not mounted');
      }
      return jest.spyOn(ref.current, 'focus');
    };

    it('moves focus to the action now where the removed one was', async () => {
      const view = await render(
        <Banner visible actions={[retry(), dismiss()]}>
          Message
        </Banner>
      );
      const dismissFocus = spyFocus(dismissRef);

      await focusAction('Retry');
      await view.rerender(
        <Banner visible actions={[dismiss()]}>
          Message
        </Banner>
      );

      expect(dismissFocus).toHaveBeenCalledTimes(1);
      // web follows dom focus, never the native screen reader call
      expect(rescues()).toEqual([]);
    });

    it('moves focus to the message when no action is left', async () => {
      const textFocus = jest.spyOn(Text.prototype, 'focus');
      textFocus.mockClear();
      const view = await render(
        <Banner visible actions={[retry()]}>
          Message
        </Banner>
      );

      await focusAction('Retry');
      await view.rerender(<Banner visible>Message</Banner>);

      expect(textFocus.mock.contexts.map(nameOf)).toEqual(['Message']);
      textFocus.mockRestore();
    });

    it('leaves focus alone when no action had it', async () => {
      const view = await render(
        <Banner visible actions={[retry(), dismiss()]}>
          Message
        </Banner>
      );
      const dismissFocus = spyFocus(dismissRef);

      // a press alone is not keyboard focus
      await press('Retry');
      await view.rerender(
        <Banner visible actions={[dismiss()]}>
          Message
        </Banner>
      );

      expect(dismissFocus).not.toHaveBeenCalled();
    });

    it('leaves focus alone once the action lost it', async () => {
      const view = await render(
        <Banner visible actions={[retry(), dismiss()]}>
          Message
        </Banner>
      );
      const dismissFocus = spyFocus(dismissRef);

      await focusAction('Retry');
      await fireEvent(surfaceOf('Retry'), 'blur');
      await view.rerender(
        <Banner visible actions={[dismiss()]}>
          Message
        </Banner>
      );

      expect(dismissFocus).not.toHaveBeenCalled();
    });

    it('leaves focus alone when the banner comes back without actions', async () => {
      const textFocus = jest.spyOn(Text.prototype, 'focus');
      textFocus.mockClear();
      const view = await render(
        <Banner visible actions={[retry(), dismiss()]}>
          Message
        </Banner>
      );

      await focusAction('Retry');
      await view.rerender(
        <Banner visible={false} actions={[retry(), dismiss()]}>
          Message
        </Banner>
      );
      // a focus kept across the hide would look like the action going and
      // pull focus to the message
      await view.rerender(
        <Banner visible actions={[]}>
          Message
        </Banner>
      );

      expect(textFocus.mock.contexts.map(nameOf)).toEqual([]);
      expect(rescues()).toEqual([]);
      textFocus.mockRestore();
    });

    it('gives focus back to where it was before the banner showed', async () => {
      const opener = new FakeElement();
      activeElement = opener;
      const view = await render(
        <Banner visible={false} actions={[retry()]}>
          Message
        </Banner>
      );
      await view.rerender(
        <Banner visible actions={[retry()]}>
          Message
        </Banner>
      );

      await focusAction('Retry');
      // the dom side of that focus, which is what the hide reads
      activeElement = new FakeElement(true);
      await view.rerender(
        <Banner visible={false} actions={[retry()]}>
          Message
        </Banner>
      );

      expect(opener.focus).toHaveBeenCalledTimes(1);
    });

    it('leaves focus alone on hide when it is not in the banner', async () => {
      const opener = new FakeElement();
      activeElement = opener;
      const view = await render(
        <Banner visible={false} actions={[retry()]}>
          Message
        </Banner>
      );
      await view.rerender(
        <Banner visible actions={[retry()]}>
          Message
        </Banner>
      );

      // focus never went into the banner, so whatever has it keeps it
      await view.rerender(
        <Banner visible={false} actions={[retry()]}>
          Message
        </Banner>
      );

      expect(opener.focus).not.toHaveBeenCalled();
    });

    it('gives focus back on hide after a rescue moved it to the message', async () => {
      const opener = new FakeElement();
      activeElement = opener;
      const view = await render(
        <Banner visible={false} actions={[retry()]}>
          Retrying
        </Banner>
      );
      await view.rerender(
        <Banner visible actions={[retry()]}>
          Retrying
        </Banner>
      );

      // the last action goes, so focus is rescued to the message, which no
      // action tracker knows about
      await focusAction('Retry');
      await view.rerender(<Banner visible>Retrying</Banner>);
      activeElement = new FakeElement(true);

      await view.rerender(<Banner visible={false}>Retrying</Banner>);

      expect(opener.focus).toHaveBeenCalledTimes(1);
    });

    it('does not remember an element inside the banner as the one to go back to', async () => {
      // a re-show while focus is still inside, such as mid-hide
      const inside = new FakeElement(true);
      activeElement = inside;
      const view = await render(
        <Banner visible={false} actions={[retry()]}>
          Message
        </Banner>
      );
      await view.rerender(
        <Banner visible actions={[retry()]}>
          Message
        </Banner>
      );

      await view.rerender(
        <Banner visible={false} actions={[retry()]}>
          Message
        </Banner>
      );

      // giving focus back to it would put it into the now inert content
      expect(inside.focus).not.toHaveBeenCalled();
    });

    it('gives focus back to the element that had it when the banner showed', async () => {
      const opener = new FakeElement();
      const elsewhere = new FakeElement();
      activeElement = opener;
      const view = await render(<Banner visible={false}>First</Banner>);
      await view.rerender(<Banner visible>First</Banner>);

      // the user moves on, and the banner re-renders while still visible
      activeElement = elsewhere;
      await view.rerender(<Banner visible>Second</Banner>);
      activeElement = new FakeElement(true);

      await view.rerender(<Banner visible={false}>Second</Banner>);

      expect(opener.focus).toHaveBeenCalledTimes(1);
      expect(elsewhere.focus).not.toHaveBeenCalled();
    });

    it('does not give focus back to an element that left the document', async () => {
      const opener = new FakeElement();
      activeElement = opener;
      const view = await render(
        <Banner visible actions={[retry()]}>
          Message
        </Banner>
      );

      await focusAction('Retry');
      activeElement = new FakeElement(true);
      opener.isConnected = false;
      await view.rerender(
        <Banner visible={false} actions={[retry()]}>
          Message
        </Banner>
      );

      expect(opener.focus).not.toHaveBeenCalled();
    });

    it('still calls the consumer onFocus and onBlur', async () => {
      const onFocus = jest.fn();
      const onBlur = jest.fn();
      await render(
        <Banner visible actions={[{ ...retry(), onFocus, onBlur }]}>
          Message
        </Banner>
      );

      await focusAction('Retry');
      await fireEvent(surfaceOf('Retry'), 'blur');

      expect(onFocus).toHaveBeenCalledTimes(1);
      expect(onBlur).toHaveBeenCalledTimes(1);
    });
  });
});

describe('animations', () => {
  let showCallback: (() => void) | undefined,
    hideCallback: (() => void) | undefined;

  beforeEach(() => {
    showCallback = jest.fn();
    hideCallback = jest.fn();
  });

  afterAll(() => {
    showCallback = undefined;
    hideCallback = undefined;
  });

  describe('when component is rendered hidden', () => {
    it('will not fire any callback on mount', async () => {
      await render(
        <Banner
          onShowAnimationFinished={showCallback}
          onHideAnimationFinished={hideCallback}
          visible={false}
        >
          Text
        </Banner>
      );

      expect(showCallback).not.toHaveBeenCalled();
      expect(hideCallback).not.toHaveBeenCalled();

      await act(() => {
        jest.runAllTimers();
      });
      expect(showCallback).not.toHaveBeenCalled();
      expect(hideCallback).not.toHaveBeenCalled();
    });

    it('should fire onShowAnimationFinished upon opening', async () => {
      const view = await render(
        <Banner
          onShowAnimationFinished={showCallback}
          onHideAnimationFinished={hideCallback}
          visible={false}
        >
          Text
        </Banner>
      );

      await act(() => {
        jest.runAllTimers();
      });
      expect(showCallback).toHaveBeenCalledTimes(0);
      expect(hideCallback).toHaveBeenCalledTimes(0);

      await view.rerender(
        <Banner
          onShowAnimationFinished={showCallback}
          onHideAnimationFinished={hideCallback}
          visible
        >
          Text
        </Banner>
      );
      await act(() => {
        jest.runAllTimers();
      });
      expect(showCallback).toHaveBeenCalledTimes(1);
      expect(hideCallback).toHaveBeenCalledTimes(0);
    });
  });

  describe('when component is rendered visible', () => {
    it('will not fire any callback on mount', async () => {
      await render(
        <Banner
          onShowAnimationFinished={showCallback}
          onHideAnimationFinished={hideCallback}
          visible
        >
          Text
        </Banner>
      );

      expect(showCallback).not.toHaveBeenCalled();
      expect(hideCallback).not.toHaveBeenCalled();

      await act(() => {
        jest.runAllTimers();
      });
      expect(showCallback).not.toHaveBeenCalled();
      expect(hideCallback).not.toHaveBeenCalled();
    });

    it('should fire onHideAnimationFinished upon closing', async () => {
      const view = await render(
        <Banner
          onShowAnimationFinished={showCallback}
          onHideAnimationFinished={hideCallback}
          visible
        >
          Text
        </Banner>
      );

      await act(() => {
        jest.runAllTimers();
      });
      expect(showCallback).toHaveBeenCalledTimes(0);
      expect(hideCallback).toHaveBeenCalledTimes(0);

      await view.rerender(
        <Banner
          onShowAnimationFinished={showCallback}
          onHideAnimationFinished={hideCallback}
          visible={false}
        >
          Text
        </Banner>
      );
      await act(() => {
        jest.runAllTimers();
      });
      expect(showCallback).toHaveBeenCalledTimes(0);
      expect(hideCallback).toHaveBeenCalledTimes(1);
    });
  });

  describe('when the callbacks change while the component is mounted', () => {
    it('should not cause another open/close animation', async () => {
      const view = await render(
        <Banner
          onShowAnimationFinished={showCallback}
          onHideAnimationFinished={hideCallback}
          visible
        >
          Text
        </Banner>
      );

      await act(() => {
        jest.runAllTimers();
      });
      expect(showCallback).toHaveBeenCalledTimes(0);
      expect(hideCallback).toHaveBeenCalledTimes(0);

      const nextShowCallback = jest.fn();
      const nextHideCallback = jest.fn();

      await view.rerender(
        <Banner
          onShowAnimationFinished={nextShowCallback}
          onHideAnimationFinished={nextHideCallback}
          visible
        >
          Text
        </Banner>
      );

      await act(() => {
        jest.runAllTimers();
      });
      expect(showCallback).toHaveBeenCalledTimes(0);
      expect(hideCallback).toHaveBeenCalledTimes(0);
      expect(nextShowCallback).toHaveBeenCalledTimes(0);
      expect(nextHideCallback).toHaveBeenCalledTimes(0);
    });

    it('should use the new callbacks upon opening/closing', async () => {
      const view = await render(
        <Banner
          onShowAnimationFinished={showCallback}
          onHideAnimationFinished={hideCallback}
          visible
        >
          Text
        </Banner>
      );

      await act(() => {
        jest.runAllTimers();
      });
      expect(showCallback).toHaveBeenCalledTimes(0);
      expect(hideCallback).toHaveBeenCalledTimes(0);

      const nextShowCallback = jest.fn();
      const nextHideCallback = jest.fn();

      await view.rerender(
        <Banner
          onShowAnimationFinished={nextShowCallback}
          onHideAnimationFinished={nextHideCallback}
          visible
        >
          Text
        </Banner>
      );

      await act(() => {
        jest.runAllTimers();
      });
      expect(showCallback).toHaveBeenCalledTimes(0);
      expect(hideCallback).toHaveBeenCalledTimes(0);
      expect(nextShowCallback).toHaveBeenCalledTimes(0);
      expect(nextHideCallback).toHaveBeenCalledTimes(0);

      await view.rerender(
        <Banner
          onShowAnimationFinished={nextShowCallback}
          onHideAnimationFinished={nextHideCallback}
          visible={false}
        >
          Text
        </Banner>
      );

      await act(() => {
        jest.runAllTimers();
      });
      expect(showCallback).toHaveBeenCalledTimes(0);
      expect(hideCallback).toHaveBeenCalledTimes(0);
      expect(nextShowCallback).toHaveBeenCalledTimes(0);
      expect(nextHideCallback).toHaveBeenCalledTimes(1);
    });
  });

  describe('with reduce motion', () => {
    it.each([
      { reduceMotion: 'off', show: 250, hide: 200 },
      { reduceMotion: 'on', show: 0, hide: 0 },
    ] as const)(
      'should open in $show ms and close in $hide ms when reduceMotion is "$reduceMotion"',
      async ({ reduceMotion, show, hide }) => {
        const withTiming = jest.mocked(Reanimated.withTiming);
        const makeBanner = (visible: boolean) => (
          <PaperProvider reduceMotion={reduceMotion}>
            <Banner visible={visible}>Text</Banner>
          </PaperProvider>
        );

        const view = await render(makeBanner(false));
        withTiming.mockClear();

        await view.rerender(makeBanner(true));
        await view.rerender(makeBanner(false));

        expect(
          withTiming.mock.calls.map(([, config]) => config?.duration)
        ).toEqual([show, hide]);
      }
    );

    it.each([
      { state: 'visible', visible: true },
      { state: 'hidden', visible: false },
    ])(
      'should not call the callbacks of a $state banner again when the OS setting changes',
      async ({ visible }) => {
        const addEventListener = jest.mocked(
          AccessibilityInfo.addEventListener
        );
        const reduceMotionListeners = () =>
          addEventListener.mock.calls
            .filter(([eventName]) => eventName === 'reduceMotionChanged')
            .map(([, listener]) => listener);
        addEventListener.mockClear();

        const makeBanner = (isVisible: boolean) => (
          <PaperProvider>
            <Banner
              onShowAnimationFinished={showCallback}
              onHideAnimationFinished={hideCallback}
              visible={isVisible}
            >
              Text
            </Banner>
          </PaperProvider>
        );

        // the callbacks don't fire on mount, so get to the state through a
        // real transition that fires one of them
        const view = await render(makeBanner(!visible));
        await view.rerender(makeBanner(visible));
        await act(() => {
          jest.runAllTimers();
        });
        expect(showCallback).toHaveBeenCalledTimes(visible ? 1 : 0);
        expect(hideCallback).toHaveBeenCalledTimes(visible ? 0 : 1);
        expect(reduceMotionListeners()).not.toHaveLength(0);

        for (const enabled of [true, false]) {
          await act(() => {
            reduceMotionListeners().forEach((listener) => listener(enabled));
          });
          await act(() => {
            jest.runAllTimers();
          });
        }

        expect(showCallback).toHaveBeenCalledTimes(visible ? 1 : 0);
        expect(hideCallback).toHaveBeenCalledTimes(visible ? 0 : 1);
      }
    );
  });
});

describe('interrupted animations', () => {
  // reanimated's timing runs against the fake timers under jest, and a new
  // animation started on the same shared value cancels the running one, which
  // reports through the very same callback with finished:false. that is what
  // drives the negative path here: without Banner's finished check, every
  // test below calls the consumer callback it says must stay silent.
  it('does not fire onHideAnimationFinished when hide is interrupted', async () => {
    const onHideAnimationFinished = jest.fn();
    const onShowAnimationFinished = jest.fn();

    const view = await render(
      <Banner
        visible
        onShowAnimationFinished={onShowAnimationFinished}
        onHideAnimationFinished={onHideAnimationFinished}
      >
        Text
      </Banner>
    );
    await act(() => {
      jest.runAllTimers();
    });

    // start hiding...
    await view.rerender(
      <Banner
        visible={false}
        onShowAnimationFinished={onShowAnimationFinished}
        onHideAnimationFinished={onHideAnimationFinished}
      >
        Text
      </Banner>
    );

    // ...and re-show while the hide animation is still running
    await view.rerender(
      <Banner
        visible
        onShowAnimationFinished={onShowAnimationFinished}
        onHideAnimationFinished={onHideAnimationFinished}
      >
        Text
      </Banner>
    );
    await act(() => {
      jest.runAllTimers();
    });

    expect(onHideAnimationFinished).not.toHaveBeenCalled();
    // the show that took over does finish, exactly once
    expect(onShowAnimationFinished).toHaveBeenCalledTimes(1);
    // the interrupted hide must also not unmount the content coming back in
    expect(screen.getByText('Text')).toBeOnTheScreen();
  });

  it('does not fire onShowAnimationFinished when show is interrupted', async () => {
    const onHideAnimationFinished = jest.fn();
    const onShowAnimationFinished = jest.fn();

    const view = await render(
      <Banner
        visible
        onShowAnimationFinished={onShowAnimationFinished}
        onHideAnimationFinished={onHideAnimationFinished}
      >
        Text
      </Banner>
    );
    await act(() => {
      jest.runAllTimers();
    });

    // let one full show/hide cycle complete, so the next show really runs
    await view.rerender(
      <Banner
        visible={false}
        onShowAnimationFinished={onShowAnimationFinished}
        onHideAnimationFinished={onHideAnimationFinished}
      >
        Text
      </Banner>
    );
    await act(() => {
      jest.runAllTimers();
    });
    onShowAnimationFinished.mockClear();
    onHideAnimationFinished.mockClear();

    // start showing...
    await view.rerender(
      <Banner
        visible
        onShowAnimationFinished={onShowAnimationFinished}
        onHideAnimationFinished={onHideAnimationFinished}
      >
        Text
      </Banner>
    );

    // ...and hide again while the show animation is still running
    await view.rerender(
      <Banner
        visible={false}
        onShowAnimationFinished={onShowAnimationFinished}
        onHideAnimationFinished={onHideAnimationFinished}
      >
        Text
      </Banner>
    );
    await act(() => {
      jest.runAllTimers();
    });

    expect(onShowAnimationFinished).not.toHaveBeenCalled();
    // the hide that took over does finish, exactly once
    expect(onHideAnimationFinished).toHaveBeenCalledTimes(1);
  });
});
