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

import { hot } from 'react-hot-loader/root';
import React from 'react';
import PropTypes from 'prop-types';
import i18next from 'i18next';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
// eslint-disable-next-line import/no-extraneous-dependencies
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

const fs = require('fs');

export class App extends React.Component {
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
            questionsData: {},
            saveConfigurationStatus: null
        };

        this.saveConfiguration = this.saveConfiguration.bind(this);
        this.isFlipped = this.isFlipped.bind(this);
        this.goToStep = this.goToStep.bind(this);
        this.goToNextStep = this.goToNextStep.bind(this);
        this.setCurrentInput = this.setCurrentInput.bind(this);
        this.setConfigurationProperty = this.setConfigurationProperty.bind(this);
        this.setLocale = this.setLocale.bind(this);
        this.saveQuestions = this.saveQuestions.bind(this);
        this.startRecording = this.startRecording.bind(this);
    }

    componentDidMount() {
        this.loadQuestions();
        this.loadConfiguration();
    }

    setQuestions(questions) {
        const questionsData = { ...questions.data };
        const questionsCopy = { ...questions };
        delete questionsCopy.data;
        // If only one language, use it for the interface
        const locales = Object.keys(questionsCopy);
        if (locales.length === 1) {
            this.setLocale(locales[0]);
        }

        this.setState({
            questions: questionsCopy,
            questionsData
        });
    }

    setCurrentInput(type, id, cb) {
        if (type === 'audio') {
            this.setState(state => ({
                configuration: {
                    ...state.configuration,
                    audioInputDeviceId: id
                }
            }), cb);
        } else if (type === 'video') {
            this.setState(state => ({
                configuration: {
                    ...state.configuration,
                    videoInputDeviceId: id
                }
            }), cb);
        }
    }

    setConfigurationProperty(property, value) {
        this.setState(state => ({
            configuration: {
                ...state.configuration,
                [property]: value,
                updatedAt: Date.now()
            }
        }));
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

    loadQuestions() {
        readJsonFile(electron.remote.getGlobal('paths').questions).then(data => {
            if (!data) {
                // No data, use the default questions
                const defaultQuestionsFile = `${electron.remote.getGlobal('paths').appPath}/default-questions.json`;
                readJsonFile(defaultQuestionsFile).then(defaultQuestions => {
                    this.setQuestions(defaultQuestions);
                    fs.writeFile(electron.remote.getGlobal('paths').questions, JSON.stringify(defaultQuestions, null, 4), () => {});
                }, err => {
                    window.logger.error('Unable to read default-questions.json', err);
                });
            } else {
                this.setQuestions(data);
            }
        }, err => {
            window.logger.error('Error while reading questions.json file', err);
        });
    }

    saveQuestions(questions) {
        return new Promise((res, rej) => {
            const questionsCopy = { ...questions };
            if (!questionsCopy.data) {
                questionsCopy.data = {};
            }
            questionsCopy.data.updatedAt = Date.now();
            fs.writeFile(electron.remote.getGlobal('paths').questions, JSON.stringify(questionsCopy, null, 4), err => {
                if (err) {
                    window.logger.error(err);
                    rej(err);
                }
                const questionsData = { ...questionsCopy.data };
                delete questionsCopy.data;
                this.setState({
                    questions: questionsCopy,
                    questionsData
                });
                res();
            });
        });
    }

    loadConfiguration() {
        // Read config file
        readJsonFile(electron.remote.getGlobal('paths').config).then(data => {
            this.setState(state => ({
                configuration: {
                    ...state.configuration,
                    ...data
                }
            }));
        }, err => {
            window.logger.error('Error while reading config.json file', err);
        });
    }

    saveConfiguration() {
        const { configuration } = this.state;
        // Save to config.json file
        this.setState({
            saveConfigurationStatus: 'saving'
        });

        fs.writeFile(electron.remote.getGlobal('paths').config, JSON.stringify(configuration, null, 4), (err) => {
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
        const { step } = this.state;
        const index = this.steps.indexOf(step);

        this.nextStep(index);
    }

    goToStep(step) {
        const index = this.steps.indexOf(step);

        // Reset save status
        this.setState({
            saveConfigurationStatus: null
        });

        if (this.shouldShowNextStep(step)) {
            this.frontBack = this.frontBack === 'front' ? 'back' : 'front';
            this.setState({
                step
            });
        } else {
            this.nextStep(index);
        }
    }

    nextStep(index) {
        const { step } = this.state;
        let newIndex = index;
        if (step === 'customize' || step === 'settings') {
            this.saveConfiguration();
        }

        if (index >= 0) {
            if (index + 1 >= this.steps.length) {
                // Back to locale picker
                newIndex = this.steps.indexOf('locale');
            } else {
                newIndex = index + 1;
            }

            const nextStep = this.steps[newIndex];
            this.goToStep(nextStep);
        }
    }

    shouldShowNextStep(nextStep) {
        if (nextStep === 'locale') {
            const { questions } = this.state;
            const locales = Object.keys(questions);
            if (locales.length === 1) {
                return false;
            }
            return true;
        }
        return true;
    }

    startRecording() {
        const { startRecording } = this.props;
        const { configuration } = this.state;
        startRecording(configuration.audioInputDeviceId, configuration.videoInputDeviceId);
    }

    render() {
        let wrapperClasses = null;
        const timeoutFlip = 1000;
        const {
            step, saveConfigurationStatus, configuration, questions, questionsData, locale
        } = this.state;
        const { stopRecording, stream } = this.props;

        if (this.isFlipped()) {
            wrapperClasses = 'flipped';
        }

        let currentComponent;
        switch (step) {
        case 'menu':
            currentComponent = (
                <CSSTransition key={step} classNames="flip" timeout={timeoutFlip}>
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
                <CSSTransition key={step} classNames="flip" timeout={timeoutFlip}>
                    <Customize
                        back={() => { this.goToStep('menu'); }}
                        editQuestions={() => { this.goToStep('customize-questions'); }}
                        save={this.saveConfiguration}
                        saveStatus={saveConfigurationStatus}
                        frontBack={this.frontBack}
                        configuration={configuration}
                        setConfigurationProperty={this.setConfigurationProperty}
                    />
                </CSSTransition>
            );
            break;
        case 'customize-questions':
            currentComponent = (
                <CSSTransition key={step} classNames="flip" timeout={timeoutFlip}>
                    <CustomizeQuestions
                        back={() => { this.goToStep('customize'); }}
                        frontBack={this.frontBack}
                        questions={questions}
                        questionsData={questionsData}
                        saveQuestions={this.saveQuestions}
                    />
                </CSSTransition>
            );
            break;
        case 'settings':
            currentComponent = (
                <CSSTransition key={step} classNames="flip" timeout={timeoutFlip}>
                    <Settings
                        back={() => { this.goToStep('menu'); }}
                        save={this.saveConfiguration}
                        saveStatus={saveConfigurationStatus}
                        frontBack={this.frontBack}
                        currentAudioInputId={configuration.audioInputDeviceId}
                        currentVideoInputId={configuration.videoInputDeviceId}
                        setCurrentInput={this.setCurrentInput}
                    />
                </CSSTransition>
            );
            break;
        case 'locale':
            currentComponent = (
                <CSSTransition key={step} classNames="flip" timeout={timeoutFlip}>
                    <LocalePicker
                        locales={Object.keys(questions)}
                        frontBack={this.frontBack}
                        goToNextStep={this.goToNextStep}
                        setLocale={this.setLocale}
                    />
                </CSSTransition>
            );
            break;
        case 'preview-video':
            currentComponent = (
                <CSSTransition key={step} classNames="flip" timeout={timeoutFlip}>
                    <PreviewVideo
                        frontBack={this.frontBack}
                        goToNextStep={this.goToNextStep}
                        startRecording={this.startRecording}
                        stream={stream}
                    />
                </CSSTransition>
            );
            break;
        case 'introduction':
            currentComponent = (
                <CSSTransition key={step} classNames="flip" timeout={timeoutFlip}>
                    <Introduction
                        frontBack={this.frontBack}
                        goToNextStep={this.goToNextStep}
                        title={configuration.title}
                        logo={configuration.logo}
                    />
                </CSSTransition>
            );
            break;
        case 'main-viewer':
            if (!questions || !locale || !questions[locale]) {
                window.logger.error('Unable to retrieve questions for given locale', {
                    questions,
                    locale
                });
            }
            currentComponent = (
                <CSSTransition key={step} classNames="flip" timeout={timeoutFlip}>
                    <MainViewer
                        frontBack={this.frontBack}
                        goToNextStep={this.goToNextStep}
                        questions={questions[locale]}
                        configuration={configuration}
                        stopRecording={stopRecording}
                    />
                </CSSTransition>
            );
            break;
        default:
            break;
        }

        return (
            <div id="wrapper" className={wrapperClasses}>
                <div id="main">
                    <TransitionGroup>
                        {currentComponent}
                    </TransitionGroup>
                </div>
            </div>
        );
    }
}

App.defaultProps = {
    stream: null
};

App.propTypes = {
    startRecording: PropTypes.func.isRequired,
    stopRecording: PropTypes.func.isRequired,
    stream: PropTypes.object
};

export default hot(App);
