jest.useFakeTimers();

jest.mock('@react-native-vector-icons/material-design-icons', () => {
  const React = require('react');
  const { Text } = require('react-native');

  const MockIcon = ({ name, color, size, style, ...props }) => {
    return (
      <Text 
        style={[{ color, fontSize: size }, style]} 
        {...props}
      >
        {name || '□'}
      </Text>
    );
  };

  MockIcon.displayName = 'MockedMaterialDesignIcon';
  
  return {
    __esModule: true,
    default: MockIcon,
  };
});