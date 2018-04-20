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