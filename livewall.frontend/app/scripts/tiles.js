import React from 'react';

import actions from './actions.js';
import Layout from './layout.js';

var ReactImageTile = React.createClass({
    displayName: 'ImageTile',
    render: function () {
        return (
            <div className="tile-content tile-image">
                <div className="tile-content-image">
                    <img src={this.props.tile.get('url')}></img>
                    <div className="tile-content-domain">
                        {this.props.tile.get('domain')}
                    </div>
                </div>
                <div className="tile-content-title">{this.props.tile.get('title')}</div>
            </div>
        );
    }
});

var ReactLinkTile = React.createClass({
    displayName: 'LinkTile',
    render: function () {
        return (
            <div className="tile-content tile-link">
                <div className="tile-content-title">
                    <a href={this.props.tile.get('url')}>{this.props.tile.get('title')}</a>
                </div>
                <div className="tile-content-domain">
                    {this.props.tile.get('domain')}
                </div>
            </div>
        );
    }
});

var ReactPiaTile = React.createClass({
    displayName: 'PiaTile',
    render: function () {
        var lis = this.props.tile.get('content').map((d) => {
            return <li dangerouslySetInnerHTML={{__html: d}}></li>
        });
        return (
            <div className="tile-content tile-pia">
                <div className="tile-content-title">
                    <a href={this.props.tile.get('url')}>{this.props.tile.get('title')}</a>
                </div>
                <div className="tile-content-content">
                    <a href={this.props.tile.get('url')}>
                        <ul>
                            {lis}
                        </ul>
                    </a>
                </div>
                <div className="tile-content-domain">
                    {this.props.tile.get('domain')}
                </div>
            </div>
        );
    }
});

var tileTypes = {
    image: ReactImageTile,
    link: ReactLinkTile,
    pia: ReactPiaTile
};

export var ReactTile = React.createClass({
    displayName: 'tile',
    componentDidMount: function () {
        var dom = this.getDOMNode();
        Layout.addTile(dom, this.props.tile);
    },
    componentWillUnmount: function () {
        Layout.removeTile(this.props.tile);
    },
    handleUpvote: function (e) {
        e.preventDefault;
        actions.upvoteItem(this.props.tile);
    },
    shouldComponentUpdate: function (props) {
        // the sole reason we are using immutable data structures
        return props.tile.get('score') !== this.props.tile.get('score');
    },
    componentDidUpdate: function (props) {
        Layout.layout(true);
    },
    render: function () {

        var tile = React.createElement(tileTypes[this.props.tile.get('type')], {tile: this.props.tile});
        // precalculate the left offset of the tile so the animation starts at the correct position

        var style = Layout.getStyle(this.props.tile);

        return (
            <article className='tile' style={style}>
                <header className='tile-header'>
                    <div className='tile-header-upvote' onClick={this.handleUpvote}>
                        {this.props.tile.get('score')}
                    </div>
                    <div className='tile-header-info'>
                        von {this.props.tile.get('author')}
                    </div>
                </header>
                {tile}
            </article>
        );

    }
});
