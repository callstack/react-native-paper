import { Image, StyleSheet } from 'react-native';

import { describe, expect, it, jest } from '@jest/globals';
import { fireEvent } from '@testing-library/react-native';

import { render, screen } from '../../test-utils';
import { red500 } from '../../theme/colors';
import { cornerFull } from '../../theme/tokens/sys/shape';
import * as Avatar from '../Avatar/Avatar';

const hidden = { includeHiddenElements: true };

const styles = StyleSheet.create({
  bgColor: {
    backgroundColor: red500,
  },
});

it('renders avatar with text', async () => {
  const tree = (await render(<Avatar.Text label="XD" />)).toJSON();

  expect(tree).toMatchSnapshot();
});

it('renders avatar with text and custom size', async () => {
  const tree = (await render(<Avatar.Text size={96} label="XD" />)).toJSON();

  expect(tree).toMatchSnapshot();
});

it('renders avatar with text and custom background color', async () => {
  const tree = (
    await render(<Avatar.Text style={styles.bgColor} label="XD" />)
  ).toJSON();

  expect(tree).toMatchSnapshot();
});

it('renders avatar with text and custom colors', async () => {
  const tree = (
    await render(<Avatar.Text color="#FFFFFF" label="XD" />)
  ).toJSON();

  expect(tree).toMatchSnapshot();
});

it('renders avatar with icon', async () => {
  const tree = (await render(<Avatar.Icon icon="information" />)).toJSON();

  expect(tree).toMatchSnapshot();
});

it('renders avatar with icon and custom background color', async () => {
  const tree = (
    await render(<Avatar.Icon style={styles.bgColor} icon="information" />)
  ).toJSON();

  expect(tree).toMatchSnapshot();
});

it('renders avatar with image', async () => {
  const tree = (
    await render(<Avatar.Image source={{ uri: 'avatar.png' }} />)
  ).toJSON();

  expect(tree).toMatchSnapshot();
});

describe('AvatarImage listener', () => {
  const onListenerMock = jest.fn();

  it('onError should be called', async () => {
    await render(
      <Avatar.Image
        testID={'avatar-image'}
        source={{ uri: 'avatar.png' }}
        onError={onListenerMock}
        onLayout={onListenerMock}
        onLoad={onListenerMock}
        onLoadEnd={onListenerMock}
        onLoadStart={onListenerMock}
        onProgress={onListenerMock}
      />
    );
    await fireEvent(screen.getByTestId('avatar-image'), 'onError');
    expect(onListenerMock).toHaveBeenCalled();
  });

  it('onLayout should be called', async () => {
    await render(
      <Avatar.Image
        testID={'avatar-image'}
        source={{ uri: 'avatar.png' }}
        onError={onListenerMock}
        onLayout={onListenerMock}
        onLoad={onListenerMock}
        onLoadEnd={onListenerMock}
        onLoadStart={onListenerMock}
        onProgress={onListenerMock}
      />
    );
    await fireEvent(screen.getByTestId('avatar-image'), 'onLayout');
    expect(onListenerMock).toHaveBeenCalled();
  });

  it('onLoad should be called', async () => {
    await render(
      <Avatar.Image
        testID={'avatar-image'}
        source={{ uri: 'avatar.png' }}
        onError={onListenerMock}
        onLayout={onListenerMock}
        onLoad={onListenerMock}
        onLoadEnd={onListenerMock}
        onLoadStart={onListenerMock}
        onProgress={onListenerMock}
      />
    );
    await fireEvent(screen.getByTestId('avatar-image'), 'onLoad');
    expect(onListenerMock).toHaveBeenCalled();
  });

  it('onLoadEnd should be called', async () => {
    await render(
      <Avatar.Image
        testID={'avatar-image'}
        source={{ uri: 'avatar.png' }}
        onError={onListenerMock}
        onLayout={onListenerMock}
        onLoad={onListenerMock}
        onLoadEnd={onListenerMock}
        onLoadStart={onListenerMock}
        onProgress={onListenerMock}
      />
    );
    await fireEvent(screen.getByTestId('avatar-image'), 'onLoadEnd');
    expect(onListenerMock).toHaveBeenCalled();
  });

  it('onLoadStart should be called', async () => {
    await render(
      <Avatar.Image
        testID={'avatar-image'}
        source={{ uri: 'avatar.png' }}
        onError={onListenerMock}
        onLayout={onListenerMock}
        onLoad={onListenerMock}
        onLoadEnd={onListenerMock}
        onLoadStart={onListenerMock}
        onProgress={onListenerMock}
      />
    );
    await fireEvent(screen.getByTestId('avatar-image'), 'onLoadStart');
    expect(onListenerMock).toHaveBeenCalled();
  });

  it('onProgress should be called', async () => {
    await render(
      <Avatar.Image
        testID={'avatar-image'}
        source={{ uri: 'avatar.png' }}
        onError={onListenerMock}
        onLayout={onListenerMock}
        onLoad={onListenerMock}
        onLoadEnd={onListenerMock}
        onLoadStart={onListenerMock}
        onProgress={onListenerMock}
      />
    );
    await fireEvent(screen.getByTestId('avatar-image'), 'onProgress');
    expect(onListenerMock).toHaveBeenCalled();
  });
});

