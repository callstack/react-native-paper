const reanimatedTestProps = new Set([
  'jestAnimatedProps',
  'jestAnimatedStyle',
  'jestInlineStyle',
]);

module.exports = {
  test(value) {
    return (
      value !== null &&
      typeof value === 'object' &&
      value.props !== null &&
      typeof value.props === 'object' &&
      Object.keys(value.props).some((prop) => reanimatedTestProps.has(prop))
    );
  },
  print(value, serialize) {
    return serialize({
      ...value,
      props: Object.fromEntries(
        Object.entries(value.props).filter(
          ([prop]) => !reanimatedTestProps.has(prop)
        )
      ),
    });
  },
};
