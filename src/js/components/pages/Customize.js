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
import { remote } from 'electron';

import { debounce } from '../../utils/Utils';

import BackButton from '../widget/BackButton';
import SaveIndicator from '../widget/SaveIndicator';

export default class Customize extends React.PureComponent {

    static propTypes = {
        frontBack: PropTypes.string.isRequired,
        save: PropTypes.func.isRequired,
        saveStatus: PropTypes.string,
        back: PropTypes.func.isRequired,
        editQuestions: PropTypes.func.isRequired,
        setConfigurationProperty: PropTypes.func.isRequired,
        configuration: PropTypes.object,
        buzzSound: PropTypes.string
    };

    constructor(props) {
        super(props);

        this.onTitleChanged = this.onTitleChanged.bind(this);
        this.openFileDialog = this.openFileDialog.bind(this);
        this.onFilePathChanged = this.onFilePathChanged.bind(this);
        this.clearFilePath = this.clearFilePath.bind(this);
        this.saveDebounced = debounce(this.props.save, 500);
    }

    onTitleChanged(e) {
        const title = e.target.value;

        this.props.setConfigurationProperty('title', title);
        this.saveDebounced();
    }

    openFileDialog(property, filters) {
        return () => {
            const file = remote.dialog.showOpenDialog({
                filters: filters,
                properties: ['openFile']
            });

            if (file && file[0]) {
                this.props.setConfigurationProperty(property, file[0]);
                this.saveDebounced();
            }
        };
    }

    onFilePathChanged(property) {
        return e => {
            const filePath = e.target.value;

            this.props.setConfigurationProperty(property, filePath);
            this.saveDebounced();
        };
    }

    clearFilePath(property) {
        return () => {
            this.props.setConfigurationProperty(property, null);
            this.saveDebounced();
        };
    }

    render() {
        const { frontBack, configuration, saveStatus, back, editQuestions } = this.props;
        const className = `${frontBack}`;
        return (
            <section id="customize" className={className}>
                <BackButton onClick={back}/>
                <div className="content-wrap">
                    <div className="custom-form">
                        <h1>{i18next.t('customize')}</h1>
                        <div className="customize-block">
                            <label htmlFor="title">{i18next.t('title')}</label>
                            <input
                                id="title"
                                type="text"
                                value={configuration.title}
                                onChange={this.onTitleChanged}
                            />
                        </div>
                        <div className="customize-block">
                            <label htmlFor="logo">{i18next.t('logoLabel')}</label>
                            <div className="group file-picker-group">
                                <input
                                    id="logo-path"
                                    className="file-path"
                                    type="text"
                                    value={configuration.logo || ''}
                                    placeholder={i18next.t('defaultLogo')}
                                    onChange={this.onFilePathChanged('logo')}
                                />
                                <button
                                    id="logo"
                                    type="button"
                                    className="file-picker"
                                    onClick={this.openFileDialog(
                                        'logo',
                                        [{'name': 'img', 'extensions': ['png', 'jpg', 'jpeg', 'bmp', 'gif', 'svg', 'webp']}]
                                    )}
                                >
                                    <i className="icon-folder"></i>{i18next.t('chooseFile')}
                                </button>
                                <button
                                    id="logo-remove"
                                    type="button"
                                    className="remove-file"
                                    onClick={this.clearFilePath('logo')}
                                >
                                    <i className="icon-close-circled"></i>
                                </button>
                            </div>
                        </div>
                        <div className="customize-block">
                            <label htmlFor="buzz-sound">{i18next.t('buzzSound')}</label>
                            <div className="group file-picker-group">
                                <input
                                    id="buzz-sound-path"
                                    className="file-path"
                                    type="text"
                                    value={configuration.buzzSound || ''}
                                    placeholder={i18next.t('defaultSound')}
                                    onChange={this.onFilePathChanged('buzzSound')}
                                />
                                <button
                                    id="buzz-sound"
                                    type="button"
                                    className="file-picker"
                                    onClick={this.openFileDialog(
                                        'buzzSound',
                                        [{'name': 'sound', 'extensions': ['ogg', 'wav', 'mp3', 'webm']}]
                                    )}
                                >
                                    <i className="icon-folder"></i>{i18next.t('chooseFile')}
                                </button>
                                <button
                                    id="buzz-sound-remove"
                                    type="button"
                                    className="remove-file"
                                    onClick={this.clearFilePath('buzzSound')}
                                >
                                    <i className="icon-close-circled"></i>
                                </button>
                            </div>
                        </div>
                        <div className="customize-block">
                            <label htmlFor="edit-questions-button">{i18next.t('questionsList')}</label>
                            <button htmlFor="edit-questions-button" onClick={editQuestions}>{i18next.t('editQuestions')}</button>
                        </div>
                    </div>
                    <footer className="save-indicator-container">
                        <SaveIndicator
                            saveStatus={saveStatus}
                            updatedAt={configuration.updatedAt}
                        />
                    </footer>
                </div>
            </section>
        );
    }
}