import React from 'react';
import PropTypes from 'prop-types';

import {throttle} from '../../utils/Utils';

export default class SoundMeter extends React.PureComponent {

    static propTypes = {
        stream: PropTypes.object
    };

    constructor(props) {
        super(props);

        this.state = {
            volume: 0
        };

        this.onAudioProcessThrottled = throttle(this.onAudioProcess.bind(this), 50);
    }

    componentWillMount() {
        this.listenToAudioChanges(this.props.stream);
    }

    componentWillReceiveProps(newProps) {
        if (this.audioContext) {
            this.audioContext.close();
        }
        this.listenToAudioChanges(newProps.stream);
    }

    componentWillUnmount() {
        if (this.audioContext) {
            this.audioContext.close();
        }
        if (this.script) {
            this.script.onaudioprocess = null;
        }
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

    onAudioProcess(event) {
        const input = event.inputBuffer.getChannelData(0);
        let sum = 0.0;
        let l = input.length;
        for (let i = 0; i < l; ++i) {
            sum += Math.abs(input[i]);
        }

        this.setState({
            volume: (sum / l) * 2 // Increase volume by 2 to make it more "relevant"
        });
    }

    render() {
        const style = {
            transform: `scaleX(${Math.min(1, this.state.volume)})`
        };

        return (
            <div className="sound-meter-container">
                <i className="icon-microphone"></i>
                <div className="sound-meter">
                    <div className="sound-meter-bar" style={style}></div>
                </div>
            </div>
        );
    }
}