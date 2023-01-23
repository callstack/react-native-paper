import * as React from 'react';
import { StyleSheet } from 'react-native';
import { Platform } from 'react-native';

import { render } from '@testing-library/react-native';

import { MD3Colors } from '../../styles/themes/v3/tokens';
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
      marginStyles: {
        marginBottom: 20,
        marginStart: 10,
        marginEnd: 20,
        marginTop: 10,
      },
      borderRadiusStyles: {
        borderBottomLeftRadius: 10,
        borderBottomEndRadius: 10,
        borderTopStartRadius: 10,
        borderTopRightRadius: 10,
      },
      innerLayerViewStyle: {
        backgroundColor: MD3Colors.error100,
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

        const style = getByTestId(`${testID}-outer-layer`).props.style;

        expect(style).not.toHaveProperty('padding');
        expect(style).not.toHaveProperty('flex-direciton');
        expect(style).not.toHaveProperty('align-content');
      });
      it('should render absolute position properties on outer layer', () => {
        const testID = 'surface-test';

        const { container } = render(
          <Surface testID={testID} style={styles.absoluteStyles} />
        );

        const style = container.props.style;

        expect(style).toHaveProperty('bottom');
        expect(style).toHaveProperty('end');
        expect(style).toHaveProperty('left');
        expect(style).toHaveProperty('position');
        expect(style).toHaveProperty('right');
        expect(style).toHaveProperty('start');
        expect(style).toHaveProperty('top');
      });

      it('should render margin styles on outer layer', () => {
        const testID = 'surface-test';

        const { getByTestId } = render(
          <Surface testID={testID} style={styles.marginStyles} />
        );

        expect(getByTestId(`${testID}-outer-layer`)).toHaveStyle(
          styles.marginStyles
        );
      });

      it('should render inner layer styles on outer layer', () => {
        const testID = 'surface-test';
        const combinedStyles = [
          styles.backgroundColor,
          styles.borderRadiusStyles,
        ];

        const { getByTestId } = render(
          <Surface testID={testID} style={combinedStyles} />
        );

        expect(getByTestId(`${testID}-outer-layer`)).toHaveStyle(
          combinedStyles
        );
      });
    });

    describe('inner layer', () => {
      it('should not render absolute position properties on the inner layer', () => {
        const testID = 'surface-test';

        const { getByTestId } = render(
          <Surface testID={testID} style={styles.absoluteStyles} />
        );

        const style = getByTestId(`${testID}-inner-layer`).props.style;

        expect(style).toHaveProperty('backgroundColor');
        expect(style).not.toHaveProperty('bottom');
        expect(style).not.toHaveProperty('end');
        expect(style).not.toHaveProperty('left');
        expect(style).not.toHaveProperty('position');
        expect(style).not.toHaveProperty('right');
        expect(style).not.toHaveProperty('start');
        expect(style).not.toHaveProperty('top');
      });

      it('should not render margin styles on the inner layer', () => {
        const testID = 'surface-test';

        const { getByTestId } = render(
          <Surface testID={testID} style={styles.marginStyles} />
        );

        const style = getByTestId(`${testID}-inner-layer`).props.style;

        expect(style).not.toHaveProperty('marginBottom');
        expect(style).not.toHaveProperty('marginStart');
        expect(style).not.toHaveProperty('marginEnd');
        expect(style).not.toHaveProperty('marginTop');
      });

      it('should render inner layer styles on the inner layer', () => {
        const testID = 'surface-test';
        const combinedStyles = [
          styles.backgroundColor,
          styles.borderRadiusStyles,
        ];

        const { getByTestId } = render(
          <Surface testID={testID} style={combinedStyles} />
        );

        expect(getByTestId(`${testID}-inner-layer`)).toHaveStyle(
          combinedStyles
        );
      });
    });

    describe('children wrapper', () => {
      it('should render rest styles', () => {
        const testID = 'surface-test';
        const combinedStyles = [
          styles.backgroundColor,
          styles.borderRadiusStyles,
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
