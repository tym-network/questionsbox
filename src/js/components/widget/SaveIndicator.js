// Copyright (C) 2018 Théotime Loiseau
//
// This file is part of QuestionsBox.
//
// QuestionsBox is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// QuestionsBox is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with QuestionsBox.  If not, see <http://www.gnu.org/licenses/>.
//

import React from 'react';
import PropTypes from 'prop-types';
import i18next from 'i18next';
import moment from 'moment';

export default class SaveIndicator extends React.PureComponent {
    debounce = null;

    constructor(props) {
        super(props);

        this.state = {
            status: null
        };

        this.showNextStatus = this.showNextStatus.bind(this);
    }

    componentDidUpdate(prevProps, prevState) {
        const { saveStatus } = this.props;
        const { status } = this.state;

        if (prevProps.saveStatus !== saveStatus) {
            if (saveStatus === 'saving') {
                // eslint-disable-next-line react/no-did-update-set-state
                this.setState({
                    status: saveStatus
                });
                // Stay in "Saving" for at least 600ms
                if (this.debounce) {
                    clearTimeout(this.debounce);
                }
                this.debounce = setTimeout(this.showNextStatus, 600);
            }

            if (!this.debounce) {
                // Status changed to "saved" or "error" and "saving" has been displayed to more than 600ms
                if (saveStatus === 'saved' || saveStatus === 'error') {
                    // eslint-disable-next-line react/no-did-update-set-state
                    this.setState({
                        status: saveStatus
                    });
                }
            }
        }

        if (prevState.status !== status) {
            if (status === 'saved') {
                // Show "saved" for 10s then back to "updated at"
                if (this.debounce) {
                    clearTimeout(this.debounce);
                }
                this.debounce = setTimeout(() => {
                    this.setState({
                        status: null
                    });
                }, 10000);
            }
        }
    }

    componentWillUnmount() {
        if (this.debounce) {
            clearTimeout(this.debounce);
        }
    }

    showNextStatus() {
        const { saveStatus: nextStatus } = this.props;
        this.setState({
            status: nextStatus
        });

        this.debounce = null;
    }

    render() {
        const { status } = this.state;
        const { updatedAt } = this.props;
        let statusText;
        let statusClass;
        let statusTitle = '';
        if (status === 'saving') {
            statusText = i18next.t('saving');
            statusClass = 'warn';
        } else if (status === 'saved') {
            statusText = i18next.t('saved');
            statusClass = 'ok';
        } else if (status === 'error') {
            statusText = i18next.t('saveError');
            statusClass = 'error';
        } else if (updatedAt) {
            const updatedAtMoment = moment(updatedAt);
            const timeFromNow = updatedAtMoment.fromNow();
            statusText = i18next.t('updatedAt', { time: timeFromNow });
            statusClass = 'info';
            statusTitle = updatedAtMoment.format('LLL');
        } else {
            return null;
        }

        return (
            <div className={`save-indicator ${statusClass}`} ref={ref => { this.saveIndicator = ref; }}>
                <span className="save-indicator-text" title={statusTitle}>{statusText}</span>
            </div>
        );
    }
}

SaveIndicator.defaultProps = {
    saveStatus: null,
    updatedAt: null
};

SaveIndicator.propTypes = {
    saveStatus: PropTypes.string,
    updatedAt: PropTypes.number
};
