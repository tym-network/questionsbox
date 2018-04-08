import React from 'react';
import PropTypes from 'prop-types';
import i18next from 'i18next';

export default class SaveIndicator extends React.PureComponent {

    static propTypes = {
        saveStatus: PropTypes.string,
    };

    render() {
        let statusText;
        let statusClass;
        if (this.props.saveStatus === 'saving') {
            statusText = i18next.t('saving');
            statusClass = 'warn';
        } else if (this.props.saveStatus === 'saved') {
            statusText = i18next.t('saved');
            statusClass = 'ok';
        } else if (this.props.saveStatus === 'error') {
            statusText = i18next.t('error');
            statusClass = 'error';
        } else {
            return null;
        }

        return (
            <div className={`save-indicator ${statusClass}`} ref={ref => this.saveIndicator = ref}>
                <span className="save-indicator-text">{statusText}</span>
            </div>
        );
    }
}