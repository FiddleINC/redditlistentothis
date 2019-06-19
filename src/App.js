import React, { Component } from "react";
import "./App.css";
import { clientId, clientSecret, username, password } from "./config";
import { whileStatement } from "@babel/types";
// import { InboxStream, CommentStream, SubmissionStream } from "snoostorm";

const Snoowrap = require("snoowrap");

const r = new Snoowrap({
  userAgent: "reddit-bot-example-node",
  clientId: clientId,
  clientSecret: clientSecret,
  username: username,
  password: password
});

const num = Math.floor(Math.random() * 100);

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      content: [],
      width: [],
      height: [],
      class: "hidden"
    };

    this.getSubmission = this.getSubmission.bind(this);
  }

  getSubmission() {
    let href = [];
    let width = [];
    let height = [];
    r.getSubreddit("listentothis")
      .getTop({ time: "month", limit: 100 })
      .then(response => {
        response.map(sub => {
          // console.log(sub.media_embed.content);
          console.log(sub.media_embed);
          href.push(sub.media_embed.content);
          width.push(sub.media_embed.width);
          height.push(sub.media_embed.height);
        });
      });
    setTimeout(() => {
      this.setState({
        content: href,
        width: width,
        height: height,
        class: ""
      });
    }, 4000);
  }
  componentDidMount() {
    // r.getHot()
    //   .map(post => post.title)
    //   .then(console.log)
    this.getSubmission();
    console.log(this.state);
  }

  componentWillMount() {}

  renderPlayer() {
    setTimeout(() => {
      console.log(
        "This is on Render Player" + this.state.submission[0].content
      );
      return <h1>{this.state.submission[0].content}</h1>;
    }, 3000);
  }
  render() {
    const style = {
      background: "#F5F5F5",
      padding: "20px"

    }
    return (
      <div className="App">
        <div className="App-header">
          <div className={this.state.class} style={style}>
            <div
              dangerouslySetInnerHTML={{
                __html: this.state.content[num]
              }}
              style={{
                width: this.state.width[num],
                height: this.state.height[num]
              }}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default App;
