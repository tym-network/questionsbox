import React from 'react';
import PropTypes from 'prop-types';
import i18next from 'i18next';

export default class Menu extends React.PureComponent {

    static propTypes = {
        frontBack: PropTypes.string.isRequired,
        goToStep: PropTypes.func.isRequired
    };

    constructor(props) {
        super(props);

        this.goToStep = this.goToStep.bind(this);
    }

    goToStep(step) {
        return () => {
            this.props.goToStep(step);
        }
    }

    render() {
        return (
            <section id="menu" className={this.props.frontBack}>
                <h1>{i18next.t('menu')}</h1>
                <div className="menu-wrapper">
                    <button onClick={this.goToStep('customize')}>{i18next.t('customize')}</button>
                    <button onClick={this.goToStep('settings')}>{i18next.t('settings')}</button>
                    <button className="start" onClick={this.goToStep('locale')}>{i18next.t('start')}</button>
                </div>
            </section>
        );
    }
}