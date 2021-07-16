import React, { Component, Fragment } from 'react';
import { Select, Avatar, Input } from 'antd';
import { DownOutlined, LockFilled,CloseOutlined } from '@ant-design/icons';
import { withRouter } from 'react-router';

import moment from 'moment';
const { Option } = Select;
const dateFormat = 'YYYY/MM/DD';
// import './index.less';
let pList = window.sessionStorage.getItem('powerList') ? window.sessionStorage.getItem('powerList') : [];
if (pList.ength > 0) {
  pList = pList.split(',');
}
class useragreeChild extends Component {
  constructor(props) {
    super(props);
    this.state = {
      authorizerName: '',
      addPerson: false,
      isEdit: true,
      deptName: '',
      userName: '',
      avatar: '',
      authorizerTime: '2020-11-18 16:48:33',
      roleId: '',
      userIds: '',
      pList: [],
      superiorList: [],
    };
  }
  componentDidMount() {
    // console.log('看下父组件传过来的值',this.props)
    let pList = window.sessionStorage.getItem('powerList') ? window.sessionStorage.getItem('powerList') : [];

    if (pList.length > 0) {
      pList = pList.split(',');
    }
    this.setState({
      pList: pList,
    });
    this.setState({
      avatar: this.props.msg.avatar,
      deptName: this.props.msg.deptName,
      mobile: this.props.msg.mobile,
      position: this.props.msg.position,
      userName: this.props.msg.userName,
      deptId: this.props.msg.deptId,
      userIds: this.props.msg.userId,
      status: this.props.msg.status,
      roleNames: this.props.msg.roleNames,
      superiorList: this.props.msg.superiorList,

    });
  }
  componentWillReceiveProps(props) {
    this.setState({
      avatar: props.msg.avatar,
      deptName: props.msg.deptName,
      mobile: props.msg.mobile,
      position: props.msg.position,
      userName: props.msg.userName,
      deptId: props.msg.deptId,
      userIds: props.msg.userId,
      status: props.msg.status,
      roleNames: props.msg.roleNames,
      superiorList: this.props.msg.superiorList,

    });
  }

  // 添加直属上级弹窗
  addLeve = (userId)=>{
    this.props.onShowPer(userId);
  }

  // 删除直属上级
  deleteLevel = (userId)=>{
    this.props.delete(userId)
  };

  linechange = () => {
    this.props.parent.getChildrenMsg(this, '保存数据', 'cancle'); //触发父组件方法更新数据
  };
  toParent = (e, type, id, userIds) => {
    //子组件通过调用父组件的方法保存值传给子组件
  };
  getTime = (data) => {
    var time = new Date(data);
    var y = time.getFullYear();
    var m = time.getMonth() + 1;
    var d = time.getDate();
    var h = time.getHours();
    var mm = time.getMinutes();
    var s = time.getSeconds();

    return y + '-' + this.add0(m) + '-' + this.add0(d) + ' ' + this.add0(h) + ':' + this.add0(mm) + ':' + this.add0(s);
  };
  add0 = (m) => {
    return m < 10 ? '0' + m : m;
  };
  changeInfo = () => {
    this.setState({
      showChange: true,
    });
  };
  clickNav1 = (e, val) => {
    console.log(this.props);
    this.props.history.push({ pathname: `/PermissionRole/permissionSet/${e}`, state: { deptId: e } });
    // console.log('是否执行点击事件',e)
  };
  clickNav2 = (e, val) => {
    this.props.history.push({ pathname: `/PermissionRole/userAgree/${e}`, state: { deptId: e } });
    console.log('是否执行点击事件', e);
  };
  delete = (id, v) => {
    console.log('点击删除角色', this);
    this.props.parent.getChildrenMsg(this, '', 'delete'); //触发父组件方法删除角色信息
    // delRole
  };
  nochange = () => {
    this.setState({
      showChange: false,
    });
  };
  changeTime = (e) => {
    this.setState({
      changeTime: e.target.value,
    });
  };

  render() {
    const mustcaosongList = this.state.superiorList.map((val, index) => {
      return (
        <div className="CC new-avate" key={val.userId}>
          {val.avatar ? (
            <img style={{width:'26px',height: '26px'}} src={val.avatar} alt="" />
          ) : (
            <div className="headerPic125">{val.username[val.username.length - 1]}</div>
          )}

          <span className="lock" onClick={()=>this.deleteLevel({
            userId: this.state.userIds,
            superiorId: val.userId
          })}>
            <CloseOutlined  />
          </span>
          <p>{val.username}</p>
        </div>
      );
    });

    return (
      <Fragment>
        {this.state.type == 'add' ? (
          <Fragment>
            <label style={{ width: '100px' }}>
              <input className="inputN" onChange={this.state.roleName} defaultValue={this.state.roleName} />
            </label>
            <label style={{ width: '100px' }} onClick={this.getCategoryTree}>
              <span className="deptNameMsg">
                <em className="deptName">{this.state.deptName}</em>
                <DownOutlined />
              </span>
            </label>
            <label style={{ width: '200px' }}></label>
            <label style={{ width: '200px' }}></label>
            {/* <DatePicker onChange={this.onChange} value={moment(this.state.createTime, dateFormat)} /> */}
          </Fragment>
        ) : (
          <Fragment>
            <label style={{ width: '100px' }}>
              <Avatar src={this.state.avatar} size={26}  style={{background: '#1677ff'}}>
                <span style={{fontSize: '17px'}}>{this.state.userName[this.state.userName.length - 1]}</span>
              </Avatar>
              <span className="menmber-childe">
                {this.state.pList.indexOf('setting:user_manage:userName') > -1 ? this.state.userName : '-'}
              </span>
            </label>
            <label style={{ width: '100px' }}>
              {this.state.pList.indexOf('setting:user_manage:mobile') > -1 ? this.state.mobile : '-'}
            </label>
            <label style={{ width: '100px' }}>
              {this.state.pList.indexOf('setting:user_manage:deptName') > -1 ? this.state.deptName : '-'}{' '}
            </label>
            <label style={{ width: '100px' }}>
              {this.state.pList.indexOf('setting:user_manage:position') > -1 ? this.state.position : '-'}
            </label>
            <label style={{ width: '100px' }}>
              {this.state.pList.indexOf('setting:user_manage:status') > -1
                ? this.state.status === 0
                  ? '在职'
                  : this.state.status === 1
                  ? '离职'
                  : '全部'
                : '-'}
              {}
            </label>
            <label style={{ width: '130px' }}>
              <div className="me-list">
                {mustcaosongList}
                <div className="addCC" onClick={()=>this.addLeve(this.state.userIds)} hidden={this.state.superiorList.length > 2}>
                  +
                </div>
              </div>
            </label>
          </Fragment>
        )}
      </Fragment>
    );
  }
}

// export default ;
export default withRouter(useragreeChild);
