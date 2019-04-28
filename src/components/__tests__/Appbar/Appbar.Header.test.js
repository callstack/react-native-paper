import React from 'react';
import renderer from 'react-test-renderer';
import Appbar from '../../Appbar/Appbar';

describe('AppbarHeader', () => {
  it('Uses a SafeAreaView wrapper if statusBarHeight is not given', () => {
    const tree = renderer
      .create(
        <Appbar.Header>
          <Appbar.Content title="Examples" />
        </Appbar.Header>
      )
      .toJSON();

    expect(tree).toMatchSnapshot();
  });

  it('Uses a View wrapper if statusBarHeight is given a number', () => {
    const tree = renderer
      .create(
        <Appbar.Header statusBarHeight={100}>
          <Appbar.Content title="Examples" />
        </Appbar.Header>
      )
      .toJSON();

    expect(tree).toMatchSnapshot();
  });
});
