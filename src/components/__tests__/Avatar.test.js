import * as React from 'react';
import { StyleSheet } from 'react-native';

import { fireEvent, render } from '@testing-library/react-native';
import renderer from 'react-test-renderer';

import { red500 } from '../../styles/themes/v2/colors';
import * as Avatar from '../Avatar/Avatar.tsx';

const styles = StyleSheet.create({
  bgColor: {
    backgroundColor: red500,
  },
});

it('renders avatar with text', () => {
  const tree = renderer.create(<Avatar.Text label="XD" />).toJSON();

  expect(tree).toMatchSnapshot();
});

it('renders avatar with text and custom size', () => {
  const tree = renderer.create(<Avatar.Text size={96} label="XD" />).toJSON();

  expect(tree).toMatchSnapshot();
});

it('renders avatar with text and custom background color', () => {
  const tree = renderer
    .create(<Avatar.Text style={styles.bgColor} label="XD" />)
    .toJSON();

  expect(tree).toMatchSnapshot();
});

it('renders avatar with text and custom colors', () => {
  const tree = renderer
    .create(<Avatar.Text color="#FFFFFF" label="XD" />)
    .toJSON();

  expect(tree).toMatchSnapshot();
});

it('renders avatar with icon', () => {
  const tree = renderer.create(<Avatar.Icon icon="information" />).toJSON();

  expect(tree).toMatchSnapshot();
});

it('renders avatar with icon and custom background color', () => {
  const tree = renderer
    .create(<Avatar.Icon style={styles.bgColor} icon="information" />)
    .toJSON();

  expect(tree).toMatchSnapshot();
});

it('renders avatar with image', () => {
  const tree = renderer
    .create(<Avatar.Image source={{ src: 'avatar.png' }} />)
    .toJSON();

  expect(tree).toMatchSnapshot();
});

describe('AvatarImage listener', () => {
  const onListenerMock = jest.fn();

  it('onError should be called', () => {
    const { getByTestId } = render(
      <Avatar.Image
        testID={'avatar-image'}
        onError={onListenerMock}
        onLayout={onListenerMock}
        onLoad={onListenerMock}
        onLoadEnd={onListenerMock}
        onLoadStart={onListenerMock}
        onProgress={onListenerMock}
      />
    );
    fireEvent(getByTestId('avatar-image'), 'onError');
    expect(onListenerMock).toHaveBeenCalled();
  });

  it('onLayout should be called', () => {
    const { getByTestId } = render(
      <Avatar.Image
        testID={'avatar-image'}
        onError={onListenerMock}
        onLayout={onListenerMock}
        onLoad={onListenerMock}
        onLoadEnd={onListenerMock}
        onLoadStart={onListenerMock}
        onProgress={onListenerMock}
      />
    );
    fireEvent(getByTestId('avatar-image'), 'onLayout');
    expect(onListenerMock).toHaveBeenCalled();
  });

  it('onLoad should be called', () => {
    const { getByTestId } = render(
      <Avatar.Image
        testID={'avatar-image'}
        onError={onListenerMock}
        onLayout={onListenerMock}
        onLoad={onListenerMock}
        onLoadEnd={onListenerMock}
        onLoadStart={onListenerMock}
        onProgress={onListenerMock}
      />
    );
    fireEvent(getByTestId('avatar-image'), 'onLoad');
    expect(onListenerMock).toHaveBeenCalled();
  });

  it('onLoadEnd should be called', () => {
    const { getByTestId } = render(
      <Avatar.Image
        testID={'avatar-image'}
        onError={onListenerMock}
        onLayout={onListenerMock}
        onLoad={onListenerMock}
        onLoadEnd={onListenerMock}
        onLoadStart={onListenerMock}
        onProgress={onListenerMock}
      />
    );
    fireEvent(getByTestId('avatar-image'), 'onLoadEnd');
    expect(onListenerMock).toHaveBeenCalled();
  });

  it('onLoadStart should be called', () => {
    const { getByTestId } = render(
      <Avatar.Image
        testID={'avatar-image'}
        onError={onListenerMock}
        onLayout={onListenerMock}
        onLoad={onListenerMock}
        onLoadEnd={onListenerMock}
        onLoadStart={onListenerMock}
        onProgress={onListenerMock}
      />
    );
    fireEvent(getByTestId('avatar-image'), 'onLoadStart');
    expect(onListenerMock).toHaveBeenCalled();
  });

  it('onProgress should be called', () => {
    const { getByTestId } = render(
      <Avatar.Image
        testID={'avatar-image'}
        onError={onListenerMock}
        onLayout={onListenerMock}
        onLoad={onListenerMock}
        onLoadEnd={onListenerMock}
        onLoadStart={onListenerMock}
        onProgress={onListenerMock}
      />
    );
    fireEvent(getByTestId('avatar-image'), 'onProgress');
    expect(onListenerMock).toHaveBeenCalled();
  });
});
