import React from 'react';
import PropTypes from 'prop-types';

import Question from './Question';
import Utils from '../Utils';

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
        this.previousQuestion = Utils.throttle(this.previousQuestion.bind(this), 1000);
        this.nextQuestion = Utils.throttle(this.nextQuestion.bind(this), 1000);
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