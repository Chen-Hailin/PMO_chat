import React, {Component, PropTypes} from 'react';
import MessageComposer from './MessageComposer';
import MessageListItem from './MessageListItem';
import Channels from './Channels';
import CaseReport from './CaseReport';
import * as actions from '../actions/actions';
import * as authActions from '../actions/authActions';
import TypingListItem from './TypingListItem';
import {Modal, DropdownButton, MenuItem, Button, Navbar, NavDropdown, Nav, NavItem} from 'react-bootstrap';
import { Grid, Row, Col } from 'react-flexbox-grid';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import {fullWhite, blueGrey50, grey400, grey600, grey200, grey100, grey900} from 'material-ui/styles/colors';
import {Avatar, DropDownMenu} from 'material-ui';
import Paper from 'material-ui/Paper';
import Chip from 'material-ui/Chip';
var fetch = require('node-fetch');
const config = require('../../server/config');

export default class Chat extends Component {

    static propTypes = {
        messages: PropTypes.array.isRequired,
        user: PropTypes.object.isRequired,
        dispatch: PropTypes.func.isRequired,
        channels: PropTypes.array.isRequired,
        activeChannel: PropTypes.string.isRequired,
        typers: PropTypes.array.isRequired,
        socket: PropTypes.object.isRequired
    };

    constructor(props, context) {
        super(props, context);
        this.state = {
            privateChannelModal: false,
            targetedUser: ''
        }
    }

    componentDidMount() {
        const {socket, user, dispatch} = this.props;
        socket.emit('chat mounted', user);
        socket.on('new bc message', msg =>
            dispatch(actions.receiveRawMessage(msg))
        );
        socket.on('typing bc', user =>
            dispatch(actions.typing(user))
        );
        socket.on('stop typing bc', user =>
            dispatch(actions.stopTyping(user))
        );
        socket.on('new channel', channel =>
            dispatch(actions.receiveRawChannel(channel))
        );
        socket.on('receive socket', socketID =>
            dispatch(authActions.receiveSocket(socketID))
        );
        socket.on('receive private channel', channel =>
            dispatch(actions.receiveRawChannel(channel))
        );
        socket.on('receive status change', channel =>
            dispatch(actions.receiveChannelStatus(channel))
        );
        socket.on('receive channel update', channel =>
            dispatch(actions.receiveChannelUpdate(channel))
        );
    }

    componentDidUpdate() {
        const messageList = this.refs.messageList;
        messageList.scrollTop = messageList.scrollHeight;
    }

    handleSave(newMessage) {
        const {dispatch} = this.props;
        if (newMessage.text.length !== 0) {
            dispatch(actions.createMessage(newMessage));
        }
    }

    handleSignOut() {
        const {dispatch} = this.props;
        dispatch(authActions.signOut());
    }

    changeActiveChannel(channel) {
        const {socket, activeChannel, dispatch} = this.props;
        socket.emit('leave channel', activeChannel);
        socket.emit('join channel', channel);
        dispatch(actions.changeChannel(channel));
        dispatch(actions.fetchMessages(channel.name));
    }

    handleApproval(channel) {
        if (channel.approved) {
            this.withdrawApproval(channel);
        } else {
            this.approveActivateCase(channel);
        }
    }

