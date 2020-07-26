/* eslint-disable jsx-a11y/click-events-have-key-events */
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
import mem from 'mem';

import { getLocales } from '../../utils/Utils';

// Import all flags
function importAll(r) {
    r.keys().forEach(r);
}

importAll(require.context('../../../assets/img/flags', true, /\.svg$/));

export default class LocalePicker extends React.PureComponent {
    constructor(props) {
        super(props);

        this.setLocale = this.setLocale.bind(this);
        this.getLocaleObjects = mem(this.getLocaleObjects);
    }

    setLocale(locale) {
        return () => {
            const { setLocale, goToNextStep } = this.props;
            setLocale(locale);
            goToNextStep();
        };
    }

    getLocaleObjects() {
        const { locales } = this.props;
        const localesIndexed = {};
        getLocales().forEach(locale => {
            localesIndexed[locale.value] = locale;
        });
        return locales.map(locale => (
            localesIndexed[locale]
        ));
    }

    render() {
        const { frontBack } = this.props;
        const classNames = `${frontBack}`;
        const locales = this.getLocaleObjects();
        return (
            <section id="locale" className={classNames}>
                <div className="content-wrap flex-column">
                    <h1>Select a language</h1>
                    <div className="locale-picker-flags">
                        {
                            locales.map(locale => (
                                // eslint-disable-next-line jsx-a11y/no-static-element-interactions
                                <div className="flag" key={locale.value} onClick={this.setLocale(locale.value)}>
                                    <img src={locale.flag} alt={locale.value} />
                                    <span className="flag-label">{locale.name}</span>
                                </div>
                            ))
                        }
                    </div>
                </div>
            </section>
        );
    }
}

LocalePicker.propTypes = {
    locales: PropTypes.arrayOf(PropTypes.string).isRequired,
    frontBack: PropTypes.string.isRequired,
    goToNextStep: PropTypes.func.isRequired,
    setLocale: PropTypes.func.isRequired
};
