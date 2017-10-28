import React, {Component, PropTypes} from 'react';
import {Button} from 'react-bootstrap';


export default class CaseReport extends Component {

    static propTypes = {
        activeCase: PropTypes.object.isRequired,
        onClick: PropTypes.func.isRequired,
    }

    render() {
        const {activeCase, onClick} = this.props;
        var message = "Approve";
        if (activeCase.approved)
            message = "Withdraw Approval";
        return (
            <div style={{
                background: '#606090',
                color: '#F3F4F8 ',
                flexGrow: '0',
                order: '0',
                paddingLeft: '0.8em',
                paddingRight: '1.0em',
                paddingBottom: '1.0em'
            }}>
                <h1>{activeCase.name}</h1>
                <ul style={{fontSize: '1.0em',}}>
                    <li>
                        {"Affected Location:" + activeCase.caseLocation}
                    </li>
                    <li>
                        {activeCase.caseDescription}
                    </li>
                    <li>
                        {"EF force requested: " + activeCase.efForce}
                    </li>
                </ul>
                <Button bsSize="large" bsStyle="primary" onClick={() => onClick(activeCase)}>
                    {message}
                </Button>
            </div>
        );
    }
}