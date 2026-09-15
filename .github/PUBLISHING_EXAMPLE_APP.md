# Publishing the example app

The example app is the demo of the library that we ship to the App Store and the
Play Store. It is published automatically by the
[`Publish example app`](workflows/publish-example-app.yml) workflow whenever a
library release is published.

## This does not affect library releases

The workflow runs **after** a release already exists. By the time it starts,
`release-it` has already published to npm and created the GitHub release, so
nothing the workflow does can fail, revoke or roll back a release.

A run that does not succeed says so on its own run page, above the logs: the
library release published normally and only the demo app is missing an update.
Whoever published the release is already emailed by GitHub that the run failed,
so that page is where they land.

Before re-running, check the EAS dashboard and the stores. A build may already
have been submitted, and submitting the same version twice is the one thing
worth avoiding — cancelling the workflow does not cancel a build already running
on EAS, so even a cancelled run can ship on its own. The run page spells this
out.

## What happens on a release

The submit profile is chosen from the release tag: a tag containing a hyphen is
a semver prerelease, and anything else is stable.

| Tag              | Android                     | iOS                           |
| ---------------- | --------------------------- | ----------------------------- |
| `v6.0.0-alpha.1` | Play Store internal track   | App Store Connect, TestFlight |
| `v6.0.0`         | Play Store production track | App Store Connect, TestFlight |

The tag is used rather than the release's prerelease flag because
[`.release-it.json`](../.release-it.json) currently pins every release to
`preRelease: true` for the 6.0 alpha cycle. Reading that flag would send a
stable 6.0.0 release to the internal track if somebody forgot to revert the pin.

Note that `eas submit` uploads an iOS build to App Store Connect, where it
becomes available in TestFlight. Releasing that build to the App Store is a
separate manual step in App Store Connect, so the iOS half behaves the same for
prereleases and stable releases.

## Versions

The example app keeps its own version line, independent of the library. Each
release bumps its minor version, so a library release of `v6.0.0` moves the
example app from `3.16.0` to `3.17.0`. After submitting, the workflow opens a
pull request with that bump.

That pull request needs merging before the next release. The bump is computed
from `main`, so two releases while it is still open both start from the same
version and ship under it. The stores accept that, because EAS assigns build
numbers separately, which is exactly why it is worth watching for: the two
builds are then hard to tell apart.

iOS build numbers and Android version codes are **not** kept in the repository.
EAS assigns them remotely via `appVersionSource: remote` and `autoIncrement`, so
retries and reruns cannot collide with an already submitted build. The
`buildNumber` and `versionCode` values still in `example/app.json` are ignored by
EAS, which warns about them on every build. They are kept only because local
`expo run:` builds still read them, and they are no longer authoritative.

The workflow always builds the example app as it is on `main`, not as it was at
the release tag. `release-it` tags the tip of `main`, so these are the same at
release time, and for a demo app the newer one is the one worth shipping anyway.

The bump pull request is opened with `GITHUB_TOKEN`, so CI does not run on it.
That is a known GitHub limitation rather than a choice, and it is acceptable
here because the pull request only changes a version string.

## Retrying a failed deployment

Check the stores first, as above. Then run the workflow by itself, without
cutting a new library release:

**Actions → Publish example app → Run workflow → the release tag**

If the previous run shipped one platform and failed the other, pick that one
platform in the `platform` input. Retrying with `all` would submit a duplicate
to the platform that already shipped.

Retry **before** merging the version bump pull request that the run opened.
Merging it first moves `main` on, so the retry bumps again and ships the second
platform under a different version from the first.

## One-time setup

### Repository secret

`EXPO_TOKEN` is the only secret this workflow needs. It should be a token for an
Expo bot account belonging to the `react-native-paper` organisation rather than
a personal account, so that it survives people joining and leaving.

Store credentials deliberately live in EAS, not in GitHub. Nothing about the
Apple or Google accounts is configured in this repository.

### Repository setting

Enable **Settings → Actions → General → Allow GitHub Actions to create and
approve pull requests**. Without it the version bump pull request fails with a
403 _after_ the app has already been submitted.

### Store credentials

Run once, from `example/`:

```sh
eas credentials
```

- **iOS**: use an App Store Connect API key. Apple ties app-specific passwords to
  an individual person's account, so they break when that person rotates their
  password or leaves.
- **Android**: upload a Google Play service account key with the
  _Release manager_ role.

### Seeding remote build numbers

Remote versioning starts from scratch, and both stores reject a build that does
not increase. Seed the remote values from the ones currently in
`example/app.json` before the first automated run, from `example/`:

```sh
eas build:version:set --platform android   # set to at least 38
eas build:version:set --platform ios       # set to at least 26.0.5
```

## Rollback

A build that has already been submitted cannot be withdrawn by re-running or
deleting anything in GitHub. Roll it back where it was published:

- **Play Store**: halt the rollout in the Play Console, and promote the previous
  release if it was already live.
- **App Store**: expire the TestFlight build, or reject it in App Store Connect
  if it had been submitted for review.

Then land the fix and cut a new release as usual.

## Reference

- [EAS Build](https://docs.expo.dev/build/introduction/)
- [EAS Submit](https://docs.expo.dev/submit/introduction/)
- [App version management](https://docs.expo.dev/build-reference/app-versions/)
