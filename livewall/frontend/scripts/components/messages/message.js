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
        var icon = <Icon fill='#222222' type='none' image='rocket'/>;

        if (type === 'badge') {
            var badge = content;
            body = (
                <span>
                    <h4>{t.messages.badge.header}</h4>
                    <h5>{badge.why}</h5>
                    <p><strong>{badge.points}</strong> {t.messages.badge.body}</p>
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
                    <p>{booster.text}</p>
                </span>
            );

            icon = (
                <Icon fill={level.fill} type='none' image={level.image}/>
            )
        }

        if (type === 'level') {
            var level = content;
            body = (
                <span>
                    <h4>{t.messages.level.header({level: level.level})}</h4>
                    <p>{t.messages.level.body}</p>
                </span>
            );

            icon = (
                <Icon fill={level.fill} type='none' image={level.image}/>
            );
        }

        var style = {
            transition: `width ${duration}s ease !important`,
            width:      `${this.state.progress}%`
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
