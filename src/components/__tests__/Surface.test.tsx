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
        expect(getByTestId('surface-test-middle-layer')).not.toHaveStyle(style);
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
