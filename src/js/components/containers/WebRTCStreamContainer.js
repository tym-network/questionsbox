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
import { getStream } from '../../utils/WebRTCUtils';

/**
 * HOC that handles stream creation based on constraints and gives the stream to its wrapped component
 * @param {Object} WrappedComponent
 */
export default function withStream(WrappedComponent) {
    class WebRTCStreamContainer extends React.PureComponent {
        currentConstraints = {};

        constructor(props) {
            super(props);

            this.state = {
                stream: null,
                error: null
            };

            this.handleStream = this.handleStream.bind(this);
            this.handleStreamError = this.handleStreamError.bind(this);
        }

        componentDidMount() {
            const { constraints } = this.props;
            this.getStream(constraints);
        }

        componentDidUpdate(prevProps) {
            const { constraints } = this.props;
            if (JSON.stringify(prevProps) !== JSON.stringify(this.props)) {
                this.getStream(constraints);
            }
        }

        componentWillUnmount() {
            const { stream } = this.state;
            if (stream) {
                stream.getTracks().forEach(track => {
                    track.stop();
                });
            }
        }

        getStream(constraints) {
            const { stream } = this.state;
            if (stream) {
                stream.getTracks().forEach(track => {
                    track.stop();
                });
                this.setState({
                    stream: null
                });
            }

            this.currentConstraints = constraints;

            getStream(constraints).then(this.handleStream, this.handleStreamError);
        }

        handleStream(stream) {
            this.setState({
                error: null,
                stream
            });
        }

        handleStreamError(err) {
            window.logger.error('Can\'t get stream with constraints', this.currentConstraints, err);

            this.setState({
                error: err
            });
        }

        render() {
            const { constraints, ...passThroughProps } = this.props; // eslint-disable-line no-unused-vars
            const { stream, error } = this.state;

            return (
                <WrappedComponent
                    stream={stream}
                    streamError={error}
                    // eslint-disable-next-line react/jsx-props-no-spreading
                    {...passThroughProps}
                />
            );
        }
    }

    WebRTCStreamContainer.propTypes = {
        constraints: PropTypes.object.isRequired
    };

    return WebRTCStreamContainer;
}
