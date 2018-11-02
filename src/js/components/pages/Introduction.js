// Copyright (C) 2018 Théotime Loiseau
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

const logo = require('../../../assets/img/logo.png');

export default class Introduction extends React.PureComponent {

    static propTypes = {
        frontBack: PropTypes.string.isRequired,
        goToNextStep: PropTypes.func.isRequired,
        title: PropTypes.string.isRequired,
        logo: PropTypes.string
    };

    render() {
        const classNames = this.props.frontBack;
        return (
            <section id="introduction" className={classNames}>
                <div className="introduction-wrapper">
                    <div>
                        <span className="avatar"><img src={this.props.logo || logo} alt="" /></span>
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