import React, {Component, PropTypes} from 'react';
import ChannelListItem from './ChannelListItem';
import ChannelListModalItem from './ChannelListModalItem';
import {Modal, Glyphicon, Input, Button} from 'react-bootstrap';
import * as actions from '../actions/actions';
import uuid from 'node-uuid';
import { Grid, Row, Col } from 'react-flexbox-grid';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
import {fullWhite, red500, grey400, grey500, grey600, yellow400} from 'material-ui/styles/colors';
import {List, ListItem, makeSelectable} from 'material-ui/List';
let SelectableList = makeSelectable(List);
export default class Channels extends Component {

    static propTypes = {
        channels: PropTypes.array.isRequired,
        onClick: PropTypes.func.isRequired,
        messages: PropTypes.array.isRequired,
        dispatch: PropTypes.func.isRequired
    };

    constructor(props, context) {
        super(props, context);
        this.state = {
            addChannelModal: false,
            channelName: '',
            caseDescription: '',
            caseLocation: '',
            efForce: '',
            accepted: false,
            moreChannelsModal: false,
            curChannel: 0
        };
    }

    handleChangeChannel(channel) {
        if (this.state.moreChannelsModal) {
            this.closeMoreChannelsModal();
        }
        this.props.onClick(channel);
        this.state.curChannel = channel;
    }

    openAddChannelModal(event) {
        event.preventDefault();
        this.setState({addChannelModal: true});
    }

    closeAddChannelModal(event) {
        // event.preventDefault();
        this.setState({addChannelModal: false});
    }

    handleModalChange(event) {
        this.setState({[event.target.name]: event.target.value});
    }

    handleModalSubmit(event) {
        const {channels, dispatch, socket} = this.props;
        event.preventDefault();
        if (this.state.channelName.length < 1) {
            this.refs.channelName.getInputDOMNode().focus();
        }
        if (this.state.channelName.length > 0 && channels.filter(channel => {
                return channel.name === this.state.channelName.trim();
            }).length < 1) {
            console.log(this.state.channelName);
            const newChannel = {
                name: this.state.channelName.trim(),
                caseDescription: this.state.caseDescription.trim(),
                caseLocation: this.state.caseLocation.trim(),
                efForce: this.state.efForce.trim(),
                id: `${Date.now()}${uuid.v4()}`,
                approved: false,
                private: false
            };
            dispatch(actions.createChannel(newChannel));
            this.handleChangeChannel(newChannel);
            socket.emit('new channel', newChannel);
            this.closeAddChannelModal();
            this.setState({
                channelName: ''
            });
        }
    }

    validateChannelName() {
        const {channels} = this.props;
        if (channels.filter(channel => {
                return channel.name === this.state.channelName.trim();
            }).length > 0) {
            return 'error';
        }
        return 'success';
    }

    openMoreChannelsModal(event) {
        event.preventDefault();
        this.setState({moreChannelsModal: true});
    }

    closeMoreChannelsModal(event) {
        event.preventDefault();
        this.setState({moreChannelsModal: false});
    }

    createChannelWithinModal() {
        this.closeMoreChannelsModal();
        this.openAddChannelModal();
    }

    render() {
        const {channels, messages} = this.props;
        const filteredChannels = channels.slice(0, 8);
        const moreChannelsBoolean = channels.length > 8;
        const restOfTheChannels = channels.slice(8);
        const newChannelModal = (
            <div>
                <Modal key={1} show={this.state.addChannelModal} onHide={::this.closeAddChannelModal}>
                    <Modal.Header closeButton>
                        <Modal.Title>Add New Channel</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <form onSubmit={::this.handleModalSubmit}>
                            <Input
                                ref="channelName"
                                type="text"
                                help={this.validateChannelName() === 'error' && 'A channel with that name already exists!'}
                                bsStyle={this.validateChannelName()}
                                hasFeedback
                                name="channelName"
                                autoFocus="true"
                                placeholder="Enter new case id"
                                value={this.state.channelName}
                                onChange={::this.handleModalChange}
                            />
                            <Input
                                ref="caseLocation"
                                type="text"
                                name="caseLocation"
                                autoFocus="true"
                                placeholder="Enter the case location"
                                value={this.state.caseLocation}
                                onChange={::this.handleModalChange}
                            />
                            <textarea
                                style={{width:'100%'}}
                                ref="caseDescription"
                                rows="5"
                                name="caseDescription"
                                autoFocus="true"
                                placeholder="Enter the case description"
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
                        <Button onClick={::this.closeAddChannelModal}>Cancel</Button>
                        <Button disabled={this.validateChannelName() === 'error' && 'true'}
                                onClick={::this.handleModalSubmit} type="submit">
                            Create New Case
                        </Button>
                    </Modal.Footer>
                </Modal>
            </div>
        );
        const moreChannelsModal = (
            <div style={{background: 'grey'}}>
                <Modal key={2} show={this.state.moreChannelsModal} onHide={::this.closeMoreChannelsModal}>
                    <Modal.Header closeButton>
                        <Modal.Title>More Channels</Modal.Title>
                        <a onClick={::this.createChannelWithinModal} style={{'cursor': 'pointer', 'color': '#85BBE9'}}>
                            Create a channel
                        </a>
                    </Modal.Header>
                    <Modal.Body>
                        <ul style={{height: 'auto', margin: '0', overflowY: 'auto', padding: '0'}}>
                            {restOfTheChannels.map(channel =>
                                <ChannelListModalItem channel={channel} key={channel.id}
                                                      onClick={::this.handleChangeChannel}/>
                            )}
                        </ul>
                    </Modal.Body>
                    <Modal.Footer>
                        <button onClick={::this.closeMoreChannelsModal}>Cancel</button>
                    </Modal.Footer>
                </Modal>
            </div>
        );
        return (
            <div>
                <Row center="xs" middle="xs">
                    <Col xs={6}>
                        Active Cases
                    </Col>
                    <Col xs={6}>
                        <FloatingActionButton mini={true} onClick={::this.openAddChannelModal} backgroundColor={grey500}>
                            <ContentAdd />
                        </FloatingActionButton>
                    </Col>
                </Row>
                {newChannelModal}
                <Row>
                    <SelectableList style={{width:'80%', marginLeft:'10%', marginRight:'10%', marginTop:'10px'}} value={this.state.curChannel}>
                      {filteredChannels.map(channel =>
                        <ChannelListItem style={{paddingLeft: '0.8em', background: '#252A45', height: '0.7em'}}
                                         messageCount={messages.filter(msg => {
                                           return msg.channelID === channel.name;
                                         }).length} channel={channel} key={channel.id}
                                         onClick={::this.handleChangeChannel}/>
                      )}
                    </SelectableList>

                    {moreChannelsBoolean &&
                    <a onClick={::this.openMoreChannelsModal} style={{'cursor': 'pointer', 'color': '#85BBE9'}}>
                        + {channels.length - 8} more...</a>}
                    {moreChannelsModal}
                </Row>
            </div>
        );
    }
}
/*
<ul style={{
    display: 'flex',
    flexDirection: 'column',
    listStyle: 'none',
    margin: '0',
    overflowY: 'auto',
    padding: '0'
}}>
    {filteredChannels.map(channel =>
        <ChannelListItem style={{paddingLeft: '0.8em', background: '#252A45', height: '0.7em'}}
                         messageCount={messages.filter(msg => {
                             return msg.channelID === channel.name;
                         }).length} channel={channel} key={channel.id}
                         onClick={::this.handleChangeChannel}/>
    )}
</ul>
 */