// React Native turns `alt` into `accessible` plus a label inside the platform
// `Image`, so asserting it reaches the image is enough here.
it('labels the image with alt, not the wrapper', async () => {
  const tree = (
    await render(
      <Avatar.Image
        testID="avatar-image"
        source={{ uri: 'avatar.png' }}
        alt="Jane Doe"
      />
    )
  ).toJSON();

  expect(tree).toMatchObject({
    props: {
      accessible: false,
      importantForAccessibility: 'no',
    },
    children: [
      {
        props: {
          alt: 'Jane Doe',
        },
      },
    ],
  });
  expect(tree).not.toMatchObject({
    props: {
      'aria-label': 'Jane Doe',
    },
  });
});

it('keeps an unlabeled image unfocusable', async () => {
  const tree = (
    await render(<Avatar.Image source={{ uri: 'avatar.png' }} />)
  ).toJSON();

  expect(tree).toMatchObject({
    props: {
      accessible: false,
      importantForAccessibility: 'no',
    },
    children: [
      {
        props: {
          accessible: false,
        },
      },
    ],
  });
});

it('hides text avatar initials from assistive tech', async () => {
  const tree = (
    await render(
      <Avatar.Text
        label="XD"
        accessibilityLabel="Jane Doe"
        accessibilityRole="image"
      />
    )
  ).toJSON();

  expect(tree).toMatchObject({
    props: {
      accessible: true,
      accessibilityLabel: 'Jane Doe',
      accessibilityRole: 'image',
    },
    children: [
      {
        props: {
          'aria-hidden': true,
        },
      },
    ],
  });
});

it('makes a labelled icon avatar an accessibility element', async () => {
  const tree = (
    await render(<Avatar.Icon icon="folder" accessibilityLabel="Folder" />)
  ).toJSON();

  // `View` is not an accessibility element by default, so without `accessible`
  // the label is never announced on iOS.
  expect(tree).toMatchObject({
    props: {
      accessible: true,
      accessibilityLabel: 'Folder',
    },
  });
});

it('leaves an unlabelled icon avatar decorative', async () => {
  const tree = (await render(<Avatar.Icon icon="folder" />)).toJSON();

  expect(tree).not.toMatchObject({ props: { accessible: true } });
});

it('bounds text avatar initials by grapheme', async () => {
  const tree = (await render(<Avatar.Text label="👨‍👩‍👧X" />)).toJSON();

  expect(tree).toMatchObject({
    children: [
      {
        children: ['👨‍👩‍👧X'],
      },
    ],
  });
});

