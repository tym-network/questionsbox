import React from 'react';
import PropTypes from 'prop-types';

export default class VideoOutput extends React.PureComponent {

    static propTypes = {
        audioInputId: PropTypes.string,
        videoInputId: PropTypes.string,
        resolution: PropTypes.object
    };

    constructor(props) {
        super(props);

        this.state = {
            error: null,
            stream: null
        };

        this.handleStream = this.handleStream.bind(this);
        this.handleStreamError = this.handleStreamError.bind(this);
        this.setStream = this.setStream.bind(this);
    }

    componentWillMount() {
        this.setStream(this.props.audioInputId, this.props.videoInputId, this.props.resolution);
    }

    componentWillReceiveProps(nextProps) {
        this.setStream(nextProps.audioInputId, nextProps.videoInputId, nextProps.resolution);
    }

    handleStream(stream) {
        this.setState({
            error: null,
            stream: stream
        }, () => {
            this.video && this.video.play();
        });

    }

    handleStreamError(err) {
        window.logger.error('Can\'t display video input', err);

        this.setState({
            error: 'Selected devices can\'t be used'
        });
    }

    setStream(audioInputId, videoInputId, resolution) {
        if (!audioInputId || !videoInputId || !resolution) {
            return;
        }

        const mediaConstraints = {
            audio: {deviceId: {exact: audioInputId}},
            video: {
                deviceId: {exact: videoInputId},
                width: {exact: resolution.width},
                height: {exact: resolution.height}
            }
        };

        if (this.state.stream) {
            this.state.stream.getTracks().forEach(function(track) {
                track.stop();
            });
            this.setState({
                stream: null
            });
        }

        navigator.mediaDevices
            .getUserMedia(mediaConstraints)
            .then(this.handleStream)
            .catch(this.handleStreamError);
    }

    stop() {
        if (this.state.stream) {
            this.state.stream.getTracks().forEach(track => (
                track.stop()
            ));
        }

        this.setState({
            stream: null
        });
    }

    render() {
        if (this.state.error) {
            return (
                <div className="error-message">{this.state.error}</div>
            )
        }

        return (
            <video
                id="video-output"
                ref={ref => this.video = ref}
                src={this.state.stream ? URL.createObjectURL(this.state.stream) : null}
                muted="true"
            >
            </video>
        );
    }
}