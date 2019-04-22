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
import { Modal } from 'react-bootstrap';
import Select from 'react-select';

// Import all flags
function importAll (r) {
    r.keys().forEach(r);
}

importAll(require.context('../../../../assets/img/flags', true, /\.svg$/));

export default class CustomizeQuestionsAddLanguage extends React.PureComponent {

    static propTypes = {
        currentLanguages: PropTypes.arrayOf(PropTypes.string),
        addLanguage: PropTypes.func.isRequired
    };

    constructor(props) {
        super(props);

        this.state = {
            open: false,
            selectedLanguage: ''
        };

        this.openModal = this.openModal.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this.addLanguage = this.addLanguage.bind(this);
        this.onSelectedLanguageChange = this.onSelectedLanguageChange.bind(this);
    }

    openModal() {
        this.setState({
            open: true
        });
    }

    closeModal() {
        this.setState({
            open: false
        });
    }

    addLanguage() {
        const { selectedLanguage } = this.state;

        if (!selectedLanguage) {
            return;
        }

        this.props.addLanguage(selectedLanguage.value);
        this.setState({
            open: false,
            selectedLanguage: null
        });
    }

    getSupportedLanguages() {
        const languages = [
            { value: 'en', label: i18next.t('langEnglish'), flag: require('../../../../assets/img/flags/en.svg')},
            { value: 'fr', label: i18next.t('langFrench'), flag: require('../../../../assets/img/flags/fr.svg')},
            { value: 'es', label: i18next.t('langSpanish'), flag: require('../../../../assets/img/flags/es.svg')},
            { value: 'de', label: i18next.t('langGerman'), flag: require('../../../../assets/img/flags/de.svg')},
            { value: 'it', label: i18next.t('langItalian'), flag: require('../../../../assets/img/flags/it.svg')},
            { value: 'ru', label: i18next.t('langRussian'), flag: require('../../../../assets/img/flags/ru.svg')},
            { value: 'pt', label: i18next.t('langPortuguese'), flag: require('../../../../assets/img/flags/pt.svg')},
            { value: 'nl', label: i18next.t('langDutch'), flag: require('../../../../assets/img/flags/nl.svg')},
            { value: 'sv', label: i18next.t('langSwedish'), flag: require('../../../../assets/img/flags/se.svg')},
            { value: 'no', label: i18next.t('langNorwegian'), flag: require('../../../../assets/img/flags/no.svg')},
            { value: 'da', label: i18next.t('langDanish'), flag: require('../../../../assets/img/flags/dk.svg')},
            { value: 'pl', label: i18next.t('langPolish'), flag: require('../../../../assets/img/flags/pl.svg')}
        ];
        return languages.sort((a, b) => (
            a.label.toLowerCase() < b.label.toLowerCase() ? -1 : 1
        ));
    }

    getLabel(language) {
        return (
            <div className="language-select-item">
              <img src={language.flag} alt="" className="flag-label" />
              <span>{language.label}</span>
            </div>
          );
    }

    onSelectedLanguageChange(language) {
        console.log(language);
        this.setState({
            selectedLanguage: language
        });
    }

    render() {
        const { currentLanguages } = this.props;
        const { selectedLanguage } = this.state;
        const availableLanguages = this.getSupportedLanguages().filter(lang => !currentLanguages.includes(lang.value));

        return (
            <React.Fragment>
                <button
                    className="btn-pill"
                    onClick={this.openModal}
                >
                    {i18next.t('addLanguage')}
                </button>
                <Modal
                    show={this.state.open}
                    onHide={this.closeModal}
                    dialogClassName="add-language-modal"
                >
                    <Modal.Header closeButton>
                        <Modal.Title>{i18next.t('addLanguage')}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div className="select-input">
                            <label htmlFor="language">{i18next.t('language')}</label>
                            <Select
                                options={availableLanguages}
                                formatOptionLabel={this.getLabel}
                                isClearable={true}
                                isSearchable={true}
                                value={selectedLanguage}
                                onChange={this.onSelectedLanguageChange}
                                placeholder={i18next.t('searchSelectLanguage')}
                            />
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <button
                            onClick={this.addLanguage}
                            disabled={!selectedLanguage}
                        >
                            {i18next.t('addLanguageAction')}
                        </button>
                    </Modal.Footer>
                    </Modal>
            </React.Fragment>
        );
    }

}
