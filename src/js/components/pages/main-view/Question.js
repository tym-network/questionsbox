import React from 'react';
import PropTypes from 'prop-types';

export default class Question extends React.PureComponent {

    static propTypes = {
        question: PropTypes.string.isRequired
    };

    render() {
        return (
            <p>{this.props.question}</p>
        );
    }
}