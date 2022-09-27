import * as React from 'react';

import { render } from '@testing-library/react-native';
import renderer from 'react-test-renderer';

import Searchbar from '../Searchbar.tsx';

it('renders with placeholder', () => {
  const tree = renderer.create(<Searchbar placeholder="Search" />).toJSON();

  expect(tree).toMatchSnapshot();
});

it('renders with text', () => {
  const tree = renderer
    .create(<Searchbar placeholder="Search" value="query" />)
    .toJSON();

  expect(tree).toMatchSnapshot();
});

it('activity indicator snapshot test', () => {
  const tree = renderer.create(<Searchbar loading={true} />).toJSON();

  expect(tree).toMatchSnapshot();
});

it('renders with ActivityIndicator', () => {
  const tree = render(<Searchbar loading={true} />);

  expect(tree.getByTestId('activity-indicator')).toBeTruthy();
});

it('renders without ActivityIndicator', () => {
  const { getByTestId } = render(<Searchbar loading={false} />);

  expect(() => getByTestId('activity-indicator')).toThrow();
});

it('renders clear icon with custom color', () => {
  const { getByTestId } = render(
    <Searchbar testID="search-bar" value="value" iconColor="purple" />
  );

  const iconComponent = getByTestId('search-bar-icon-wrapper').props.children;

  expect(iconComponent.props.iconColor).toBe('purple');
});

it('renders clear icon wrapper, which can be the target of touch events, if search has value', () => {
  const { getByTestId } = render(
    <Searchbar testID="search-bar" value="value" />
  );

  expect(getByTestId('search-bar-icon-wrapper').props.pointerEvents).toBe(
    'auto'
  );
});

it('renders clear icon wrapper, which is never target of touch events, if search has no value', () => {
  const { getByTestId } = render(<Searchbar testID="search-bar" value="" />);

  expect(getByTestId('search-bar-icon-wrapper').props.pointerEvents).toBe(
    'none'
  );
});
