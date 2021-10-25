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

/* eslint-disable react/no-find-dom-node */
import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';

export default class OverlapTransition extends React.PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            switchingFromMainToChild: false,
            switchingFromChildToMain: false
        };

        this.backToMainView = this.backToMainView.bind(this);

        this.mainRef = React.createRef();
        this.childRef = React.createRef();
    }

    componentDidUpdate(prevProps) {
        const { child } = this.props;
        const { switchingFromMainToChild } = this.state;
        if (!prevProps.child && child && !switchingFromMainToChild) {
            // eslint-disable-next-line react/no-did-update-set-state
            this.setState({
                switchingFromMainToChild: true
            }, () => {
                const { mainNode, childNode } = this.getDOMNodes();
                mainNode.classList.add('overlap-transition-main-animating', 'overlap-transition-main-start');
                childNode.classList.add('overlap-transition-child-animating', 'overlap-transition-child-start');
                childNode.addEventListener('transitionend', e => {
                    if (e.propertyName === 'left') {
                        // Transition is over
                        this.setState({
                            switchingFromMainToChild: false
                        });
                        childNode.classList.remove(
                            'overlap-transition-child-animating',
                            'overlap-transition-child-end'
                        );
                    }
                });
                setTimeout(() => {
                    mainNode.classList.remove('overlap-transition-main-start');
                    childNode.classList.remove('overlap-transition-child-start');
                    mainNode.classList.add('overlap-transition-main-end');
                    childNode.classList.add('overlap-transition-child-end');
                }, 0);
            });
        }
    }

    getDOMNodes() {
        const mainRef = this.mainRef.current;
        const childRef = this.childRef.current;
        const mainNode = ReactDOM.findDOMNode(mainRef);
        const childNode = ReactDOM.findDOMNode(childRef);

        return { mainNode, childNode };
    }

    backToMainView() {
        const { onChildClosed } = this.props;

        this.setState({
            switchingFromChildToMain: true
        }, () => {
            const { mainNode, childNode } = this.getDOMNodes();
            mainNode.classList.add('overlap-transition-main-animating', 'overlap-transition-main-end');
            childNode.classList.add('overlap-transition-child-animating', 'overlap-transition-child-end');

            childNode.addEventListener('transitionend', e => {
                if (e.propertyName === 'left') {
                    // Transition is over
                    this.setState({
                        switchingFromChildToMain: false
                    });
                    // Delete child
                    onChildClosed();
                    mainNode.classList.remove(
                        'overlap-transition-child-animating',
                        'overlap-transition-child-start'
                    );
                }
            });
            setTimeout(() => {
                mainNode.classList.remove('overlap-transition-main-end');
                childNode.classList.remove('overlap-transition-child-end');
                mainNode.classList.add('overlap-transition-main-start');
                childNode.classList.add('overlap-transition-child-start');
            }, 0);
        });
    }

    render() {
        const {
            switchingFromMainToChild,
            switchingFromChildToMain,
        } = this.state;
        const { main, child } = this.props;
        if (switchingFromMainToChild || switchingFromChildToMain) {
            return (
                <>
                    {React.cloneElement(React.Children.only(main), { ref: this.mainRef })}
                    {React.cloneElement(React.Children.only(child), { ref: this.childRef, back: this.backToMainView })}
                </>
            );
        } else if (child) {
            return (
                React.cloneElement(React.Children.only(child), { ref: this.childRef, back: this.backToMainView })
            );
        }

        return (
            React.cloneElement(React.Children.only(main), { ref: this.mainRef })
        );
    }
}

OverlapTransition.defaultProps = {
    child: null
};

OverlapTransition.propTypes = {
    main: PropTypes.element.isRequired,
    child: PropTypes.element,
    onChildClosed: PropTypes.func.isRequired
};
