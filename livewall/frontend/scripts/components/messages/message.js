import React   from 'react';
import { Col, Row, ProgressBar } from 'react-bootstrap';
import Icon                from '../utility/icon.js';
import BADGES    from '../../../shared/gamification/badges.js';
import BOOSTER    from '../../../shared/gamification/booster.js';

export default React.createClass({
    getInitialState: function () {
        return {
            progress: 0
        };
    },
    componentDidMount: function () {
        setTimeout(() => {
            this.setState({
                progress: 100
            });
        }, 0);
    },
    render: function () {

        var {type, content, duration} = this.props.message;

        var body = <span></span>;
        var icon = <Icon fill='#222222' type='none' icon='/assets/search.png'/>;

        if (type === 'badge') {
            var badge = content;
            console.log(type, content, duration, this.props.message, badge);

            body = (
                <span>
                    <h4>Du hast ein Abzeichen erhalten!</h4>
                    <h5>{badge.why}</h5>
                    <p>Dafür hast du <strong>{badge.points}</strong> Punkte bekommen</p>
                </span>
            );

            icon = (
                <Icon fill={badge.fill} type={badge.type} image={badge.image}/>
            );
        }

        if (type === 'booster') {

            var booster = _.find(BOOSTER, {id: content.name});

            body = (
                <span>
                    <h4>Booster erfolgreich erworben!</h4>
                    <p>...</p>
                </span>
            );

            icon = (
                <Icon fill={booster.fill} type='none' image={booster.image}/>
            )
        }

        var style = {
            transition: `width ${duration}s ease !important`,
            width: `${this.state.progress}%`
        };

        return (
            <div className='message-card__container'>
                <div className='message-card__svg-container'>
                    {icon}
                </div>
                <div className='message-card__text-container'>
                    {body}
                </div>
                <div className='message-card__time-container'>
                    <div className='progress active progress-striped'>
                        <div style={style} min="0" max="100"
                            className="progress-bar" role="progressbar"></div>
                    </div>
                </div>
            </div>
        );
    }
});
