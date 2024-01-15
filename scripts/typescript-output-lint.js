const { promises: fs } = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const output = path.join(root, 'lib', 'typescript');

/**
 * List of React Native props not used by React Native Paper.
 * Feel free to delete props from this list when
 * React Native Paper has defined/uses one with the same name.
 * This script was originally created to detect if TypeScript
 * has exported a large union of props from ViewProps.
 * More info: https://github.com/callstack/react-native-paper/pull/3603
 */
const unusedViewProps = [
  'nativeID',
  'accessibilityActions',
  'accessibilityValue',
  'onAccessibilityAction',
  'accessibilityLabelledBy',
  'accessibilityLiveRegion',
  'accessibilityLanguage',
  'accessibilityViewIsModal',
  'onAccessibilityEscape',
  'onAccessibilityTap',
  'onMagicTap',
  'accessibilityIgnoresInvertColors',
  'hitSlop',
  'removeClippedSubviews',
  'collapsable',
  'needsOffscreenAlphaCompositing',
  'renderToHardwareTextureAndroid',
  'shouldRasterizeIOS',
  'isTVSelectable',
  'hasTVPreferredFocus',
  'tvParallaxProperties',
  'tvParallaxShiftDistanceX',
  'tvParallaxShiftDistanceY',
  'tvParallaxTiltAngle',
  'tvParallaxMagnification',
  'onStartShouldSetResponder',
  'onMoveShouldSetResponder',
  'onResponderEnd',
  'onResponderGrant',
  'onResponderReject',
  'onResponderMove',
  'onResponderRelease',
  'onResponderStart',
  'onResponderTerminationRequest',
  'onResponderTerminate',
  'onStartShouldSetResponderCapture',
  'onMoveShouldSetResponderCapture',
  'onTouchStart',
  'onTouchMove',
  'onTouchEnd',
  'onTouchCancel',
  'onTouchEndCapture',
  'onPointerEnter',
  'onPointerEnterCapture',
  'onPointerLeave',
  'onPointerLeaveCapture',
  'onPointerMove',
  'onPointerMoveCapture',
  'onPointerCancel',
  'onPointerCancelCapture',
  'onPointerDown',
  'onPointerDownCapture',
  'onPointerUp',
  'onPointerUpCapture',
  'onHoverIn',
  'onHoverOut',
  'cancelable',
  'delayHoverIn',
  'delayHoverOut',
  'pressRetentionOffset',
  'android_disableSound',
  'android_ripple',
  'testOnly_pressed',
  'unstable_pressDelay',
];

async function* getFiles(directory) {
  const entries = await fs.readdir(directory, { withFileTypes: true });
  for (const entry of entries) {
    const res = path.resolve(directory, entry.name);
    if (entry.isDirectory()) {
      yield* getFiles(res);
    } else {
      yield res;
    }
  }
}

async function main() {
  for await (const file of getFiles(output)) {
    const content = await fs.readFile(file);
    for (const prop of unusedViewProps) {
      if (content.includes(prop)) {
        throw new Error(
          `Found text '${prop}' in '${file}'. Please use the wrapped 'forwardRef' in 'src/utils/forwardRef.ts', export some return types, or modify 'scripts/typescript-output-lint.js'`
        );
      }
    }
  }

  console.log('✅ No React Native props mentioned in TypeScript files');
}

main().catch((reason) => {
  console.error(reason);
  process.exit(1);
});
