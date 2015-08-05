import React   from 'react';
import { Col } from 'react-bootstrap';

/**
 * Component to create an IconCard, which will center the provided icon alongside
 * a body
 */
export default React.createClass({
    displayName: 'IconCard',

    propTypes: {
        xs: React.PropTypes.number,
        md: React.PropTypes.number,
        icon: React.PropTypes.element,
        body: React.PropTypes.body
    },

    getDefaultProps: function () {
        return {
            xs: 12,
            md: 6
        };
    },

    render: function () {

        var {icon, body, xs, md, active} = this.props;

        return (
            <Col xs={xs} md={md}>
                <div className={`icon-card__container ${active ? 'icon-card__container--active' : ''}`}>
                    <div className='icon-card__svg-container'>
                        {icon}
                    </div>
                    <div className='icon-card__text-container'>
                        {body}
                    </div>
                </div>
            </Col>
        );
    }
});
