import { MD3Theme } from './src/types';

declare global {
  namespace ReactNativePaper {
    interface Theme extends MD3Theme {}
  }
}
