import * as React from 'react';
import renderer from 'react-test-renderer';
import Rating from '../Rating.tsx';
import { TouchableOpacity } from 'react-native';

it('renders rating component by default', () => {
  const tree = renderer.create(<Rating max={5} value={2.5} />).toJSON();

  expect(tree).toMatchSnapshot();
});

it('should render children equal to max value', () => {
  const tree = renderer.create(<Rating max={5} value={2.5} />).toJSON();

  expect(tree.children).toHaveLength(5);
});

it('should call onRatingChanged whenever user changes rating', () => {
  const ratingChanged = jest.fn();
  const event = {
    nativeEvent: {
      locationX: 20,
    },
  };
  const tree = renderer.create(
    <Rating
      max={5}
      value={2.5}
      editable={true}
      onRatingChanged={ratingChanged}
    />
  ).root;

  tree.findAllByType(TouchableOpacity)[2].props.onPress(event);

  expect(ratingChanged).toHaveBeenCalledWith(3);
});

it('should support half star rating', () => {
  const ratingChanged = jest.fn();
  const event = {
    nativeEvent: {
      locationX: 20,
    },
  };
  const tree = renderer.create(
    <Rating
      max={5}
      value={2.5}
      editable={true}
      size={50}
      onRatingChanged={ratingChanged}
    />
  ).root;

  tree.findAllByType(TouchableOpacity)[2].props.onPress(event);

  expect(ratingChanged).toHaveBeenCalledWith(2.5);
});

it('should take full rating when user clicks icon in full', () => {
  const ratingChanged = jest.fn();
  const event = {
    nativeEvent: {
      locationX: 40,
    },
  };
  const tree = renderer.create(
    <Rating
      max={5}
      value={2.5}
      editable={true}
      size={50}
      onRatingChanged={ratingChanged}
    />
  ).root;

  tree.findAllByType(TouchableOpacity)[2].props.onPress(event);

  expect(ratingChanged).toHaveBeenCalledWith(3);
});

it('should not allow user to select rating when editable is false', () => {
  const ratingChanged = jest.fn();
  const event = {
    nativeEvent: {
      locationX: 40,
    },
  };
  const tree = renderer.create(
    <Rating
      max={5}
      value={2.5}
      editable={false}
      size={50}
      animate={false}
      onRatingChanged={ratingChanged}
    />
  ).root;

  tree.findAllByType(TouchableOpacity)[2].props.onPress(event);

  expect(ratingChanged).not.toHaveBeenCalled();
});

it('should not support half star when allowHalf passed false', () => {
  const ratingChanged = jest.fn();
  const event = {
    nativeEvent: {
      locationX: 10,
    },
  };
  const tree = renderer.create(
    <Rating
      max={5}
      value={3}
      editable={true}
      size={50}
      onRatingChanged={ratingChanged}
      allowHalfInput={false}
    />
  ).root;

  tree.findAllByType(TouchableOpacity)[2].props.onPress(event);

  expect(ratingChanged).toHaveBeenCalledWith(3);
});
