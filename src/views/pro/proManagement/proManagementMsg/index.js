import React, { Component, Fragment } from 'react';
import { Select, Button, DatePicker, Menu, Dropdown, Tag, Avatar, message, Modal } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import { getCategoryTree, updatePM } from '../../../../api/api';
import moment from 'moment';
import { withRouter } from 'react-router-dom';
import './index.less';
import { Link } from 'react-router-dom';
const { Option } = Select;

const dateFormat = 'YYYY/MM/DD';
// import axios from 'axios';

class ProManagementMsg extends Component {
  constructor(props) {
    super(props);
    this.state = {
      change: false,
      projNum: this.props.msg.projNum,
      projName: this.props.msg.projName,
      deptName: this.props.msg.deptName,
      categoryList: {},
      categoryName: this.props.msg.categoryName,
      avatar: this.props.msg.avatar,
      categoryId: this.props.msg.categoryId,
      id: this.props.msg.id,
      startTime: '',
      endTime: '',
      pmName: this.props.msg.pmName,
      status: this.props.msg.status,
      pList: [],
      showChange: false,
      getstate: 0,
    };
  }

  componentWillUnmount() {}
  componentDidMount() {
    let pList = window.sessionStorage.getItem('powerList') ? window.sessionStorage.getItem('powerList') : [];

    if (pList.length > 0) {
      pList = pList.split(',');
    }
    this.setState({
      pList: pList,
    });

    if (this.props.msg != '') {
      this.getCategoryTree(this.props.msg.deptId);

      let startTime = this.getTime(this.props.msg.startTime);
      let endTime = this.getTime(this.props.msg.endTime);
      this.setState({
        startTime: startTime ? moment(startTime, dateFormat) : '',
        endTime: endTime ? moment(endTime, dateFormat) : '',
      });
    }
  }
  componentWillReceiveProps(props) {
    this.setState({
      projNum: props.msg.projNum,
      projName: props.msg.projName,
      deptName: props.msg.deptName,
      categoryList: {},
      categoryName: props.msg.categoryName,
      avatar: props.msg.avatar,
      categoryId: props.msg.categoryId,
      id: props.msg.id,
      startTime: '',
      endTime: '',
      pmName: props.msg.pmName,
      status: props.msg.status,
    });

    let startTime = this.getTime(props.msg.startTime);
    let endTime = this.getTime(props.msg.endTime);
    this.setState({
      startTime: startTime ? moment(startTime, dateFormat) : '',
      endTime: endTime ? moment(endTime, dateFormat) : '',
    });
  }
  getTime = (time) => {
    if (time) {
      let date = new Date(time);
      let Y = date.getFullYear();
      let M = date.getMonth() + 1;
      let D = date.getDate();

      if (M < 10) {
        M = '0' + M;
      }
      if (D < 10) {
        D = '0' + D;
      }

      return Y + '-' + M + '-' + D;
    } else {
      return '';
    }
  };

  handleChange = (value) => {
    this.setState({
      showChange: true,
      getstate: value,
    });
  };
  getCategoryTree = (id) => {
    id = id ? id : this.state.deptId;
    let data = '368243720';

    getCategoryTree(id).then((res) => {
      if (res.data.code == 1) {
        this.setState({
          categoryList: res.data.data.rows,
        });
      } else {
        message.error(res.data.message);
      }
    });
  };
  getCategoryTree1 = (id) => {
    // id  = id? id : this.state.deptId
    let data = '368243720';

    getCategoryTree(data).then((res) => {
      if (res.data.code == 1) {
        this.setState({
          categoryList: res.data.data.rows,
        });
      } else {
        message.error(res.data.message);
      }
    });
  };

