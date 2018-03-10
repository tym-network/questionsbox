import React from 'react';
import PropTypes from 'prop-types';
import { CSSTransition, TransitionGroup } from 'react-transition-group'
import fs from 'fs';

import Buzzer from './Buzzer';
import Instructions from './Instructions';
import IntroVideo from './IntroVideo';
import Questions from './Questions';
import Thanks from './Thanks';

export default class MainViewer extends React.PureComponent {

    static propTypes = {
        frontBack: PropTypes.string.isRequired,
        goToNextStep: PropTypes.func.isRequired,
        questions: PropTypes.arrayOf(PropTypes.string).isRequired,
        stopRecording: PropTypes.func.isRequired
    };

    steps = [
        'instructions',
        'intro-video',
        'questions',
        'thanks'
    ];

    lastBuzzId = 0;

    constructor(props) {
        super(props);

        this.state = {
            step: 'instructions',
            style: {},
            buzzers: []
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

    onDocumentClick (e) {
        if (e.target.tagName !== 'BUTTON') {
            this.addBuzzer();
        }
    }

    goToNextSubstep() {
        let index = this.steps.indexOf(this.state.step);

        if (index >= 0) {
            if (index + 1 >= this.steps.length) {
                return;
            }

            let nextStep = this.steps[index + 1];
            if (nextStep === 'intro-video') {
                try {
                    fs.statSync('../movies/baq.webm')
                } catch(e) {
                    // Don't show IntroVideo if video isn't found
                    nextStep = this.steps[index + 2];
                }
            }

            this.setState({
                step: nextStep,
                style: {}
            });
        }
    }

    goToNextStep() {
        this.props.stopRecording();
        this.props.goToNextStep();
    }

    setStyle(style) {
        this.setState({
            style
        });
    }

    addBuzzer() {
        let newBuzzers = this.state.buzzers.slice(0);

        newBuzzers.push(this.lastBuzzId);
        this.lastBuzzId++;

        this.setState({
            buzzers: newBuzzers
        });
    }

    onBuzzerEnd(id) {
        // Remove buzzer based on the id
        const index = this.state.buzzers.indexOf(id);
        let newBuzzers = this.state.buzzers;

        if (index >= 0) {
            newBuzzers = this.state.buzzers.splice(index, 1);
        }

        this.setState({
            buzzers: newBuzzers
        });
    }

    render() {
        let currentComponent;
        const timeoutTransition = 400;
        const classNames = this.props.frontBack;

        switch (this.state.step) {
            case 'instructions':
                currentComponent = (
                    <CSSTransition key={this.state.step} classNames="fade" timeout={timeoutTransition}>
                        <Instructions
                            goToNextSubstep={this.goToNextSubstep}
                        />
                    </CSSTransition>
                );
                break;
            case 'intro-video':
                currentComponent = (
                    <CSSTransition key={this.state.step} classNames="fade" timeout={timeoutTransition}>
                        <IntroVideo
                            goToNextSubstep={this.goToNextSubstep}
                            setStyle={this.setStyle}
                        />
                    </CSSTransition>
                );
                break;
            case 'questions':
                currentComponent = (
                    <Questions
                        goToNextSubstep={this.goToNextSubstep}
                        questions={this.props.questions}
                    />
                );
                break;
            case 'thanks':
                currentComponent = (
                    <Thanks
                        goToNextStep={this.goToNextStep}
                    />
                );
                break;
        }

        const buzzers = this.state.buzzers.map(buzzerId => (
            <Buzzer
                key={buzzerId}
                id={buzzerId}
                onEnd={this.onBuzzerEnd}
            />
        ))

        return (
            <div id="start" className={classNames} style={this.state.style}>
                <TransitionGroup>
                    {currentComponent}
                </TransitionGroup>
                {buzzers}
            </div>
        );
    }
}