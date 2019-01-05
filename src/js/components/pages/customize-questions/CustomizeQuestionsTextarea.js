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

export default class CustomizeQuestionsTextarea extends React.PureComponent {

    static propTypes = {
        question: PropTypes.string.isRequired,
        locale: PropTypes.string.isRequired
    };

    render() {
        const { question, locale } = this.props;

        return (
            <div className="questions-edit-textarea">
                <div className="questions-edit-textarea-locale">{locale}</div>
                <textarea value={question}></textarea>
            </div>
        );
    }

}
