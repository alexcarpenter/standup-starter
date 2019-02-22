import React from "react";

export default class Toggle extends React.Component {
  state = {
    open: false
  };

  onToggle = () => {
    this.setState(state => ({ open: !state.open }));
  };

  render() {
    return this.props.children({
      isOpen: this.state.open,
      onToggle: this.onToggle
    });
  }
}
