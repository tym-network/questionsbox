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

import BackButton from '../widget/BackButton';
import CustomizeQuestionsLanguages from './customize-questions/CustomizeQuestionsLanguages';
import CustomizeQuestionsList from './customize-questions/CustomizeQuestionsList';

export default class CustomizeQuestions extends React.PureComponent {

    static propTypes = {
        frontBack: PropTypes.string.isRequired,
        back: PropTypes.func.isRequired,
        questions: PropTypes.object.isRequired,
        saveQuestions: PropTypes.func.isRequired
    };

    constructor(props) {
        super(props);

        const languagesSelected = Object.keys(this.props.questions);
        this.state = {
            languagesSelected: languagesSelected,
            questions: this.props.questions
        };

        this.setLanguagesSelected = this.setLanguagesSelected.bind(this);
        this.addLanguage = this.addLanguage.bind(this);
        this.removeLanguage = this.removeLanguage.bind(this);
        this.removeQuestion = this.removeQuestion.bind(this);
    }

    setLanguagesSelected(languages) {
        this.setState({
            languagesSelected: languages
        });
    }

    addLanguage(language) {
        const { questions, languagesSelected } = this.state;

        this.setState({
            languagesSelected: [...languagesSelected, language],
            questions: {...questions, [language]: ['']}
        });
    }

    removeLanguage(language) {
        const { questions, languagesSelected } = this.state;
        const newQuestions = {...questions};
        const newLanguagesSelected = [...languagesSelected];
        const indexLanguage = newLanguagesSelected.indexOf(language);

        delete newQuestions[language];
        newLanguagesSelected.splice(indexLanguage, 1);

        this.setState({
            languagesSelected: newLanguagesSelected,
            questions: newQuestions
        });
    }

    removeQuestion(question) {
        console.log('removeQuestion', question);
    }

    render() {
        const { back, frontBack } = this.props;
        const { languagesSelected, questions } = this.state;
        const className = `${frontBack}`;
        const languages = Object.keys(this.state.questions);

        return (
            <section id="customize-questions" className={className}>
                <BackButton onClick={back}/>
                <div className="custom-form">
                    <h1>{i18next.t('questionsList')}</h1>
                    <div className="customize-block">
                        <label>{i18next.t('languages')}</label>
                        <CustomizeQuestionsLanguages
                            languages={languages}
                            languagesSelected={languagesSelected}
                            setLanguagesSelected={this.setLanguagesSelected}
                            addLanguage={this.addLanguage}
                            removeLanguage={this.removeLanguage}
                        />
                    </div>
                    {
                        languagesSelected.length > 0 &&
                            <div className="customize-block">
                                <label>{i18next.t('questions')}</label>
                                <CustomizeQuestionsList
                                    languagesSelected={languagesSelected}
                                    questions={questions}
                                    removeQuestion={this.removeQuestion}
                                />
                            </div>
                    }
                </div>
            </section>
        );
    }

}