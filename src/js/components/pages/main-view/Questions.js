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

import Question from './Question';
import { throttle } from '../../../utils/Utils';

export default class Questions extends React.PureComponent {

    static propTypes = {
        goToNextSubstep: PropTypes.func.isRequired,
        questions: PropTypes.arrayOf(PropTypes.string).isRequired
    };

    constructor(props) {
        super(props);

        this.state = {
            questionIndex: 0
        }

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
        if (this.state.questionIndex > 0) {
            this.setState({
                questionIndex: this.state.questionIndex - 1
            });
        }
    }

    nextQuestion() {
        if (this.state.questionIndex + 1 < this.props.questions.length) {
            this.setState({
                questionIndex: this.state.questionIndex + 1
            });
        } else {
            // Go to "Thanks"
            this.props.goToNextSubstep();
        }
    }

    render() {
        return (
            <div id="question">
                <Question
                    question={this.props.questions[this.state.questionIndex]}
                />
            </div>
        );
    }
}