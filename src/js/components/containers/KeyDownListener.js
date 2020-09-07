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

export default function withKeyDownListener(WrappedComponent) {
    return class KeyDownListener extends React.PureComponent {
        constructor(props) {
            super(props);

            this.setEventListener = this.setEventListener.bind(this);
            this.handleKeyDown = this.handleKeyDown.bind(this);
        }

        componentDidMount() {
            document.addEventListener('keydown', this.handleKeyDown);
        }

        componentWillUnmount() {
            document.removeEventListener('keydown', this.handleKeyDown);
        }

        setEventListener(eventListener) {
            this.eventListener = eventListener;
        }

        handleKeyDown(e) {
            if (this.eventListener && typeof this.eventListener === 'function') {
                this.eventListener(e.keyCode);
            }
        }

        render() {
            return (
                <WrappedComponent
                    setKeyDownListener={this.setEventListener}
                    // eslint-disable-next-line react/jsx-props-no-spreading
                    {...this.props}
                />
            );
        }
    };
}
