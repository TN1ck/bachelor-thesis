import React from 'react/addons';

import actions from '../actions.js';
import {hashCode, colors, colorLuminance} from '../utils.js';

var PureRenderMixin = React.addons.PureRenderMixin;

var ReactImageTile = React.createClass({
    displayName: 'ImageTile',
    mixins: [PureRenderMixin],
    render: function () {
        return (
            <div className="tile__content tile__image">
                <div className="tile__content__image">
                    <a target='_blank' href={this.props.tile.get('url')}>
                        <img src={this.props.tile.get('url')}></img>
                        <div className="tile__content__domain">
                            {this.props.tile.get('domain')}
                        </div>
                    </a>
                </div>
                <div className="tile__content__title"><a target='_blank' href={this.props.tile.get('url')}>{this.props.tile.get('title')}</a></div>
            </div>
        );
    }
});

var ReactLinkTile = React.createClass({
    displayName: 'LinkTile',
    mixins: [PureRenderMixin],
    render: function () {
        return (
            <div className="tile__content tile__link">
                <div className="tile__content__title">
                    <a target='_blank' href={this.props.tile.get('url')}>{this.props.tile.get('title')}</a>
                </div>
            </div>
        );
    }
});

var ReactPiaTile = React.createClass({
    displayName: 'PiaTile',
    mixins: [PureRenderMixin],
    render: function () {

        var html = this.props.tile.get('title') || '';

        var icons = {
            'pia-pdf':     'fa-file-pdf-o',
            'pia-web':     'fa-globe',
            'pia-contact': 'fa-user'
        };

        var icon = icons[this.props.tile.get('type')];

        return (
            <div className="tile__content tile--pia">
                <div className="tile__content__title">
                    <a target='_blank' href={this.props.tile.get('url')}>
                        <i className={'tile__content__icon fa ' + icon}></i>
                        <p dangerouslySetInnerHTML={{__html: html}}>
                        </p>
                    </a>
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
    mixins: [PureRenderMixin],
    componentDidMount: function () {
        var dom = this.getDOMNode();
        actions.addDomElement(this.props.tile.get('uuid'), dom);
    },
    handleUpvote: function (e) {
        e.preventDefault;
        actions.upvoteItem(this.props.tile.get('uuid'));
    },
    handleDownvote: function (e) {
        e.preventDefault;
        actions.downvoteItem(this.props.tile.get('uuid'));
    },
    handleFavourite: function (e) {
        e.preventDefault;
        actions.favouriteItem(this.props.tile.get('uuid'));
    },
    render: function () {

        var type = this.props.tile.get('type');

        if (!tileTypes[type]) {
            console.error('No tile for type ', type);
            return;
        }

        var tile = React.createElement(tileTypes[type], {tile: this.props.tile});
        
        // precalculate the left offset of the tile so the animation starts at the correct position
        var style = this.props.tile.get('css').toJS();
        var cssClass = this.props.tile.get('class');
        var color = this.props.tile.get('color');
        style['background-color'] = color;

        var favourited = this.props.tile.get('favourite') ? 'favourite' : 'unfavourite';

        return (
            <article className={`tile white ${cssClass} tile--${this.props.tile.get('type')}`} style={style}>
                <header className='tile__header' style={{'background-color': color, color: 'white'}}>
                    <div className='tile__header__upvote' style={{'background-color': color}}>
                        {this.props.tile.get('score')}
                    </div>
                    <div className='tile__header__buttons'>
                        <div className='tile__header__upvote-button' onClick={this.handleUpvote}></div>
                        <div className='tile__header__downvote-button' onClick={this.handleDownvote}></div>
                        <div className={`tile__header__favourite-button ${favourited}`} onClick={this.handleFavourite}></div>
                    </div>
                </header>
                {tile}
                <footer className="tile__footer" style={{'background-color': color}}>
                    <div className="tile__footer__domain">
                        {this.props.tile.get('domain')}
                    </div>
                    <div className='tile__footer__author'>
                        von {this.props.tile.get('author')}
                    </div>
                </footer>
            </article>
        );

    }
});
