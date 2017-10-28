import React, {Component, PropTypes} from 'react';
import {Modal, Glyphicon, Input, Button} from 'react-bootstrap';


export default class CaseReport extends Component {

    static propTypes = {
        activeCase: PropTypes.object.isRequired,
        onClick: PropTypes.func.isRequired,
        username: PropTypes.string.isRequired,
        onUpdateCMO: PropTypes.func.isRequired,
    };

    constructor(props, context) {
        super(props, context);
        const activeCase = this.props.activeCase;
        this.state = {
            updateChannelModal: false,
            caseDescription: activeCase.caseDescription,
            caseLocation: activeCase.caseLocation,
            efForce: activeCase.efForce,
            accepted: false,
            moreChannelsModal: false
        };
    }

    openUpdateChannelModal(event) {
        console.log("open modal called");
        event.preventDefault();
        this.setState({updateChannelModal: true});
    }

    closeUpdateChannelModal(event) {
        // event.preventDefault();
        this.setState({updateChannelModal: false});
    }

    handleModalChange(event) {
        this.setState({[event.target.name]: event.target.value});
    }

    handleModalSubmit(event) {
        const {activeCase, onUpdateCMO} = this.props;
        event.preventDefault();
        console.log(this.state.channelName);
        const newChannel = {
            name: activeCase.name,
            caseDescription: this.state.caseDescription.trim(),
            caseLocation: this.state.caseLocation.trim(),
            efForce: this.state.efForce.trim(),
            id: activeCase.id,
            approved: false,
            private: activeCase.private
        };
        onUpdateCMO(newChannel);
        this.closeUpdateChannelModal();
        this.setState({
            efForce: ''
        });
    }

    render() {
        const {activeCase, onClick, username} = this.props;
        const updateChannelModal = (
            <div>
                <Modal key={1} show={this.state.updateChannelModal} onHide={::this.closeUpdateChannelModal}>
                    <Modal.Header closeButton>
                        <Modal.Title>Update Case</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <form onSubmit={::this.handleModalSubmit}>
                            <Input
                                ref="caseLocation"
                                type="text"
                                name="caseLocation"
                                autoFocus="true"
                                placeholder="Enter new case location"
                                value={this.state.caseLocation}
                                onChange={::this.handleModalChange}
                            />
                            <textarea
                                style={{width:'100%'}}
                                ref="caseDescription"
                                rows="5"
                                name="caseDescription"
                                autoFocus="true"
                                placeholder="Enter new case description"
                                value={this.state.caseDescription}
                                onChange={::this.handleModalChange}
                            />
                            <Input
                                ref="efForce"
                                type="text"
                                name="efForce"
                                autoFocus="true"
                                placeholder="Enter EF force required"
                                value={this.state.efForce}
                                onChange={::this.handleModalChange}
                            />
                        </form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button onClick={::this.closeUpdateChannelModal}>Cancel</Button>
                        <Button onClick={::this.handleModalSubmit} type="submit">
                            Update Case
                        </Button>
                    </Modal.Footer>
                </Modal>
            </div>
        );
        var message = "Approve";
        if (activeCase.approved)
            message = "Withdraw Approval";
        if (username === 'pmo') {
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
        } else {
            var status = "pending";
            if (activeCase.approved)
                status = "approved";
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
                    {updateChannelModal}
                    <h1>{activeCase.name}</h1>
                    <h2>  {status}</h2>
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
                    <Button bsSize="large" bsStyle="primary" onClick={::this.openUpdateChannelModal}>
                        Update Case
                    </Button>
                </div>
            );
        }
    }
}