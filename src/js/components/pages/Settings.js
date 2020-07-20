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

import BackButton from '../widget/BackButton';
import SaveIndicator from '../widget/SaveIndicator';
import SoundMeter from '../widget/SoundMeter';
import VideoOutput from '../widget/VideoOutput';
import withStream from '../containers/WebRTCStreamContainer';
import { listDevices } from '../../utils/WebRTCUtils'

const VideoOutputWithStream = withStream(VideoOutput);
const SoundMeterWithStream = withStream(SoundMeter);

export default class Settings extends React.PureComponent {

    static propTypes = {
        frontBack: PropTypes.string.isRequired,
        save: PropTypes.func.isRequired,
        saveStatus: PropTypes.string,
        back: PropTypes.func.isRequired,
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

        this.handleDeviceList = this.handleDeviceList.bind(this);
    }

    componentDidMount() {
        listDevices().then(this.handleDeviceList)
    }

    handleDeviceList(deviceList) {
        const { audioInputs, videoInputs } = deviceList;
        let audioInputExists = false;
        let videoInputExists = false;

        audioInputExists = !!audioInputs.find(deviceInfo => (
            deviceInfo.deviceId === this.props.currentAudioInputId
        ));

        videoInputExists = !!videoInputs.find(deviceInfo => (
            deviceInfo.deviceId === this.props.currentVideoInputId
        ));

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

    onInputChanged(mediaType) {
        return e => {
            const id = e.target.value;

            this.props.setCurrentInput(mediaType, id, () => {
                this.props.save();
            });
        }
    }

    render() {
        const className = `${this.props.frontBack}`;
        return (
            <section id="settings" className={className}>
                <BackButton onClick={this.props.back} />
                <div className="content-wrap">
                    <h1>{i18next.t('settings')}</h1>
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
                            <div className="settings-preview-audio">
                                <SoundMeterWithStream
                                    constraints={{
                                        audio: { deviceId: {exact: this.props.currentAudioInputId} }
                                    }}
                                />
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
                            <div className="settings-preview-video">
                                <VideoOutputWithStream
                                    constraints={{
                                        video: { deviceId: {exact: this.props.currentVideoInputId} }
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                    <footer className="save-indicator-container">
                        <SaveIndicator saveStatus={this.props.saveStatus} />
                    </footer>
                </div>
            </section>
        );
    }
}