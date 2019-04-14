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

import LanguageButton from '../../widget/LanguageButton';
import CustomizeQuestionsAddLanguage from './CustomizeQuestionsAddLanguage';

export default class CustomizeQuestionsLanguages extends React.PureComponent {

    static propTypes = {
        languages: PropTypes.arrayOf(PropTypes.string).isRequired,
        languagesSelected: PropTypes.arrayOf(PropTypes.string).isRequired,
        setLanguagesSelected: PropTypes.func.isRequired,
        addLanguage: PropTypes.func.isRequired,
        removeLanguage: PropTypes.func.isRequired
    };

    constructor(props) {
        super(props);

        this.toggleLanguage = this.toggleLanguage.bind(this);
        this.selectAll = this.selectAll.bind(this);
        this.unselectAll = this.unselectAll.bind(this);
    }

    toggleLanguage(language) {
        const { languagesSelected, setLanguagesSelected } = this.props;
        const languageIndex = languagesSelected.indexOf(language);
        if (languageIndex >= 0) {
            const newLanguagesSelected = [...languagesSelected];
            newLanguagesSelected.splice(languageIndex, 1);
            setLanguagesSelected(newLanguagesSelected);
        } else {
            setLanguagesSelected([...languagesSelected, language]);
        }
    }

    selectAll() {
        const { languages, setLanguagesSelected } = this.props;
        setLanguagesSelected([...languages]);
    }

    unselectAll() {
        const { setLanguagesSelected } = this.props;
        setLanguagesSelected([]);
    }

    render() {
        const { languages, languagesSelected, addLanguage, removeLanguage } = this.props;

        return (
            <React.Fragment>
                <div className="languages-row">
                    <button
                        className="btn-pill"
                        onClick={this.selectAll}
                    >
                        {i18next.t('displayAll')}
                    </button>
                    <button
                        className="btn-pill"
                        onClick={this.unselectAll}
                    >
                        {i18next.t('hideAll')}
                    </button>
                </div>
                <div className="languages-row">
                    { languages.map(language =>
                        <LanguageButton
                            key={language}
                            language={language}
                            isSelected={languagesSelected.includes(language)}
                            toggle={this.toggleLanguage}
                            remove={removeLanguage}
                        />
                    )}
                    <CustomizeQuestionsAddLanguage
                        currentLanguages={languages}
                        addLanguage={addLanguage}
                    />
                </div>
            </React.Fragment>
        );
    }

}
