import React from 'react';
import PropTypes from 'prop-types';
import i18next from 'i18next';

export default class Thanks extends React.PureComponent {

    static propTypes = {
        goToNextStep: PropTypes.func.isRequired
    };

    constructor(props) {
        super(props);

        this.state = {
            timeToRestart: 30
        };
    }

    componentDidMount() {
        const interval = setInterval(() => {
            this.setState({
                timeToRestart: this.state.timeToRestart - 1
            });
            if (this.state.timeToRestart === 0) {
                clearInterval(interval);
                this.props.goToNextStep();
            }
        }, 1000);
    }

    render() {
        return (
            <div id="thanks" className="flex column center grow">
                <p>{i18next.t('thankYou')}</p>
                <p className="restart">{i18next.t('restartMessage', {time: this.state.timeToRestart})}</p>
            </div>
        );
    }
}