  onChange = (date, dateString) => {
    if (dateString != '') {
      this.setState({
        startTime: moment(dateString, dateFormat),
      });

      let data = {
        id: this.state.id,
        startTime: dateString,
      };
      updatePM(data).then((res) => {
        if (res.data.code == 1) {
          message.info('修改成功');
        } else {
          message.error(res.data.message);
        }
      });
    } else {
      dateString = '1111-11-11';
      let data = {
        id: this.state.id,
        startTime: dateString,
      };
      this.setState({
        startTime: '',
      });

      updatePM(data).then((res) => {
        if (res.data.code == 1) {
          message.info('修改成功');
        } else {
          message.error(res.data.message);
        }
      });
    }
  };
  onChange1 = (date, dateString) => {
    if (dateString != '') {
      this.setState({
        endTime: moment(dateString, dateFormat),
      });

      let data = {
        id: this.state.id,
        endTime: dateString,
      };
      updatePM(data).then((res) => {
        if (res.data.code == 1) {
          message.info('修改成功');
        } else {
          message.error(res.data.message);
        }
      });
    } else {
      dateString = '1111-11-11';
      let data = {
        id: this.state.id,
        endTime: dateString,
      };
      this.setState({
        endTime: '',
      });

      updatePM(data).then((res) => {
        if (res.data.code == 1) {
          message.info('修改成功');
        } else {
          message.error(res.data.message);
        }
      });
    }
  };
  changeProjNum = (e) => {
    this.setState({
      projNum: e.target.value,
    });
  };
  toMembersManagement = () => {};
  toCYGL = () => {
    this.props.history.push({
      pathname: '/project/management/membersManagement',
      query: { id: this.props.msg.id, name: this.props.msg.projName },
    });
  };
  toGSGL = () => {
    // let projdata = { id : this.props.msg.id ,name :this.props.msg.projName }
    let a = this.props.msg.id;
    let b = this.props.msg.projName;
    sessionStorage.setItem('proJdataId', a);
    sessionStorage.setItem('proJdataName', b);
    this.props.history.push({ pathname: '/project/management/gl' });
  };
  toXMFX = () => {
    this.props.history.push({
      pathname: '/project/management/analysis',
      query: { id: this.props.msg.id, name: this.props.msg.projName },
    });
  };
  handleOk = () => {
    let data = {
      id: this.state.id,
      status: this.state.getstate,
    };
    this.setState({
      showChange: false,
    });
    updatePM(data).then((res) => {
      if (res.data.code == 1) {
        message.info('修改成功');
        this.setState({
          status: this.state.getstate,
        });
      } else {
        message.error(res.data.message);
      }
    });
  };
  handleCancel = () => {
    this.setState({
      showChange: false,
    });
  };
  render() {
    const menu = (
      <Menu>
        <Menu.Item key="0">
          <a target="_blank" rel="noopener noreferrer" onClick={this.toCYGL}>
            成员管理
          </a>
        </Menu.Item>
        <Menu.Divider />
        <Menu.Item key="1">
          <a target="_blank" rel="noopener noreferrer" onClick={this.toGSGL}>
            工时管理
          </a>
        </Menu.Item>
        <Menu.Divider />

        {this.state.pList.indexOf('project:manage:analysis') > -1 ? (
          <Menu.Item key="3" onClick={this.toXMFX}>
            项目分析
          </Menu.Item>
        ) : (
          ''
        )}
      </Menu>
    );

    let categoryList = '';
    if (this.state.categoryList.length > 0) {
      categoryList = this.state.categoryList.map((val) => {
        return <Option value={val.id}>{val.categoryName}</Option>;
      });
    }
    return (
      <Fragment>
        <div className="tableMsg" style={{ display: 'flex', justifyContent: 'space-between' }}>
          {/* <label style={{width:'85px'}}>{this.state.pList.indexOf('project:manage:projectCode') > -1?this.state.projNum :'-'}</label> */}
          <label style={{ width: '140px' }}>
            {this.state.pList.indexOf('project:manage:projectName') > -1 ? this.state.projName : '-'}
          </label>
          <label style={{ width: '85px' }}>
            {this.state.pList.indexOf('project:manage:deptName') > -1 ? this.state.deptName : '-'}
          </label>
          <label style={{ width: '85px' }}>
            {this.state.pList.indexOf('project:manage:projectTypeName') > -1 ? this.state.categoryName : '-'}
          </label>
          {this.state.pList.indexOf('project:manage:projectTypeName') > -1 ? (
            <label style={{ width: '112px' }}>
              {this.props.msg.avatar == '' ? (
                <div className="headerPic">{this.state.pmName[this.props.msg.pmName.length - 1]}</div>
              ) : (
                <Avatar src={this.state.avatar} />
              )}
              {this.state.pmName}
            </label>
          ) : (
            <label style={{ width: '112px' }}></label>
          )}

          <label style={{ width: '122px' }}>
            {this.state.pList.indexOf('project:manage:startTime') > -1 ? (
              <DatePicker onChange={this.onChange} value={this.state.startTime} />
            ) : (
              '-'
            )}
          </label>
          <label style={{ width: '122px' }}>
            {' '}
            {this.state.pList.indexOf('project:manage:endTime') > -1 ? (
              <DatePicker onChange={this.onChange1} value={this.state.endTime} />
            ) : (
              '-'
            )}{' '}
          </label>
          <label style={{ width: '92px' }}>
            {this.state.pList.indexOf('project:manage:status') > -1 ? (
              <Select value={this.state.status} style={{ width: 90 }} onChange={this.handleChange}>
                <Option value={0}>
                  <Tag color="blue">进行中</Tag>
                </Option>
                <Option value={1}>
                  <Tag color="red">已暂停</Tag>
                </Option>
                <Option value={2}>
                  <Tag color="orange">已结束</Tag>
                </Option>
                <Option value={3}>
                  <Tag color="green">已归档</Tag>
                </Option>
              </Select>
            ) : (
              '-'
            )}
          </label>
          {this.state.pList.indexOf('project:manage:operate') > -1 ? (
            <label className="operation" style={{ width: '100px' }}>
              {/* <span onClick={this.toCYGL} onChange={this.toMembersManagement}>成员管理</span>
                                                        <span onClick={this.toGSGL}>工时管理</span>
                                                      
                                                        {this.state.pList.indexOf('project:manage:analysis') > -1?
                                                             <span onClick={this.toXMFX}>项目分析</span>: ''} */}
              <Dropdown overlay={menu}>
                <a className="ant-dropdown-link" style={{ color: '#1890FF' }} onClick={(e) => e.preventDefault()}>
                  更多 <DownOutlined />
                </a>
              </Dropdown>
            </label>
          ) : (
            <label className="operation" style={{ width: '100px' }}></label>
          )}
        </div>
        <Modal
          title="提示"
          width={480}
          visible={this.state.showChange}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
        >
          <p>
            请确认是否将项目状态调整为
            {this.state.getstate == 0 ? <Tag color="blue">进行中</Tag> : ''}
            {this.state.getstate == 1 ? <Tag color="red">已暂停</Tag> : ''}
            {this.state.getstate == 2 ? <Tag color="orange">已结束</Tag> : ''}
            {this.state.getstate == 3 ? <Tag color="green">已归档</Tag> : ''}
          </p>
        </Modal>
      </Fragment>
    );
  }
}

export default withRouter(ProManagementMsg);
