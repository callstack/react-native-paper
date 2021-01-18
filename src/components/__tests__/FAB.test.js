import * as React from 'react';
import renderer from 'react-test-renderer';
import FAB from '../FAB';

it('renders normal FAB', () => {
  const tree = renderer.create(<FAB onPress={() => {}} icon="plus" />).toJSON();

  expect(tree).toMatchSnapshot();
});

it('renders small FAB', () => {
  const tree = renderer
    .create(<FAB small onPress={() => {}} icon="plus" />)
    .toJSON();

  expect(tree).toMatchSnapshot();
});

it('renders extended FAB', () => {
  const tree = renderer
    .create(<FAB onPress={() => {}} icon="plus" label="Add items" />)
    .toJSON();

  expect(tree).toMatchSnapshot();
});

it('renders loading FAB', () => {
  const tree = renderer
    .create(<FAB onPress={() => {}} icon="plus" loading={true} />)
    .toJSON();

  expect(tree).toMatchSnapshot();
});

it('renders disabled FAB', () => {
  const tree = renderer
    .create(<FAB onPress={() => {}} icon="plus" disabled />)
    .toJSON();

  expect(tree).toMatchSnapshot();
});

it('renders custom color for the icon and label of the FAB', () => {
  const tree = renderer
    .create(<FAB onPress={() => {}} icon="plus" color="#AA0114" />)
    .toJSON();

  expect(tree).toMatchSnapshot();
});

it('renders not visible FAB', () => {
  const { update, toJSON } = renderer.create(
    <FAB onPress={() => {}} icon="plus" />
  );
  update(<FAB onPress={() => {}} icon="plus" visible={false} />);

  expect(toJSON()).toMatchSnapshot();
});

it('renders visible FAB', () => {
  const { update, toJSON } = renderer.create(
    <FAB onPress={() => {}} icon="plus" visible={false} />
  );

  update(<FAB onPress={() => {}} icon="plus" visible={true} />);

  expect(toJSON()).toMatchSnapshot();
});
