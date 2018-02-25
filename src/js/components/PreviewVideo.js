import React from 'react';
import PropTypes from 'prop-types';
import i18next from 'i18next';

export default class PreviewVideo extends React.PureComponent {

    static propTypes = {
        frontBack: PropTypes.string.isRequired,
        goToNextStep: PropTypes.func.isRequired,
        startRecording: PropTypes.func.isRequired,
        stream: PropTypes.object,
        resolution: PropTypes.object
    };

    constructor(props) {
        super(props);

        this.state = {
            style: {}
        };

        // Start recording as soon as the preview is displayed
        this.props.startRecording();
    }

    componentDidMount() {
        this.playVideo();
        this.computeHeight();
    }

    componentDidUpdate() {
        this.playVideo();
    }

    playVideo() {
        this.video && this.video.play();
    }

    computeHeight() {
        if (!this.video || !this.props.resolution) {
            return;
        }

        // Compute height based on resolution
        const resolutionRatio = this.props.resolution.width / this.props.resolution.height;
        const newHeight = this.previewVideo.offsetWidth / resolutionRatio;

        this.setState({
            style: {
                height: newHeight
            }
        });
    }

    render() {
        const classNames = this.props.frontBack;
        return (
            <div id="preview-video" ref={ref => this.previewVideo = ref} className={classNames} style={this.state.style}>
                <video
                    ref={ref => this.video = ref}
                    src={this.props.stream ? URL.createObjectURL(this.props.stream) : null}
                    muted="true"
                >
                </video>
                <button onClick={this.props.goToNextStep}>{i18next.t('next')}</button>
            </div>
        );
    }
}