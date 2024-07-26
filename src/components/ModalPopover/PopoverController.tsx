import * as PropTypes from 'prop-types';
import * as React from 'react';
import {
  Dimensions,
  findNodeHandle,
  MeasureOnSuccessCallback,
  NativeModules,
  I18nManager,
  StatusBar,
  EmitterSubscription,
} from 'react-native';
import { Rect } from './PopoverGeometry';

export interface PopoverControllerRenderProps {
  openPopover: () => void;
  closePopover: () => void;
  popoverVisible: boolean;
  setPopoverAnchor: (ref: any) => void;
  popoverAnchorRect: Rect;
}

export interface Props {
  calculateStatusBar?: boolean;
  children: (props: PopoverControllerRenderProps) => React.ReactElement<any>;
}

export interface State {
  showPopover: boolean;
  popoverAnchor: Rect;
}

export class PopoverController extends React.PureComponent<Props, State> {
  static propTypes = {
    children: PropTypes.func.isRequired,
  };

  state: State = {
    showPopover: false,
    popoverAnchor: { x: 0, y: 0, width: 0, height: 0 },
  };

  private dimensionsSub?: EmitterSubscription;

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
      requestAnimationFrame(this.openPopover);
    }
  };

  private touchable: any = null;

  private setTouchableRef = (ref: any) => {
    this.touchable = ref;
  };

  private openPopover = () => {
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
    const dimensions = Dimensions.get('window');
    this.setState({
      showPopover: true,
      popoverAnchor: {
        x: I18nManager.isRTL ? dimensions.width - x : x,
        y:
          y -
          (this.props.calculateStatusBar ? StatusBar.currentHeight ?? 0 : 0),
        width,
        height,
      },
    });
  };

  private closePopover = () => this.setState({ showPopover: false });

  render() {
    return this.props.children({
      openPopover: this.openPopover,
      closePopover: this.closePopover,
      setPopoverAnchor: this.setTouchableRef,
      popoverVisible: this.state.showPopover,
      popoverAnchorRect: this.state.popoverAnchor,
    });
  }
}
