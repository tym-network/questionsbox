import React from 'react';
import PropTypes from 'prop-types';
import i18next from 'i18next';

import VideoOutput from './VideoOutput';
import Utils from '../Utils';

export default class DeviceSettings extends React.PureComponent {

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
        this.startVideo = this.startVideo.bind(this);
        this.determineResolution = this.determineResolution.bind(this);
        this.testResolution = this.testResolution.bind(this);
        this.setCurrentInput = this.setCurrentInput.bind(this);
        this.onSave = this.onSave.bind(this);
    }

    componentWillMount() {
        navigator.mediaDevices.enumerateDevices()
            .then(this.listDevices)
            .then(this.startVideo)
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

        return true;
    }

    startVideo() {
        // Select the first device to show
        const audioInputExists = this.state.audioInputs.find(device => {
            return device.id == this.props.currentAudioInputId
        });
        const videoInputExists = this.state.videoInputs.find(device => {
            return device.id == this.props.currentVideoInputId
        });

        if (audioInputExists && videoInputExists) {
            this.determineResolution();
        }
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
        const className = `${this.props.frontBack}`;
        return (
            <section id="device-settings" className={className}>
                <div>
                    <h1>{i18next.t('settings')} (2/2)</h1>
                    <div className="settings-wrapper">
                        <div className="settings-wrapper-inputs">
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
                        <div className="settings-wrapper-video">
                            {(() => {
                                if (this.state.showVideoOuput) {
                                    return (
                                        <VideoOutput
                                            ref={ref => this.videoOutput = ref}
                                            audioInputId={this.props.currentAudioInputId}
                                            videoInputId={this.props.currentVideoInputId}
                                            resolution={this.props.resolution}
                                        />
                                    );
                                } else {
                                    return (
                                        <div className="video-placeholder">
                                            <i className="icon-no-camera"></i>
                                        </div>
                                    );
                                }
                            })()}
                        </div>
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