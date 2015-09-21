import React from 'react';

/**
 * Component to create a browser-agnostic and styled Checkbox
 */
export default React.createClass({
    getInitialState: function () {
        return {
            checked: false
        };
    },
    getDefaultProps: function () {
        return {
            onChange: () => {}
        };
    },
    onClick: function (e) {
        e.preventDefault();
        let newState = !(this.props.checked || this.state.checked);
        this.setState({
            checked: newState
        });
        this.props.onChange(newState);
    },
    render: function () {
        let checked  = this.state.checked || this.props.checked;
        let label    = this.props.label;
        let error    = this.props.error;
        let className = 'info_checkbox' + (this.props.inline ? ' info_checkbox--inline' : '');

        if (error) {
            className += ' info_checkbox--error';
        }

        return (
            <div className={className} onClick={this.onClick}>
                <input
                    ref='input'
                    type='checkbox'
                    checked={checked}
                />
                <label>{label}</label>
            </div>
        );
    }
});
