import * as React from 'react';
import { StyleSheet, TextInput, I18nManager, } from 'react-native';
import color from 'color';
import IconButton from './IconButton';
import Surface from './Surface';
import { withTheme } from '../core/theming';
import MaterialCommunityIcon from './MaterialCommunityIcon';
/**
 * Searchbar is a simple input box where users can type search queries.
 *
 * <div class="screenshots">
 *   <img class="medium" src="screenshots/searchbar.png" />
 * </div>
 *
 * ## Usage
 * ```js
 * import * as React from 'react';
 * import { Searchbar } from 'react-native-paper';
 *
 * export default class MyComponent extends React.Component {
 *   state = {
 *     firstQuery: '',
 *   };
 *
 *   render() {
 *     const { firstQuery } = this.state;
 *     return (
 *       <Searchbar
 *         placeholder="Search"
 *         onChangeText={query => { this.setState({ firstQuery: query }); }}
 *         value={firstQuery}
 *       />
 *     );
 *   }
 * }
 * ```
 */
class Searchbar extends React.Component {
    constructor() {
        super(...arguments);
        this.handleClearPress = () => {
            this.clear();
            this.props.onChangeText && this.props.onChangeText('');
        };
    }
    /**
     * @internal
     */ setNativeProps(args) {
        return this.root && this.root.setNativeProps(args);
    }
    /**
     * Returns `true` if the input is currently focused, `false` otherwise.
     */
    isFocused() {
        return this.root && this.root.isFocused();
    }
    /**
     * Removes all text from the TextInput.
     */
    clear() {
        return this.root && this.root.clear();
    }
    /**
     * Focuses the input.
     */
    focus() {
        return this.root && this.root.focus();
    }
    /**
     * Removes focus from the input.
     */
    blur() {
        return this.root && this.root.blur();
    }
    render() {
        const { clearAccessibilityLabel, clearIcon, icon, iconColor: customIconColor, inputStyle, onIconPress, multiline, numberOfLines, placeholder, searchAccessibilityLabel, style, theme, value, ...rest } = this.props;
        const { colors, roundness, dark, fonts } = theme;
        const textColor = colors.text;
        const font = fonts.regular;
        const iconColor = customIconColor ||
            (dark
                ? textColor
                : color(textColor)
                    .alpha(0.54)
                    .rgb()
                    .string());
        const rippleColor = color(textColor)
            .alpha(0.32)
            .rgb()
            .string();
        return (React.createElement(Surface, { style: [
                { borderRadius: roundness, elevation: 4 },
                styles.container,
                style,
            ] },
            React.createElement(IconButton, { accessibilityTraits: "button", accessibilityComponentType: "button", accessibilityRole: "button", borderless: true, rippleColor: rippleColor, onPress: onIconPress, color: iconColor, icon: icon ||
                    (({ size, color }) => (React.createElement(MaterialCommunityIcon, { name: "magnify", color: color, size: size, direction: I18nManager.isRTL ? 'rtl' : 'ltr' }))), accessibilityLabel: searchAccessibilityLabel }),
            React.createElement(TextInput, Object.assign({ style: [styles.input, { color: textColor, ...font }, inputStyle], placeholder: placeholder || '', placeholderTextColor: colors.placeholder, selectionColor: colors.primary, underlineColorAndroid: "transparent", multiline: multiline || false, numberOfLines: numberOfLines, returnKeyType: "search", keyboardAppearance: dark ? 'dark' : 'light', accessibilityTraits: "search", accessibilityRole: "search", ref: c => {
                    this.root = c;
                }, value: value }, rest)),
            React.createElement(IconButton, { borderless: true, disabled: !value, accessibilityLabel: clearAccessibilityLabel, color: value ? iconColor : 'rgba(255, 255, 255, 0)', rippleColor: rippleColor, onPress: this.handleClearPress, icon: clearIcon ||
                    (({ size, color }) => (React.createElement(MaterialCommunityIcon, { name: "close", color: color, size: size, direction: I18nManager.isRTL ? 'rtl' : 'ltr' }))), accessibilityTraits: "button", accessibilityComponentType: "button", accessibilityRole: "button" })));
    }
}
const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    input: {
        flex: 1,
        fontSize: 18,
        paddingLeft: 8,
        alignSelf: 'stretch',
        textAlign: I18nManager.isRTL ? 'right' : 'left',
        minWidth: 0,
    },
});
export default withTheme(Searchbar);
