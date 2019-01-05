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

import CustomizeQuestionsEdit from './CustomizeQuestionsEdit';

export default class CustomizeQuestionsList extends React.PureComponent {

    static propTypes = {
        questions: PropTypes.object.isRequired,
        languagesSelected: PropTypes.arrayOf(PropTypes.string).isRequired
    };

    render() {
        const { questions, languagesSelected } = this.props;
        const questionsByIndex = [];

        languagesSelected.map(locale => {
            questions[locale].forEach((question, index) => {
                if (!questionsByIndex[index]) {
                    questionsByIndex[index] = {};
                }
                questionsByIndex[index][locale] = question;
            });
        });

        console.log(questionsByIndex);

        return questionsByIndex.map((question, index) =>
            <CustomizeQuestionsEdit
                key={index}
                question={question}
                languagesSelected={languagesSelected}
                index={index + 1}
            />
        );
    }

}
