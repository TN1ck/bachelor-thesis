/**
 * Custom radio input component.
 */
let React = require('react');

module.exports = React.createClass({
    propTypes: {
        // Label for input
        label: React.PropTypes.string.isRequired,
        // Set value of input
        value: React.PropTypes.any,
        // Function that is executed on change
        onChange: React.PropTypes.func,
        // Set if icon is in checked state
        checked: React.PropTypes.bool
    },

    onChange: function () {
        if (this.props.onChange) {
            this.props.onChange(this.props.value);
        }
    },

    onClick: function (e) {
        e.preventDefault();
        let dom = this.refs.input.getDOMNode();
        dom.click();
    },

    onTouch: function (e) {
        e.preventDefault();
        this.onClick();
    },

    render: function () {
        let value    = this.props.value;
        let checked  = this.props.checked  || false;
        let label    = this.props.label;

        return (
            <span className='radio' onClick={this.onClick} onTouch={this.onTouch}>
                <input
                    ref='input'
                    type='radio'
                    className='with-gap'
                    value={value}
                    checked={checked}
                    onChange={this.onChange}
                />
                <label>{label}</label>
            </span>
        );
    }
});
