import React from 'react';
import PropTypes from 'prop-types';
import i18next from 'i18next';

export default class DataSettings extends React.PureComponent {

    static propTypes = {
        frontBack: PropTypes.string.isRequired,
        goToNextStep: PropTypes.func.isRequired,
        setTitle: PropTypes.func.isRequired,
        title: PropTypes.string
    };

    constructor(props) {
        super(props);

        this.onSave = this.onSave.bind(this);
        this.onTitleChanged = this.onTitleChanged.bind(this);
    }

    onSave() {
        this.props.goToNextStep();
    }

    onTitleChanged(e) {
        const title = e.target.value;

        this.props.setTitle(title);
    }

    render() {
        const className = `${this.props.frontBack}`;
        return (
            <section id="data-settings" className={className}>
                <div>
                    <h1>{i18next.t('settings')} (1/2)</h1>
                    <label htmlFor="title">{i18next.t('title')}</label>
                    <input
                        id="title"
                        type="text"
                        value={this.props.title}
                        onChange={this.onTitleChanged}
                    />
                </div>
                <footer>
                    <button
                        id="save-settings"
                        type="button"
                        onClick={this.onSave}
                    >
                        {i18next.t('saveSettings')}
                    </button>
                </footer>
            </section>
        );
    }
}