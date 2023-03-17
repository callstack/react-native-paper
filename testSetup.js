jest.useFakeTimers();
jest.mock('react-native/Libraries/Animated/NativeAnimatedHelper');
jest.mock('@react-navigation/native', () => ({
  ...jest.requireActual('@react-navigation/native'),
  useRoute: () => ({}),
  useNavigation: () => ({ setParams: jest.fn() }),
}));
