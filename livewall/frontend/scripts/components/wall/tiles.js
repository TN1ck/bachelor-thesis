import React     from 'react/addons';
import _         from 'lodash';
import Immutable from 'Immutable';
import actions   from '../../actions/actions.js';

import t from '../../../shared/translations/translation.js';

import { OverlayTrigger, Tooltip } from 'react-bootstrap';

/* PureRenderMixin provides a `shouldComponentUpdate`-method with a simple
   reference-check */
var PureRenderMixin = React.addons.PureRenderMixin;

/**
 * Tile for results from a PIA-Broker
 */
var PiaTile = React.createClass({
    displayName: 'PiaTile',

    propTypes: {
        tile: React.PropTypes.instanceOf(Immutable.Map).isRequired
    },

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
                        // the results contain styled markup
                        <p dangerouslySetInnerHTML={{__html: html}}>
                        </p>
                    </a>
                </div>
            </div>
        );
    }
});

/* Dispatcher-object for the different types of tiles.
   We only use PiaTile at the moment, but outhers can be easily used here.
   See ImageTile for an example in the git-history.
   These tiles only specify the inner-part of the tile, the Footer and Header
   are always the same for every tile.
*/
var tileTypes = {
    'pia-pdf': PiaTile,
    'pia-web': PiaTile,
    'pia-contact': PiaTile
};

/**
 * The Header of a tile, should be the same for every tile-type.
 * Provide the upvote/downvote-functionality as well as the ability
 * to favourite the tile.
 */
var Header = React.createClass({
    displayName: 'tile-header',

    propTypes: {
        uuid: React.PropTypes.string.isRequired,
        score: React.PropTypes.number.isRequired,
        userVote: React.PropTypes.number
    },

    mixins: [PureRenderMixin],

    getInitialState: function () {
        return {
            loadingFavourite: false
        };
    },

    handleUpvote: function (e) {
        e.preventDefault;
        actions.voteItem(this.props.uuid, 1);
    },

    handleDownvote: function (e) {
        e.preventDefault;
        actions.voteItem(this.props.uuid, -1);
    },

    handleFavourite: function (e) {
        e.preventDefault;
        this.setState({loadingFavourite: true});
        actions.favouriteItem(this.props.uuid);
    },

    componentWillReceiveProps: function (props) {
        // request completed, deactive the spinning of the star
        if (props.favourited !== this.props.favourited) {
            this.setState({loadingFavourite: false});
        }
    },

    render: function () {

        var favourited       = this.props.favourited;
        var score            = this.props.score;
        var userVote         = this.props.userVote;
        var loadingFavourite = this.state.loadingFavourite;

        var favouriteText = t.tile.tooltip.favourite[favourited];

        var downvoteClass, upvoteClass;

        if (userVote === -1) {
            downvoteClass = 'tile__header__downvote-button--active';
        }

        if (userVote === 1) {
            upvoteClass = 'tile__header__upvote-button--active';
        }

        var favouriteTooltip = <Tooltip>{favouriteText}</Tooltip>;

        return (
            <header className='tile__header' style={{color: 'white'}}>
                <div className='tile__header__upvote'>
                    {score}
                </div>
                <div className='tile__header__buttons'>
                    <div
                        className={`tile__header__upvote-button ${upvoteClass}`}
                        onClick={this.handleUpvote}>
                        <i className='fa fa-caret-up'></i>
                    </div>
                    <div className={`tile__header__downvote-button ${downvoteClass}`} onClick={this.handleDownvote}>
                        <i className='fa fa-caret-down'></i>
                    </div>
                    <OverlayTrigger placement='top' overlay={favouriteTooltip} delayShow={300} delayHide={150}>
                        <div
                            className={`tile__header__favourite-button
                                        ${favourited}
                                        ${loadingFavourite ? 'animate-rotate' : ''}`}
                            onClick={this.handleFavourite}>
                        </div>
                    </OverlayTrigger>
                </div>
            </header>
        );
    }
});

/**
 * The Footer of the tile, should be the same for every tile.
 * Show the domain and the last performed action.
 */
var Footer = React.createClass({
    displayName: 'tile-footer',

    propTypes: {
        domain: React.PropTypes.string,
        action: React.PropTypes.action
    },

    mixins: [PureRenderMixin],

    render: function () {

        var domain = this.props.domain;
        var action = this.props.action;

        var text;

        // create the appropriate text for every message
        if (action) {
            // if the action has no user, the user has been deleted
            var username = _.get(action, '.User.username', '[Gelöscht]');
            var group = action.group;
            var label = action.label;

            text = <strong>{`${username} ${_.get(t.tile.actions, [group, label], group + ' ' + label)}`}</strong>;
        } else {
            text = t.tile.noInteractions;
        }

        return (
            <footer className="tile__footer">
                <div className="tile__footer__domain">
                    {domain}
                </div>
                <div className='tile__footer__action'>
                    {text}
                </div>
            </footer>
        );
    }
});

/**
 * The complete visualization of an item, also called tile.
 */
export default React.createClass({

    displayName: 'tile',

    propTypes: {
        tile: React.PropTypes.instanceOf(Immutable.Map).isRequired
    },

    shouldComponentUpdate: function (props) {
        /* A simple reference check is not faster here, because
           the layoutstore updates the components regardless of change.
           This is one drawback in the seperation of the item and layoutstore.
           This will lazily check if we need to update the tile.
       */
        return _.some([
            ['css', 'transform'],
            ['css', 'opacity'],
            ['ownVote'],
            ['favourite'],
            ['score']
        ], attr => {
            this.props.tile.getIn(attr) !== props.tile.getIn(attr);
        });

    },

    componentDidMount: function () {
        /* A DOM-node is sucessfully created, we send it to the layoutstore so
           it can be used for layouting */
        var dom = this.getDOMNode();
        actions.addDomElement(this.props.tile.get('uuid'), dom);
    },

    render: function () {

        var type = this.props.tile.get('type');

        // if we do not know the type, we cannot visualize it
        if (!tileTypes[type]) {
            console.error('No tile for type ', type);
            return <span></span>;
        }

        var tile = React.createElement(tileTypes[type], this.props);

        // color the tile according to the query
        var style = _.extend(this.props.tile.get('css').toJS(), {
            backgroundColor: this.props.tile.get('query').color
        });

        var cssClass = this.props.tile.get('class');

        var favourited = this.props.tile.get('favourite') ? 'favourite' : 'unfavourite';

        // Add the uservotes onto the global score
        var score = Math.round(this.props.tile.get('score') + (this.props.tile.get('votes') || 0));
        var userVote = this.props.tile.get('ownVote');

        var _actions = this.props.tile.get('actions');
        _actions = _actions ? _actions.toJS() : [];

        // the most recent action a user did
        var lastAction = _.last(_actions);

        var domain = this.props.tile.get('domain');

        return (
            <article
                className={`tile white ${cssClass} tile--${this.props.tile.get('type')}`}
                style={style}>
                <Header
                    userVote={userVote}
                    score={score}
                    favourited={favourited}
                    uuid={this.props.tile.get('uuid')}
                />
                {tile}
                <Footer domain={domain} action={lastAction}/>
            </article>
        );
    }
});
