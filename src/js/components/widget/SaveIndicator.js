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