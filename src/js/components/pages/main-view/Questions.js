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

import Question from './Question';
import { throttle } from '../../../utils/Utils';

export default class Questions extends React.PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            questionIndex: 0
        };

        this.handleKeyDown = this.handleKeyDown.bind(this);
        this.previousQuestion = throttle(this.previousQuestion.bind(this), 1000);
        this.nextQuestion = throttle(this.nextQuestion.bind(this), 1000);
    }

    componentDidMount() {
        document.addEventListener('keydown', this.handleKeyDown);
    }

    componentWillUnmount() {
        document.removeEventListener('keydown', this.handleKeyDown);
    }

    handleKeyDown(e) {
        if (e.keyCode === 37) {
            // Left arrow
            this.previousQuestion();
        } else {
            this.nextQuestion();
        }
    }

    previousQuestion() {
        const { questionIndex } = this.state;
        if (questionIndex > 0) {
            this.setState({
                questionIndex: questionIndex - 1
            });
        }
    }

    nextQuestion() {
        const { questionIndex } = this.state;
        const { questions, goToNextSubstep } = this.props;

        if (questionIndex + 1 < questions.length) {
            this.setState({
                questionIndex: questionIndex + 1
            });
        } else {
            // Go to "Thanks"
            goToNextSubstep();
        }
    }

    render() {
        const { questions } = this.props;
        const { questionIndex } = this.state;

        return (
            <div id="question">
                <Question
                    question={questions[questionIndex]}
                />
            </div>
        );
    }
}

Questions.propTypes = {
    goToNextSubstep: PropTypes.func.isRequired,
    questions: PropTypes.arrayOf(PropTypes.string).isRequired
};
