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

export default class IntroVideo extends React.PureComponent {
    componentDidMount() {
        const { goToNextSubstep, setStyle } = this.props;

        if (!this.video) {
            return;
        }

        this.video.addEventListener('ended', () => {
            goToNextSubstep();
        });
        this.video.addEventListener('loadeddata', () => {
            setStyle({
                height: this.video.offsetHeight
            });
        });
        this.video.play();
    }

    render() {
        return (
            <video id="introVideo" ref={ref => { this.video = ref; }}>
                <source src="../movies/baq.webm" type="video/webm" />
            </video>
        );
    }
}

IntroVideo.propTypes = {
    goToNextSubstep: PropTypes.func.isRequired,
    setStyle: PropTypes.func.isRequired
};
