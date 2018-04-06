import React from 'react';
import PropTypes from 'prop-types';

export default class VideoOutput extends React.PureComponent {

    static propTypes = {
        stream: PropTypes.object,
        streamError: PropTypes.object
    };

    componentDidMount() {
        if (this.video) {
            this.video.play();
        }
    }

    componentDidUpdate() {
        if (this.video) {
            this.video.play();
        }
    }

    componentWillUnmount() {
        if (this.video) {
            this.video.pause();
        }
    }

    render() {
        if (this.props.streamError) {
            return (
                <div className="error-message">ERROR</div>
            )
        }

        if (!this.props.stream) {
            return (
                <div className="video-placeholder">
                    <i className="icon-no-camera"></i>
                </div>
            );
        }

        return (
            <video
                id="video-output"
                ref={ref => this.video = ref}
                src={this.props.stream ? URL.createObjectURL(this.props.stream) : null}
                muted="true"
            >
            </video>
        );
    }
}