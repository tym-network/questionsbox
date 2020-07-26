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
import defaultBuzzSoundFile from '../../../assets/sound/buzz.ogg';

export default class Buzzer extends React.PureComponent {
    constructor(props) {
        super(props);

        this.onEnded = this.onEnded.bind(this);
    }

    componentDidMount() {
        this.buzzer.addEventListener('ended', this.onEnded);
        this.buzzer.play();
    }

    componentWillUnmount() {
        this.buzzer.removeEventListener('ended', this.onEnded);
    }

    onEnded() {
        const { id, onEnd } = this.props;
        onEnd(id);
    }

    render() {
        const { buzzSound } = this.props;
        return (
            // eslint-disable-next-line jsx-a11y/media-has-caption
            <audio className="buzzer" ref={ref => { this.buzzer = ref; }}>
                <source src={buzzSound || defaultBuzzSoundFile} />
            </audio>
        );
    }
}

Buzzer.defaultProps = {
    buzzSound: null
};

Buzzer.propTypes = {
    id: PropTypes.number.isRequired,
    onEnd: PropTypes.func.isRequired,
    buzzSound: PropTypes.string
};
