import React from 'react';
import PropTypes from 'prop-types';

export default class BackButton extends React.PureComponent {

    static propTypes = {
        onClick: PropTypes.func.isRequired
    };

    render() {
        return (
            <button className="back icon-angle-left" onClick={this.props.onClick}></button>
        );
    }
}