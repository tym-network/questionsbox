import React from 'react';
import PropTypes from 'prop-types';

// Import all flags
function importAll (r) {
    r.keys().forEach(r);
}

importAll(require.context('../../../assets/img/flags', true, /\.svg$/));

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
            <section id="locale" className={classNames}>
                <h1>Select a language</h1>
                <div className="flex row center align-center grow">
                    {
                        this.props.locales.map(locale => {
                            const flagImg = require(`../../../assets/img/flags/${locale}.svg`);
                            return (
                                <div className="flag" key={locale} onClick={this.setLocale(locale)}>
                                    <img src={flagImg}/>
                                </div>
                            );
                        })
                    }
                </div>
            </section>
        );
    }
}