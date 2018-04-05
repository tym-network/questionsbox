import React from 'react';
import PropTypes from 'prop-types';
import i18next from 'i18next';
const fs = require('fs');
// import MediaStreamRecorder from 'msr';
// import blobUtil from 'blob-util';
import { CSSTransition, TransitionGroup } from 'react-transition-group'

import { readJsonFile } from '../utils/Utils';
import DataSettings from './DataSettings';
import DeviceSettings from './DeviceSettings';
import LocalePicker from './LocalePicker';
import PreviewVideo from './PreviewVideo';
import Introduction from './Introduction';
import MainViewer from './MainViewer';

export default class App extends React.Component {

    steps = [
        'data-settings',
        'device-settings',
        'locale',
        'preview-video',
        'introduction',
        'main-viewer'
    ];

    multiStreamRecorder;
    frontBack = 'front';

    static propTypes = {
        startRecording: PropTypes.func,
        stopRecording: PropTypes.func,
        stream: PropTypes.object
    };

    constructor(props) {
        super(props);
        this.state = {
            step: 'data-settings',
            locale: 'en',
            configuration: {
                audioInputDeviceId: '',
                videoInputDeviceId: '',
                title: 'Questions Box'
            },
            questions: {}
        }

        this.loadQuestions = this.loadQuestions.bind(this);
        this.isFlipped = this.isFlipped.bind(this);
        this.goToNextStep = this.goToNextStep.bind(this);
        this.setCurrentInput = this.setCurrentInput.bind(this);
        this.setTitle = this.setTitle.bind(this);
        this.setLocale = this.setLocale.bind(this);
    }

    componentDidMount() {
        this.loadQuestions();
        this.loadConfiguration();
    }

    loadQuestions() {
        readJsonFile('questions.json').then(data => {
            // If only one language, use it for the interface
            const locales = Object.keys(data);
            if (locales.length === 1) {
                this.setLocale(locales[0]);
            }

            this.setState({
                questions: data
            });
        }, err => {
            window.logger.error('Error while reading questions.json file', err)
        });
    }

    loadConfiguration() {
        // Read config file
        readJsonFile('.data/config.json').then(data => {
            const mergedConfiguration = Object.assign({}, this.state.configuration, data);

            this.setState({
                configuration: mergedConfiguration
            });
        }, err => {
            window.logger.error('Error while reading .data/config.json file', err)
        });
    }

    saveConfiguration() {
        // Save to config.json file
        fs.mkdir('.data', err => {
            if (err && err.code !== 'EEXIST') {
                window.logger.error('Failed to create ".data" dir ', err);
            }
            fs.writeFile('.data/config.json', JSON.stringify(this.state.configuration, null, 4), (err) => {
                err && window.logger.error(err);
            });
        });
    }

    isFlipped() {
        return this.frontBack === 'back';
    }

    goToNextStep() {
        let index = this.steps.indexOf(this.state.step);

        this.nextStep(index);
    }

    nextStep(index) {
        if (this.state.step === 'data-settings' || this.state.step === 'device-settings') {
            this.saveConfiguration();
        }

        if (index >= 0) {
            if (index + 1 >= this.steps.length) {
                // Back to locale picker
                index = 2;
            } else {
                index++;
            }

            const nextStep = this.steps[index];
            if (this.shouldShowNextStep(nextStep)) {
                this.frontBack = this.frontBack === 'front' ? 'back' : 'front';
                this.setState({
                    step: nextStep
                });
            } else {
                this.nextStep(index + 1);
            }
        }
    }

    shouldShowNextStep(nextStep) {
        if (nextStep === 'locale') {
            const locales =  Object.keys(this.state.questions);
            if (locales.length === 1) {
                return false;
            }
            return true;
        }
        return true;
    }

