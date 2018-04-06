import React from 'react';
import PropTypes from 'prop-types';
// import i18next from 'i18next';

export default class SaveIndicator extends React.PureComponent {

    static propTypes = {
        saveStatus: PropTypes.string,
    };

    render() {
        if (this.props.saveStatus === 'saving') {
            return <span>Saving</span>;
        } else if (this.props.saveStatus === 'saved') {
            return <span>Saved</span>;
        } else if (this.props.saveStatus === 'error') {
            return <span>Error while saving</span>
        } else {
            return null;
        }
    }
}