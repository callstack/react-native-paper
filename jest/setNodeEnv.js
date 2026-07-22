// Must run before any React Native modules load. RN Animated only force-updates
// host styles under Jest when NODE_ENV === 'test'; otherwise setValue/timing
// go through setNativeProps, which does not update props visible to toHaveStyle.
process.env.NODE_ENV = 'test';
