'use strict';

import _ from 'lodash';
import React from 'react';
import $ from 'jquery';
import cookies from 'cookies';
import store from 'store';

var SETTINGS = {};


// DEFAULT SETTINGS
SETTINGS.LOGIN_URL = 'http://pia-gesis.dai-labor.de/login/';
SETTINGS.PIA_URL   = 'http://pia-gesis.dai-labor.de';

// check if there are settings set

var getLocalSettings = function(settings) {
    var result = _.extend({}, settings);
    _.each(settings, (v, k) => {
        var value = store.get(k);
        if (value) {
            result[key] = value;
        }
    });
    return result;
};

class User {

    request () {

        return $.ajax({
            url: SETTINGS.LOGIN_URL,
            data: 'username=' + this.username + '&' + 'password=' + this.password,
            processData: false,
            type: 'POST'
        }).promise();
    }

    login (username, password, keep) {
        
        this.username = username;
        this.password = password;

        return this.request().then(data => {
            console.log(data);
            this.token = data.token; 
            if (keep) {
                this.setCookie()
            }
        });

    }

    logout () {
        this.username = '';
        this.password = '';
        this.token = '';
        this.deleteCookie();
        console.log(this);
    }

    setCookie () {
        if (this.token) {
            cookies.set('username', this.username);
            cookies.set('token', this.token);
        }
    }

    deleteCookie () {
        cookies.expire('username');
        cookies.expire('token');
    }

    loginViaCookie () {
        
        var username = cookies.get('username');
        var token = cookies.get('token');
        
        if (username && token) {
            // make pseudo request and check if it works
            this.token = token;
            this.username = username;
            return true;
        }

        return false;
    }

    isLogedIn () {
        console.log('token', this.token);
        return !!this.token;
    }
}

class RedditSource {

    constructor (search) {
        this.search = search;
    }

    getData () {
        
        var url = 'https://www.reddit.com';

        if (this.search) {
            url += '/r/' + this.search;
        }

        url += '/.json'

        return $.getJSON(url).promise().then(json => {

            var endsWith = function(str, term)
            {
                var lastIndex = str.lastIndexOf(term);
                return (lastIndex !== -1) && (lastIndex + term.length === str.length);
            }

            var tiles = json.data.children.map((d, i) => {
                d = d.data;
                var type = 'link';

                if (d.domain.indexOf('imgur.com') > -1 && !(d.url.indexOf('/a/') > -1)
                    && !endsWith(d.url, '.gifv') || endsWith(d.url, '.jpg')) {
                    
                    type = 'image';
                    if (!(d.url.endsWith('.jpg') || d.url.endsWith('.png'))) {
                        d.url += '.jpg';
                    }
                }

                return {
                    i: i,
                    author: d.author,
                    created: d.created,
                    title: d.title,
                    url: d.url,
                    // score: d.score,
                    domain: d.domain,
                    type: type,
                    score: _.random(0, 10)
                };
            });
            return {
                data: tiles
            }
        });
    }
};

class PiaSource {
    constructor(user, broker, search, filter) {
        this.user = user;
        this.search = search;
        this.brokers = {
            zentral: {
                name: 'zentral',
                public: true
            },
            haus: {
                name: 'haus',
                public: false
            }
        };
        this.broker = this.brokers[broker];
    }

    getData () {
        var url = SETTINGS.PIA_URL + '/' + this.broker.name;
        var params = {
            query: this.search,
            start: 0,
            num: 10,
            username: user.username,
            action: 'ACTION_SOLR'
        };

        if (this.filter) {
            params.filter = this.filter;
        }

        if (!this.broker.public) {
            params.token = user.token;
        }

        // http://pia-gesis.dai-labor.de/zentral?username=gesis3&query=pia%20enterprise&action=ACTION_SOLR&filter=dai-labor&start=0&num=10&dojo.preventCache=1426084708658&json.wrf=dojo.io.script.jsonp_dojoIoScript4._jsonpCallback

        $.ajax({  
            type: 'GET',        
            url: url,  // Send the login info to this page
            data: params, 
            dataType: 'jsonp', 
            jsonp: 'json.wrf',
            success: function(result)
            { 
                // console.log(result);
            } 

        });  
    }
}


