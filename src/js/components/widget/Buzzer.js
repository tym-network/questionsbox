import React from 'react';
import PropTypes from 'prop-types';
import buzzSound from '../../../assets/sound/buzz.ogg';

export default class Buzzer extends React.PureComponent {

    static propTypes = {
        id: PropTypes.number.isRequired,
        onEnd: PropTypes.func.isRequired
    };

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
        this.props.onEnd(this.props.id);
    }

    render() {
        return (
            <audio className="buzzer" ref={ref => this.buzzer = ref}>
                <source src={buzzSound} type="audio/ogg" />
            </audio>
        );
    }
}