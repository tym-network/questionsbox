import React from 'react';
import PropTypes from 'prop-types';
import i18next from 'i18next';

const logo = require('../../../assets/img/logo.png');

export default class Introduction extends React.PureComponent {

    static propTypes = {
        frontBack: PropTypes.string.isRequired,
        goToNextStep: PropTypes.func.isRequired,
        title: PropTypes.string.isRequired
    };

    render() {
        const classNames = this.props.frontBack;
        return (
            <section id="introduction" className={classNames}>
                <div className="introduction-wrapper">
                    <div>
                        <span className="avatar"><img src={logo} alt="" /></span>
                        <h1>{this.props.title}</h1>
                    </div>
                </div>

                <footer>
                    <button id="see-instructions" onClick={this.props.goToNextStep}>{i18next.t('instructionsButton')}</button>
                </footer>
            </section>
        );
    }
}