import React, { Component } from "react";
import axios from "axios";
import "./App.css";
import hash from "./hash";
import {
  RedditclientId,
  RedditclientSecret,
  Redditusername,
  Redditpassword
} from "./config";
// import { InboxStream, CommentStream, SubmissionStream } from "snoostorm";

const oauth2Endpoint = "https://accounts.google.com/o/oauth2/v2/auth";
const scopes = [
  "https://www.googleapis.com/auth/youtube",
  "https://www.googleapis.com/auth/youtube.readonly"
];

const Snoowrap = require("snoowrap");

/* Working on the Reddit API*/
const r = new Snoowrap({
  userAgent: "reddit-bot-example-node",
  clientId: RedditclientId,
  clientSecret: RedditclientSecret,
  username: Redditusername,
  password: Redditpassword
});

const num = Math.floor(Math.random() * 100);

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      token: null,
      author_name: [],
      html: [],
      width: [],
      height: [],
      class: "hidden",
      YouTubeClientID: "",
      YouTubeClientSecret: "",
      YouTubeRedirect: ""
    };

    this.getSubmission = this.getSubmission.bind(this);
    this.getYouTubeData = this.getYouTubeData.bind(this);
    this.validateToken = this.validateToken.bind(this);
  }

  getYouTubeData() {
    axios.get("../client_secret.json").then(response => {
      console.log(response.data.web);
      this.setState({
        YouTubeClientID: response.data.web.client_id,
        YouTubeClientSecret: response.data.web.client_secret,
        YouTubeRedirect: response.data.web.redirect_uris[0]
      });

      console.log(
        this.state.YouTubeClientID,
        this.state.YouTubeClientSecret,
        this.state.YouTubeRedirect
      );
    });
  }

  validateToken() {
    if (this.state.token) {
      axios({
        method: "post",
        url: oauth2Endpoint + "?access_token=" + this.state.token
      }).then(response => console.log(response));
    }
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
      console.log(this.state.token);
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
    let _token = hash.access_token;

    if (_token) {
      // Set token
      this.setState({
        token: _token
      });
    }
  }

  componentWillMount() {
    this.getYouTubeData();
    this.validateToken();
  }

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
          {this.state.token ? (
            <div>
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
                <button
                  type="button"
                  onClick={this.refreshPage}
                  className="btn btn--loginApp-link"
                >
                  {" "}
                  <span>Refresh</span>
                </button>
              </div>
            </div>
          ) : (
            <div>
              <a
                className="btn btn--loginApp-link"
                href={`${oauth2Endpoint}?client_id=${
                  this.state.YouTubeClientID
                }&redirect_uri=${this.state.YouTubeRedirect.toString()}&scope=${scopes.join(
                  "%20"
                )}&response_type=token&show_dialog=true&include_granted_scopes=true&state=state_parameter_passthrough_value`}
              >
                Login to YouTube
              </a>
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default App;
