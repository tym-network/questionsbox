// questionsbox (c) by Théotime Loiseau
//
// questionsbox is licensed under a
// Creative Commons Attribution-NonCommercial-ShareAlike 3.0 Unported License.
//
// You should have received a copy of the license along with this
// work.  If not, see <http://creativecommons.org/licenses/by-nc-sa/3.0/>.

import React from 'react';
import PropTypes from 'prop-types';

import Customize from './Customize';
import CustomizeQuestions from './CustomizeQuestions';
import OverlapTransition from '../containers/OverlapTransition';

class CustomizeRouter extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            showCustomizeQuestions: false,
        };

        this.setShowCustomizeQuestions = this.setShowCustomizeQuestions.bind(this);
    }

    setShowCustomizeQuestions(value) {
        this.setState({
            showCustomizeQuestions: value,
        });
    }

    render() {
        const { back, saveConfiguration, saveConfigurationStatus, configuration, setConfigurationProperty, questions, questionsData, saveQuestions } = this.props;
        const { showCustomizeQuestions } = this.state;
        const customize = (
            <Customize
                back={back}
                editQuestions={() => {
                    this.setShowCustomizeQuestions(true);
                }}
                save={saveConfiguration}
                saveStatus={saveConfigurationStatus}
                configuration={configuration}
                setConfigurationProperty={setConfigurationProperty}
            />
        );
        let customizeQuestions;
        if (showCustomizeQuestions) {
            customizeQuestions = <CustomizeQuestions questions={questions} questionsData={questionsData} saveQuestions={saveQuestions} />;
        }
        return (
            <OverlapTransition
                main={customize}
                child={customizeQuestions}
                onChildClosed={() => {
                    this.setShowCustomizeQuestions(false);
                }}
            />
        );
    }
}

CustomizeRouter.defaultProps = {
    back: () => {},
    saveConfigurationStatus: null,
};

CustomizeRouter.propTypes = {
    back: PropTypes.func,
    saveConfiguration: PropTypes.func.isRequired,
    saveConfigurationStatus: PropTypes.string,
    configuration: PropTypes.object.isRequired,
    setConfigurationProperty: PropTypes.func.isRequired,
    questions: PropTypes.object.isRequired,
    questionsData: PropTypes.object.isRequired,
    saveQuestions: PropTypes.func.isRequired,
};

export default CustomizeRouter;
