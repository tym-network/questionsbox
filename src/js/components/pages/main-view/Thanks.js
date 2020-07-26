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

export default class Thanks extends React.PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            timeToRestart: 30
        };
    }

    componentDidMount() {
        const interval = setInterval(() => {
            this.setState(state => ({
                timeToRestart: state.timeToRestart - 1
            }), () => {
                const { timeToRestart } = this.state;
                const { goToNextStep } = this.props;

                if (timeToRestart === 0) {
                    clearInterval(interval);
                    goToNextStep();
                }
            });
        }, 1000);
    }

    render() {
        const { timeToRestart } = this.state;

        return (
            <div id="thanks">
                <p>{i18next.t('thankYou')}</p>
                <p className="restart">{i18next.t('restartMessage', { time: timeToRestart })}</p>
            </div>
        );
    }
}

Thanks.propTypes = {
    goToNextStep: PropTypes.func.isRequired
};
