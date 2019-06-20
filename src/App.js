import React, { Component } from 'react';
import axios from 'axios';
import './App.css';
import hash from './hash';
import { RedditclientId, RedditclientSecret, Redditusername, Redditpassword } from './config';
// import { InboxStream, CommentStream, SubmissionStream } from "snoostorm";

const oauth2Endpoint = 'https://accounts.google.com/o/oauth2/v2/auth';
const scopes = [
	'https://www.googleapis.com/auth/youtube',
	'https://www.googleapis.com/auth/youtube.readonly',
	'https://www.googleapis.com/auth/youtubepartner',
	'https://www.googleapis.com/auth/youtube.force-ssl'
];

const Snoowrap = require('snoowrap');

/* Working on the Reddit API*/
const r = new Snoowrap({
	userAgent: 'reddit-bot-example-node',
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
			class: 'hidden',
			YouTubeClientID: '',
			YouTubeClientSecret: '',
			YouTubeRedirect: '',
			userId: null,
			videoId: null,
			playlistId: null
		};

		this.getSubmission = this.getSubmission.bind(this);
		this.getCredentials = this.getCredentials.bind(this);
		this.validateToken = this.validateToken.bind(this);
		this.getYouTubeData = this.getYouTubeData.bind(this);
		// this.getYouTubePlaylists = this.getYouTubePlaylists.bind(this);
		// this.addId = this.addId.bind(this);
		this.getVideoId = this.getVideoId.bind(this);
		this.addToPlaylist = this.addToPlaylist.bind(this);
		this.createPlaylist = this.createPlaylist.bind(this);
	}

	getCredentials() {
		axios.get('client_secret.json').then((response) => {
			this.setState({
				YouTubeClientID: response.data.web.client_id,
				YouTubeClientSecret: response.data.web.client_secret,
				YouTubeRedirect: response.data.web.redirect_uris[0]
			});
		});
	}

	getYouTubeData() {
		const config = {
			headers: {
				Authorization: 'Bearer ' + this.state.token,
				Accept: 'application/json'
			}
		};

		axios.get('https://www.googleapis.com/youtube/v3/channels?part=snippet&mine=true', config).then((response) => {
			response.data.items.map((item) => {
				this.setState({
					userId: item.id
				});
			});
		});
	}

	// getYouTubePlaylists() {
	// 	const config = {
	// 		headers: {
	// 			Authorization: 'Bearer ' + this.state.token,
	// 			Accept: 'application/json'
	// 		}
	// 	};

	// 	const url =
	// 		'https://www.googleapis.com/youtube/v3/playlists?part=snippet%2CcontentDetails&maxResults=25&mine=true';

	// 	axios.get(url, config).then((response) => {
	// 		let playlistIds = [];
	// 		console.log(response.data.items);
	// 		response.data.items.forEach((item) => {
	// 			playlistIds.push(item.id);
	// 		});
	// 		console.log(playlistIds);
	// 		this.setState({
	// 			playlistsId: playlistIds
	// 		});
	// 	});
	// }

	validateToken() {
		if (this.state.token) {
			axios({
				method: 'post',
				url: oauth2Endpoint + '?access_token=' + this.state.token
			}).then((response) => console.log(response.data));
		}
	}

	getSubmission() {
		let href = [];
		let width = [];
		let height = [];
		r.getSubreddit('listentothis').getTop({ time: 'month', limit: 100 }).then((response) => {
			response.map((sub) => {
				// console.log(sub.media_embed.content);
				console.log(sub);
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
				class: ''
			});
		}, 6000);
	}

	getVideoId() {
		console.log(this);
		let videoIdList;
		let url = this.state.html[num];
		if (url !== undefined) {
			let strUrl1 = url.split('/');
			let idList = strUrl1[4].split('?');
			videoIdList = idList[0];
			console.log(videoIdList);
		}
		this.setState({
			videoId: videoIdList
		});
	}

	createPlaylist() {
		axios({
			method: 'post',
			url: 'https://www.googleapis.com/youtube/v3/playlists?part=snippet%2Cstatus',
			headers: {
				Authorization: 'Bearer ' + this.state.token,
				Accept: 'application/json',
				'Content-Type': 'application/json'
			},
			data: {
				snippet: {
					title: 'Listen to This Reddit',
					description: 'A Playlist created by Listen to this Reddit App developed by Fiddleinc',
					tags: [ 'reddit', 'music' ],
					defaultLanguage: 'en'
				},
				status: {
					privacyStatus: 'private'
				}
			}
		}).then((response) => {
      console.log(response.data.id);
      this.setState({
        playlistId: response.data.id
      })
		});
	}

	addToPlaylist() {
		this.getVideoId();
		// this.getYouTubePlaylists();
		console.log(this.state.videoId);
		setTimeout(() => {
			axios({
				method: 'post',
				url: 'https://www.googleapis.com/youtube/v3/playlistItems?part=snippet',
				headers: {
					Authorization: 'Bearer ' + this.state.token,
					Accept: 'application/json',
					'Content-Type': 'application/json'
				},
				data: {
					snippet: {
						playlistId: this.state.playlistId,
						position: 0,
						resourceId: {
							kind: 'youtube#video',
							videoId: this.state.videoId
						}
					}
				}
			}).then((response) => {
				console.log(response);
			});
		}, 5000);
	}

	componentDidMount() {
		// r.getHot()
		//   .map(post => post.title)
		//   .then(console.log)

    this.getYouTubeData();
    this.createPlaylist();
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
		window.location.reload();
	}

	// addId() {
	//   document.getElementsByTagName("iframe")[0].setAttribute("id", "yt");
	// }

	render() {
		const style = {
			background: '#F5F5F5',
			padding: '20px'
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
									onMouseEnter={this.addId}
									style={{
										width: this.state.width[num],
										height: this.state.height[num],
										border: '7.5px solid #292C35'
									}}
								/>
							</div>
							<div className={this.state.class}>
								<button type="button" onClick={this.refreshPage} className="btn btn--loginApp-link">
									{' '}
									<span>Refresh</span>
								</button>
								<button
									type="button"
									// eslint-disable-next-line no-restricted-globals
									onClick={this.addToPlaylist}
									className="btn btn--loginApp-link"
								>
									{' '}
									<span>Add To Playlist</span>
								</button>
							</div>
						</div>
					) : (
						<div>
							<a
								className="btn btn--loginApp-link"
								href={`${oauth2Endpoint}?client_id=${this.state
									.YouTubeClientID}&redirect_uri=${this.state.YouTubeRedirect.toString()}&scope=${scopes.join(
									'%20'
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
