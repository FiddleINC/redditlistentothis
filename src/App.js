import React, { Component } from "react";
import "./App.css";
import { clientId, clientSecret, username, password } from "./config";
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
      author_name: [],
      html: [],
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
        console.log(response);
        response.map(sub => {
          // console.log(sub.media_embed.content);
          console.log(sub.media);
          href.push(sub.media_embed.content);
          width.push(sub.media_embed.width);
          height.push(sub.media_embed.height);
        });
      });
    setTimeout(() => {
      this.setState({
        html: href,
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

  refreshPage() {
    window.location.reload();
  }
  render() {
    const style = {
      background: "#F5F5F5",
      padding: "20px"
    };
    return (
      <div className="App">
        <div className="App-header">
          <div className={this.state.class} style={style}>
            <div
              dangerouslySetInnerHTML={{
                __html: this.state.html[num]
              }}
              style={{
                width: this.state.width[num],
                height: this.state.height[num],
                border: "7.5px solid #292C35"
              }}
            />
          </div>
          <div className={this.state.class}>
            <button type="button" onClick={this.refreshPage} className="button">
              {" "}
              <span>Refresh</span>
            </button>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
