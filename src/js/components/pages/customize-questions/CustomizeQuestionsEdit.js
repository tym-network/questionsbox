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

import CustomizeQuestionsTextarea from './CustomizeQuestionsTextarea';

export default class CustomizeQuestionsEdit extends React.PureComponent {
    constructor(props) {
        super(props);

        this.addQuestion = this.addQuestion.bind(this);
        this.editQuestion = this.editQuestion.bind(this);
        this.removeQuestion = this.removeQuestion.bind(this);
    }

    addQuestion() {
        const { index, addQuestion } = this.props;
        addQuestion(index);
    }

    editQuestion(locale) {
        const { editQuestion, index } = this.props;

        return value => {
            editQuestion(locale, index, value);
        };
    }

    removeQuestion() {
        const { index, removeQuestion } = this.props;
        removeQuestion(index);
    }

    render() {
        const { question, languagesSelected, index } = this.props;

        return (
            <>
                <div className="questions-edit">
                    <span className="question-number">
                        {index + 1}
                        .
                    </span>
                    <div className="questions-edit-textareas">
                        {languagesSelected.map(locale => (
                            <CustomizeQuestionsTextarea
                                key={locale}
                                locale={locale}
                                question={question[locale]}
                                editQuestion={this.editQuestion(locale)}
                            />
                        ))}
                    </div>
                    <button
                        className="questions-edit-remove"
                        onClick={this.removeQuestion}
                        type="button"
                    >
                        <i className="icon-trash" />
                    </button>
                </div>
                <button
                    className="btn-pill btn-add-question"
                    onClick={this.addQuestion}
                    type="button"
                >
                    {i18next.t('addQuestion')}
                </button>
            </>
        );
    }
}

CustomizeQuestionsEdit.propTypes = {
    question: PropTypes.object.isRequired,
    languagesSelected: PropTypes.arrayOf(PropTypes.string).isRequired,
    index: PropTypes.number.isRequired,
    addQuestion: PropTypes.func.isRequired,
    editQuestion: PropTypes.func.isRequired,
    removeQuestion: PropTypes.func.isRequired
};