    setCurrentInput(type, id, cb) {
        if (type === 'audio') {
            const newConfiguration = Object.assign({}, this.state.configuration, {
                audioInputDeviceId: id
            });
            this.setState({
                configuration: newConfiguration
            }, cb);
        } else if (type === 'video') {
            const newConfiguration = Object.assign({}, this.state.configuration, {
                videoInputDeviceId: id
            });
            this.setState({
                configuration: newConfiguration
            }, cb);
        }
    }

    setTitle(title) {
        const newConfiguration = Object.assign({}, this.state.configuration, {
            title
        });
        this.setState({
            configuration: newConfiguration
        });
    }

    setLocale(locale) {
        this.setState({
            locale
        });

        // If possible, also change interface's locale
        if (window.locales.includes(locale)) {
            i18next.changeLanguage(locale);
        }
    }

    render() {
        let wrapperClasses = null;
        const timeoutFlip = 1000;

        if (this.isFlipped()) {
            wrapperClasses = 'flipped';
        }

        let currentComponent;
        switch (this.state.step) {
            case 'data-settings':
                currentComponent = (
                    <CSSTransition key={this.state.step} classNames="flip" timeout={timeoutFlip}>
                        <DataSettings
                            goToNextStep={this.goToNextStep}
                            frontBack={this.frontBack}
                            title={this.state.configuration.title}
                            setTitle={this.setTitle}
                        />
                    </CSSTransition>
                );
                break;
            case 'device-settings':
                currentComponent = (
                    <CSSTransition key={this.state.step} classNames="flip" timeout={timeoutFlip}>
                        <DeviceSettings
                            goToNextStep={this.goToNextStep}
                            frontBack={this.frontBack}
                            currentAudioInputId={this.state.configuration.audioInputDeviceId}
                            currentVideoInputId={this.state.configuration.videoInputDeviceId}
                            setCurrentInput={this.setCurrentInput}
                        />
                    </CSSTransition>
                );
                break;
            case 'locale':
                currentComponent = (
                    <CSSTransition key={this.state.step} classNames="flip" timeout={timeoutFlip}>
                        <LocalePicker
                            locales={Object.keys(this.state.questions)}
                            frontBack={this.frontBack}
                            goToNextStep={this.goToNextStep}
                            setLocale={this.setLocale}
                        />
                    </CSSTransition>
                );
                break;
            case 'preview-video':
                currentComponent = (
                    <CSSTransition key={this.state.step} classNames="flip" timeout={timeoutFlip}>
                        <PreviewVideo
                            frontBack={this.frontBack}
                            goToNextStep={this.goToNextStep}
                            startRecording={this.props.startRecording}
                            stream={this.props.stream}
                        />
                    </CSSTransition>
                );
                break;
            case 'introduction':
                currentComponent = (
                    <CSSTransition key={this.state.step} classNames="flip" timeout={timeoutFlip}>
                        <Introduction
                            frontBack={this.frontBack}
                            goToNextStep={this.goToNextStep}
                            title={this.state.configuration.title}
                        />
                    </CSSTransition>
                );
                break;
            case 'main-viewer':
                if (!this.state.questions || !this.state.locale || !this.state.questions[this.state.locale]) {
                    window.logger.error('Unable to retrieve questions for given locale', {
                        questions: this.state.questions,
                        locale: this.state.locale
                    });
                }
                currentComponent = (
                    <CSSTransition key={this.state.step} classNames="flip" timeout={timeoutFlip}>
                        <MainViewer
                            frontBack={this.frontBack}
                            goToNextStep={this.goToNextStep}
                            questions={this.state.questions[this.state.locale]}
                            stopRecording={this.props.stopRecording}
                        />
                    </CSSTransition>
                );
                break;
        }

        return (
            <div id="wrapper" className={wrapperClasses}>
                <div id="main">
                    <TransitionGroup>
                        {currentComponent}
                    </TransitionGroup>
                </div>
                {
                    // {this.props.stream && <video id="video-feedback" ref={ref => this.video = ref} muted="true" src={URL.createObjectURL(this.props.stream)}></video>}
                }
            </div>
        );
    }
}