var ReactImageTile = React.createClass({
    render: function () {
        return (
            <div className="tile-content tile-image">
                <div className="tile-content-image">
                    <img src={this.props.tile.url}></img>
                    <div className="tile-content-domain">
                        {this.props.tile.domain}
                    </div>
                </div>
                <div className="tile-content-title">{this.props.tile.title}</div>
            </div>
        );
    }
});

var ReactLinkTile = React.createClass({
    render: function () {
        return (
            <div className="tile-content tile-link">
                <div className="tile-content-title">
                    <a href={this.props.tile.url}>{this.props.tile.title}</a>
                </div>
                <div className="tile-content-domain">
                    {this.props.tile.domain}
                </div>
            </div>
        );
    }
});

var tileTypes = {
    image: ReactImageTile,
    link: ReactLinkTile
};

var TileStore = {
    tiles: [],
    cache: {},
    addTile: function(tile) {
        
        if (this.cache[tile.title]) {
            return;
        }

        this.cache[tile.title] = tile;
        this.tiles.push(tile);
    }
};

var calculateColumns = function () {
    
    var screens = {
        large: 1200,
        desktop: 992,
        tablet: 768,
        phone: 480
    }

    var width = window.innerWidth;
    var columns = 1;

    if (width > screens.large) {
        columns = 4;
    } else if (width > screens.desktop) {
        columns = 4;
    } else if (width > screens.tablet) {
        columns = 3;
    } else if (width > screens.phone) {
        columns = 2;
    }

    return columns;

};

var columns = calculateColumns();

var Layout  = {
    tiles: [],
    layout: function () {
        // console.log('layouting', this.tiles.length);
        var chunks = _.range(columns).map(i => { return []; });
        
        TileStore.tiles.forEach((tile, i) => {
            chunks[i % (chunks.length)].push(tile);
        });

        chunks = chunks.map( (chunk) => {
            return _.sortBy(chunk, (x) => -x.score);
        });
        var counter = 0;
        
        var margin = 14;
        // var width = margin;
        chunks.forEach((column, j) => {
            var height = 0;
            column.forEach((tile, i) => {
                // console.log(this.tiles, tile.i);
                var domTile = this.tiles[tile.i];
                
                if (!domTile) {
                    return;
                }

                $(domTile.dom).css({
                    transition: '0.5s',
                    position: 'absolute',
                    height: domTile.height,
                    width: domTile.width,
                    left: 0,
                    top: 0,
                    transform: 'translate(0px, ' + height + 'px )'
                });
                height += domTile.height + margin;
                counter++;
            });
            // width += this.tiles[counter - 1].width + margin;
        });

    },
    addTile: function (dom, props) {
        var width = dom.offsetWidth;
        var height = dom.offsetHeight;
        this.tiles[props.i] = {dom: dom, width: width, height: height, props};
    },
    removeTile: function(props) {
        this.tiles.splice(props.i, 1);
    }
};

var ReactTile = React.createClass({
    displayName: 'tile',
    componentDidMount: function () {
        var dom = this.getDOMNode();
        // var width = dom.offsetWidth;
        // var height = dom.offsetHeight;
        Layout.addTile(dom, this.props.tile);
        Layout.layout();
    },
    componentWillUnmount: function () {
        Layout.removeTile(this.props.tile);
    },
    render: function () {
        var tile = React.createElement(tileTypes[this.props.tile.type], {tile: this.props.tile});
        return (
            <article className='tile animate-2'>
                <header className='tile-header'>
                    <div className='tile-header-upvote'>
                        {this.props.tile.score}
                    </div>
                    <div className='tile-header-info'>
                        von {this.props.tile.author}
                    </div>
                </header>
                {tile}
            </article>
        );
    }
});

var ReactTileColumn = React.createClass({
    displayName: 'column',
    getInitialState: function () {
        return {
            numberOfTiles: _.random(10, 15)
        };
    },
    render: function () {
        var tiles = this.props.tiles.map(tile => <ReactTile tile={tile}/>);
        return (
            <div className='tile-column' style={this.props.style}>
                {tiles}
            </div>
        );
    }
});

