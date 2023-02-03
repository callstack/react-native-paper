declare module 'react-native-safe-area-context/jest/mock' {
  export default mockSafeAreaContext = {
    SafeAreaProvider: React.Component,
  };
}
