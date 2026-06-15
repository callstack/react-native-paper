import '@jest/expect';
import type { JestNativeMatchers } from '@testing-library/jest-native/extend-expect';
import 'expect';

declare module 'expect' {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface Matchers<R extends void | Promise<void>, T = unknown>
    extends JestNativeMatchers<R> {}
}
