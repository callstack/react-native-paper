import * as PropTypes from 'prop-types';
import * as React from 'react';
import {
  Dimensions,
  findNodeHandle,
  MeasureOnSuccessCallback,
  NativeModules,
  EmitterSubscription,
} from 'react-native';
import { Rect } from './PopoverGeometry';

export interface Props {
  onPopoverDisplayed?: () => unknown;
  children?: React.ReactNode;
}

export interface State {
  showPopover: boolean;
  popoverAnchor: Rect;
}

export class PopoverTouchable extends React.PureComponent<Props, State> {
  static propTypes = {
    onPopoverDisplayed: PropTypes.func,
  };

  private dimensionsSub?: EmitterSubscription;

  constructor(props: Props) {
    super(props);
    this.state = {
      showPopover: false,
      popoverAnchor: { x: 0, y: 0, width: 0, height: 0 },
    };
    console.warn(
      'PopoverTouchable is deprecated, please use PopoverController instead',
    );
  }

  componentDidMount() {
    this.dimensionsSub = Dimensions.addEventListener(
      'change',
      this.onOrientationChange,
    );
  }

  componentWillUnmount() {
    this.dimensionsSub?.remove();
  }

  private onOrientationChange = () => {
    if (this.state.showPopover) {
      // Need to measure touchable and setFrom rect on popover again
      requestAnimationFrame(this.onPress);
    }
  };

  private touchable: any = null;

  private setRef = (ref: any) => {
    this.touchable = ref;
  };

  private onPress = () => {
    const handle = findNodeHandle(this.touchable);
    if (handle) {
      NativeModules.UIManager.measure(handle, this.onTouchableMeasured);
    }
  };

  private onTouchableMeasured: MeasureOnSuccessCallback = (
    x0,
    y0,
    width,
    height,
    x,
    y,
  ) => {
    this.setState(
      {
        showPopover: true,
        popoverAnchor: { x, y, width, height },
      },
      () => {
        if (this.props.onPopoverDisplayed) {
          this.props.onPopoverDisplayed();
        }
      },
    );
  };

  private onClosePopover = () => this.setState({ showPopover: false });

  render() {
    const children = React.Children.toArray(this.props.children);
    if (
      children.length !== 2 ||
      children[1] instanceof Number ||
      children[1] instanceof String ||
      (children[1] as any).type.displayName !== 'Popover'
    ) {
      throw new Error(
        'Popover touchable must have two children and the second one must be Popover',
      );
    }
    return (
      <React.Fragment>
        {React.cloneElement(children[0] as React.ReactElement<any>, {
          ref: this.setRef,
          onPress: this.onPress,
        })}
        {React.cloneElement(children[1] as React.ReactElement<any>, {
          visible: this.state.showPopover,
          onClose: this.onClosePopover,
          fromRect: this.state.popoverAnchor,
        })}
      </React.Fragment>
    );
  }
}
