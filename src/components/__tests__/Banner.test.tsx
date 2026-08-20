import * as React from 'react';
import {
  AccessibilityInfo,
  Animated,
  Image,
  Platform,
  Text,
  View,
} from 'react-native';

import {
  afterAll,
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  jest,
} from '@jest/globals';
import { act } from '@testing-library/react-native';

import { fireEvent, render, screen, within } from '../../test-utils';
import Banner from '../Banner';

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

  it('exposes the content while visible', async () => {
    await render(
      <Banner visible actions={ACTIONS} testID="banner">
        Message
      </Banner>
    );
    await act(() => {
      jest.runAllTimers();
    });

    expect(screen.getByText('Message')).toBeOnTheScreen();
    expect(screen.getByText('Fix it')).toBeOnTheScreen();
    expect(screen.getByTestId('banner-content')).toHaveProp(
      'aria-hidden',
      false
    );
    expect(screen.getByTestId('banner-content')).toHaveProp(
      'pointerEvents',
      'auto'
    );
  });

  it('keeps the content inert while the hide animation is running', async () => {
    const view = await render(
      <Banner visible actions={ACTIONS} testID="banner">
        Message
      </Banner>
    );
    await act(() => {
      jest.runAllTimers();
    });

    await view.rerender(
      <Banner visible={false} actions={ACTIONS} testID="banner">
        Message
      </Banner>
    );

    // animation still in flight, so the content is mounted but must be dead
    const content = screen.getByTestId('banner-content', ALL);
    expect(content).toHaveProp('aria-hidden', true);
    expect(content).toHaveProp('pointerEvents', 'none');
    expect(content).toHaveProp('inert', true);

    // and already unreachable through a11y-aware queries
    expect(screen.queryByText('Message')).toBeNull();
    expect(screen.queryByText('Fix it')).toBeNull();
  });

  it('unmounts the content once the hide animation finishes', async () => {
    const view = await render(
      <Banner visible actions={ACTIONS} testID="banner">
        Message
      </Banner>
    );
    await act(() => {
      jest.runAllTimers();
    });

    await view.rerender(
      <Banner visible={false} actions={ACTIONS} testID="banner">
        Message
      </Banner>
    );
    await act(() => {
      jest.runAllTimers();
    });

    // ALL, so null means genuinely gone rather than merely hidden
    expect(screen.queryByText('Message', ALL)).toBeNull();
    expect(screen.queryByText('Fix it', ALL)).toBeNull();
    expect(screen.queryByTestId('banner-content', ALL)).toBeNull();
  });

  it('measures once then unmounts the content when mounted hidden', async () => {
    await render(
      <Banner visible={false} actions={ACTIONS} testID="banner">
        Message
      </Banner>
    );

    // the measuring pass must not be reachable either
    const content = screen.getByTestId('banner-content', ALL);
    expect(content).toHaveProp('aria-hidden', true);
    expect(screen.queryByText('Message')).toBeNull();

    await fireEvent(content, 'layout', {
      nativeEvent: { layout: { height: 80, width: 320 } },
    });

    expect(screen.queryByTestId('banner-content', ALL)).toBeNull();
  });

  it('keeps the content mounted when the hide animation is interrupted', async () => {
    // a hide interrupted by a re-show reports finished:false; acting on it
    // would unmount the content while the banner is on its way back in
    let hideDone: ((result: { finished: boolean }) => void) | undefined;
    const timing = jest
      .spyOn(Animated, 'timing')
      .mockImplementation((_value, config) => {
        return {
          start: (cb) => {
            if (config.toValue === 0) {
              hideDone = cb;
            }
          },
          stop: () => {},
          reset: () => {},
        };
      });

    const view = await render(
      <Banner visible actions={ACTIONS} testID="banner">
        Message
      </Banner>
    );

    await view.rerender(
      <Banner visible={false} actions={ACTIONS} testID="banner">
        Message
      </Banner>
    );
    // banner comes back before the hide finishes
    await view.rerender(
      <Banner visible actions={ACTIONS} testID="banner">
        Message
      </Banner>
    );

    await act(() => {
      hideDone?.({ finished: false });
    });

    expect(screen.getByTestId('banner-content', ALL)).toBeTruthy();
    expect(screen.getByText('Message')).toBeOnTheScreen();

    timing.mockRestore();
  });

  it('remounts the content when shown again', async () => {
    const view = await render(
      <Banner visible={false} actions={ACTIONS} testID="banner">
        Message
      </Banner>
    );
    await act(() => {
      jest.runAllTimers();
    });

    await view.rerender(
      <Banner visible actions={ACTIONS} testID="banner">
        Message
      </Banner>
    );
    await act(() => {
      jest.runAllTimers();
    });

    expect(screen.getByText('Message')).toBeOnTheScreen();
    expect(screen.getByTestId('banner-content')).toHaveProp(
      'aria-hidden',
      false
    );
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

    expect(screen.getByText('first')).toBeOnTheScreen();
    expect(screen.getByText('second')).toBeOnTheScreen();
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

    expect(screen.getByText('first')).toBeOnTheScreen();
    expect(screen.getByText('second')).toBeOnTheScreen();
    expect(screen.queryByText('third')).toBeNull();
  });

  it('keeps a touchableRef passed through an action', async () => {
    const setFocus = jest
      .spyOn(AccessibilityInfo, 'setAccessibilityFocus')
      .mockImplementation(() => {});
    setFocus.mockClear();
    const touchableRef = React.createRef<View>();

    const view = await render(
      <Banner
        visible
        actions={[
          {
            label: 'first',
            onPress: () => {},
            testID: 'action-first',
            touchableRef,
          },
        ]}
      >
        Message
      </Banner>
    );

    // the consumer gets the node, and the internal ref still restores focus
    expect(touchableRef.current).not.toBeNull();

    await fireEvent(screen.getByTestId('action-first-container'), 'focus');
    await view.rerender(
      <Banner visible actions={[]}>
        Message
      </Banner>
    );

    expect(setFocus).toHaveBeenCalledTimes(1);
    setFocus.mockRestore();
  });

  it('moves focus to a surviving action when the focused one disappears', async () => {
    const setFocus = jest
      .spyOn(AccessibilityInfo, 'setAccessibilityFocus')
      .mockImplementation(() => {});
    setFocus.mockClear();

    const view = await render(
      <Banner
        visible
        actions={[
          { label: 'first', onPress: () => {}, testID: 'action-first' },
          { label: 'second', onPress: () => {}, testID: 'action-second' },
        ]}
      >
        Message
      </Banner>
    );

    await fireEvent(screen.getByTestId('action-second-container'), 'focus');
    expect(setFocus).not.toHaveBeenCalled();

    await view.rerender(
      <Banner
        visible
        actions={[
          { label: 'first', onPress: () => {}, testID: 'action-first' },
        ]}
      >
        Message
      </Banner>
    );

    expect(setFocus).toHaveBeenCalledTimes(1);
    setFocus.mockRestore();
  });

  it('leaves focus alone when the focused action survives a shrink', async () => {
    const setFocus = jest
      .spyOn(AccessibilityInfo, 'setAccessibilityFocus')
      .mockImplementation(() => {});
    setFocus.mockClear();

    const view = await render(
      <Banner
        visible
        actions={[
          { label: 'first', onPress: () => {}, testID: 'action-first' },
          { label: 'second', onPress: () => {}, testID: 'action-second' },
        ]}
      >
        Message
      </Banner>
    );

    // focus the first action, then drop the second: the count changes, so the
    // effect runs, but the focused index is still valid and must be left alone
    await fireEvent(screen.getByTestId('action-first-container'), 'focus');
    await view.rerender(
      <Banner
        visible
        actions={[
          { label: 'first', onPress: () => {}, testID: 'action-first' },
        ]}
      >
        Message
      </Banner>
    );

    expect(screen.getByText('first')).toBeOnTheScreen();
    expect(setFocus).not.toHaveBeenCalled();
    setFocus.mockRestore();
  });

  it('does not move focus into the banner once it starts hiding', async () => {
    // the content is inert from the moment it hides, so focusing it would be
    // worse than releasing focus. returning focus to wherever it came from
    // needs an api the consumer owns
    const setFocus = jest
      .spyOn(AccessibilityInfo, 'setAccessibilityFocus')
      .mockImplementation(() => {});
    setFocus.mockClear();

    const view = await render(
      <Banner
        visible
        actions={[
          { label: 'first', onPress: () => {}, testID: 'action-first' },
        ]}
      >
        Message
      </Banner>
    );

    await fireEvent(screen.getByTestId('action-first-container'), 'focus');

    await view.rerender(
      <Banner
        visible={false}
        actions={[
          { label: 'first', onPress: () => {}, testID: 'action-first' },
        ]}
      >
        Message
      </Banner>
    );

    expect(setFocus).not.toHaveBeenCalled();
    setFocus.mockRestore();
  });

  it('moves focus off the last action when every action is removed', async () => {
    const setFocus = jest
      .spyOn(AccessibilityInfo, 'setAccessibilityFocus')
      .mockImplementation(() => {});
    setFocus.mockClear();

    const view = await render(
      <Banner
        visible
        actions={[
          { label: 'first', onPress: () => {}, testID: 'action-first' },
        ]}
      >
        Message
      </Banner>
    );

    await fireEvent(screen.getByTestId('action-first-container'), 'focus');

    await view.rerender(
      <Banner visible actions={[]} testID="banner">
        Message
      </Banner>
    );

    // nothing left to focus inside the actions, so land on the message
    expect(setFocus).toHaveBeenCalledTimes(1);
    setFocus.mockRestore();
  });

  it('still calls a consumer onFocus handler on an action', async () => {
    const onFocus = jest.fn();

    await render(
      <Banner
        visible
        actions={[
          {
            label: 'first',
            onPress: () => {},
            onFocus,
            testID: 'action-first',
          },
        ]}
      >
        Message
      </Banner>
    );

    await fireEvent(screen.getByTestId('action-first-container'), 'focus');

    expect(onFocus).toHaveBeenCalledTimes(1);
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

  const announcerHas = (text: string) =>
    within(screen.getByTestId('banner-announcer', ALL)).queryByText(text) !==
    null;

  it('is a polite status region by default', async () => {
    await render(
      <Banner visible testID="banner">
        Message
      </Banner>
    );

    const region = screen.getByTestId('banner-announcer');
    expect(region).toHaveProp('role', 'status');
    expect(region).toHaveProp('aria-live', 'polite');
  });

  it('is an assertive alert region when urgent', async () => {
    await render(
      <Banner visible urgent testID="banner">
        Message
      </Banner>
    );

    const region = screen.getByTestId('banner-announcer');
    expect(region).toHaveProp('role', 'alert');
    expect(region).toHaveProp('aria-live', 'assertive');
  });

  it('stays mounted and empty while the banner is hidden', async () => {
    await render(
      <Banner visible={false} testID="banner">
        Message
      </Banner>
    );
    await flush();

    expect(screen.getByTestId('banner-announcer', ALL)).toBeOnTheScreen();
    expect(announcerHas('Message')).toBe(false);
  });

  it('announces again every time the banner is shown', async () => {
    const view = await render(
      <Banner visible testID="banner">
        Message
      </Banner>
    );
    await flush();
    expect(announcerHas('Message')).toBe(true);

    await view.rerender(
      <Banner visible={false} testID="banner">
        Message
      </Banner>
    );
    // finish the hide so the content really unmounts, which the bug needed
    await act(() => {
      jest.runAllTimers();
    });
    expect(screen.queryByTestId('banner-content', ALL)).toBeNull();
    expect(announcerHas('Message')).toBe(false);

    await view.rerender(
      <Banner visible testID="banner">
        Message
      </Banner>
    );
    await flush();
    expect(announcerHas('Message')).toBe(true);
  });

  it('announces an unchanged message again on every show', async () => {
    const view = await render(
      <Banner visible={false} testID="banner">
        Same text
      </Banner>
    );

    for (let i = 0; i < 2; i++) {
      await view.rerender(
        <Banner visible testID="banner">
          Same text
        </Banner>
      );
      await flush();
      expect(announcerHas('Same text')).toBe(true);

      await view.rerender(
        <Banner visible={false} testID="banner">
          Same text
        </Banner>
      );
      await act(() => {
        jest.runAllTimers();
      });
      expect(announcerHas('Same text')).toBe(false);
    }
  });

  it('re-announces when the message changes while visible', async () => {
    const view = await render(
      <Banner visible testID="banner">
        First
      </Banner>
    );
    await flush();
    expect(announcerHas('First')).toBe(true);

    await view.rerender(
      <Banner visible testID="banner">
        Second
      </Banner>
    );
    await flush();
    expect(announcerHas('Second')).toBe(true);
  });

  it('re-announces when urgency changes while visible', async () => {
    const view = await render(
      <Banner visible testID="banner">
        Message
      </Banner>
    );
    await act(() => {
      jest.runAllTimers();
    });
    expect(announcerHas('Message')).toBe(false);

    await view.rerender(
      <Banner visible urgent testID="banner">
        Message
      </Banner>
    );
    await flush();

    expect(screen.getByTestId('banner-announcer')).toHaveProp('role', 'alert');
    expect(announcerHas('Message')).toBe(true);
  });

  it('announces text nested inside elements', async () => {
    await render(
      <Banner visible testID="banner">
        Your card <Text>ending 4242</Text> was declined
      </Banner>
    );
    await flush();

    expect(announcerHas('Your card ending 4242 was declined')).toBe(true);
  });

  it('drops the text again so it is not a second copy of the message', async () => {
    await render(
      <Banner visible testID="banner">
        Message
      </Banner>
    );
    await act(() => {
      jest.runAllTimers();
    });

    expect(announcerHas('Message')).toBe(false);
    expect(
      within(screen.getByTestId('banner-message')).getByText('Message')
    ).toBeOnTheScreen();
  });

  it('carries the message only, so action labels never re-announce it', async () => {
    // status/alert imply aria-atomic, so anything inside the region is
    // re-announced whenever it changes - keep the buttons out of it
    await render(
      <Banner
        visible
        testID="banner"
        actions={[{ label: 'Fix it', onPress: () => {} }]}
      >
        Message
      </Banner>
    );
    await flush();

    const region = screen.getByTestId('banner-announcer');
    expect(within(region).getByText('Message')).toBeOnTheScreen();
    expect(within(region).queryByText('Fix it')).toBeNull();
  });

  it('leaves the region off the message and its text', async () => {
    // the message is a focus target now, not a region
    await render(
      <Banner visible testID="banner">
        Message
      </Banner>
    );

    const container = screen.getByTestId('banner-message');
    expect(container).not.toHaveProp('aria-live');
    expect(container).not.toHaveProp('role');

    const text = within(container).getByText('Message');
    expect(text).not.toHaveProp('aria-live');
    expect(text).not.toHaveProp('role');
  });

  it('is left out on ios, which announces by hand instead', async () => {
    Platform.OS = 'ios';

    await render(
      <Banner visible testID="banner">
        Message
      </Banner>
    );

    expect(screen.queryByTestId('banner-announcer', ALL)).toBeNull();
  });
});