    approveActivateCase(channel) {
        const {socket, activeCase, dispatch} = this.props;
        activeCase.approved = true;
        socket.emit('channel status change', activeCase);
        dispatch(actions.approveCase(channel));
        const payload = {
            caseid: activeCase.name
        };
        fetch(config.FEEDBACKURL, {
            method: 'post',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'text/plain'
            },
            body: JSON.stringify(payload)
        }).then(function(res) {
            if (res.status === 200) {
                console.log(res.json());
            } else {
                console.log(res.status);
                console.log("notification failed");
            }
        }).catch(function(err) {
            console.log("catch error");
            console.log(err);
        });
    }

    withdrawApproval(channel) {
        const {socket, activeCase, dispatch} = this.props;
        activeCase.approved = false;
        socket.emit('channel status change', activeCase);
        dispatch(actions.withdrawApproval(channel));
    }

    handleUpdate(channel) {
        const {socket, activeCase, dispatch} = this.props;
        const newActiveCase = channel;
        socket.emit('channel updated', newActiveCase);
        dispatch(actions.updateCase(newActiveCase));
    }

    handleClickOnUser(user) {
        this.setState({privateChannelModal: true, targetedUser: user});
    }

    closePrivateChannelModal(event) {
        event.preventDefault();
        this.setState({privateChannelModal: false});
    }

    handleSendDirectMessage() {
        const {dispatch, socket, channels, user} = this.props;
        const doesPrivateChannelExist = channels.filter(item => {
            return item.name === (`${this.state.targetedUser.username}+${user.username}` || `${user.username}+${this.state.targetedUser.username}`)
        })
        if (user.username !== this.state.targetedUser.username && doesPrivateChannelExist.length === 0) {
            const newChannel = {
                name: `${this.state.targetedUser.username}+${user.username}`,
                id: Date.now(),
                private: true,
                between: [this.state.targetedUser.username, user.username]
            };
            dispatch(actions.createChannel(newChannel));
            this.changeActiveChannel(newChannel);
            socket.emit('new private channel', this.state.targetedUser.socketID, newChannel);
        }
        if (doesPrivateChannelExist.length > 0) {
            this.changeActiveChannel(doesPrivateChannelExist[0]);
        }
        this.setState({privateChannelModal: false, targetedUser: ''});
    }

    render() {
        const {messages, socket, channels, activeChannel, typers, dispatch, user, screenWidth, activeCase} = this.props;
        const filteredMessages = messages.filter(message => message.channelID === activeChannel);
        const username = this.props.user.username;
        const dropDownMenu = (
            <Row center="xs">
                <DropdownButton key={1} style={{background: grey600, width:'100%'}} bsStyle="primary" bsSize="large"
                                title={username}>
                    <MenuItem eventKey="4" onSelect={::this.handleSignOut} className="dropdown-link">Sign
                        out</MenuItem>
                </DropdownButton>
            </Row>
        );

        const mobileNav = (
            <Navbar fixedTop style={{background: '#337ab7', color: 'white'}}>
                <span style={{fontSize: '2em'}}>{username}</span>
                <Navbar.Toggle/>
                <Navbar.Collapse style={{maxHeight: '100%'}}>
                    <Button bsStyle="primary" onSelect={::this.handleSignOut}> Sign out
                    </Button>
                    <section style={{order: '2', marginTop: '1.5em'}}>
                        <Channels socket={socket} onClick={::this.changeActiveChannel} channels={channels}
                                  messages={messages} dispatch={dispatch} username={username}/>
                    </section>
                </Navbar.Collapse>
            </Navbar>
        );
        const bigNav = (
            <Card style={{background: grey600, height:'100%'}}>
                <grid fluid style={{'top': '0', alignSelf: 'baseline', padding: '0', margin: '0', order: '1'}}>
                    {dropDownMenu}
                    <Channels socket={socket} onClick={::this.changeActiveChannel} channels={channels}
                              messages={messages} dispatch={dispatch} username={username}/>
                </grid>
            </Card>
        );
        return (
            <Grid fluid style={{height:'100%'}}>
                <Row style={{marginTop:'20px',marginLeft:'15px',marginRight:'15px', marginBottom:'20px', height:'100%'}}>
                <Col xs={2}>
                    {screenWidth < 500 ? mobileNav : bigNav}
                </Col>
                <Col xs={10}>
                    <Row style={{height:'45%', paddingBottom:'10px', width:'100%'}}>
                        <CaseReport style={{height:'100%'}} activeCase={activeCase} username={username} onClick={::this.handleApproval} onUpdateCMO={::this.handleUpdate}/>
                    </Row>
                    <Row style={{height:'55%', width:'100%'}}>
                        <Paper style={{width:'100%', height:'100%'}}>
                            <ul style={{
                              background: blueGrey50,
                              color: grey900,
                              wordWrap: 'break-word',
                              margin: '0',
                              overflowY: 'auto',
                              padding: '0',
                              paddingBottom: '1em',
                              paddingTop: '1em',
                              flexGrow: '1',
                              order: '1',
                              height:'80%'
                            }} ref="messageList">
                              {filteredMessages.map(message =>
                                <MessageListItem handleClickOnUser={::this.handleClickOnUser} message={message}
                                                 key={message.id}/>
                              )}
                            </ul>
                            <MessageComposer style={{height:'20%'}} socket={socket} activeChannel={activeChannel} user={user}
                                             onSave={::this.handleSave}/>
                        </Paper>
                    </Row>
                </Col>
                </Row>
            </Grid>
        );
    }
}
