import React from 'react/addons';

import actions from '../actions.js';
import Layout from '../layout.js';
import {hashCode, colors, colorLuminance} from '../utils.js';

var ReactImageTile = React.createClass({
    displayName: 'ImageTile',
    render: function () {
        return (
            <div className="tile-content tile-image">
                <div className="tile-content-image">
                    <a target='_blank' href={this.props.tile.get('url')}>
                        <img src={this.props.tile.get('url')}></img>
                        <div className="tile-content-domain">
                            {this.props.tile.get('domain')}
                        </div>
                    </a>
                </div>
                <div className="tile-content-title"><a target='_blank' href={this.props.tile.get('url')}>{this.props.tile.get('title')}</a></div>
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
                    <a target='_blank' href={this.props.tile.get('url')}>{this.props.tile.get('title')}</a>
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
                    <a target='_blank' href={this.props.tile.get('url')}>{this.props.tile.get('title')}</a>
                </div>
            </div>
        );
    }
});

var tileTypes = {
    image: ReactImageTile,
    link: ReactLinkTile,
    'pia-pdf': ReactPiaTile,
    'pia-web': ReactPiaTile,
    'pia-contact': ReactPiaTile,
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
    componentWillUpdate: function (props) {
        Layout.layout(true, true);
    },
    render: function () {

        var tile = React.createElement(tileTypes[this.props.tile.get('type')], {tile: this.props.tile});
        // precalculate the left offset of the tile so the animation starts at the correct position

        var style = Layout.getStyle(this.props.tile);
        var color = this.props.tile.get('color');
        var colorLight = color;
        var colorDark = color;

        style.css['background-color'] = color;

        return (
            <article className={`tile white ${style.class}`} style={style.css}>
                <header className='tile-header' style={{'background-color': colorDark, color: 'white'}}>
                    <div className='tile-header-upvote' style={{'background-color': colorLight}}>
                        {this.props.tile.get('score')}
                    </div>
                    <div className='tile-header-buttons'>
                        <div className='tile-header-upvote-button' onClick={this.handleUpvote}></div>
                        <div className='tile-header-downvote-button'></div>
                    </div>
                </header>
                {tile}
                <footer className="tile-footer" style={{'background-color': colorDark}}>
                    <div className="tile-footer-domain">
                        {this.props.tile.get('domain')}
                    </div>
                    <div className='tile-footer-author'>
                        von {this.props.tile.get('author')}
                    </div>
                </footer>
            </article>
        );

    }
});
