import React, { Component } from "react";
import ReactDelayRender from "react-delay-render";

class Player extends Component {

  componentDidMount() {
    console.log(this.props.submission);
  }
  render() {
    return (
      <div className="player">
        <h1>Hello World</h1>
      </div>
    );
  }
}

export default ReactDelayRender({ delay: 3000 })(Player);
