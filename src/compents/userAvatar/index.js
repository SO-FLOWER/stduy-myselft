import React from 'react';
import { Avatar } from 'antd';

const UserAvatar = (props) => {
  return props.src ? (
    <Avatar size={32} src={props.src} />
  ) : (
    <div className="headerPic">{(props.name && props.name[props.name.length - 1]) || 'U'}</div>
  );
};

export default UserAvatar;
