(window.webpackJsonp=window.webpackJsonp||[]).push([[0],{147:function(t,e){},165:function(t,e){},179:function(t,e,n){t.exports=n(386)},184:function(t,e,n){},201:function(t,e,n){},310:function(t,e){},323:function(t,e){},365:function(t,e){},372:function(t,e){},374:function(t,e){},381:function(t,e){},386:function(t,e,n){"use strict";n.r(e);var a=n(2),i=n.n(a),o=n(173),s=n.n(o),l=(n(184),n(174)),c=n(175),u=n(177),d=n(176),r=n(13),h=n(178),p=n(32),b=n.n(p),m=(n(201),window.location.hash.substring(1).split("&").reduce(function(t,e){if(e){var n=e.split("=");t[n[0]]=decodeURIComponent(n[1])}return t},{}));window.location.hash="";var g=m,v="https://accounts.google.com/o/oauth2/v2/auth",w=["https://www.googleapis.com/auth/youtube","https://www.googleapis.com/auth/youtube.readonly","https://www.googleapis.com/auth/youtubepartner","https://www.googleapis.com/auth/youtube.force-ssl"],y=new(n(202))({userAgent:"reddit-bot-example-node",clientId:"STQS9rsO3bTkQQ",clientSecret:"W7kKqk0LRvD2EeV6zg9wbWsNtyc",username:"fiddle_inc",password:"riochiranjib985"}),f=Math.floor(100*Math.random()),k=function(t){function e(t){var n;return Object(l.a)(this,e),(n=Object(u.a)(this,Object(d.a)(e).call(this,t))).state={token:null,author_name:[],html:[],width:[],height:[],class:"hidden",YouTubeClientID:"",YouTubeClientSecret:"",YouTubeRedirect:"",userId:null,videoId:null,playlistId:null},n.getSubmission=n.getSubmission.bind(Object(r.a)(n)),n.getCredentials=n.getCredentials.bind(Object(r.a)(n)),n.validateToken=n.validateToken.bind(Object(r.a)(n)),n.getYouTubeData=n.getYouTubeData.bind(Object(r.a)(n)),n.getVideoId=n.getVideoId.bind(Object(r.a)(n)),n.addToPlaylist=n.addToPlaylist.bind(Object(r.a)(n)),n.createPlaylist=n.createPlaylist.bind(Object(r.a)(n)),n}return Object(h.a)(e,t),Object(c.a)(e,[{key:"getCredentials",value:function(){var t=this;b.a.get("client_secret.json").then(function(e){t.setState({YouTubeClientID:e.data.web.client_id,YouTubeClientSecret:e.data.web.client_secret,YouTubeRedirect:e.data.web.redirect_uris[0]})})}},{key:"getYouTubeData",value:function(){var t=this,e={headers:{Authorization:"Bearer "+this.state.token,Accept:"application/json"}};b.a.get("https://www.googleapis.com/youtube/v3/channels?part=snippet&mine=true",e).then(function(e){e.data.items.map(function(e){t.setState({userId:e.id})})})}},{key:"validateToken",value:function(){this.state.token&&b()({method:"post",url:v+"?access_token="+this.state.token}).then(function(t){return console.log(t.data)})}},{key:"getSubmission",value:function(){var t=this,e=[],n=[],a=[];y.getSubreddit("listentothis").getTop({time:"month",limit:100}).then(function(t){t.map(function(t){console.log(t),e.push(t.media_embed.content),n.push(t.media_embed.width),a.push(t.media_embed.height)})}),setTimeout(function(){t.setState({html:e,width:n,height:a,class:""})},6e3)}},{key:"getVideoId",value:function(){var t;console.log(this);var e=this.state.html[f];void 0!==e&&(t=e.split("/")[4].split("?")[0],console.log(t));this.setState({videoId:t})}},{key:"createPlaylist",value:function(){var t=this;b()({method:"post",url:"https://www.googleapis.com/youtube/v3/playlists?part=snippet%2Cstatus",headers:{Authorization:"Bearer "+this.state.token,Accept:"application/json","Content-Type":"application/json"},data:{snippet:{title:"Listen to This Reddit",description:"A Playlist created by Listen to this Reddit App developed by Fiddleinc",tags:["reddit","music"],defaultLanguage:"en"},status:{privacyStatus:"private"}}}).then(function(e){console.log(e.data.id),t.setState({playlistId:e.data.id})})}},{key:"addToPlaylist",value:function(){var t=this;this.getVideoId(),console.log(this.state.videoId),setTimeout(function(){b()({method:"post",url:"https://www.googleapis.com/youtube/v3/playlistItems?part=snippet",headers:{Authorization:"Bearer "+t.state.token,Accept:"application/json","Content-Type":"application/json"},data:{snippet:{playlistId:t.state.playlistId,position:0,resourceId:{kind:"youtube#video",videoId:t.state.videoId}}}}).then(function(t){console.log(t)})},5e3)}},{key:"componentDidMount",value:function(){this.getYouTubeData(),this.createPlaylist()}},{key:"componentWillMount",value:function(){var t=g.access_token;t&&this.setState({token:t}),this.getSubmission(),this.getCredentials(),this.validateToken()}},{key:"refreshPage",value:function(){window.location.reload()}},{key:"render",value:function(){return i.a.createElement("div",{className:"App"},i.a.createElement("div",{className:"App-header"},this.state.token?i.a.createElement("div",null,i.a.createElement("div",{className:this.state.class,style:{background:"#F5F5F5",padding:"20px"}},i.a.createElement("div",{dangerouslySetInnerHTML:{__html:this.state.html[f]},onMouseEnter:this.addId,style:{width:this.state.width[f],height:this.state.height[f],border:"7.5px solid #292C35"}})),i.a.createElement("div",{className:this.state.class},i.a.createElement("button",{type:"button",onClick:this.refreshPage,className:"btn btn--loginApp-link"}," ",i.a.createElement("span",null,"Refresh")),i.a.createElement("button",{type:"button",onClick:this.addToPlaylist,className:"btn btn--loginApp-link"}," ",i.a.createElement("span",null,"Add To Playlist")))):i.a.createElement("div",null,i.a.createElement("a",{className:"btn btn--loginApp-link",href:"".concat(v,"?client_id=").concat(this.state.YouTubeClientID,"&redirect_uri=").concat(this.state.YouTubeRedirect.toString(),"&scope=").concat(w.join("%20"),"&response_type=token&show_dialog=true&include_granted_scopes=true&state=state_parameter_passthrough_value")},"Login to YouTube"))))}}]),e}(a.Component);Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));s.a.render(i.a.createElement(k,null),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then(function(t){t.unregister()})}},[[179,1,2]]]);
//# sourceMappingURL=main.c605915d.chunk.js.map