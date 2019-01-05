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
// import i18next from 'i18next';

import CustomizeQuestionsTextarea from './CustomizeQuestionsTextarea';

export default class CustomizeQuestionsEdit extends React.PureComponent {

    static propTypes = {
        question: PropTypes.object.isRequired,
        languagesSelected: PropTypes.arrayOf(PropTypes.string).isRequired,
        index: PropTypes.number.isRequired
    };

    render() {
        const { question, languagesSelected, index } = this.props;

        return (
            <div className="questions-edit">
                <span className="question-number">{index}.</span>
                <div className="questions-edit-textareas">
                    {languagesSelected.map(locale =>
                        <CustomizeQuestionsTextarea
                            key={locale}
                            locale={locale}
                            question={question[locale]}
                        />
                    )}
                </div>
                <button className="questions-edit-remove">
                    <i className="icon-trash"></i>
                </button>
            </div>
        );
    }

}
