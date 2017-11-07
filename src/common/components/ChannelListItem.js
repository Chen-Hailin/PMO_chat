import React, { PropTypes } from 'react';
import classnames from 'classnames';
import { Button } from 'react-bootstrap';
import {List, ListItem} from 'material-ui/List';

const ChannelListItem = (props) => {
  const { channel: selectedChannel, onClick, channel } = props;
  return (
    <ListItem
      onClick={() => onClick(channel)}
      value = {channel}
      primaryText = {<a className={classnames({ selected: channel === selectedChannel })}
                        style={{ cursor: 'hand', color: 'white', textAlign:'center'}}>
          <h5>{channel.name}</h5>
      </a>}
    />
  );
}

ChannelListItem.propTypes = {
  channel: PropTypes.object.isRequired,
  onClick: PropTypes.func.isRequired
}

export default ChannelListItem;