describe('icon', () => {
  it('hides a decorative icon from screen readers', async () => {
    // an unlabelled icon reads as a bare "image"
    await render(
      <Banner visible icon="camera" testID="banner">
        Message
      </Banner>
    );

    expect(screen.queryByTestId('banner-icon')).toBeNull();
    expect(
      screen.getByTestId('banner-icon', { includeHiddenElements: true })
    ).toHaveProp('aria-hidden', true);
  });

  it('exposes the icon when it is given a label', async () => {
    await render(
      <Banner
        visible
        icon="camera"
        iconAccessibilityLabel="Payment failed"
        testID="banner"
      >
        Message
      </Banner>
    );

    const wrapper = screen.getByTestId('banner-icon');
    expect(wrapper).toHaveProp('aria-hidden', false);
    expect(wrapper).toHaveProp('accessible', true);
    expect(wrapper).toHaveProp('aria-label', 'Payment failed');
  });
});

describe('message focus', () => {
  const originalPlatform = Platform.OS;

  afterEach(() => {
    Platform.OS = originalPlatform;
  });

  it('makes the message focusable on web', async () => {
    Platform.OS = 'web';

    await render(
      <Banner visible testID="banner">
        Message
      </Banner>
    );

    expect(screen.getByTestId('banner-message')).toHaveProp('tabIndex', -1);
  });

  it('makes the message an accessibility element on native', async () => {
    Platform.OS = 'ios';

    await render(
      <Banner visible testID="banner">
        Message
      </Banner>
    );

    expect(screen.getByTestId('banner-message')).toHaveProp('accessible', true);
  });

  it('does not reach for a native handle on web', async () => {
    // rnw's findNodeHandle throws, and calling it took the whole tree down
    Platform.OS = 'web';
    const setFocus = jest
      .spyOn(AccessibilityInfo, 'setAccessibilityFocus')
      .mockImplementation(() => {});
    setFocus.mockClear();

    const view = await render(
      <Banner
        visible
        testID="banner"
        actions={[
          { label: 'first', onPress: () => {}, testID: 'action-first' },
        ]}
      >
        Message
      </Banner>
    );

    await fireEvent(screen.getByTestId('action-first-container'), 'focus');

    await view.rerender(
      <Banner visible actions={[]} testID="banner">
        Message
      </Banner>
    );

    expect(setFocus).not.toHaveBeenCalled();
    expect(screen.getByTestId('banner-message')).toBeOnTheScreen();
    setFocus.mockRestore();
  });
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

  it('announces on ios when mounted visible', async () => {
    await render(<Banner visible>Something went wrong</Banner>);

    expect(announce).toHaveBeenCalledTimes(1);
    // polite by default: queue behind whatever the screen reader is saying
    expect(announce).toHaveBeenCalledWith('Something went wrong', {
      queue: true,
    });
  });

  it('does not announce on ios while hidden', async () => {
    const view = await render(<Banner visible={false}>Quiet</Banner>);

    expect(announce).not.toHaveBeenCalled();

    await view.rerender(<Banner visible>Quiet</Banner>);
    expect(announce).toHaveBeenCalledTimes(1);
    expect(announce).toHaveBeenCalledWith('Quiet', { queue: true });
  });

  it('re-announces on ios when the message changes while visible', async () => {
    const view = await render(<Banner visible>First</Banner>);
    expect(announce).toHaveBeenCalledTimes(1);

    await view.rerender(<Banner visible>Second</Banner>);

    expect(announce).toHaveBeenCalledTimes(2);
    expect(announce).toHaveBeenLastCalledWith('Second', { queue: true });
  });

  it('does not announce again when an unrelated prop changes', async () => {
    const view = await render(<Banner visible>Same</Banner>);
    expect(announce).toHaveBeenCalledTimes(1);

    await view.rerender(
      <Banner visible elevation={3}>
        Same
      </Banner>
    );

    expect(announce).toHaveBeenCalledTimes(1);
  });

  it('interrupts the screen reader on ios when urgent', async () => {
    await render(
      <Banner visible urgent>
        Your payment failed
      </Banner>
    );

    expect(announce).toHaveBeenCalledWith('Your payment failed', {
      queue: false,
    });
  });

  it('re-announces on ios when urgency changes while visible', async () => {
    const view = await render(<Banner visible>Same message</Banner>);
    expect(announce).toHaveBeenCalledTimes(1);

    await view.rerender(
      <Banner visible urgent>
        Same message
      </Banner>
    );

    expect(announce).toHaveBeenCalledTimes(2);
    expect(announce).toHaveBeenLastCalledWith('Same message', {
      queue: false,
    });
  });

  it('announces children that are not a plain string', async () => {
    const name = 'Ada';
    await render(<Banner visible>Hello {name}, your card was declined</Banner>);

    expect(announce).toHaveBeenCalledWith('Hello Ada, your card was declined', {
      queue: true,
    });
  });

  it('leaves announcing to the live region off ios', async () => {
    Platform.OS = 'android';

    await render(<Banner visible>Handled by the live region</Banner>);

    expect(announce).not.toHaveBeenCalled();
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

  it('should not fire callbacks when only the theme animation scale changes', async () => {
    const view = await render(
      <Banner
        onShowAnimationFinished={showCallback}
        onHideAnimationFinished={hideCallback}
        theme={{ animation: { scale: 1 } }}
        visible
      >
        Text
      </Banner>
    );

    await act(() => {
      jest.runAllTimers();
    });

    await view.rerender(
      <Banner
        onShowAnimationFinished={showCallback}
        onHideAnimationFinished={hideCallback}
        theme={{ animation: { scale: 2 } }}
        visible
      >
        Text
      </Banner>
    );
    await act(() => {
      jest.runAllTimers();
    });

    expect(showCallback).not.toHaveBeenCalled();
    expect(hideCallback).not.toHaveBeenCalled();
  });

  it('animated value changes correctly', async () => {
    const value = new Animated.Value(1);
    await render(
      <Banner
        visible
        testID="banner"
        style={[{ transform: [{ scale: value }] }]}
      >
        Banner
      </Banner>
    );
    expect(screen.getByTestId('banner-outer-layer')).toHaveStyle({
      transform: [{ scale: 1 }],
    });

    Animated.timing(value, {
      toValue: 1.5,
      useNativeDriver: false,
      duration: 200,
    }).start();

    await act(() => {
      jest.runAllTimers();
    });

    expect(screen.getByTestId('banner-outer-layer')).toHaveStyle({
      transform: [{ scale: 1.5 }],
    });
  });
});

describe('interrupted animations', () => {
  let showDone: ((result: { finished: boolean }) => void) | undefined;
  let hideDone: ((result: { finished: boolean }) => void) | undefined;
  let timing: jest.SpiedFunction<typeof Animated.timing>;

  beforeEach(() => {
    showDone = undefined;
    hideDone = undefined;
    timing = jest
      .spyOn(Animated, 'timing')
      .mockImplementation((_value, config) => {
        return {
          start: (cb) => {
            if (config.toValue === 1) {
              showDone = cb;
            } else if (config.toValue === 0) {
              hideDone = cb;
            }
          },
          stop: () => {},
          reset: () => {},
        };
      });
  });

  afterEach(() => {
    timing.mockRestore();
  });

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
      hideDone?.({ finished: false });
    });

    expect(onShowAnimationFinished).not.toHaveBeenCalled();
    expect(onHideAnimationFinished).not.toHaveBeenCalled();
  });

  it('does not fire onShowAnimationFinished when show is interrupted', async () => {
    const onHideAnimationFinished = jest.fn();
    const onShowAnimationFinished = jest.fn();

    const view = await render(
      <Banner
        visible={false}
        onShowAnimationFinished={onShowAnimationFinished}
        onHideAnimationFinished={onHideAnimationFinished}
      >
        Text
      </Banner>
    );

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
      showDone?.({ finished: false });
    });

    expect(onShowAnimationFinished).not.toHaveBeenCalled();
    expect(onHideAnimationFinished).not.toHaveBeenCalled();
  });
});
