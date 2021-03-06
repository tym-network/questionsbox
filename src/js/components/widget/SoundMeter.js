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

import { throttle } from '../../utils/Utils';

export default class SoundMeter extends React.PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            volume: 0
        };

        this.onAudioProcessThrottled = throttle(this.onAudioProcess.bind(this), 50);
    }

    componentDidMount() {
        const { stream } = this.props;
        this.listenToAudioChanges(stream);
    }

    componentDidUpdate(prevProps) {
        const { stream } = this.props;
        if (prevProps.stream !== stream) {
            if (this.audioContext && this.audioContext.state === 'running') {
                this.audioContext.close();
            }
            this.listenToAudioChanges(stream);
        }
    }

    componentWillUnmount() {
        if (this.audioContext && this.audioContext.state === 'running') {
            this.audioContext.close();
        }
        if (this.script) {
            this.script.onaudioprocess = null;
        }
    }

    onAudioProcess(event) {
        const input = event.inputBuffer.getChannelData(0);
        let sum = 0.0;
        const l = input.length;
        for (let i = 0; i < l; ++i) {
            sum += Math.abs(input[i]);
        }

        this.setState({
            volume: (sum / l) * 2 // Increase volume by 2 to make it more "relevant"
        });
    }

    listenToAudioChanges(stream) {
        if (!stream) {
            return;
        }

        this.audioContext = new AudioContext();
        const script = this.audioContext.createScriptProcessor(2048, 1, 1);
        this.script = script;

        script.onaudioprocess = this.onAudioProcessThrottled;

        const mic = this.audioContext.createMediaStreamSource(stream);
        mic.connect(script);
        // Necessary to make sample run, but should not be.
        script.connect(this.audioContext.destination);
    }

    render() {
        const { volume } = this.state;
        const style = {
            transform: `scaleX(${Math.min(1, volume)})`
        };

        return (
            <div className="sound-meter-container">
                <i className="icon-microphone" />
                <div className="sound-meter">
                    <div className="sound-meter-bar" style={style} />
                </div>
            </div>
        );
    }
}

SoundMeter.defaultProps = {
    stream: null
};

SoundMeter.propTypes = {
    stream: PropTypes.object
};
