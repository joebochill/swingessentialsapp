import React from 'react';
import { TouchableWithoutFeedback } from 'react-native';

export default class NTap extends React.Component {
  static defaultProps = {
    n: 3,
    delay: 450,
    onMultiTap: () => null,
  };

  lastTap = null;
  start = null;
  tapCount = 0;

  handleTap = () => {
    const now = Date.now();
    if (this.start && (now - this.start) < this.props.delay) {
        this.tapCount++;
        if(this.tapCount >= this.props.n)
      if(this.props.onMultiTap){this.props.onMultiTap();}
    } else {
      this.start = now;
      this.tapCount = 1;
    }
  }

  render() {
    return (
      <TouchableWithoutFeedback onPress={this.handleTap}>
        {this.props.children}
      </TouchableWithoutFeedback>
    );
  }
}