describe('AvatarImage fallback', () => {
  it('shows fallback when the image fails to load', async () => {
    await render(
      <Avatar.Image
        testID="avatar-image"
        source={{ uri: 'avatar.png' }}
        fallback={({ size }) => <Avatar.Text size={size} label="JD" />}
      />
    );

    await fireEvent(screen.getByTestId('avatar-image'), 'onError');

    expect(screen.getByText('JD', hidden)).toBeTruthy();
  });

  it('still calls onError when showing a fallback', async () => {
    const onError = jest.fn();

    await render(
      <Avatar.Image
        testID="avatar-image"
        source={{ uri: 'avatar.png' }}
        fallback={({ size }) => <Avatar.Text size={size} label="JD" />}
        onError={onError}
      />
    );

    await fireEvent(screen.getByTestId('avatar-image'), 'onError');

    expect(onError).toHaveBeenCalled();
    expect(screen.getByText('JD', hidden)).toBeTruthy();
  });

  it('keeps the image mounted and still calls onError without a fallback', async () => {
    const onError = jest.fn();

    await render(
      <Avatar.Image
        testID="avatar-image"
        source={{ uri: 'avatar.png' }}
        onError={onError}
      />
    );

    await fireEvent(screen.getByTestId('avatar-image'), 'onError');

    expect(onError).toHaveBeenCalled();
    expect(screen.getByTestId('avatar-image')).toBeTruthy();
  });

  it('retries the image when the source URI changes', async () => {
    const { rerender } = await render(
      <Avatar.Image
        testID="avatar-image"
        source={{ uri: 'bad.png' }}
        fallback={({ size }) => <Avatar.Text size={size} label="JD" />}
      />
    );

    await fireEvent(screen.getByTestId('avatar-image'), 'onError');
    expect(screen.getByText('JD', hidden)).toBeTruthy();

    await rerender(
      <Avatar.Image
        testID="avatar-image"
        source={{ uri: 'good.png' }}
        fallback={({ size }) => <Avatar.Text size={size} label="JD" />}
      />
    );

    expect(screen.getByTestId('avatar-image')).toBeTruthy();
    expect(screen.queryByText('JD', hidden)).toBeNull();
  });

  it('keeps the fallback when the source object identity changes', async () => {
    const { rerender } = await render(
      <Avatar.Image
        testID="avatar-image"
        source={{ uri: 'bad.png' }}
        fallback={({ size }) => <Avatar.Text size={size} label="JD" />}
      />
    );

    await fireEvent(screen.getByTestId('avatar-image'), 'onError');

    await rerender(
      <Avatar.Image
        testID="avatar-image"
        source={{ uri: 'bad.png' }}
        fallback={({ size }) => <Avatar.Text size={size} label="JD" />}
      />
    );

    expect(screen.getByText('JD', hidden)).toBeTruthy();
  });

  it('passes host size, style, and a11y to a function source', async () => {
    const source = jest.fn(
      ({
        style,
      }: {
        size: number;
        style: { width: number; height: number; borderRadius: number };
      }) => (
        <Image
          testID="custom-image"
          source={{ uri: 'avatar.png' }}
          style={style}
          accessibilityIgnoresInvertColors
        />
      )
    );

    await render(<Avatar.Image size={48} source={source} />);

    expect(source).toHaveBeenCalledWith({
      size: 48,
      style: { width: 48, height: 48, borderRadius: cornerFull },
      onError: expect.any(Function),
      accessible: false,
    });
    expect(screen.getByTestId('custom-image')).toBeTruthy();
  });

  it('passes alt to a function source', async () => {
    const source = jest.fn(
      ({
        style,
        ...a11y
      }: {
        size: number;
        style: { width: number; height: number; borderRadius: number };
      }) => (
        <Image
          testID="custom-image"
          source={{ uri: 'avatar.png' }}
          style={style}
          accessibilityIgnoresInvertColors
          {...a11y}
        />
      )
    );

    await render(<Avatar.Image size={48} source={source} alt="Jane Doe" />);

    expect(source).toHaveBeenCalledWith(
      expect.objectContaining({ alt: 'Jane Doe' })
    );
    expect(source).not.toHaveBeenCalledWith(
      expect.objectContaining({ accessible: false })
    );
  });

  it('shows fallback when a function source reports an error', async () => {
    await render(
      <Avatar.Image
        source={({ style, onError }) => (
          <Image
            testID="custom-image"
            source={{ uri: 'avatar.png' }}
            style={style}
            onError={onError}
            accessibilityIgnoresInvertColors
          />
        )}
        fallback={({ size }) => <Avatar.Text size={size} label="JD" />}
      />
    );

    await fireEvent(screen.getByTestId('custom-image'), 'onError');

    expect(screen.getByText('JD', hidden)).toBeTruthy();
    expect(screen.queryByTestId('custom-image')).toBeNull();
  });

  it('keeps the fallback when a function source identity changes', async () => {
    const { rerender } = await render(
      <Avatar.Image
        source={({ style, onError }) => (
          <Image
            testID="custom-image"
            source={{ uri: 'avatar.png' }}
            style={style}
            onError={onError}
            accessibilityIgnoresInvertColors
          />
        )}
        fallback={({ size }) => <Avatar.Text size={size} label="JD" />}
      />
    );

    await fireEvent(screen.getByTestId('custom-image'), 'onError');

    await rerender(
      <Avatar.Image
        source={({ style, onError }) => (
          <Image
            testID="custom-image"
            source={{ uri: 'avatar.png' }}
            style={style}
            onError={onError}
            accessibilityIgnoresInvertColors
          />
        )}
        fallback={({ size }) => <Avatar.Text size={size} label="JD" />}
      />
    );

    expect(screen.getByText('JD', hidden)).toBeTruthy();
    expect(screen.queryByTestId('custom-image')).toBeNull();
  });

  it('moves alt onto the host when fallback is shown', async () => {
    const { toJSON } = await render(
      <Avatar.Image
        testID="avatar-image"
        source={{ uri: 'avatar.png' }}
        fallback={({ size }) => <Avatar.Text size={size} label="JD" />}
        alt="Jane Doe"
      />
    );

    await fireEvent(screen.getByTestId('avatar-image'), 'onError');

    expect(toJSON()).toMatchObject({
      props: {
        accessible: true,
        'aria-label': 'Jane Doe',
      },
    });
  });

  it('leaves the host unlabelled when a fallback is shown without alt', async () => {
    const { toJSON } = await render(
      <Avatar.Image
        testID="avatar-image"
        source={{ uri: 'avatar.png' }}
        fallback={({ size }) => <Avatar.Text size={size} label="JD" />}
      />
    );

    await fireEvent(screen.getByTestId('avatar-image'), 'onError');

    // The fallback carries its own label, so the host must not swallow it.
    expect(toJSON()).not.toMatchObject({ props: { accessible: true } });
  });
});
