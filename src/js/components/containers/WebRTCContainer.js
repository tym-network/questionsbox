const fs = require('fs');
import React from 'react';
import RecordRTC from 'recordrtc';
import blobUtil from 'blob-util';
import electron from 'electron';

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
                const options = {
                    mimeType: 'video/webm;codecs=vp9',
                    type: 'video',
                    disableLogs: true
                };
                this.recordRTC = RecordRTC(stream, options);
                this.recordRTC.startRecording();
            };

            getStream(mediaConstraints)
                .then(onMediaSuccess)
                .catch(onMediaError);
        }

        stopRecording() {
            if (this.recordRTC) {
                this.recordRTC.stopRecording(() => {
                    const blobs = this.recordRTC.getBlob();
                    const videoName = + new Date();

                    try {
                        blobUtil.blobToBase64String(blobs).then(base64String => {
                            fs.writeFile(`${electron.remote.getGlobal('paths').videos}/${videoName}.webm`, new Buffer(base64String, 'base64'), function(err){
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
                });
            }

            if (this.state.stream) {
                this.state.stream.getTracks().forEach(function(track) {
                    track.stop();
                });
                this.setState({
                    stream: null
                });
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