import React from 'react';
import PropTypes from 'prop-types';
import i18next from 'i18next';
const fs = require('fs');

import VideoOutput from './VideoOutput';
import Utils from '../Utils';

export default class Settings extends React.PureComponent {

    static propTypes = {
        frontBack: PropTypes.string.isRequired,
        goToNextStep: PropTypes.func.isRequired,
        setCurrentInput: PropTypes.func.isRequired,
        setResolution: PropTypes.func.isRequired,
        currentAudioInputId: PropTypes.string,
        currentVideoInputId: PropTypes.string,
        resolution: PropTypes.object
    };

    constructor(props) {
        super(props);

        this.state = {
            audioInputs: [],
            videoInputs: [],
            showVideoOuput: false,
            canSave: false
        }

        this.listDevices = this.listDevices.bind(this);
        this.loadFromConfigFile = this.loadFromConfigFile.bind(this);
        this.determineResolution = this.determineResolution.bind(this);
        this.testResolution = this.testResolution.bind(this);
        this.setCurrentInput = this.setCurrentInput.bind(this);
        this.onSave = this.onSave.bind(this);
    }

    componentWillMount() {
        navigator.mediaDevices.enumerateDevices()
            .then(this.listDevices)
            .then(this.loadFromConfigFile)
            .catch(function(err) {
                window.logger.error('Error while enumerating devices', err);
            });
    }

    listDevices(deviceInfos) {
        const audioInputs = [];
        const videoInputs = [];

        deviceInfos.forEach(deviceInfo => {
            const device = {
                id: deviceInfo.deviceId
            };

            if (deviceInfo.kind === 'audioinput') {
                device.text = deviceInfo.label || 'microphone ' + (audioInputs.length + 1);
                audioInputs.push(device);
            } else if (deviceInfo.kind === 'videoinput') {
                device.text = deviceInfo.label || 'camera ' + (videoInputs.length + 1);
                videoInputs.push(device);
            }
        });

        this.setState({
            audioInputs,
            videoInputs
        });
    }

    loadFromConfigFile() {
        // Read config file
        fs.readFile('.data/config.json', (err, data) => {
            if (err && err.code !== 'ENOENT') {
                window.logger.error('Error while reading config file', err)
            }

            try {
                data = JSON.parse(data);
                if (this.state.audioInputs.find(input => input.id === data.audioInputDeviceId)) {
                    this.setCurrentInput('audio', data.audioInputDeviceId || null);
                }

                if (this.state.videoInputs.find(input => input.id === data.videoInputDeviceId)) {
                    this.setCurrentInput('video', data.videoInputDeviceId || null);
                }
            } catch(err) {
                window.logger.error('Unable to parse JSON data from .data/config.json');
            }
        });
    }

    determineResolution() {
        // WebRTC won't give you the resolution of the camera, so we have to guess it
        if (!this.props.currentVideoInputId) {
            return;
        }

        // Recursive system to test each standard resolution one by one
        this.testResolution(0);
    }

    handleResolutionSuccess(resolution) {
        return (stream) => {
            // Stream won't be used, discard it
            if (stream) {
                stream.getTracks().forEach(function(track) {
                    track.stop();
                });
            }

            this.props.setResolution(resolution, () => {
                // Resolution is set, display the result
                this.setState({
                    showVideoOuput: true,
                    canSave: true
                });
            });
        };
    }

    handleResolutionError(index) {
        return () => {
            // This resolution doesn't work, try the next one
            const newIndex = index + 1;
            if (newIndex < Utils.standardResolutions.length) {
                this.testResolution(newIndex);
            }
        }
    }

    testResolution(index) {
        const resolution = Utils.standardResolutions[index];
        const mediaConstraints = {
            video: {
                deviceId: {exact: this.props.currentVideoInputId},
                width: {exact: resolution.width},
                height: {exact: resolution.height}
            }
        };

        navigator.mediaDevices
            .getUserMedia(mediaConstraints)
            .then(this.handleResolutionSuccess(resolution))
            .catch(this.handleResolutionError(index));
    }

    onSave() {
        if (!this.state.canSave) {
            return;
        }

        this.videoOutput && this.videoOutput.stop();

        this.props.goToNextStep();

        // Save to config.json file
        fs.mkdir('.data', err => {
            var configFile = {
                audioInputDeviceId: this.props.currentAudioInputId,
                videoInputDeviceId: this.props.currentVideoInputId
            };
            if (err && err.code !== 'EEXIST') {
                window.logger.error('Failed to create ".data" dir ', err);
            }
            fs.writeFile('.data/config.json', JSON.stringify(configFile, null, 4), (err) => {
                err && window.logger.error(err);
            });
        });
    }

    setCurrentInput(mediaType, id) {
        this.setState({
            showVideoOuput: false,
            canSave: false
        }, () => {
            this.props.setCurrentInput(mediaType, id);

            if (mediaType === 'video') {
                this.props.setResolution(null, () => {
                    this.determineResolution();
                });
            }
        });
    }

    onInputChanged(mediaType) {
        return e => {
            const id = e.target.value;

            this.setCurrentInput(mediaType, id);
        }
    }

    render() {
        const classNames = `${this.props.frontBack} flex column space-between`;
        return (
            <section id="settings" className={classNames}>
                <div>
                    <h1>{i18next.t('settings')}</h1>
                    <div className="flex row space-between">
                        <div className="flex column grow">
                            <div className="select-input">
                                <label htmlFor="audio-input">{i18next.t('audioInput')}</label>
                                <div className="select-wrapper">
                                    <select id="audio-input" value={this.props.currentAudioInputId} onChange={this.onInputChanged('audio')}>
                                        {this.state.audioInputs.map(audioInput => (
                                            <option key={audioInput.id} value={audioInput.id}>{audioInput.text}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <div className="select-input">
                                <label htmlFor="video-input">{i18next.t('videoInput')}</label>
                                <div className="select-wrapper">
                                    <select id="video-input" value={this.props.currentVideoInputId} onChange={this.onInputChanged('video')}>
                                        {this.state.videoInputs.map(videoInput => (
                                            <option key={videoInput.id} value={videoInput.id}>{videoInput.text}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>
                        {(() => {
                            if (this.state.showVideoOuput) {
                                return (
                                    <div className="flex column center">
                                        <VideoOutput
                                            ref={ref => this.videoOutput = ref}
                                            audioInputId={this.props.currentAudioInputId}
                                            videoInputId={this.props.currentVideoInputId}
                                            resolution={this.props.resolution}
                                        />
                                    </div>
                                );
                            } else {
                                return (
                                    <div className="flex column center">
                                        <div className="video-placeholder">
                                            <i className="icon-no-camera"></i>
                                        </div>
                                    </div>
                                );
                            }
                        })()}
                    </div>
                </div>
                <footer>
                    <button
                        id="save-settings"
                        type="button"
                        onClick={this.onSave}
                        disabled={!this.state.canSave}
                    >
                        {i18next.t('saveSettings')}
                    </button>
                </footer>
            </section>
        );
    }
}