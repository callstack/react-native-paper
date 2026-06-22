import { StyleSheet } from 'react-native';

import { describe, expect, it, jest } from '@jest/globals';
import { fireEvent } from '@testing-library/react-native';

import { render, screen } from '../../test-utils';
import { red500 } from '../../theme/colors';
import * as Avatar from '../Avatar/Avatar';

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
