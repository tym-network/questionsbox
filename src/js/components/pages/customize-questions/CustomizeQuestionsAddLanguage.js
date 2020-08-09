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

import { getLocales } from '../../../utils/Utils';

export default class CustomizeQuestionsAddLanguage extends React.PureComponent {
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

    static getSupportedLanguages() {
        const languages = getLocales();
        languages.forEach(lang => {
            // eslint-disable-next-line no-param-reassign
            lang.label = i18next.t(lang.labelKey);
        });
        return languages.sort((a, b) => (
            a.label.toLowerCase() < b.label.toLowerCase() ? -1 : 1
        ));
    }

    onSelectedLanguageChange(language) {
        this.setState({
            selectedLanguage: language
        });
    }

    static getLabel(language) {
        let { label } = language;

        if (language.value !== i18next.language) {
            label += ` (${language.name})`;
        }

        return (
            <div className="language-select-item">
                <img src={language.flag} alt="" className="flag-label" />
                <span>{label}</span>
            </div>
        );
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
        const { addLanguage } = this.props;
        const { selectedLanguage } = this.state;

        if (!selectedLanguage) {
            return;
        }

        addLanguage(selectedLanguage.value);
        this.setState({
            open: false,
            selectedLanguage: null
        });
    }

    render() {
        const { currentLanguages } = this.props;
        const { selectedLanguage, open } = this.state;
        const availableLanguages = CustomizeQuestionsAddLanguage.getSupportedLanguages().filter(lang => !currentLanguages.includes(lang.value));

        return (
            <>
                <button
                    className="btn-pill"
                    onClick={this.openModal}
                    type="button"
                >
                    {i18next.t('addLanguage')}
                </button>
                <Modal
                    show={open}
                    onHide={this.closeModal}
                    dialogClassName="add-language-modal"
                    centered
                >
                    <Modal.Header closeButton>
                        <Modal.Title>{i18next.t('addLanguage')}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div className="select-input">
                            <label htmlFor="language">{i18next.t('language')}</label>
                            <Select
                                options={availableLanguages}
                                formatOptionLabel={CustomizeQuestionsAddLanguage.getLabel}
                                isClearable
                                isSearchable
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
                            type="button"
                        >
                            {i18next.t('addLanguageAction')}
                        </button>
                    </Modal.Footer>
                </Modal>
            </>
        );
    }
}

CustomizeQuestionsAddLanguage.defaultProps = {
    currentLanguages: []
};

CustomizeQuestionsAddLanguage.propTypes = {
    currentLanguages: PropTypes.arrayOf(PropTypes.string),
    addLanguage: PropTypes.func.isRequired
};
