import React from 'react';
import PropTypes from 'prop-types';
import { CSSTransition, TransitionGroup } from 'react-transition-group'
import fs from 'fs';

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

    constructor(props) {
        super(props);

        this.state = {
            step: 'instructions',
            style: {}
        };

        this.goToNextSubstep = this.goToNextSubstep.bind(this);
        this.goToNextStep = this.goToNextStep.bind(this);
        this.setStyle = this.setStyle.bind(this);
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

        return (
            <div id="start" className={classNames} style={this.state.style}>
                <TransitionGroup>
                    {currentComponent}
                </TransitionGroup>
            </div>
        );
    }
}