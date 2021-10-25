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
import fs from 'fs';

import Buzzer from '../widget/Buzzer';
import Instructions from './main-view/Instructions';
import IntroVideo from './main-view/IntroVideo';
import Questions from './main-view/Questions';
import Thanks from './main-view/Thanks';

export default class MainViewer extends React.PureComponent {
    steps = ['instructions', 'intro-video', 'questions', 'thanks'];

    lastBuzzId = 0;

    constructor(props) {
        super(props);

        this.state = {
            step: 'instructions',
            style: {},
            buzzers: [],
        };

        this.onDocumentClick = this.onDocumentClick.bind(this);
        this.goToNextSubstep = this.goToNextSubstep.bind(this);
        this.goToNextStep = this.goToNextStep.bind(this);
        this.setStyle = this.setStyle.bind(this);
        this.onBuzzerEnd = this.onBuzzerEnd.bind(this);
    }

    componentDidMount() {
        document.addEventListener('click', this.onDocumentClick);
    }

    componentWillUnmount() {
        document.removeEventListener('click', this.onDocumentClick);
    }

    onDocumentClick(e) {
        if (e.target.tagName !== 'BUTTON') {
            this.addBuzzer();
        }
    }

    onBuzzerEnd(id) {
        // Remove buzzer based on the id
        const { buzzers } = this.state;
        const index = buzzers.indexOf(id);
        const newBuzzers = JSON.parse(JSON.stringify(buzzers));

        if (index >= 0) {
            newBuzzers.splice(index, 1);
        }

        this.setState({
            buzzers: newBuzzers,
        });
    }

    setStyle(style) {
        this.setState({
            style,
        });
    }

    addBuzzer() {
        const { buzzers } = this.state;
        const newBuzzers = buzzers.slice(0);

        newBuzzers.push(this.lastBuzzId);
        this.lastBuzzId++;

        this.setState({
            buzzers: newBuzzers,
        });
    }

    goToNextStep() {
        const { stopRecording, goToNextStep } = this.props;
        stopRecording();
        goToNextStep();
    }

    goToNextSubstep() {
        const { step } = this.state;
        const index = this.steps.indexOf(step);

        if (index >= 0) {
            if (index + 1 >= this.steps.length) {
                return;
            }

            let nextStep = this.steps[index + 1];
            if (nextStep === 'intro-video') {
                try {
                    fs.statSync('../movies/baq.webm');
                } catch (e) {
                    // Don't show IntroVideo if video isn't found
                    nextStep = this.steps[index + 2];
                }
            }

            this.setState({
                step: nextStep,
                style: {},
            });
        }
    }

    render() {
        const { questions, configuration } = this.props;
        const { step, buzzers, style } = this.state;
        let currentComponent;

        switch (step) {
            case 'instructions':
                currentComponent = <Instructions goToNextSubstep={this.goToNextSubstep} />;
                break;
            case 'intro-video':
                currentComponent = <IntroVideo goToNextSubstep={this.goToNextSubstep} setStyle={this.setStyle} />;
                break;
            case 'questions':
                currentComponent = <Questions goToNextSubstep={this.goToNextSubstep} questions={questions} />;
                break;
            case 'thanks':
                currentComponent = <Thanks goToNextStep={this.goToNextStep} />;
                break;
            default:
                break;
        }

        const buzzersElements = buzzers.map((buzzerId) => <Buzzer key={buzzerId} id={buzzerId} buzzSound={configuration.buzzSound} onEnd={this.onBuzzerEnd} />);

        return (
            <section id="start" className="card" style={style}>
                <div className="content-wrap flex-column">{currentComponent}</div>
                {buzzersElements}
            </section>
        );
    }
}

MainViewer.propTypes = {
    goToNextStep: PropTypes.func.isRequired,
    questions: PropTypes.arrayOf(PropTypes.string).isRequired,
    configuration: PropTypes.shape({
        buzzSound: PropTypes.string,
    }).isRequired,
    stopRecording: PropTypes.func.isRequired,
};
