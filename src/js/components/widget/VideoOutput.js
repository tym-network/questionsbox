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

export default class VideoOutput extends React.PureComponent {

    static propTypes = {
        stream: PropTypes.object,
        streamError: PropTypes.object
    };

    constructor(props) {
        super(props);

        this.video = React.createRef();
    }

    componentDidMount() {
        const { stream } = this.props;

        if (this.video && this.video.current) {
            if (stream) {
                this.video.current.srcObject = this.props.stream;
            }
            this.video.current.play();
        }
    }

    componentDidUpdate() {
        const { stream } = this.props;

        if (this.video.current) {
            if (stream) {
                this.video.current.srcObject = this.props.stream;
            }
            this.video.current.play();
        }
    }

    componentWillUnmount() {
        if (this.video.current) {
            this.video.current.pause();
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
                ref={this.video}
                muted={true}
            >
            </video>
        );
    }
}