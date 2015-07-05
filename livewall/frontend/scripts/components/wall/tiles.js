import React   from 'react/addons';
import _       from 'lodash';
import actions from '../../actions/actions.js';

import t from '../../../shared/translations/translation.js';

import { OverlayTrigger, Tooltip } from 'react-bootstrap';

var PureRenderMixin = React.addons.PureRenderMixin;

var ImageTile = React.createClass({
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

var PiaTile = React.createClass({
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
    image: ImageTile,
    'pia-pdf': PiaTile,
    'pia-web': PiaTile,
    'pia-contact': PiaTile,
};

export default React.createClass({
    displayName: 'tile',
    mixins: [PureRenderMixin],
    getInitialState: function () {
        return {
            loadingFavourite: false
        };
    },
    componentDidMount: function () {
        var dom = this.getDOMNode();
        actions.addDomElement(this.props.tile.get('uuid'), dom);
    },
    handleUpvote: function (e) {
        e.preventDefault;
        actions.voteItem(this.props.tile.get('uuid'), 1);
    },
    handleDownvote: function (e) {
        e.preventDefault;
        actions.voteItem(this.props.tile.get('uuid'), -1);
    },
    handleFavourite: function (e) {
        e.preventDefault;
        this.setState({loadingFavourite: true});
        actions.favouriteItem(this.props.tile.get('uuid'));
    },
    componentWillReceiveProps: function (props) {
        this.setState({loadingFavourite: false});
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
        var color = this.props.tile.get('query').color;
        style['background-color'] = color;

        var favourited = this.props.tile.get('favourite') ? 'favourite' : 'unfavourite';
        var loadingFavourite = this.state.loadingFavourite;

        var favouriteText = t.tile.tooltip.favourite[favourited];

        var favouriteTooltip = <Tooltip>
            {favouriteText}
        </Tooltip>;

        var voteTooltip = <Tooltip>
            {t.tile.tooltip.vote}
        </Tooltip>

        var score = Math.round(this.props.tile.get('score') + (this.props.tile.get('votes') || 0));
        var ownVote = this.props.tile.get('ownVote');

        var downvoteClass, upvoteClass;

        if (ownVote === -1) {
            downvoteClass = 'tile__header__downvote-button--active';
        }

        if (ownVote === 1) {
            upvoteClass = 'tile__header__upvote-button--active';
        }

        var actions = this.props.tile.get('actions');
        actions = actions ? actions.toJS() : [];

        var lastAction = _.last(actions);

        var _action;

        if (lastAction) {

            var username = lastAction.User.username;
            var group = lastAction.group;
            var label = lastAction.label;

            var text = `${username} ${_.get(t.tile.actions, [group, label], group + ' ' + label)}`;

            _action = (
                <div className='tile__footer__action'>
                    {text}
                </div>
            );
        }

        // var author = <div className='tile__footer__author'>
        //     von {this.props.tile.get('author')}
        // </div>;

        return (
            <article className={`tile white ${cssClass} tile--${this.props.tile.get('type')}`} style={style}>
                <header className='tile__header' style={{color: 'white'}}>
                    <div className='tile__header__upvote'>
                        {score}
                    </div>
                    <div className='tile__header__buttons'>
                        <div className={`tile__header__upvote-button ${upvoteClass}`} onClick={this.handleUpvote}>
                            <i className='fa fa-caret-up'></i>
                        </div>
                        <div className={`tile__header__downvote-button ${downvoteClass}`} onClick={this.handleDownvote}>
                            <i className='fa fa-caret-down'></i>
                        </div>
                        <OverlayTrigger placement='top' overlay={favouriteTooltip} delayShow={300} delayHide={150}>
                            <div
                                className={`tile__header__favourite-button
                                            ${favourited}
                                            ${loadingFavourite ? 'animate-rotate': ''}`}
                                onClick={this.handleFavourite}>
                            </div>
                        </OverlayTrigger>
                    </div>
                </header>
                {tile}
                <footer className="tile__footer">
                    <div className="tile__footer__domain">
                        {this.props.tile.get('domain')}
                    </div>
                    {_action}
                </footer>
            </article>
        );

    }
});
