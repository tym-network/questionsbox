const fs = require('fs');
import React from 'react';
import MediaStreamRecorder from 'msr';
import blobUtil from 'blob-util';

import { getStream } from '../../utils/WebRTCUtils';

export default function withRecorder(WrappedComponent) {
    return class WebRTCContainer extends React.PureComponent {

        multiStreamRecorder;

        constructor(props) {
            super(props);

            this.state = {
                stream: null,
                error: null
            };

            this.startRecording = this.startRecording.bind(this);
            this.stopRecording = this.stopRecording.bind(this);
        }

        startRecording(audioInputDeviceId, videoInputDeviceId) {
            const mediaConstraints = {
                audio: {deviceId: {exact: audioInputDeviceId}},
                video: {
                    deviceId: {exact: videoInputDeviceId}
                }
            };

            const onMediaError = function(e) {
                window.logger.error('Media error while recording', e);
            };

            const onMediaSuccess = stream => {
                this.setState({ stream });

                this.multiStreamRecorder = new MediaStreamRecorder.MultiStreamRecorder(stream);
                this.multiStreamRecorder.stream = stream;
                this.multiStreamRecorder.ondataavailable = blobs => {
                    const videoName = + new Date();
                    try {
                        blobUtil.blobToBase64String(blobs.video).then(base64String => {
                            fs.writeFile('videos/' + videoName + '.webm', new Buffer(base64String, 'base64'), function(err){
                                if (err) {
                                    window.logger.error('Failed to save video', videoName, err);
                                } else {
                                    window.logger.info('File saved', videoName);
                                }
                            });
                        }, err => {
                            window.logger.error('Failed to convert blob to base64', err);
                        });
                    } catch(e) {
                        window.logger.error(e);
                    }
                };

                const timeInterval = 20000;
                // get blob after specific time interval
                this.multiStreamRecorder.start(timeInterval);
            };

            getStream(mediaConstraints)
                .then(onMediaSuccess)
                .catch(onMediaError);
        }

        stopRecording() {
            if (this.multiStreamRecorder) {
                this.multiStreamRecorder.stop();
                this.multiStreamRecorder = null;

                if (this.state.stream) {
                    this.state.stream.getTracks().forEach(function(track) {
                        track.stop();
                    });
                    this.setState({
                        stream: null
                    });
                }
            }
        }

        render() {
            return <WrappedComponent
                setInputDevice={this.setInputDevice}
                startRecording={this.startRecording}
                stopRecording={this.stopRecording}
                stream={this.state.stream}
                {...this.props}
            />;
        }
    }
}