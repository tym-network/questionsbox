import React from 'react';
import PropTypes from 'prop-types';
import { getStream } from '../../utils/WebRTCUtils';

/**
 * HOC that handles stream creation based on constraints and gives the stream to its wrapped component
 * @param {Object} WrappedComponent
 */
export default function withStream(WrappedComponent) {
    return class WebRTCStreamContainer extends React.PureComponent {

        currentConstraints = {};

        static propTypes = {
            constraints: PropTypes.object.isRequired
        };

        constructor(props) {
            super(props);

            this.state = {
                stream: null,
                error: null
            };

            this.handleStream = this.handleStream.bind(this);
            this.handleStreamError = this.handleStreamError.bind(this);
        }

        componentWillMount() {
            this.getStream(this.props.constraints);
        }

        componentWillReceiveProps(nextProps) {
            if (JSON.stringify(nextProps) != JSON.stringify(this.props)) {
                this.getStream(nextProps.constraints);
            }
        }

        componentWillUnmount() {
            if (this.state.stream) {
                this.state.stream.getTracks().forEach(track => {
                    track.stop();
                });
            }
        }

        handleStream(stream) {
            this.setState({
                error: null,
                stream: stream
            });
        }

        handleStreamError(err) {
            window.logger.error('Can\'t get stream with constraints', this.currentConstraints, err);

            this.setState({
                error: err
            });
        }

        getStream(constraints) {
            if (this.state.stream) {
                this.state.stream.getTracks().forEach(track => {
                    track.stop();
                });
                this.setState({
                    stream: null
                });
            }

            this.currentConstraints = constraints;

            getStream(constraints).then(this.handleStream, this.handleStreamError);
        }

        render() {
            const { constraints, ...passThroughProps } = this.props; // eslint-disable-line no-unused-vars

            return <WrappedComponent
                stream={this.state.stream}
                streamError={this.state.error}
                {...passThroughProps}
            />
        }
    }
}