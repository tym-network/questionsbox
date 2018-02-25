import React from 'react';
import PropTypes from 'prop-types';

export default class LocalePicker extends React.PureComponent {

    static propTypes = {
        locales: PropTypes.arrayOf(PropTypes.string).isRequired,
        frontBack: PropTypes.string.isRequired,
        goToNextStep: PropTypes.func.isRequired,
        setLocale: PropTypes.func.isRequired
    };

    constructor(props) {
        super(props);

        this.setLocale = this.setLocale.bind(this);
    }

    setLocale(locale) {
        return () => {
            this.props.setLocale(locale);
            this.props.goToNextStep();
        };
    }

    render() {
        const classNames = `${this.props.frontBack} flex column space-between`;
        return (
            <div id="locale" className={classNames}>
                <h1>Select a language</h1>
                <div className="flex row center align-center grow">
                    {
                        this.props.locales.map(locale => (
                            <div className="flag" key={locale} onClick={this.setLocale(locale)}>
                                <img src={`../images/${locale}.svg`}/>
                            </div>
                        ))
                    }
                </div>
            </div>
        );
    }
}