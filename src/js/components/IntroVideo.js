import React from 'react';
import PropTypes from 'prop-types';

export default class IntroVideo extends React.PureComponent {

    static propTypes = {
        goToNextSubstep: PropTypes.func.isRequired,
        setStyle: PropTypes.func.isRequired
    };

    componentDidMount() {
        if (!this.video) {
            return;
        }

        this.video.addEventListener('ended', () => {
            this.props.goToNextSubstep();
        });
        this.video.addEventListener('loadeddata', () => {
            this.props.setStyle({
                height: this.video.offsetHeight
            })
        });
        this.video.play();

    }

    render() {
        return (
            <video id="introVideo" ref={ref => this.video = ref}>
                <source src="../movies/baq.webm" type="video/webm" />
            </video>
        );
    }
}