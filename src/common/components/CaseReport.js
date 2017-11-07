import React, {Component, PropTypes} from 'react';
import {Modal, Glyphicon, Input, Button} from 'react-bootstrap';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import {fullWhite, red500, grey400, grey600, yellow400} from 'material-ui/styles/colors';
import { Grid, Row, Col } from 'react-flexbox-grid';
import {List, ListItem, makeSelectable} from 'material-ui/List';
import Paper from 'material-ui/Paper';
import RaisedButton from 'material-ui/RaisedButton';

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
        );
        var message = "Approve";
        if (activeCase.approved)
            message = "Withdraw Approval";

        var status = "pending";
        if (activeCase.approved)
            status = "approved";
        return (
            <Grid style={{
                background: grey600,
                color: '#F3F4F8 ',
                flexGrow: '0',
                order: '0',
                paddingLeft: '0.8em',
                paddingRight: '1.0em',
                paddingBottom: '1.0em',
                width:'100%'
            }}>
                {updateChannelModal}
                <Row style={{height:'100%'}}>
                    <Col xs={8}>
                        <Row style={{height:'20%', paddingBottom:'5px'}} top="xs">
                            <p style={{fontSize:'24px'}}>   <b>{activeCase.name}</b> - {status}</p>
                        </Row>
                        <Row style={{height:'80%'}}>
                            <ul style={{maxHeight: '100%', overflow:'auto', paddingTop:'10px'}} >
                                <li style={{maxWidth:'100%'}}>
                                    <p>{"Location:" + activeCase.caseLocation}</p>
                                </li>
                                <li style={{maxWidth:'100%'}}>
                                    <p>{"Description:" + activeCase.caseDescription}</p>
                                </li>
                                <li style={{maxWidth:'100%'}}>
                                    <p>{"EF force requested:" + activeCase.efForce}</p>
                                </li>
                            </ul>
                        </Row>
                    </Col>
                    <Col xs={4}>
                        <Row style={{height:'70%'}}>
                            <iframe src="https://www.youtube.com/embed/nN2ItObt2NE" style={{height:'100%',width:'100%'}} frameborder="0" allowfullscreen></iframe>
                        </Row>
                        <Row bottom="xs" style={{bottom:'0px', height:'30%'}}>
                          {(username === 'pmo')?
                            <RaisedButton label={message} onClick={() => onClick(activeCase)}/>
                            :
                            <RaisedButton label="Update Case" onClick={::this.openUpdateChannelModal}/>}
                        </Row>
                    </Col>
                </Row>
            </Grid>
            );
        }
}