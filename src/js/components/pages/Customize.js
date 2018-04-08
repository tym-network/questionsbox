import React from 'react';
import PropTypes from 'prop-types';
import i18next from 'i18next';

import { debounce } from '../../utils/Utils';

import BackButton from '../widget/BackButton';
import SaveIndicator from '../widget/SaveIndicator';

export default class Customize extends React.PureComponent {

    static propTypes = {
        frontBack: PropTypes.string.isRequired,
        save: PropTypes.func.isRequired,
        saveStatus: PropTypes.string,
        back: PropTypes.func.isRequired,
        setTitle: PropTypes.func.isRequired,
        title: PropTypes.string
    };

    constructor(props) {
        super(props);

        this.onTitleChanged = this.onTitleChanged.bind(this);
        this.saveDebounced = debounce(this.props.save, 500);
    }

    onTitleChanged(e) {
        const title = e.target.value;

        this.props.setTitle(title);
        this.saveDebounced();
    }

    render() {
        const className = `${this.props.frontBack}`;
        return (
            <section id="customize" className={className}>
                <BackButton onClick={this.props.back}/>
                <div>
                    <h1>{i18next.t('customize')}</h1>
                    <label htmlFor="title">{i18next.t('title')}</label>
                    <input
                        id="title"
                        type="text"
                        value={this.props.title}
                        onChange={this.onTitleChanged}
                    />
                </div>
                <footer className="save-indicator-container">
                    <SaveIndicator saveStatus={this.props.saveStatus} />
                </footer>
            </section>
        );
    }
}