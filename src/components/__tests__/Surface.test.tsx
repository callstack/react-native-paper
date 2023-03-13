import * as React from 'react';
import { StyleSheet } from 'react-native';
import { Platform } from 'react-native';

import { render } from '@testing-library/react-native';

import Surface from '../Surface';

describe('Surface', () => {
  it('should properly render passed props', () => {
    const testID = 'surface-container';
    const { getByTestId } = render(
      <Surface pointerEvents="box-none" testID={testID}>
        {null}
      </Surface>
    );
    expect(getByTestId(testID).props.pointerEvents).toBe('box-none');
  });

  describe('on iOS', () => {
    Platform.OS = 'ios';
    const styles = StyleSheet.create({
      absoluteStyles: {
        bottom: 10,
        end: 20,
        left: 30,
        position: 'absolute',
        right: 40,
        start: 50,
        top: 60,
      },
      innerLayerViewStyle: {
        padding: 13,
      },
      restStyle: {
        padding: 10,
        flexDirection: 'row',
        alignContent: 'center',
      },
    });

    it.each`
      property              | value
      ${'opacity'}          | ${0.7}
      ${'transform'}        | ${[{ scale: 1.02 }]}
      ${'width'}            | ${'42%'}
      ${'height'}           | ${'32.5%'}
      ${'margin'}           | ${13}
      ${'marginLeft'}       | ${13.1}
      ${'marginRight'}      | ${13.2}
      ${'marginTop'}        | ${13.3}
      ${'marginBottom'}     | ${13.4}
      ${'marginHorizontal'} | ${13.5}
      ${'marginVertical'}   | ${13.6}
      ${'position'}         | ${'absolute'}
      ${'alignSelf'}        | ${'flex-start'}
      ${'top'}              | ${1.1}
      ${'right'}            | ${1.2}
      ${'bottom'}           | ${1.3}
      ${'left'}             | ${1.4}
      ${'start'}            | ${1.5}
      ${'end'}              | ${1.6}
      ${'flex'}             | ${6}
    `('applies $property to outer layer only', ({ property, value }) => {
      const style = { [property]: value };

      const { getByTestId } = render(
        <Surface testID="surface-test" style={style}>
          {null}
        </Surface>
      );

      expect(getByTestId('surface-test-outer-layer')).toHaveStyle(style);
      expect(getByTestId('surface-test')).not.toHaveStyle(style);
    });

    it.each`
      property                     | value
      ${'padding'}                 | ${12}
      ${'paddingLeft'}             | ${12.1}
      ${'paddingRight'}            | ${12.2}
      ${'paddingTop'}              | ${12.3}
      ${'paddingBottom'}           | ${12.4}
      ${'paddingHorizontal'}       | ${12.5}
      ${'paddingVertical'}         | ${12.6}
      ${'borderWidth'}             | ${2}
      ${'borderColor'}             | ${'black'}
      ${'borderRadius'}            | ${3}
      ${'borderTopLeftRadius'}     | ${1}
      ${'borderTopRightRadius'}    | ${2}
      ${'borderBottomLeftRadius'}  | ${3}
      ${'borderBottomRightRadius'} | ${4}
    `('applies $property to inner layer only', ({ property, value }) => {
      const style = { [property]: value };

      const { getByTestId } = render(
        <Surface testID="surface-test" style={style}>
          {null}
        </Surface>
      );

      expect(getByTestId('surface-test-outer-layer')).not.toHaveStyle(style);
      expect(getByTestId('surface-test')).toHaveStyle(style);
    });

    describe('outer layer', () => {
      it('should not render rest style', () => {
        const testID = 'surface-test';

        const { getByTestId } = render(
          <Surface testID={testID} style={styles.restStyle}>
            {null}
          </Surface>
        );

        expect(getByTestId(`${testID}-outer-layer`)).not.toHaveStyle(
          styles.restStyle
        );
      });

      it('should render absolute position properties on outer layer', () => {
        const testID = 'surface-test';

        const { getByTestId } = render(
          <Surface testID={testID} style={styles.absoluteStyles}>
            {null}
          </Surface>
        );

        expect(getByTestId(`${testID}-outer-layer`)).toHaveStyle(
          styles.absoluteStyles
        );
      });

      it('should render absolute position properties on the outer layer', () => {
        const testID = 'surface-test';

        const { getByTestId } = render(
          <Surface testID={testID} style={styles.absoluteStyles}>
            {null}
          </Surface>
        );

        expect(getByTestId(`${testID}-outer-layer`)).toHaveStyle(
          styles.absoluteStyles
        );
      });
    });

    describe('inner layer', () => {
      it('applies backgroundColor to inner layer only', () => {
        const backgroundColor = 'rgb(1,2,3)';
        const { getByTestId } = render(
          <Surface
            testID="surface-test"
            theme={{ colors: { elevation: { level1: backgroundColor } } }}
          >
            {null}
          </Surface>
        );

        const style = { backgroundColor };
        expect(getByTestId('surface-test-outer-layer')).not.toHaveStyle(style);
        expect(getByTestId('surface-test')).toHaveStyle(style);
      });

      it('should render inner layer styles on the inner layer', () => {
        const testID = 'surface-test';

        const { getByTestId } = render(
          <Surface testID={testID} style={styles.innerLayerViewStyle}>
            {null}
          </Surface>
        );

        expect(getByTestId(testID)).toHaveStyle(styles.innerLayerViewStyle);
      });
    });

    describe('children wrapper', () => {
      it('should render rest styles', () => {
        const testID = 'surface-test';
        const combinedStyles = [styles.innerLayerViewStyle, styles.restStyle];

        const { getByTestId } = render(
          <Surface testID={testID} style={combinedStyles}>
            {null}
          </Surface>
        );

        expect(getByTestId(testID)).toHaveStyle(combinedStyles);
      });
    });
  });
});
