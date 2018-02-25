import React from 'react';
import fs from 'fs';
import i18next from 'i18next';
// import MediaStreamRecorder from 'msr';
// import blobUtil from 'blob-util';
import { CSSTransition, TransitionGroup } from 'react-transition-group'

import Settings from './Settings';
import LocalePicker from './LocalePicker';
import PreviewVideo from './PreviewVideo';
import Introduction from './Introduction';
import MainViewer from './MainViewer';

export default class App extends React.Component {

    steps = [
        'settings',
        'locale',
        'preview-video',
        'introduction',
        'main-viewer'
    ];

    multiStreamRecorder;
    frontBack = 'front';

    constructor(props) {
        super(props);

        this.state = {
            step: 'settings',
            locale: 'en',
            currentAudioInputId: '',
            currentVideoInputId: '',
            cameraResolution: null,
            questions: {},
            stream: null
        }

        this.loadQuestions = this.loadQuestions.bind(this);
        this.isFlipped = this.isFlipped.bind(this);
        this.goToNextStep = this.goToNextStep.bind(this);
        this.setCurrentInput = this.setCurrentInput.bind(this);
        this.setLocale = this.setLocale.bind(this);
        this.setResolution = this.setResolution.bind(this);
        this.startRecording = this.startRecording.bind(this);
        this.stopRecording = this.stopRecording.bind(this);
    }

    componentDidMount() {
        this.loadQuestions();
    }

    loadQuestions() {
        // Read config file
        fs.readFile('questions.json', (err, data) => {
            if (err && err.code !== 'ENOENT') {
                window.logger.error('Error while reading questions.json file', err)
            }

            try {
                data = JSON.parse(data);
                this.setState({
                    questions: data
                });
            } catch(err) {
                window.logger.error('Unable to parse JSON data from questions.json');
            }
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
        if (index >= 0) {
            if (index + 1 >= this.steps.length) {
                index = 0;
            }

            const nextStep = this.steps[index + 1];
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
                this.setLocale(locales[0]);
                return false;
            }
            return true;
        }
        return true;
    }

    setCurrentInput(type, id, cb) {
        if (type === 'audio') {
            this.setState({
                currentAudioInputId: id
            }, cb);
        } else if (type === 'video') {
            this.setState({
                currentVideoInputId: id
            }, cb);
        }
    }

    setResolution(resolution, cb) {
        this.setState({
            cameraResolution: resolution
        }, cb);
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

    startRecording() {
        const mediaConstraints = {
            audio: {deviceId: {exact: this.state.currentAudioInputId}},
            video: {
                deviceId: {exact: this.state.currentVideoInputId},
                width: {exact: this.state.cameraResolution.width},
                height: {exact: this.state.cameraResolution.height}
            }
        };

        const onMediaError = function(e) {
            window.logger.error('Media error while recording', e);
        };

        const onMediaSuccess = stream => {
            this.setState({ stream });

            // this.multiStreamRecorder = new MediaStreamRecorder.MultiStreamRecorder(stream);
            // this.multiStreamRecorder.stream = stream;
            // this.multiStreamRecorder.canvas = {
            //     width: this.state.cameraResolution.width,
            //     height: this.state.cameraResolution.height
            // };
            // this.multiStreamRecorder.video = this.video;
            // this.multiStreamRecorder.ondataavailable = blobs => {
            //     const videoName = + new Date();
            //     try {
            //         blobUtil.blobToBase64String(blobs.video).then(base64String => {
            //             fs.writeFile('videos/' + videoName + '.webm', new Buffer(base64String, 'base64'), function(err){
            //                 if (err) {
            //                     window.logger.error('Failed to save video', videoName, err);
            //                 } else {
            //                     window.logger.info('File saved', videoName);
            //                 }
            //             });
            //         }, err => {
            //             window.logger.error('Failed to convert blob to base64', err);
            //         });
            //     } catch(e) {
            //         window.logger.error(e);
            //     }
            // };

            // const timeInterval = 20000;
            // // get blob after specific time interval
            // this.multiStreamRecorder.start(timeInterval);

            this.video.play();
        };

        navigator.mediaDevices
            .getUserMedia(mediaConstraints)
            .then(onMediaSuccess)
            .catch(onMediaError);
    }

    stopRecording() {
        if (this.multiStreamRecorder) {
            this.multiStreamRecorder.stop();
            this.multiStreamRecorder = null;

            if (this.state.stream) {
                this.state.stream.getTracks().forEach(function(track) {
                    track.stop();
                });
                this.setState({
                    stream: null
                });
            }
        }
    }

    logger(name) {
        return () => {
            const t = console;
            t.log('EVENT', name);
        };
    }

    render() {
        let wrapperClasses = null;
        const timeoutFlip = 1000;

        if (this.isFlipped()) {
            wrapperClasses = 'flipped';
        }

        let currentComponent;
        switch (this.state.step) {
            case 'settings':
                currentComponent = (
                    <CSSTransition key={this.state.step} classNames="flip" timeout={timeoutFlip}>
                        <Settings
                            className={`fade fade-${status}`}
                            goToNextStep={this.goToNextStep}
                            frontBack={this.frontBack}
                            currentAudioInputId={this.state.currentAudioInputId}
                            currentVideoInputId={this.state.currentVideoInputId}
                            resolution={this.state.cameraResolution}
                            setCurrentInput={this.setCurrentInput}
                            setResolution={this.setResolution}
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
                            className={`fade fade-${status}`}
                            frontBack={this.frontBack}
                            goToNextStep={this.goToNextStep}
                            startRecording={this.startRecording}
                            stream={this.state.stream}
                            resolution={this.state.cameraResolution}
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
                            stopRecording={this.stopRecording}
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
                {this.state.stream && <video id="video-feedback" ref={ref => this.video = ref} muted="true" src={URL.createObjectURL(this.state.stream)}></video>}
            </div>
        );
    }
}