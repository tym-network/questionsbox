import React from 'react';
import PropTypes from 'prop-types';
import buzzSound from '../../assets/sound/buzz.ogg';

export default class MainViewer extends React.PureComponent {

    static propTypes = {
        id: PropTypes.number.isRequired,
        onEnd: PropTypes.func.isRequired
    };

    componentDidMount() {
        this.buzzer.addEventListener('ended', () => {
            this.props.onEnd(this.props.id);
        });
        this.buzzer.play();
    }

    render() {
        return (
            <audio className="buzzer" ref={ref => this.buzzer = ref}>
                <source src={buzzSound} type="audio/ogg" />
            </audio>
        );
    }
}