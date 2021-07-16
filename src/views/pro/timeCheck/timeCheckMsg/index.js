import React, { Component, Fragment } from 'react';
import { Tag, message, Avatar } from 'antd';
import { updateHourNum, passWorkTime } from './../../../../api/api.js';
import './index.less';

class TimeCheckMsg extends Component {
  constructor(props) {
    super(props);
    this.state = {
      avatar: '',
      checkStatus: '',
      deptName: '',
      hourNum: 0,
      hourTime: 0,
      id: 0,
      projName: '',
      updateTime: 0,
      username: '0',
      showChange: false,
      changeTime: '',
      pList: [],
    };
  }

  componentDidMount() {
    let pList = window.sessionStorage.getItem('powerList') ? window.sessionStorage.getItem('powerList') : [];

    if (pList.length > 0) {
      pList = pList.split(',');
    }
    this.setState({
      pList: pList,
    });
    this.setState({
      avatar: this.props.msg.avatar,
      checkStatus: this.props.msg.checkStatus,
      deptName: this.props.msg.deptName,
      hourNum: this.props.msg.hourNum,
      hourTime: this.getTime(this.props.msg.hourTime).substring(0, 10),
      id: this.props.msg.id,
      projName: this.props.msg.projName,
      updateTime: this.getTime(this.props.msg.updateTime),
      username: this.props.msg.username,
      changeTime: this.props.msg.hourNum,
    });
  }
  componentWillReceiveProps(props) {
    this.setState({
      avatar: props.msg.avatar,
      checkStatus: props.msg.checkStatus,
      deptName: props.msg.deptName,
      hourNum: props.msg.hourNum,
      hourTime: this.getTime(props.msg.hourTime).substring(0, 10),
      id: props.msg.id,
      projName: props.msg.projName,
      updateTime: this.getTime(props.msg.updateTime),
      username: props.msg.username,
      changeTime: props.msg.hourNum,
    });
  }

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
  passMsg = () => {
    let idList = [];
    idList.push(this.state.id);
    let data = {
      idList: idList,
    };
    passWorkTime(data).then((res) => {
      if (res.data.code == 1) {
        this.setState({
          checkStatus: 2,
        });
        message.info('通过成功');
      } else {
        message.error(res.data.message);
      }
    });
  };
  changeInfo = () => {
    this.setState({
      showChange: true,
    });
  };
  nochange = () => {
    this.setState({
      showChange: false,
    });
  };
  changeTime = (e) => {
    const { value } = e.target;
    const reg = /^\d*?$/;
    console.log((reg.test(value) && value <= 100) || value === '');
    if ((reg.test(value) && value <= 100) || value === '') {
      this.setState({
        changeTime: e.target.value,
      });
    }
  };
  sendTIme = () => {
    if (this.state.changeTime == '') {
      message.error('请输入工时');
      return;
    }
    let data = {
      hourNum: this.state.changeTime,
      id: this.state.id,
    };
    updateHourNum(data).then((res) => {
      if (res.data.code == 1) {
        this.setState({
          hourNum: this.state.changeTime,
          showChange: false,
          checkStatus: 2,
        });
        message.info('修改成功');
        // window.location.reload();
      } else {
        message.info(res.data.message);
      }
    });
  };
  render() {
    return (
      <Fragment>
        {this.state.pList.indexOf('project:hour_time_check:username') > -1 ? (
          <label style={{ width: '100px' }}>
            {' '}
            {this.props.msg.avatar == '' ? (
              <div className="headerPic">{this.props.msg.username[this.props.msg.username.length - 1]}</div>
            ) : (
              <Avatar src={this.props.msg.avatar} />
            )}
            <span className="newUserName">{this.state.username}</span>
          </label>
        ) : (
          <label style={{ width: '100px' }}>-</label>
        )}

        <label style={{ width: '100px' }}>
          {this.state.pList.indexOf('project:hour_time_check:username') > -1 ? this.state.deptName : ''}
        </label>
        <label style={{ width: '100px' }}>
          {this.state.pList.indexOf('project:hour_time_check:projName') > -1 ? this.state.projName : ''}
        </label>
        <label style={{ width: '100px' }}>
          {this.state.pList.indexOf('project:hour_time_check:hourTime') > -1 ? this.state.hourTime : ''}
        </label>

        <label style={{ width: '100px' }} className={!this.state.showChange ? '' : 'hidden'}>
          {this.state.pList.indexOf('project:hour_time_check:hourNum') > -1 ? this.state.hourNum + '%' : ''}
        </label>
        <label style={{ width: '100px' }} className={this.state.showChange ? '' : 'hidden'}>
          {this.state.pList.indexOf('project:hour_time_check:hourNum') > -1 ? (
            <input className="inputN" value={this.state.changeTime} onChange={this.changeTime} />
          ) : (
            ''
          )}
          {this.state.pList.indexOf('project:hour_time_check:hourNum') > -1 ? '%' : ''}
        </label>
        <label style={{ width: '200px' }}>
          {this.state.pList.indexOf('project:hour_time_check:updateTime') > -1 ? this.state.updateTime : ''}
        </label>
        <label style={{ width: '100px' }}>
          {this.state.checkStatus == 0 ? <Tag color="orange">待审核</Tag> : ''}
          {this.state.checkStatus == 1 ? <Tag color="orange">待确认</Tag> : ''}
          {this.state.checkStatus == 2 ? <Tag color="blue">已确认</Tag> : ''}
        </label>
        {this.state.pList.indexOf('project:hour_time_check:operate') > -1 ? (
          <label style={{ width: '100px' }} className={!this.state.showChange ? 'operation' : 'hidden'}>
            <span className={this.state.checkStatus == '1' ? '' : 'hidden'} onClick={this.passMsg}>
              通过
            </span>
            <span className={this.state.checkStatus == 1 ? '' : 'hidden'} onClick={this.changeInfo}>
              修改
            </span>
          </label>
        ) : (
          <label style={{ width: '100px' }} className={!this.state.showChange ? 'operation' : 'hidden'}>
            -
          </label>
        )}
        {this.state.pList.indexOf('project:hour_time_check:operate') > -1 ? (
          <label style={{ width: '100px' }} className={this.state.showChange ? 'operation' : 'hidden'}>
            <span onClick={this.nochange}>取消</span>
            <span onClick={this.sendTIme}>确认</span>
          </label>
        ) : (
          <label style={{ width: '100px' }} className={this.state.showChange ? 'operation' : 'hidden'}></label>
        )}
      </Fragment>
    );
  }
}

export default TimeCheckMsg;
