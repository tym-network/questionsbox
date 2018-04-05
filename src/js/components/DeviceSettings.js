import React from 'react';
import PropTypes from 'prop-types';
import i18next from 'i18next';

import VideoOutput from './VideoOutput';
import SoundMeter from './SoundMeter';
import withStream from './containers/WebRTCStreamContainer';

const VideoOutputWithStream = withStream(VideoOutput);
const SoundMeterWithStream = withStream(SoundMeter);

export default class DeviceSettings extends React.PureComponent {

    static propTypes = {
        frontBack: PropTypes.string.isRequired,
        goToNextStep: PropTypes.func.isRequired,
        setCurrentInput: PropTypes.func.isRequired,
        currentAudioInputId: PropTypes.string,
        currentVideoInputId: PropTypes.string,
    };

    constructor(props) {
        super(props);

        this.state = {
            audioInputs: [],
            videoInputs: []
        }

        this.listDevices = this.listDevices.bind(this);
        this.onSave = this.onSave.bind(this);
    }

    componentWillMount() {
        navigator.mediaDevices.enumerateDevices()
            .then(this.listDevices)
            .catch(function(err) {
                window.logger.error('Error while enumerating devices', err);
            });
    }

    listDevices(deviceInfos) {
        const audioInputs = [];
        const videoInputs = [];
        let audioInputExists = false;
        let videoInputExists = false;

        deviceInfos.forEach(deviceInfo => {
            const device = {
                id: deviceInfo.deviceId
            };

            if (deviceInfo.kind === 'audioinput') {
                device.text = deviceInfo.label || 'microphone ' + (audioInputs.length + 1);
                audioInputs.push(device);
                if (deviceInfo.deviceId === this.props.currentAudioInputId) {
                    audioInputExists = true;
                }
            } else if (deviceInfo.kind === 'videoinput') {
                device.text = deviceInfo.label || 'camera ' + (videoInputs.length + 1);
                videoInputs.push(device);
                if (deviceInfo.deviceId === this.props.currentVideoInputId) {
                    videoInputExists = true;
                }
            }
        });

        this.setState({
            audioInputs,
            videoInputs
        });

        if (!audioInputExists && audioInputs.length > 0) {
            this.props.setCurrentInput('audio', audioInputs[0].id);
        }
        if (!videoInputExists && videoInputs.length > 0) {
            this.props.setCurrentInput('video', videoInputs[0].id);
        }

        return true;
    }

    onSave() {
        this.props.goToNextStep();
    }

    onInputChanged(mediaType) {
        return e => {
            const id = e.target.value;

            this.props.setCurrentInput(mediaType, id);
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
                            <VideoOutputWithStream
                                constraints={{
                                    video: { deviceId: {exact: this.props.currentVideoInputId} }
                                }}
                            />
                        </div>
                        <div className="settings-wrapper-audio">
                            <SoundMeterWithStream
                                constraints={{
                                    audio: { deviceId: {exact: this.props.currentAudioInputId} }
                                }}
                            />
                        </div>
                    </div>
                </div>
                <footer>
                    <button
                        id="save-settings"
                        type="button"
                        onClick={this.onSave}
                    >
                        {i18next.t('saveSettings')}
                    </button>
                </footer>
            </section>
        );
    }
}