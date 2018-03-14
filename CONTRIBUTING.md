# Contributing to React Native Paper

React Native Paper was started by [satya164](https://github.com/satya164) and [ahmedlhanafy](https://github.com/ahmedlhanafy). Right now, is one of [Callstack](https://callstack.com)'s open source projects that is currently under active development.

## [Code of Conduct](/CODE_OF_CONDUCT.md)

We want this community to be friendly and respectful to each other. Please read [the full text](/CODE_OF_CONDUCT.md) so that you can understand what actions will and will not be tolerated.

## Our Development Process

The core team works directly on GitHub and all work is public.

### Workflow and Pull Requests

> **Working on your first Pull Request?** 
You can learn how from this *free* series [How to Contribute to an Open Source Project on GitHub](https://egghead.io/series/how-to-contribute-to-an-open-source-project-on-github)

*Before* submitting a pull request, please make sure the following is done:

1. Fork the repo and create your branch from `master` (a guide on [how to fork a repository](https://help.github.com/articles/fork-a-repo/))

2. We have a commit message convention, messages should start by one of the following: 
* `fix`: : for bug fixes, e.g. fix Button color on DarkTheme
* `feat`: for new features, e.g. add Snackbar component
* `refactor`: for code/structure refactor, e.g. new structure folder for components
* `BREAKING`: for changes that break current versiong usage, e.g. remove withTheme
* `docs`: changes into documentation, e.g. add usage example for Button
* `chore`: tooling changes, e.g. change circle ci config
* `test`: for testcases, eg unit, snapshot testing

3. We use `flow`, `eslint` and `prettier`. Be sure that `npm run flow` and `npm run lint -- --fix` give no errors.

4. If you work on a component:
   * Be sure to follow the specifics (design, name convention, etc) described in the [official material docs](https://material.io/guidelines/)
   * For any Text usage, use our components provided in the Typography folder
   * If your app depends on the theme always wrap you component with `withTheme` to get the theme as a prop instead of the context
   * Default colors will be provided by the theme, if you find that there's something missing from the theme that might be beneficial for other components don't hesitate to add it
   * Make sure to write a brief description of every prop when defining `type Props`
   * Make sure to provide an example usage for the component (check how others do it)

5. In case of doubts, check out the current code. For example, we use the prop `icon` not `iconName`.

6. You can run `yarn bootstrap` which will install all the dependencies in example & docs folder respectively.

## Running the example

The example app uses [Expo](https://expo.io/). You will need to install the Expo app for [Android](https://play.google.com/store/apps/details?id=host.exp.exponent) and [iOS](https://itunes.apple.com/app/apple-store/id982107779) to start developing.

After you're done, you can run `yarn && yarn start` in the `example/` folder and scan the QR code to launch it on your device.

## Working on documentation

The documentation is automatically generated from the [flowtype](https://flowtype.org) annotation in the components. You can add comments above the type annotations to add descriptions. To preview the generated documentation, run `yarn && yarn start` in the `docs/` folder.

When your pull request is merged to master, the documentation updates are automatically deployed to the website.

## Reporting New Issues

The best way to get your bug fixed is to provide a reduced test case. Please provide a public repository with a runnable example.

## How to Get in Touch

* Callstack Open Source Slack - [#react-native-paper](https://slack.callstack.io/).

## Code Conventions

We use [eslint-config-callstack](https://github.com/callstack/eslint-config-callstack-io).

## License

By contributing to React Native Paper, you agree that your contributions will be licensed under its **MIT** license.

