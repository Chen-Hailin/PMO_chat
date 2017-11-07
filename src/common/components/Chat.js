import React, {Component, PropTypes} from 'react';
import MessageComposer from './MessageComposer';
import MessageListItem from './MessageListItem';
import Channels from './Channels';
import CaseReport from './CaseReport';
import * as actions from '../actions/actions';
import * as authActions from '../actions/authActions';
import TypingListItem from './TypingListItem';
import {Modal, DropdownButton, MenuItem, Button, Navbar, NavDropdown, Nav, NavItem} from 'react-bootstrap';

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
            <div style={{background: '#3F96FF', 'width': '21rem', 'top': '0', alignSelf: 'baseline', padding: '0', margin: '0', order: '1'}}>
                <DropdownButton key={1} style={{background: '#3F96FF', 'width': '21rem'}} id="user-menu" bsSize="large" bsStyle="primary"
                                title={username}>
                    <MenuItem style={{'width': '21rem'}} eventKey="4" onSelect={::this.handleSignOut}>Sign
                        out</MenuItem>
                </DropdownButton>
            </div>
        );
        // a pop up showed when click on a username in chat window
        const PrivateMessageModal = (
            <div>
                <Modal bsSize="small" key={1} show={this.state.privateChannelModal}
                       onHide={::this.closePrivateChannelModal}>
                    <Modal.Header>
                        {this.state.targetedUser.username}
                    </Modal.Header>
                    <Modal.Body>
                        <Button onClick={this.handleSendDirectMessage.bind(this)}>
                            Direct Message
                        </Button>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button onClick={this.closePrivateChannelModal.bind(this)}>
                            Close
                        </Button>
                    </Modal.Footer>
                </Modal>
            </div>
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
                                  messages={messages} dispatch={dispatch}/>
                    </section>
                </Navbar.Collapse>
            </Navbar>
        );
        const bigNav = (
            <div className="nav">
                {dropDownMenu}
                <section style={{order: '2', marginTop: '1.5em'}}>
                    <Channels socket={socket} onClick={::this.changeActiveChannel} channels={channels}
                              messages={messages} dispatch={dispatch}/>
                </section>
            </div>
        );
        return (
            <div style={{margin: '0', padding: '0', height: '100%', width: '100%', display: '-webkit-box'}}>
                {screenWidth < 500 ? mobileNav : bigNav}
                <div className="main">
                    <CaseReport activeCase={activeCase} username={username} onClick={::this.handleApproval} onUpdateCMO={::this.handleUpdate}/>
                    {PrivateMessageModal}
                    <ul style={{
                        background: '#6D76A2',
                        color: '#F3F4F8 ',
                        wordWrap: 'break-word',
                        margin: '0',
                        overflowY: 'auto',
                        padding: '0',
                        paddingBottom: '1em',
                        paddingTop: '1em',
                        flexGrow: '1',
                        order: '1'
                    }} ref="messageList">
                        {filteredMessages.map(message =>
                            <MessageListItem handleClickOnUser={::this.handleClickOnUser} message={message}
                                             key={message.id}/>
                        )}
                    </ul>
                    <MessageComposer socket={socket} activeChannel={activeChannel} user={user}
                                     onSave={::this.handleSave}/>
                </div>
                <footer style={{
                    fontSize: '1em',
                    position: 'fixed',
                    bottom: '0.2em',
                    left: '21.5rem',
                    color: '#000000',
                    width: '100%',
                    opacity: '0.5'
                }}>
                    {typers.length === 1 &&
                    <div>
              <span>
                <TypingListItem username={typers[0]} key={1}/>
                <span> is typing</span>
              </span>
                    </div>}
                    {typers.length === 2 &&
                    <div>
            <span>
              <TypingListItem username={typers[0]} key={1}/>
              <span> and </span>
              <TypingListItem username={typers[1]} key={2}/>
              <span> are typing</span>
            </span>
                    </div>}
                    {typers.length > 2 &&
                    <div>
                        <span>Several people are typing</span>
                    </div>}
                </footer>
            </div>
        );
    }
}
