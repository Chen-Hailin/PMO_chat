import React, { PropTypes } from 'react';
import {fullWhite, red500, grey400, grey600, yellow400, grey900, grey300} from 'material-ui/styles/colors';
import Chip from 'material-ui/Chip';

export default class MessageListItem extends React.Component {
  static propTypes = {
    message: PropTypes.object.isRequired
  };
  handleClick(user) {
    this.props.handleClickOnUser(user);
  }
  render() {
    const { message } = this.props;
    return (
      <li>
        <span style={{paddingLeft:'1.0em'}}>
          <b style={{color: grey600}}><button style={{background: 'Transparent',backgroundRepeat: 'noRepeat', border: 'none', cursor: 'pointer', overflow: 'hidden', outline: 'none'}} onClick={this.handleClick.bind(this, message.user)}>{message.user.username}</button></b>
          <i style={{color: grey900, opacity: '0.8'}}>{message.time}</i>
        </span>
        {/*<div style={{clear: 'both', paddingLeft:'1.8em', paddingTop: '0.1em', marginTop: '-1px', paddingBottom: '0.3em'}}>{message.text}</div>*/}
        <Chip backgroundColor={grey300} labelColor={grey900} style={{clear: 'both', marginLeft:'1.8em', marginRight:'1.8em', marginTop: '0.1em', marginTop: '-1px', paddingBottom: '0.3em'}}>
          {message.text}
        </Chip>
      </li>
    );
  }
}
