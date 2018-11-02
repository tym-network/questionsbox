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

export const standardResolutions = [
    {
        "label": "4K(UHD)",
        "width" : 3840,
        "height": 2160,
        "ratio": "16:9"
    },
    {
        "label": "1080p(FHD)",
        "width": 1920,
        "height": 1080,
        "ratio": "16:9"
    },
    {
        "label": "UXGA",
        "width": 1600,
        "height": 1200,
        "ratio": "4:3"
    },
    {
        "label": "720p(HD)",
        "width": 1280,
        "height": 720,
        "ratio": "16:9"
    },
    {
        "label": "SVGA",
        "width": 800,
        "height": 600,
        "ratio": "4:3"
    },
    {
        "label": "VGA",
        "width": 640,
        "height": 480,
        "ratio": "4:3"
    },
    {
        "label": "360p(nHD)",
        "width": 640,
        "height": 360,
        "ratio": "16:9"
    },
    {
        "label": "CIF",
        "width": 352,
        "height": 288,
        "ratio": "4:3"
    },
    {
        "label": "QVGA",
        "width": 320,
        "height": 240,
        "ratio": "4:3"
    },
    {
        "label": "QCIF",
        "width": 176,
        "height": 144,
        "ratio": "4:3"
    },
    {
        "label": "QQVGA",
        "width": 160,
        "height": 120,
        "ratio": "4:3"
    }
];

/**
 * This function resolves the best possible resolution for current device as WebRTC doesn't provide such info for the moment
 * This function isn't perfect, it only tests the most current resolutions until it finds one that is accepted
 *
 * @param {number} videoInputId
 * @param {Object} options - "sessionStorage" Saves the resolution to the local storage "keepStream" Whether to keep the stream open and return it in the promise at the end or not
 *
 * @returns {Promise} Promise resolving with resolution (and stream is keepStream is true) or rejecting with an error message
 */
export function guessResolution(videoInputId, options = {sessionStorage: false, keepStream: false}) {
    if (!videoInputId) {
        return new Promise((res, rej) => {
            rej(new Error('Missing input ID'));
        });
    }

    if (options.sessionStorage) {
        try {
            const resolution = JSON.parse(sessionStorage.getItem(`resolution-${videoInputId}`));
            if (resolution) {
                // Found the resolution in sessionStorage, return it
                return new Promise(res => {
                    res({
                        resolution
                    });
                })
            }
        } catch(e) {
            // Do nothing
        }
    }

    // Recursive system to test each standard resolution one by one
    return testResolution(videoInputId, 0, options);
}

function testResolution(videoInputId, index, options) {
    const resolution = standardResolutions[index];
    const mediaConstraints = {
        video: {
            deviceId: {exact: videoInputId},
            width: {exact: resolution.width},
            height: {exact: resolution.height}
        }
    };

    return navigator.mediaDevices
        .getUserMedia(mediaConstraints)
        .then(handleResolutionSuccess(videoInputId, resolution, options))
        .catch(handleResolutionError(videoInputId, index, options));
}

function handleResolutionSuccess(videoInputId, resolution, options) {
    return (stream) => {
        // Stream won't be used, discard it
        if (stream && !options.keepStream) {
            stream.getTracks().forEach(function(track) {
                track.stop();
            });
        }

        if (options.sessionStorage) {
            try {
                sessionStorage.setItem(`resolution-${videoInputId}`, JSON.stringify(resolution));
            } catch(e) {
                // Do nothing
            }
        }

        return new Promise(res => {
            const result = {
                resolution
            };

            if (stream && options.keepStream) {
                result.stream = stream
            }

            res(result);
        });
    };
}

function handleResolutionError(videoInputId, index, options) {
    return () => {
        // This resolution doesn't work, try the next one
        const newIndex = index + 1;
        if (newIndex < standardResolutions.length) {
            return testResolution(videoInputId, newIndex, options);
        }

        return new Promise((res, rej) => {
            rej(new Error('Unable to find a resolution'));
        });
    }
}

function getUserMedia(constraints) {
    return navigator.mediaDevices.getUserMedia(constraints);
}

/**
 * Get stream from constraints, with best resolution possible for video
 * @param {Object} constraints - A MediaStreamConstraints object
 */
export function getStream(constraints) {
    if (constraints.video) {
        // For video, guess the resolution first
        return guessResolution(constraints.video.deviceId.exact, {
            sessionStorage: true,
            keepStream: false
        }).then(result => {
            if (result.stream) {
                return result.stream;
            } else {
                const newConstraints = JSON.parse(JSON.stringify(constraints)); // clone
                newConstraints.video.width = {
                    exact: result.resolution.width
                };
                newConstraints.video.height = {
                    exact: result.resolution.height
                };
                return getUserMedia(newConstraints);
            }
        });
    } else {
        return getUserMedia(constraints);
    }
}