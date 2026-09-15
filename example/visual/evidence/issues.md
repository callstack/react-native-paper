# agent-device findings from the PoC, verified

Nineteen observations were recorded while using agent-device 0.21.0 (`npx agent-device@0.21.0`) as a visual regression tool on the example app, on an iPhone 17 Pro simulator (iOS 26.5) and a `Pixel_10_Pro` emulator (API 37). On 2026-09-15 every one was re-checked against the 0.21.3 docs and source, the emulator, and the upstream issue tracker, with one question: is this agent-device's fault, or ours?

Result: **none was an unreported agent-device bug.** One was a real ergonomic gap and has since been fixed upstream. Two are documented behaviour worth knowing. The rest were our own build, our runner, React Native, or claims that did not survive re-testing. They are kept below because most of them are things anyone scripting this loop will hit. Original numbers are in brackets so the README references still resolve.

## What holds up

**The default diff threshold is too loose for shadows; we use 0.02 [4].** Documented, deterministic behaviour, not a defect: `--threshold` "sets the per-pixel RGB tolerance (default 0.1)", and the implementation maps it to a colour distance of about 44 RGB units. A one-step Material elevation change moves a shadow by a few units per channel, so at 0.1 the realistic Surface regression diffs to 0 changed pixels and `match: true` on both platforms, while 0.02 catches it (10,179 px on iOS, 9,336 px on Android, identical on three captures each, noise floor 0 at every threshold down to 0.01). Full numbers in `results.csv`, images in `diff-images/`. Any suite built on this must set the threshold explicitly and verify noise at it. One small upstream ask survives: the diff result JSON does not record which threshold produced it, so a saved diff cannot say what tolerance it was run at.

**Implicit sessions were keyed by cwd only [6], fixed upstream.** Driving iOS and Android from one checkout needed a hand-named `--session` on every command. Reported as callstack/agent-device#2580 and fixed: the unreleased changelog entry keys the implicit session by workspace and platform (not yet released as of 0.21.3). Our iOS commands also omitted `--platform`, which parked the session on the platform-less default and made the conflict worse.

**`diff screenshot --out` writes the image only when pixels differ [17].** On a match it writes nothing and deletes any stale file at that path, so a previous run's diff can never be mistaken for the current one. `diffPath` in the response is the signal, not file existence. The docs say it "writes a diff PNG when `--out` is provided" without the on-mismatch qualifier; that is the only remark.

**`--crop-on` is refused on web [19].** Documented: accepted on iOS simulators and Android emulators only, refused before any device work (`CROP_TARGET_NOT_ACCEPTED`). `open` and full-page `screenshot` work on web (`web-excerpt.json`). A web leg would be full-viewport diffs, a different loop, with page motion frozen since it cannot be cropped out.

## Our build and our runner, not the tool

**Expo dev-client chrome ends up in screenshots [3, 9, 14, 18].** A dev build cold-starts into the Expo dev launcher on Android and shows the dev menu on iOS a few seconds after the bundle loads. Reproduced with plain `adb shell am force-stop` and `monkey`, no agent-device involved. The dev-client's floating "Tools" button, toggled by the dev menu entry "Tools button", sat inside the Android crop and produced a deterministic 2,822 px false FAIL with `src/` clean (`diff-images/android-devclient-tools-button.png`, `devclient-excerpt.json`). agent-device already flags the loading state: `wait stable` returned "Settled on a nearly-empty tree, the app may still be loading. Wait for specific content." A runner must reconnect to the dev server after any relaunch, wait for real content, dismiss the menu, and check for the floating button. A release build removes the whole class.

**Fast Refresh did not reach the Android app after a relaunch [15].** Metro served the new bundle; the app kept the old one until a Reload. Metro and Expo behaviour, and agent-device documents the remedy we did by hand through the dev menu: `agent-device metro reload`, "before `open <app> --relaunch`". A runner should use that, never Fast Refresh.

**The example app restores its last route on relaunch [13].** `PERSISTENCE_KEY = 'NAVIGATION_STATE'` in `example/src/index.tsx`. A runner cannot assume the list is at the top after `open --relaunch`; it has to press Back to the root and pick the "Surface" row, not the header title with the same label.

**Android exposes the same label on a row and its text child [7].** React Native's accessibility output, visible on every example row and on the Expo launcher itself, so `find 'label="Surface"'` is `AMBIGUOUS_MATCH` there and unique on iOS. agent-device documents the disambiguators: `--first`, `--last`, a `role=` qualifier, and the read-only `list` action that returns the candidates without tapping.

**`scroll bottom` hit its pass limit on the example list [2].** A documented, bounded edge-seek that refuses to swipe forever; the dev menu was on screen absorbing the gestures, which is also why the edge was never reached. Use `scroll down 6 --settle`, or `scroll <dir> --until <selector>` on 0.21.1 and later.

## Withdrawn after re-verification

These were recorded as agent-device problems and are not.

- **`find` taps its match [1].** `find` is documented as `find <locator> <action>` with `click` as the default action and a read-only `list` action that never taps. Upstream #1625 raised the same complaint and was closed in August with `list` as the answer. We ran bare `find` and got the documented default.
- **No timing in `screenshot --json` [5].** Per-command durations are in the session event log (`agent-device events`, `request.finished` with `durationMs`); `open` returns `startup.durationMs` as well.
- **Stale refs rejected with a confusing message [8].** The response carries `hint: "Capture a fresh interactive snapshot (snapshot -i) or use a stable selector, then retry."`, a reason code, and the set of refs the frame does accept. The message says exactly what to do.
- **`logs` reports success on an inactive log [10].** Bare `logs` is documented as an info query; `success: true` means the query ran, and `active`, `state` and `sizeBytes` are the answer. Logging is documented as off until `logs start`.
- **`--pixel-density` is iOS-only [11].** Documented in the CLI help; Android returns native pixels anyway.
- **`snapshot` returns empty `nodes` when the tree is unchanged [12].** Not reproducible: two consecutive `snapshot --json` returned the full 57 nodes both times, and the source never empties `nodes`, only adds an `unchanged` metadata field. The text-mode "unchanged" acknowledgement is documented. The empty result we saw most likely came from a `--scope` that matched nothing.
- **Occasional exit 1 with empty stdout and stderr [16].** Two unlogged occurrences on iOS; 0 of 40 rapid calls on Android reproduced it; nothing upstream. Not supportable.

## Filing history

Five of these were filed on callstack/agent-device on 2026-09-14 (#2579 to #2583) and withdrawn the same day. One (#2581, the Node client "unreachable" without a dependency) was simply wrong and a maintainer closed it within the hour; it has been removed from this file. #2580 was fixed upstream regardless. Nothing else is filed, and nothing will be without a maintainer of this repo deciding to.
