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
const fs = require('fs');
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import electron from 'electron';

import { readJsonFile } from '../utils/Utils';
import Customize from './pages/Customize';
import CustomizeQuestions from './pages/CustomizeQuestions';
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
        'customize-questions',
        'settings',
        'locale',
        'preview-video',
        'introduction',
        'main-viewer'
    ];

    multiStreamRecorder;
    frontBack = 'front';

    key = 1; // Used to refresh menu if locale is updated

    static propTypes = {
        startRecording: PropTypes.func,
        stopRecording: PropTypes.func,
        setInputDevice: PropTypes.func,
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
        this.setConfigurationProperty = this.setConfigurationProperty.bind(this);
        this.setLocale = this.setLocale.bind(this);
        this.startRecording = this.startRecording.bind(this);
    }

    componentDidMount() {
        this.loadQuestions();
        this.loadConfiguration();
    }

    setQuestions(questions) {
        // If only one language, use it for the interface
        const locales = Object.keys(questions);
        if (locales.length === 1) {
            this.setLocale(locales[0]);
        }

        this.setState({
            questions: questions
        });
    }

    loadQuestions() {
        readJsonFile(electron.remote.getGlobal('paths').questions).then(data => {
            if (!data) {
                // No data, use the default questions
                readJsonFile(`${electron.remote.getGlobal('paths').appPath}/default-questions.json`).then(defaultQuestions => {
                    this.setQuestions(defaultQuestions);
                    fs.writeFile(electron.remote.getGlobal('paths').questions, JSON.stringify(defaultQuestions, null, 4), () => {});
                }, err => {
                    window.logger.error('Unable to read default-questions.json', err)
                });
            } else {
                this.setQuestions(data);
            }
        }, err => {
            window.logger.error('Error while reading questions.json file', err)
        });
    }

    saveQuestions(questions) {
        // TO DO -> Save to file
        fs.writeFile(electron.remote.getGlobal('paths').config, JSON.stringify(questions, null, 4), (err) => {
            if (err) {
                window.logger.error(err);
                // this.setState({
                //     saveConfigurationStatus: 'error'
                // });
            }
            this.setState({
                questions: questions
            });
        });
    }

    loadConfiguration() {
        // Read config file
        readJsonFile(electron.remote.getGlobal('paths').config).then(data => {
            const mergedConfiguration = Object.assign({}, this.state.configuration, data);

            this.setState({
                configuration: mergedConfiguration
            });
        }, err => {
            window.logger.error('Error while reading config.json file', err)
        });
    }

    saveConfiguration() {
        // Save to config.json file
        this.setState({
            saveConfigurationStatus: 'saving'
        });

        fs.writeFile(electron.remote.getGlobal('paths').config, JSON.stringify(this.state.configuration, null, 4), (err) => {
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
            this.nextStep(index);
        }
    }

    nextStep(index) {
        if (this.state.step === 'customize' || this.state.step === 'settings') {
            this.saveConfiguration();
        }

        if (index >= 0) {
            if (index + 1 >= this.steps.length) {
                // Back to locale picker
                index = this.steps.indexOf('locale');
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

    setConfigurationProperty(property, value) {
        const newConfiguration = Object.assign({}, this.state.configuration, {
            [property]: value
        });
        this.setState({
            configuration: newConfiguration
        });
    }

    setLocale(locale) {
        // If possible, also change interface's locale
        if (window.locales.includes(locale)) {
            this.key++; // Update Menu to take the new locale into consideration
            i18next.changeLanguage(locale);
        }

        this.setState({
            locale
        });
    }

    startRecording() {
        this.props.startRecording(this.state.configuration.audioInputDeviceId, this.state.configuration.videoInputDeviceId);
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
                            key={this.key}
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
                            editQuestions={() => {this.goToStep('customize-questions');}}
                            save={this.saveConfiguration}
                            saveStatus={this.state.saveConfigurationStatus}
                            frontBack={this.frontBack}
                            configuration={this.state.configuration}
                            setConfigurationProperty={this.setConfigurationProperty}
                        />
                    </CSSTransition>
                );
                break;
            case 'customize-questions':
                currentComponent = (
                    <CSSTransition key={this.state.step} classNames="flip" timeout={timeoutFlip}>
                        <CustomizeQuestions
                            back={() => {this.goToStep('customize');}}
                            frontBack={this.frontBack}
                            questions={this.state.questions}
                            saveQuestions={this.saveQuestions}
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
                            startRecording={this.startRecording}
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
                            logo={this.state.configuration.logo}
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
                            configuration={this.state.configuration}
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