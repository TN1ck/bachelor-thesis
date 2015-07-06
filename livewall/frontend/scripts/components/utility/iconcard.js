import React   from 'react';
import { Col } from 'react-bootstrap';

export default React.createClass({
    getDefaultProps: function () {
        return {
            xs: 12,
            md: 6
        };
    },
    render: function () {

        var p = this.props;

        var icon = p.icon
        var body = p.body;

        return (
            <Col xs={p.xs} md={p.md}>
                <div className='icon-card__container'>
                    <div className='icon-card__svg-container'>
                        {icon}
                    </div>
                    <div className='icon-card__text-container'>
                        {p.body}
                    </div>
                </div>
            </Col>
        );
    }
});
