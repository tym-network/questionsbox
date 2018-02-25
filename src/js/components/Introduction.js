import React from 'react';
import PropTypes from 'prop-types';
import i18next from 'i18next';

const logo = require('../../assets/img/logo.png');

export default class Introduction extends React.PureComponent {

    static propTypes = {
        frontBack: PropTypes.string.isRequired,
        goToNextStep: PropTypes.func.isRequired
    };

    render() {
        const classNames = `${this.props.frontBack} flex column space-between`;
        return (
            <div id="home" className={classNames}>
                <div className="flex column center grow">
                    <div>
                        <span className="avatar"><img src={logo} alt="" /></span>
                        <h1>Questions Box</h1>
                    </div>
                </div>

                <footer>
                    <button id="see-instructions" onClick={this.props.goToNextStep}>{i18next.t('instructionsButton')}</button>
                </footer>
            </div>
        );
    }
}