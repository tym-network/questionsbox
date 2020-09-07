/* eslint-disable jsx-a11y/click-events-have-key-events */
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
import mem from 'mem';
import withKeyDownListener from '../containers/KeyDownListener';

import { getLocales } from '../../utils/Utils';

// Import all flags
function importAll(r) {
    r.keys().forEach(r);
}

importAll(require.context('../../../assets/img/flags', true, /\.svg$/));

class LocalePicker extends React.PureComponent {
    constructor(props) {
        super(props);

        const firstLocale = props.locales[0] ? props.locales[0] : null;

        this.state = {
            selectedLocale: firstLocale
        };

        this.setLocale = this.setLocale.bind(this);
        this.getLocaleObjects = mem(this.getLocaleObjects);
        this.onSumbit = this.onSumbit.bind(this);
        this.handleKeyDown = this.handleKeyDown.bind(this);
        props.setKeyDownListener(this.handleKeyDown);
    }

    onSumbit() {
        const { setLocale, goToNextStep } = this.props;
        const { selectedLocale } = this.state;
        setLocale(selectedLocale);
        goToNextStep();
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

    getNextLocale() {
        const { locales } = this.props;
        const { selectedLocale } = this.state;
        let index = locales.indexOf(selectedLocale);
        index++;
        if (index >= locales.length) {
            index = 0;
        }
        return locales[index];
    }

    getPreviousLocale() {
        const { locales } = this.props;
        const { selectedLocale } = this.state;
        let index = locales.indexOf(selectedLocale);
        index--;
        if (index < 0) {
            index = locales.length - 1;
        }
        return locales[index];
    }

    setLocale(e) {
        this.setState({
            selectedLocale: e.target.value
        }, this.onSumbit);
    }

    handleKeyDown(keyCode) {
        let locale;
        if (keyCode === 39) {
            // Right arrow key
            locale = this.getNextLocale();
            this.setState({
                selectedLocale: locale
            });
        } else if (keyCode === 37) {
            // Left arrow key
            locale = this.getPreviousLocale();
            this.setState({
                selectedLocale: locale
            });
        } else if (keyCode === 13) {
            // Enter key
            this.onSumbit();
        }
    }

    render() {
        const { frontBack } = this.props;
        const { selectedLocale } = this.state;
        const classNames = `${frontBack}`;
        const locales = this.getLocaleObjects();
        return (
            <section id="locale" className={classNames}>
                <div className="content-wrap flex-column">
                    <h1>Select a language</h1>
                    <form
                        className="locale-picker-flags"
                        onSubmit={this.onSumbit}
                    >
                        {
                            locales.map(locale => (
                                <div key={locale.value}>
                                    <input
                                        type="radio"
                                        name="locale"
                                        id={`locale-${locale.value}`}
                                        value={locale.value}
                                        checked={selectedLocale === locale.value}
                                        readOnly
                                        onClick={this.setLocale}
                                    />
                                    <label className="flag" htmlFor={`locale-${locale.value}`}>
                                        <img src={locale.flag} alt={locale.value} />
                                        <span className="flag-label">{locale.name}</span>
                                    </label>
                                </div>
                            ))
                        }
                    </form>
                </div>
            </section>
        );
    }
}

LocalePicker.propTypes = {
    locales: PropTypes.arrayOf(PropTypes.string).isRequired,
    frontBack: PropTypes.string.isRequired,
    goToNextStep: PropTypes.func.isRequired,
    setLocale: PropTypes.func.isRequired,
    setKeyDownListener: PropTypes.func.isRequired
};

export default withKeyDownListener(LocalePicker);
