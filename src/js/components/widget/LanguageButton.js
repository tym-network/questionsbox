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

export default class LanguageButton extends React.PureComponent {

    static propTypes = {
        language: PropTypes.string.isRequired,
        isSelected: PropTypes.bool.isRequired,
        toggle: PropTypes.func.isRequired,
        remove: PropTypes.func.isRequired
    };

    constructor(props) {
        super(props);
        this.onToggle = this.onToggle.bind(this);
        this.onRemove = this.onRemove.bind(this);
    }

    onToggle() {
        const { language, toggle } = this.props;
        toggle(language);
    }

    onRemove() {
        const { language, remove } = this.props;
        remove(language);
    }

    render() {
        const { language, isSelected } = this.props;
        const inputId = `toggle-${language}`;

        return (
            <div className="language-button">
                <input
                    type="checkbox"
                    id={inputId}
                    checked={isSelected}
                    onChange={this.onToggle}
                />
                <label className="button btn-pill-left" htmlFor={inputId}>
                    <div className="checkbox">
                        <i className="checkmark icon-checkmark-round"></i>
                    </div>
                    { language }
                </label>
                <button
                    className="language-button-remove btn-pill-right"
                    alt={i18next.t('delete')}
                    onClick={this.onRemove}
                >
                    <i className="icon-trash"></i>
                </button>
            </div>
        );
    }

}
