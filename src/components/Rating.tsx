import * as React from 'react';
import { withTheme } from '../core/theming';
import { Theme } from '../types';
import {
  GestureResponderEvent,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import Icon from './Icon';

export type Props = {
  /**
   * Max possible rating value.
   */
  max: number;
  /**
   * Rating value.
   */
  value: number;
  /**
   * Whether the component editable or not.
   */
  editable?: boolean;
  /**
   * Fill colour.
   */
  color?: string;
  /**
   * Size of icons.
   */
  size?: number;
  /**
   * Whether to animate icons on touch.
   */
  animate?: boolean;
  /**
   * Whether half rating input is allowed.
   */
  allowHalfInput?: boolean;
  /**
   * User defined styles for wrapping icons.
   */
  customStyles?: object;
  /**
   * Callback to access changed rating value in editable version.
   */
  onRatingChanged?: ((changedValue: number) => void) | (() => void);
  /**
   * @optional
   */
  theme: Theme;
};

export type State = {
  /**
   * Rating value.
   */
  value: number;
};

/**
 * Rating component for visualizing scores/feedback.
 * It has both a read only and an editable version.
 *
 * <div class="screenshots">
 *   <figure>
 *     <img src="screenshots/rating-default.png" />
 *     <figcaption>Default</figcaption>
 *   </figure>
 *   <figure>
 *     <img src="screenshots/rating-custom-styles.png" />
 *     <figcaption>With Customizations</figcaption>
 *   </figure>
 * </div>
 *
 * ## Usage
 * ```js
 import * as React from 'react';
 import { View } from 'react-native';
 import { Rating } from 'react-native-paper';

 export default class RatingExample extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      editableValue: 1,
    };
  }

  onRatingChanged(changedValue) {
    this.setState({ editableValue: changedValue });
  }

  render() {
    const { editableValue } = this.state;
    return (
      <View>
        <Rating value={3} max={5} color={'red'} size={24} />
        <Rating value={2.5} max={5} color={'#0c6cc1'} />
        <Rating
          value={editableValue}
          max={10}
          editable={true}
          onRatingChanged={this.onRatingChanged.bind(this)}
        />
        <Rating
          value={1.5}
          max={5}
          color={'magenta'}
          customStyles={{flex: 1, alignItems: 'center'}}
        />
      </View>
    );
  }
}
 * ```
 */
class Rating extends React.Component<Props, State> {
  static defaultProps: Partial<Props> = {
    editable: false,
    color: 'gold',
    size: 36,
    animate: true,
    allowHalfInput: true,
    customStyles: {},
    onRatingChanged: () => {},
  };

  constructor(props: Props) {
    super(props);
    this.state = {
      value: props.max / 2,
    };
  }

  updateRating = (e: GestureResponderEvent, i: number) => {
    const { editable, onRatingChanged } = this.props;
    if (!editable) return;
    const newRating = this.calculateRating(e, i);
    this.setState({ value: newRating });
    // @ts-ignore
    onRatingChanged(newRating);
  };

  calculateRating = (event: GestureResponderEvent, i: number) => {
    const { size, allowHalfInput } = this.props;
    if (!allowHalfInput) return i;
    return event.nativeEvent.locationX < Number(size) / 2 ? i - 0.5 : i;
  };

  getIconSource = (value: number, i: number) => {
    return i > value
      ? i - value <= 0.5
        ? 'star-half'
        : 'star-outline'
      : 'star';
  };

  render() {
    const { max, color, animate, customStyles } = this.props;
    const size = Number(this.props.size);
    const opacity = animate ? 0.5 : 1;
    const { value } = this.state;
    let source;
    let outputs = [];

    for (let i = 1; i <= max; ++i) {
      source = this.getIconSource(value, i);
      outputs.push(
        <TouchableOpacity
          activeOpacity={opacity}
          key={i}
          onPress={e => this.updateRating(e, i)}
          style={customStyles}
        >
          <Icon source={source} color={color} size={size} />
        </TouchableOpacity>
      );
    }
    return <View style={styles.container}>{outputs}</View>;
  }
}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'row',
  },
});

export default withTheme(Rating);
