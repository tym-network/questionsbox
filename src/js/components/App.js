import React from 'react';
import PropTypes from 'prop-types';
import i18next from 'i18next';
const fs = require('fs');
import { CSSTransition, TransitionGroup } from 'react-transition-group'

import { readJsonFile } from '../utils/Utils';
import Customize from './pages/Customize';
import Introduction from './pages/Introduction';
import LocalePicker from './pages/LocalePicker';
import MainViewer from './pages/MainViewer';
import Menu from './pages/Menu';
import PreviewVideo from './pages/PreviewVideo';
import Settings from './pages/Settings';

export default class App extends React.Component {

    steps = [
        'menu',
        'customize',
        'settings',
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
            step: 'menu',
            locale: 'en',
            configuration: {
                audioInputDeviceId: '',
                videoInputDeviceId: '',
                title: 'Questions Box'
            },
            questions: {},
            saveConfigurationStatus: null
        }

        this.saveConfiguration = this.saveConfiguration.bind(this);
        this.isFlipped = this.isFlipped.bind(this);
        this.goToStep = this.goToStep.bind(this);
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
        this.setState({
            saveConfigurationStatus: 'saving'
        });
        fs.mkdir('.data', err => {
            if (err && err.code !== 'EEXIST') {
                window.logger.error('Failed to create ".data" dir ', err);
                this.setState({
                    saveConfigurationStatus: 'error'
                });
            }
            fs.writeFile('.data/config.json', JSON.stringify(this.state.configuration, null, 4), (err) => {
                if (err) {
                    window.logger.error(err);
                    this.setState({
                        saveConfigurationStatus: 'error'
                    });
                }
                this.setState({
                    saveConfigurationStatus: 'saved'
                });
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

    goToStep(step) {
        let index = this.steps.indexOf(step);

        // Reset save status
        this.setState({
            saveConfigurationStatus: null
        });

        if (this.shouldShowNextStep(step)) {
            this.frontBack = this.frontBack === 'front' ? 'back' : 'front';
            this.setState({
                step: step
            });
        } else {
            this.nextStep(index + 1);
        }
    }

    nextStep(index) {
        if (this.state.step === 'customize' || this.state.step === 'settings') {
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
            this.goToStep(nextStep);
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
            case 'menu':
                currentComponent = (
                    <CSSTransition key={this.state.step} classNames="flip" timeout={timeoutFlip}>
                        <Menu
                            goToStep={this.goToStep}
                            frontBack={this.frontBack}
                        />
                    </CSSTransition>
                );
                break;
            case 'customize':
                currentComponent = (
                    <CSSTransition key={this.state.step} classNames="flip" timeout={timeoutFlip}>
                        <Customize
                            back={() => {this.goToStep('menu');}}
                            save={this.saveConfiguration}
                            saveStatus={this.state.saveConfigurationStatus}
                            frontBack={this.frontBack}
                            title={this.state.configuration.title}
                            setTitle={this.setTitle}
                        />
                    </CSSTransition>
                );
                break;
            case 'settings':
                currentComponent = (
                    <CSSTransition key={this.state.step} classNames="flip" timeout={timeoutFlip}>
                        <Settings
                            back={() => {this.goToStep('menu');}}
                            save={this.saveConfiguration}
                            saveStatus={this.state.saveConfigurationStatus}
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