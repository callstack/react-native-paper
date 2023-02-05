import * as React from 'react';
import { StyleSheet } from 'react-native';
import { Platform } from 'react-native';

import { render } from '@testing-library/react-native';

import Surface from '../Surface';

describe('Surface', () => {
  it('should properly render passed props', () => {
    const testID = 'surface-container';
    const { getByTestId } = render(
      <Surface pointerEvents="box-none" testID={testID} />
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
        flex: 1,
      },
      innerLayerViewStyle: {
        flex: 1,
      },
      restStyle: {
        padding: 10,
        flexDirection: 'row',
        alignContent: 'center',
      },
    });

    describe('outer layer', () => {
      it('should not render rest style', () => {
        const testID = 'surface-test';

        const { getByTestId } = render(
          <Surface testID={testID} style={styles.restStyle} />
        );

        expect(getByTestId(`${testID}-outer-layer`)).not.toHaveStyle(
          styles.restStyle
        );
      });

      it('should render absolute position properties on outer layer', () => {
        const testID = 'surface-test';

        const { getByTestId } = render(
          <Surface testID={testID} style={styles.absoluteStyles} />
        );

        expect(getByTestId(`${testID}-outer-layer`)).toHaveStyle(
          styles.absoluteStyles
        );
      });

      it('should render inner layer styles on outer layer', () => {
        const testID = 'surface-test';

        const { getByTestId } = render(
          <Surface testID={testID} style={styles.innerLayerViewStyle} />
        );

        expect(getByTestId(`${testID}-outer-layer`)).toHaveStyle(
          styles.innerLayerViewStyle
        );
      });
    });

    describe('inner layer', () => {
      it('should not render absolute position properties on the inner layer', () => {
        const testID = 'surface-test';

        const { getByTestId } = render(
          <Surface testID={testID} style={styles.absoluteStyles} />
        );

        expect(getByTestId(`${testID}-inner-layer`)).not.toHaveStyle(
          styles.absoluteStyles
        );
      });

      it('should render inner layer styles on the inner layer', () => {
        const testID = 'surface-test';

        const { getByTestId } = render(
          <Surface testID={testID} style={styles.innerLayerViewStyle} />
        );

        expect(getByTestId(`${testID}-inner-layer`)).toHaveStyle(
          styles.innerLayerViewStyle
        );
      });
    });

    describe('children wrapper', () => {
      it('should render rest styles', () => {
        const testID = 'surface-test';
        const combinedStyles = [
          styles.backgroundColor,
          styles.innerLayerViewStyle,
          styles.restStyle,
        ];

        const { getByTestId } = render(
          <Surface testID={testID} style={combinedStyles} />
        );

        expect(getByTestId(testID)).toHaveStyle(combinedStyles);
      });
    });
  });
});
