import React, {Component, PropTypes} from 'react';
import moment from 'moment';
import {Input} from 'react-bootstrap';
import uuid from 'node-uuid';
import TextField from 'material-ui/TextField';
import {fullWhite, grey50, grey400, grey600, yellow400, grey900, grey300} from 'material-ui/styles/colors';

export default class MessageComposer extends Component {

    static propTypes = {
        activeChannel: PropTypes.string.isRequired,
        onSave: PropTypes.func.isRequired,
        user: PropTypes.object.isRequired,
        socket: PropTypes.object.isRequired
    };

    constructor(props, context) {
        super(props, context);
        this.state = {
            text: '',
            typing: false
        };
    }

    handleSubmit(event) {
        const {user, socket, activeChannel} = this.props;
        const text = event.target.value.trim();
        if (event.which === 13) {
            event.preventDefault();
            var newMessage = {
                id: `${Date.now()}${uuid.v4()}`,
                channelID: this.props.activeChannel,
                text: text,
                user: user,
                time: moment.utc().format('lll')
            };
            socket.emit('new message', newMessage);
            socket.emit('stop typing', {user: user.username, channel: activeChannel});
            this.props.onSave(newMessage);
            this.setState({text: '', typing: false});
        }
    }

    handleChange(event) {
        const {socket, user, activeChannel} = this.props;
        this.setState({text: event.target.value});
        if (event.target.value.length > 0 && !this.state.typing) {
            socket.emit('typing', {user: user.username, channel: activeChannel});
            this.setState({typing: true});
        }
        if (event.target.value.length === 0 && this.state.typing) {
            socket.emit('stop typing', {user: user.username, channel: activeChannel});
            this.setState({typing: false});
        }
    }

    render() {
        return (
          <TextField
            hintText="Type your message"
            multiLine={true}
            rows={1}
            rowsMax={2}
            fullWidth={true}
            value={this.state.text}
            onChange={::this.handleChange}
            onKeyDown={::this.handleSubmit}
            style={{background:grey50}}
            textareaStyle={{color:grey900, marginLeft:'5px'}}
          />
        );
    }
}

/*
<div style={{
    background: '#606090',
    zIndex: '52',
    left: '21.1rem',
    right: '1rem',
    width: '100%',
    flexShrink: '0',
    order: '2',
    paddingTop: '0.5em',
    paddingLeft: '0.5em',
    paddingRight: '0.5em'
}}>
    <Input
        style={{
            background: '#C5CAE9',
            color: '#757575',
            height: '100%',
            fontSize: '2em',
            // marginBottom: '1em'
        }}
        type="textarea"
        name="message"
        ref="messageComposer"
        autoFocus="true"
        placeholder="Type here to chat!"
        value={this.state.text}
        onChange={::this.handleChange}
        onKeyDown={::this.handleSubmit}
    />
</div>
 */