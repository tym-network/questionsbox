// Copyright (C) 2020 Théotime Loiseau
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

import React from 'react';
import PropTypes from 'prop-types';
import i18next from 'i18next';
import withKeyDownListener from '../../containers/KeyDownListener';

class Instructions extends React.PureComponent {
    constructor(props) {
        super(props);

        this.handleKeyDown = this.handleKeyDown.bind(this);
        props.setKeyDownListener(this.handleKeyDown);
    }

    handleKeyDown(keyCode) {
        const { goToNextSubstep } = this.props;

        if (keyCode === 13) {
            // Enter key
            goToNextSubstep();
        }
    }

    render() {
        const { goToNextSubstep } = this.props;
        return (
            <div id="instructions">
                <div className="instructions-wrapper">
                    <div>
                        <p className="largeParagraph">{i18next.t('instruction1')}</p>
                        <p>{i18next.t('instruction2')}</p>
                        <ul>
                            <li>
                                <span className="icon-mouse" />
                                {' '}
                                {i18next.t('buzz')}
                            </li>
                            <li>
                                <span className="icon-keyboard" />
                                {' '}
                                {i18next.t('nextQuestion')}
                            </li>
                            <li>
                                <span className="icon-arrow-left-b" />
                                {' '}
                                {i18next.t('previousQuestion')}
                            </li>
                        </ul>
                    </div>
                </div>
                <footer>
                    <button
                        id="letsGo"
                        onClick={goToNextSubstep}
                        type="button"
                    >
                        {i18next.t('letsGo')}
                    </button>
                </footer>
            </div>
        );
    }
}

Instructions.propTypes = {
    goToNextSubstep: PropTypes.func.isRequired,
    setKeyDownListener: PropTypes.func.isRequired
};

export default withKeyDownListener(Instructions);
