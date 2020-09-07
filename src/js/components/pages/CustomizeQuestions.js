// Copyright (C) 2020 Théotime Loiseau
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
import SaveIndicator from '../widget/SaveIndicator';
import CustomizeQuestionsLanguages from './customize-questions/CustomizeQuestionsLanguages';
import CustomizeQuestionsList from './customize-questions/CustomizeQuestionsList';

import { debounce } from '../../utils/Utils';

export default class CustomizeQuestions extends React.PureComponent {
    constructor(props) {
        super(props);

        const { questions } = this.props;
        const languagesSelected = Object.keys(questions);
        this.state = {
            languagesSelected,
            questions,
            saveStatus: null
        };

        this.setLanguagesSelected = this.setLanguagesSelected.bind(this);
        this.addLanguage = this.addLanguage.bind(this);
        this.removeLanguage = this.removeLanguage.bind(this);
        this.addQuestion = this.addQuestion.bind(this);
        this.editQuestion = this.editQuestion.bind(this);
        this.saveQuestions = this.saveQuestions.bind(this);
        this.saveQuestionsDebounce = debounce(this.saveQuestions, 2000);
        this.removeQuestion = this.removeQuestion.bind(this);
    }

    setLanguagesSelected(languages) {
        this.setState({
            languagesSelected: languages
        });
    }

    addLanguage(language) {
        const { questions, languagesSelected } = this.state;
        let nbQuestions = 0;
        const arrayEmptyQuestions = [];

        // Get the number of questions
        Object.keys(questions).forEach(locale => {
            nbQuestions = Math.max(nbQuestions, questions[locale].length);
        });

        for (let i = 0; i < nbQuestions; i++) {
            arrayEmptyQuestions.push('');
        }

        this.setState({
            languagesSelected: [...languagesSelected, language],
            questions: { ...questions, [language]: arrayEmptyQuestions }
        }, () => {
            this.saveQuestions();
        });
    }

    removeLanguage(language) {
        const { questions, languagesSelected } = this.state;
        const newQuestions = { ...questions };
        const newLanguagesSelected = [...languagesSelected];
        const indexLanguage = newLanguagesSelected.indexOf(language);

        delete newQuestions[language];
        newLanguagesSelected.splice(indexLanguage, 1);

        this.setState({
            languagesSelected: newLanguagesSelected,
            questions: newQuestions
        }, () => {
            this.saveQuestions();
        });
    }

    addQuestion(questionIndex) {
        const { questions } = this.state;
        const newQuestions = JSON.parse(JSON.stringify(questions));
        Object.keys(newQuestions).forEach(locale => {
            newQuestions[locale].splice(questionIndex + 1, 0, '');
        });

        this.setState({
            questions: newQuestions
        }, () => {
            this.saveQuestions();
        });
    }

    editQuestion(locale, questionIndex, value) {
        const { questions } = this.state;
        const newQuestions = JSON.parse(JSON.stringify(questions));
        newQuestions[locale][questionIndex] = value;

        this.setState({
            questions: newQuestions
        }, () => {
            this.saveQuestionsDebounce();
        });
    }

    removeQuestion(questionIndex) {
        const { questions } = this.state;
        const newQuestions = JSON.parse(JSON.stringify(questions));
        Object.keys(newQuestions).forEach(locale => {
            newQuestions[locale].splice(questionIndex, 1);
        });

        this.setState({
            questions: newQuestions
        }, () => {
            this.saveQuestions();
        });
    }

    saveQuestions() {
        const { saveQuestions } = this.props;
        const { questions } = this.state;

        this.setState({
            saveStatus: 'saving'
        });
        saveQuestions(questions).then(() => {
            this.setState({
                saveStatus: 'saved'
            });
        }, err => {
            window.logger.error(err);
            this.setState({
                saveStatus: 'error'
            });
        });
    }

    render() {
        const { back, frontBack, questionsData } = this.props;
        const { languagesSelected, questions, saveStatus } = this.state;
        const className = `${frontBack}`;
        const languages = Object.keys(questions);

        return (
            <section id="customize-questions" className={className}>
                <BackButton onClick={back} />
                <div className="content-wrap">
                    <div className="custom-form">
                        <h1>{i18next.t('questionsList')}</h1>
                        <div className="customize-block">
                            <h2>{i18next.t('languages')}</h2>
                            <CustomizeQuestionsLanguages
                                languages={languages}
                                languagesSelected={languagesSelected}
                                setLanguagesSelected={this.setLanguagesSelected}
                                addLanguage={this.addLanguage}
                                removeLanguage={this.removeLanguage}
                            />
                        </div>
                        {
                            languagesSelected.length > 0
                            && (
                                <div className="customize-block">
                                    <h2>{i18next.t('questions')}</h2>
                                    <CustomizeQuestionsList
                                        languagesSelected={languagesSelected}
                                        questions={questions}
                                        addQuestion={this.addQuestion}
                                        editQuestion={this.editQuestion}
                                        removeQuestion={this.removeQuestion}
                                    />
                                </div>
                            )
                        }
                    </div>
                    <footer className="save-indicator-container">
                        <SaveIndicator
                            saveStatus={saveStatus}
                            updatedAt={questionsData.updatedAt}
                        />
                    </footer>
                </div>
            </section>
        );
    }
}

CustomizeQuestions.propTypes = {
    frontBack: PropTypes.string.isRequired,
    back: PropTypes.func.isRequired,
    questions: PropTypes.object.isRequired,
    questionsData: PropTypes.object.isRequired,
    saveQuestions: PropTypes.func.isRequired
};
