import React from 'react';
import { Platform } from 'react-native';
import renderer from 'react-test-renderer';
import Appbar from '../../Appbar';
import Searchbar from '../../Searchbar';

describe('Appbar', () => {
  it('does not pass any additional props to Searchbar', () => {
    const tree = renderer
      .create(
        <Appbar>
          <Searchbar placeholder="Search" />
        </Appbar>
      )
      .toJSON();

    expect(tree).toMatchSnapshot();
  });

  it('passes additional props to AppbarBackAction, AppbarContent and AppbarAction', () => {
    const tree = renderer
      .create(
        <Appbar>
          <Appbar.BackAction onPress={() => {}} />
          <Appbar.Content title="Examples" />
          <Appbar.Action icon="menu" onPress={() => {}} />
        </Appbar>
      )
      .toJSON();

    expect(tree).toMatchSnapshot();
  });

  describe('when android', () => {
    it('passes additional props AppbarBackAction, AppbarContent and AppbarAction', () => {
      Platform.OS = 'android';
      const tree = renderer
        .create(
          <Appbar>
            <Appbar.BackAction onPress={() => {}} />
            <Appbar.Content title="Examples" subtitle="Examples" />
            <Appbar.Action icon="menu" onPress={() => {}} />
          </Appbar>
        )
        .toJSON();

      expect(tree).toMatchSnapshot();
    });
  });

  describe('when iOS', () => {
    describe('and only content', () => {
      it('renders AppBar with left spacing and right spacing', () => {
        Platform.OS = 'ios';

        const tree = renderer
          .create(
            <Appbar.Header>
              <Appbar.Content title="Examples" subtitle="Examples" />
            </Appbar.Header>
          )
          .toJSON();

        expect(tree).toMatchSnapshot();
      });
    });
  });
});
