/* eslint-disable no-undef */
import React, { Component } from "react";
import axios from "axios";
import "./App.css";
import hash from "./hash";
import {
  RedditclientId,
  RedditclientSecret,
  Redditusername,
  Redditpassword,
  client_id,
  client_secret,
  redirect_uris
} from "./config";
// import { InboxStream, CommentStream, SubmissionStream } from "snoostorm";

const oauth2Endpoint = "https://accounts.google.com/o/oauth2/v2/auth";
const scopes = [
  "https://www.googleapis.com/auth/youtube",
  "https://www.googleapis.com/auth/youtube.readonly",
  "https://www.googleapis.com/auth/youtubepartner",
  "https://www.googleapis.com/auth/youtube.force-ssl"
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
      YouTubeRedirect: "",
      userId: null,
      videoId: null,
      playlists: [
        {
          id: null,
          title: ""
        }
      ],
      selectedPlaylist: [
        {
          id: null,
          title: ""
        }
      ],
      validationError: null,
      index: num,
      loggedIn: false
    };

    this.getSubmission = this.getSubmission.bind(this);
    this.getCredentials = this.getCredentials.bind(this);
    this.validateToken = this.validateToken.bind(this);
    this.getYouTubeData = this.getYouTubeData.bind(this);
    // this.getYouTubePlaylists = this.getYouTubePlaylists.bind(this);
    // this.addId = this.addId.bind(this);
    this.getVideoId = this.getVideoId.bind(this);
    this.addToPlaylist = this.addToPlaylist.bind(this);
    this.refreshPage = this.refreshPage.bind(this);
    this.show_login_status = this.show_login_status.bind(this);
    this.onStateChange = this.onStateChange.bind(this);
    this.getDocumentIframe = this.getDocumentIframe.bind(this);
  }

  getCredentials() {
    this.setState({
      YouTubeClientID: client_id,
      YouTubeClientSecret: client_secret,
      YouTubeRedirect: redirect_uris[0]
    });
  }

  getYouTubeData() {
    const config = {
      headers: {
        Authorization: "Bearer " + this.state.token,
        Accept: "application/json"
      }
    };

    axios
      .get(
        "https://www.googleapis.com/youtube/v3/channels?part=snippet&mine=true",
        config
      )
      .then(response => {
        response.data.items.map(item => {
          this.setState({
            userId: item.id
          });
        });
      });
  }

  getYouTubePlaylists() {
    const config = {
      headers: {
        Authorization: "Bearer " + this.state.token,
        Accept: "application/json"
      }
    };

    const url =
      "https://www.googleapis.com/youtube/v3/playlists?part=snippet%2CcontentDetails&maxResults=25&mine=true";

    axios.get(url, config).then(response => {
      let playlists = [];
      response.data.items.forEach(item => {
        playlists.push({ id: item.id, title: item.snippet.title });
      });
      this.setState({
        playlists: playlists,
        selectedPlaylist: {
          id: playlists[0].id,
          title: playlists[0].title
        }
      });
    });
  }

  validateToken() {
    if (this.state.token) {
      axios({
        method: "post",
        url: oauth2Endpoint + "?access_token=" + this.state.token
      }).then(response => console.log(response.data));
    }
  }

  getSubmission() {
    let href = [];
    let width = [];
    let height = [];
    r.getSubreddit("listentothis")
      .getTop({ time: "month", limit: 100 })
      .then(response => {
        response.map(sub => {
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
      // this.getDocumentIframe();
    }, 6000);
  }

  getVideoId() {
    let videoIdList;
    let url = this.state.html[this.state.index];
    if (url !== undefined) {
      let strUrl1 = url.split("/");
      let idList = strUrl1[4].split("?");
      videoIdList = idList[0];
    }
    this.setState({
      videoId: videoIdList
    });
  }

  addToPlaylist() {
    this.getVideoId();
    setTimeout(() => {
      axios({
        method: "post",
        url: "https://www.googleapis.com/youtube/v3/playlistItems?part=snippet",
        headers: {
          Authorization: "Bearer " + this.state.token,
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        data: {
          snippet: {
            playlistId: this.state.selectedPlaylist,
            position: 0,
            resourceId: {
              kind: "youtube#video",
              videoId: this.state.videoId
            }
          }
        }
      })
        .then(response => {
          alert("Done!");
        })
        .catch(error => {
          alert("Request Failed! Try with Different Playlist");
        });
    }, 4000);
  }

  getDocumentIframe() {
    let doc = document.getElementsByTagName("iframe")[0];
    doc.setAttribute("id", "player");
    console.log(doc);
    this.onYouTubeIframeAPIReady();
  }

  onYouTubeIframeAPIReady() {
    let player = new YT.Player("player", {
      playerVars: { autoplay: 1 },
      events: {
        onStateChange: this.onStateChange
      }
    });
  }

  onStateChange(event) {
    console.log(event);
    if (event.data === 0) {
      this.refreshPage();
    }
  }

  componentDidMount() {
    this.getYouTubeData();
    this.getYouTubePlaylists();
  }

  componentWillMount() {
    let _token = hash.access_token;

    if (_token) {
      // Set token
      this.setState({
        token: _token
      });
    }
    this.getSubmission();
    this.getCredentials();
    this.validateToken();
  }

  refreshPage() {
    // window.location.reload();
    this.setState({
      index: Math.floor(Math.random() * 100)
    });
  }

  show_login_status(status) {
    this.setState({
      loggedIn: status
    });
  }

  // addId() {
  //   document.getElementsByTagName("iframe")[0].setAttribute("id", "yt");
  // }

  render() {
    const style = {
      background: "#F5F5F5",
      padding: "20px"
    };
    return (
      <div className="App">
        <img
          className="hidden"
          alt="google"
          onLoad={() => this.show_login_status(true)}
          onError={() => this.show_login_status(false)}
          src="https://accounts.google.com/CheckCookie?continue=https%3A%2F%2Fwww.google.com%2Fintl%2Fen%2Fimages%2Flogos%2Faccounts_logo.png&followup=https%3A%2F%2Fwww.google.com%2Fintl%2Fen%2Fimages%2Flogos%2Faccounts_logo.png&chtml=LoginDoneHtml&checkedDomains=youtube&checkConnection=youtube%3A291%3A1"
        />
        <div className="App-header">
          {this.state.token ? (
            <div>
              <div className={this.state.class}>
                <button
                  type="button"
                  onClick={this.refreshPage}
                  className="btn btn--loginApp-link"
                >
                  {" "}
                  <span>Refresh</span>
                </button>
                <div style={style}>
                  <div
                    dangerouslySetInnerHTML={{
                      __html: this.state.html[this.state.index]
                    }}
                    onMouseEnter={this.getDocumentIframe}
                    style={{
                      width: this.state.width[this.state.index],
                      height: this.state.height[this.state.index],
                      border: "7.5px solid #292C35"
                    }}
                  />
                </div>
              </div>
              <div className={this.state.class}>
                <div className="dropdown">
                  <div className="dropdown-content">
                    <select
                      value={this.state.selectedPlaylist}
                      onChange={e =>
                        this.setState({
                          selectedPlaylist: e.target.value,
                          validationError:
                            e.target.value === "" ? "Select a Playlist" : ""
                        })
                      }
                    >
                      {this.state.playlists.map(playlist => (
                        <option key={playlist.id} value={playlist.id}>
                          {playlist.title}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div style={{ color: "red", marginTop: "5px" }}>
                    {this.state.validationError}
                  </div>
                </div>
                <button
                  type="button"
                  // eslint-disable-next-line no-restricted-globals
                  onClick={this.addToPlaylist}
                  className="btn btn--loginApp-link"
                >
                  {" "}
                  <span>Add To Playlist</span>
                </button>
              </div>
            </div>
          ) : (
            <div>
              <h1>Listen to This Reddit</h1>
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
