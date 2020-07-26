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

export default class PreviewVideo extends React.PureComponent {
    constructor(props) {
        super(props);
        const { startRecording } = this.props;

        this.state = {
            style: {}
        };

        this.video = React.createRef();

        // Start recording as soon as the preview is displayed
        startRecording();
    }

    componentDidMount() {
        const { stream } = this.props;
        this.playVideo();
        this.computeHeight();

        if (this.video && this.video.current && stream) {
            this.video.current.srcObject = stream;
        }
    }

    componentDidUpdate() {
        const { stream } = this.props;
        if (this.video && this.video.current && stream) {
            this.video.current.srcObject = stream;
        }

        this.playVideo();
    }

    playVideo() {
        if (this.video && this.video.current) {
            this.video.current.play();
        }
    }

    computeHeight() {
        const { resolution } = this.props;
        if (!this.video || !resolution) {
            return;
        }

        // Compute height based on resolution
        const resolutionRatio = resolution.width / resolution.height;
        const newHeight = this.previewVideo.offsetWidth / resolutionRatio;

        this.setState({
            style: {
                height: newHeight
            }
        });
    }

    render() {
        const { frontBack, goToNextStep } = this.props;
        const { style } = this.state;
        const classNames = frontBack;
        return (
            <section id="preview-video" ref={ref => { this.previewVideo = ref; }} className={classNames} style={style}>
                <video
                    ref={this.video}
                    muted
                />
                <button onClick={goToNextStep} type="button">{i18next.t('next')}</button>
            </section>
        );
    }
}

PreviewVideo.defaultProps = {
    stream: null,
    resolution: null
};

PreviewVideo.propTypes = {
    frontBack: PropTypes.string.isRequired,
    goToNextStep: PropTypes.func.isRequired,
    startRecording: PropTypes.func.isRequired,
    stream: PropTypes.object,
    resolution: PropTypes.object
};
