import React from 'react';
import PropTypes from 'prop-types';
import i18next from 'i18next';

export default class Instructions extends React.PureComponent {

    static propTypes = {
        goToNextSubstep: PropTypes.func.isRequired
    };

    render() {
        return (
            <div id="instructions">
                <div className="instructions-wrapper">
                    <div>
                        <p className="largeParagraph">{i18next.t('instruction1')}</p>
                        <p>{i18next.t('instruction2')}</p>
                        <ul>
                            <li><span className="icon-mouse"></span> {i18next.t('buzz')}</li>
                            <li><span className="icon-keyboard"></span> {i18next.t('nextQuestion')}</li>
                            <li><span className="icon-arrow-left-b"></span> {i18next.t('previousQuestion')}</li>
                        </ul>
                    </div>
                </div>
                <footer>
                    <button id="letsGo" onClick={this.props.goToNextSubstep}>{i18next.t('letsGo')}</button>
                </footer>
            </div>
        );
    }
}