var ReactWall = React.createClass({
    displayName: 'wall',
    getInitialState: function () {
        return {
            numberOfColumns: columns,
            data: TileStore
        }
    },
    componentDidMount: function() {

        sources.forEach(s => {
            s.getData('politics').then(data => {

                data.data.forEach((d, i) => {
                    // append tile when image finishes loading
                    if (d.type === 'image') {
                        var img = new Image;
                        img.src = d.url;
                        img.onload = () => {
                            TileStore.addTile(d);
                            this.setState({data: TileStore});
                        };    
                    } else {
                        setTimeout(() => {
                            TileStore.addTile(d);
                            this.setState({data: TileStore});
                        }, _.random(200 * i));
                    }
                    
                });
            });
        });

        // proof of concept for making it responsive when resizing
        window.addEventListener('resize', () => {
            console.log('resize!');
            columns = calculateColumns();
            var copy = _.clone(TileStore.tiles);
            // Layout.tiles = [];
            TileStore.tiles = [];
            this.setState({data: TileStore, numberOfColumns: columns});
            TileStore.tiles = copy;
            this.setState({data: TileStore});

        });
    },
    render: function () {
        var chunks = _.range(this.state.numberOfColumns).map(i => { return []; });

        this.state.data.tiles.forEach((tile, i) => {
            chunks[i % (chunks.length)].push(tile);
        });

        // var style = {width: 'calc(' + 100 / this.state.numberOfColumns + '% - 20px)' }
        var style = {};
        var columns = chunks.map(tiles => <ReactTileColumn tiles={tiles} style={style}/>);
        return (
            <div className='wall'>
                {columns}
            </div>
        );
    }
});


class ReactApp extends React.Component {

    constructor(props) {
        super(props);

        var user = new User();

        var result;
        if (cookies.enabled) {
            result = user.loginViaCookie();
        }

        this.state = {
            user: user,
            remember: true,
            loading: false,
            error: false        };
    }

    handleSubmit (e) {
        e.preventDefault();
        var username = this.refs.username.getDOMNode().value;
        var password = this.refs.password.getDOMNode().value;
        var promise = this.state.user.login(username, password, this.state.remember);
        this.setState({loading: true});
        
        promise.done(() => {
            this.setState({loading: false});
        }).fail(() => {
            this.setState({loading: false, error: true});
        })
    }

    handleChange (e) {
        this.setState({
            remember: !this.state.remember
        });
    }

    handleLogout () {
        this.state.user.logout();
        this.setState({user: this.state.user});
    }

    render () {
        var header = (
            <div className='wall-header'>
                <div className='wall-header-info'>
                    Angemeldet als {this.state.user.username}
                </div>
                <div className='wall-header-settings'>
                    <span>settings</span> | <span onClick={this.handleLogout.bind(this)}>logout</span>
                </div>
            </div>
        );

        if (!this.state.user.isLogedIn()) {
            return (
                <div>
                    {header}
                    <div className="blur">
                        <ReactWall user={this.state.user} />
                    </div>
                    <form className="wall-login" onSubmit={this.handleSubmit.bind(this)}>
                        <div className="wall-login-header">
                            Du musst angemeldet sein um die dai-wall zu benutzen
                        </div>
                        <div className="wall-login-content">
                            <div className="labelgroup">
                                <label for="username">Benutzername</label>
                                <input ref="username" id="username" placeholder="Benutzername" required autofocus/>
                            </div>
                            <div className="labelgroup">
                                <label for="password">Password</label>
                                <input ref="password" id="password" type="password" placeholder="Password" required/>
                            </div>
                            <label for="remember">
                                <input checked={this.state.remember} onChange={this.handleChange.bind(this)} ref="remember" id="remember" type="checkbox" /> Eingeloggt bleiben
                            </label>
                            <button>
                                Anmelden
                            </button>
                        </div>
                    </form>
                </div>
            );
        } else {
            return (
                <div>
                    {header}
                    <ReactWall user={this.state.user} />  
                </div>
            );
        }
    }
};

// user.login('Gesis3', 'G3Test');

// var source = new PiaSource(user, 'zentral', 'dai labor');
// source.getData();

var sources = [new RedditSource('politics')];

React.render(<ReactApp/>, document.getElementById('react'));