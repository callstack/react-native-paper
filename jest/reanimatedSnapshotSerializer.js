const reanimatedTestProps = new Set([
  'jestAnimatedProps',
  'jestAnimatedStyle',
  'jestInlineStyle',
  // Reanimated passes the ref it was given down as a prop of its own. Printing
  // it walks the whole host instance, which never ends.
  'forwardedRef',
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
