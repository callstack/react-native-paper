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
    const style = StyleSheet.create({
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
    });

    it('should not render absolute position properties on the bottom layer', () => {
      const testID = 'surface-test-bottom-layer';

      const { getByTestId } = render(
        <Surface testID={testID} style={style.absoluteStyles} />
      );

      expect(getByTestId(testID).props.style).toHaveProperty('flex');
      expect(getByTestId(testID).props.style).toHaveProperty('backgroundColor');
      expect(getByTestId(testID).props.style).not.toHaveProperty('bottom');
      expect(getByTestId(testID).props.style).not.toHaveProperty('end');
      expect(getByTestId(testID).props.style).not.toHaveProperty('left');
      expect(getByTestId(testID).props.style).not.toHaveProperty('position');
      expect(getByTestId(testID).props.style).not.toHaveProperty('right');
      expect(getByTestId(testID).props.style).not.toHaveProperty('start');
      expect(getByTestId(testID).props.style).not.toHaveProperty('top');
    });

    it('should render absolute position properties on shadow layer 0', () => {
      const testID = 'surface-test-shadow-layer-0';

      const { container } = render(
        <Surface testID={testID} style={style.absoluteStyles} />
      );

      expect(container.props.style).toHaveProperty('bottom');
      expect(container.props.style).toHaveProperty('end');
      expect(container.props.style).toHaveProperty('left');
      expect(container.props.style).toHaveProperty('position');
      expect(container.props.style).toHaveProperty('right');
      expect(container.props.style).toHaveProperty('start');
      expect(container.props.style).toHaveProperty('top');
    });
  });
});
