import { Platform, View } from 'react-native';

import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  jest,
} from '@jest/globals';
import { render, screen } from '@testing-library/react-native';

import Portal from '../../components/Portal/Portal';
import { LocaleProvider } from '../locale';
import PaperProvider from '../PaperProvider';

// react-native-web renders `dir` as the attribute that lays out the element's
// children in that direction.
const parentOf = (testID: string) => screen.getByTestId(testID).parent;

const renderSubtree = () =>
  render(
    <PaperProvider>
      <LocaleProvider direction="rtl">
        <View testID="content" />
        <Portal>
          <View testID="portal-content" />
        </Portal>
      </LocaleProvider>
    </PaperProvider>
  );

describe.each(['web', 'ios', 'android'] as const)('on %s', (os) => {
  let platformOS: { restore(): void } | undefined;

  beforeEach(() => {
    platformOS = jest.replaceProperty(Platform, 'OS', os);
  });

  afterEach(() => {
    platformOS?.restore();
  });

  if (os === 'web') {
    it('lays out a LocaleProvider subtree and its portal content in its direction', async () => {
      await renderSubtree();
      await screen.findByTestId('portal-content');

      expect(parentOf('content')).toHaveProp('dir', 'rtl');
      expect(parentOf('portal-content')).toHaveProp('dir', 'rtl');
    });
  } else {
    it('leaves the layout direction of a LocaleProvider subtree to the app', async () => {
      await renderSubtree();
      await screen.findByTestId('portal-content');

      expect(parentOf('content')).not.toHaveProp('dir');
      expect(parentOf('portal-content')).not.toHaveProp('dir');
    });
  }

  it('leaves the layout direction to the app with PaperProvider alone', async () => {
    await render(
      <PaperProvider direction="rtl">
        <View testID="content" />
        <Portal>
          <View testID="portal-content" />
        </Portal>
      </PaperProvider>
    );
    await screen.findByTestId('portal-content');

    expect(parentOf('content')).not.toHaveProp('dir');
    expect(parentOf('portal-content')).not.toHaveProp('dir');
  });
});
