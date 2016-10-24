## Contributing Guidelines
1. Assign yourself to component(s) from the issues
2. Every component has a link to its section in the Material Design docs, make sure to read the documentation thoroughly before start implementing
3. Default colors will be provided my the theme you, if you find that there's something missing from the theme that might be beneficial for other components
don't hesitate to add it to the theme.
4. For any Text usage, use our components provided in the Typography folder.
5. If your app depends on the theme always wrap you component with `withTheme` to get the theme as a prop instead of the context refer to `TouchableRipple`.
6. Make sure to write a brief description of every prop when defining `propTypes`.
7. Always make sure that your code passes `eslint` before opening a PR
8. Have different usages of your component in the example app.  
