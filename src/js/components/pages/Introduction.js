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
import withKeyDownListener from '../containers/KeyDownListener';
import defaultLogo from '../../../assets/img/logo.png';

class Introduction extends React.PureComponent {
    constructor(props) {
        super(props);

        this.handleKeyDown = this.handleKeyDown.bind(this);
        props.setKeyDownListener(this.handleKeyDown);
    }

    handleKeyDown(keyCode) {
        const { goToNextStep } = this.props;

        if (keyCode === 13) {
            // Enter key
            goToNextStep();
        }
    }

    render() {
        const {
            frontBack, title, logo, goToNextStep
        } = this.props;
        const classNames = frontBack;
        return (
            <section id="introduction" className={classNames}>
                <div className="content-wrap flex-column">
                    <div className="introduction-wrapper">
                        <div>
                            <span className="avatar"><img src={logo || defaultLogo} alt="" /></span>
                            <h1>{title}</h1>
                        </div>
                    </div>

                    <footer>
                        <button
                            id="see-instructions"
                            onClick={goToNextStep}
                            type="button"
                        >
                            {i18next.t('start')}
                        </button>
                    </footer>
                </div>
            </section>
        );
    }
}

Introduction.defaultProps = {
    logo: null
};

Introduction.propTypes = {
    frontBack: PropTypes.string.isRequired,
    goToNextStep: PropTypes.func.isRequired,
    title: PropTypes.string.isRequired,
    logo: PropTypes.string,
    setKeyDownListener: PropTypes.func.isRequired
};

export default withKeyDownListener(Introduction);
