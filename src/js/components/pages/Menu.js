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
// eslint-disable-next-line import/no-extraneous-dependencies
import electron from 'electron';

export default class Menu extends React.PureComponent {
    static openVideoFolder() {
        const videoFolder = electron.remote.getGlobal('paths').videos;
        electron.shell.showItemInFolder(videoFolder);
    }

    constructor(props) {
        super(props);

        this.goToStep = this.goToStep.bind(this);
    }

    goToStep(step) {
        return () => {
            const { goToStep } = this.props;
            goToStep(step);
        };
    }

    render() {
        const { frontBack } = this.props;
        return (
            <section id="menu" className={frontBack}>
                <div className="content-wrap">
                    <h1>{i18next.t('menu')}</h1>
                    <div className="menu-wrapper">
                        <button onClick={this.goToStep('customize')} type="button">{i18next.t('customize')}</button>
                        <button onClick={this.goToStep('settings')} type="button">{i18next.t('settings')}</button>
                        <button onClick={Menu.openVideoFolder} type="button">{i18next.t('videoFolder')}</button>
                        <button className="start" onClick={this.goToStep('locale')} type="button">{i18next.t('start')}</button>
                    </div>
                </div>
            </section>
        );
    }
}

Menu.propTypes = {
    frontBack: PropTypes.string.isRequired,
    goToStep: PropTypes.func.isRequired
};
