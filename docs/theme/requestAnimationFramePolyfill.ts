// react-native-worklets 0.13 calls `requestAnimationFrame` at module scope,
// which doesn't exist during SSG in Node. Remove once the upstream fallback
// (software-mansion/react-native-reanimated#10667) ships in a stable release.
if (typeof globalThis.requestAnimationFrame === 'undefined') {
  globalThis.requestAnimationFrame = (callback: FrameRequestCallback) =>
    setTimeout(() => callback(Date.now()), 16);
}
