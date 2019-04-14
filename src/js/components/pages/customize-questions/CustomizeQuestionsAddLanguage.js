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

export default class CustomizeQuestionsAddLanguage extends React.PureComponent {

    static propTypes = {
        currentLanguages: PropTypes.arrayOf(PropTypes.string),
        addLanguage: PropTypes.func.isRequired
    };

    static supportedLanguages = [
        'en',
        'fr',
        'es',
        'de'
    ]

    constructor(props) {
        super(props);

        this.state = {
            open: false,
            selectedLanguage: ''
        };

        this.openModal = this.openModal.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this.addLanguage = this.addLanguage.bind(this);

        this.language = React.createRef();
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
        this.props.addLanguage(this.language.current.value);
        this.setState({
            open: false
        });
    }

    render() {
        const { currentLanguages } = this.props;
        const availableLanguages = CustomizeQuestionsAddLanguage.supportedLanguages.filter(lang => !currentLanguages.includes(lang));

        return (
            <React.Fragment>
                <button
                    className="btn-pill"
                    onClick={this.openModal}
                >
                    {i18next.t('addLanguage')}
                </button>
                <Modal show={this.state.open} onHide={this.closeModal}>
                    <Modal.Header closeButton>
                        <Modal.Title>{i18next.t('addLanguage')}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div className="select-input">
                            <label htmlFor="language">{i18next.t('language')}</label>
                            <div className="select-wrapper">
                                <select
                                    id="language"
                                    ref={this.language}
                                >
                                    {availableLanguages.map(language => (
                                        <option key={language} value={language}>{i18next.t(language)}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <button onClick={this.addLanguage}>{i18next.t('addLanguageAction')}</button>
                    </Modal.Footer>
                    </Modal>
            </React.Fragment>
        );
    }

}
