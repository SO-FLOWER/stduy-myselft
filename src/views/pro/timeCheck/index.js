import React, { Component, Fragment } from 'react';
import Praise from './../../../img/praise.png';
import { Select, Button, DatePicker, Pagination, Tag, message, Empty, Table, Checkbox } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { getProjList, getWorkTime, passWorkTime } from '../../../api/api';
import ProAssignedMsg from '../proAssignedMsg/index.js';
import AddProAssignedMsg from '../addProAssignedMsg/index.js';
import './index.less';
import Left from '../compents/leftRouter/index';
import Titler from '../../compent/headerTitle/headerTitle';
import TimeCheckMsg from './timeCheckMsg/index';
const { Option } = Select;

class TimeCheck extends Component {
  state = {
    userName: '',
    pmName: '',
    status: '1',
    allCount: 1,
    page: 1,
    dataList: [],
    NumList: [],
    pList: [],
    showCheckbox: true,
  };

  componentDidMount() {
    let pList = window.sessionStorage.getItem('powerList') ? window.sessionStorage.getItem('powerList') : [];

    if (pList.length > 0) {
      pList = pList.split(',');
    }
    this.setState({
      pList: pList,
    });
    let data = {
      current: 1,
      size: 10,
      checkStatus: this.state.status * 1,
    };

    const timeCheckeds = setTimeout(() => {
      if (window.sessionStorage.getItem('accessToken')) {
        clearTimeout(timeCheckeds);
        getWorkTime(data).then((res) => {
          if (res.data.code == 1) {
            this.setState({
              dataList: res.data.data.rows,
              allCount: res.data.data.count,
              current: 1,
            });
          } else {
            message.error(res.data.message);
          }
        });
      }
    },300);
  }
  handleChange = (value) => {
    this.setState({
      status: value,
    });
  };

  getUserName = (e) => {
    this.setState({
      userName: e.target.value,
    });
  };
  getPmName = (e) => {
    this.setState({
      pmName: e.target.value,
    });
  };

  changePage = (page) => {
    let data = {
      current: page,
      size: 10,
      checkStatus: this.state.status,
      username: this.state.userName,
      projName: this.state.pmName,
    };
    getWorkTime(data).then((res) => {
      if (res.data.code == 1) {
        this.setState({
          dataList: res.data.data.rows,
          allCount: res.data.data.count,
          page: page,
        });
        console.log('换页面', this.state);
      } else {
        message.error(res.data.message);
      }
    });
  };

  onChangeGetCheck = (checkedValues) => {
    this.setState({
      NumList: checkedValues,
    });
  };
  onCheckAllChange = (e) => {
    let a = [];
    for (let i = 0; i < this.state.dataList.length; i++) {
      a.push(i);
    }

    let aaa = e.target.checked ? a : [];
    this.setState({
      NumList: aaa,
    });
  };
  passAll = () => {
    if (this.state.NumList.length == 0) {
      message.error('请选择员工');
      return;
    }
    console.log(this.state.NumList);
    let list = [];
    this.state.NumList.map((val) => {
      if (this.state.dataList[val].checkStatus == 1) {
        list.push(this.state.dataList[val].id);
      }
    });
    let data = {
      idList: [...list],
    };
    passWorkTime(data).then((res) => {
      if (res.data.code == 1) {
        message.info('通过成功');
        window.location.reload();
      } else {
        message.error(res.data.message);
      }
    });
  };
  findPm = () => {
    let data = {
      current: 1,
      size: 10,
      checkStatus: this.state.status * 1,
      username: this.state.userName,
      projName: this.state.pmName,
    };
    getWorkTime(data).then((res) => {
      if (res.data.code == 1) {
        this.setState({
          dataList: res.data.data.rows,

          allCount: res.data.data.count,
          current: 1,
        }).then(() => {
          console.log(123);
        });
      } else {
        message.error(res.data.message);
      }
    });
    if (this.state.status == 1) {
      this.setState({
        showCheckbox: true,
      });
    } else {
      this.setState({
        showCheckbox: false,
      });
    }
  };
  getBox = (e) => {};
  render() {
    let msgList = <Empty />;
    if (this.state.dataList.length > 0) {
      msgList = this.state.dataList.map((val, index) => {
        return (
          <div className="tableMsg">
            {this.state.showCheckbox ? <Checkbox onChange={this.getBox} value={index}></Checkbox> : ''}
            <TimeCheckMsg key={index} msg={val} />
          </div>
        );
      });
    }
    return (
      <Fragment>
        <Titler />
        <div className="content">
          <div className="left">
            <Left />
          </div>

          <div className="right">
            <div className="pmTitle">
              {/* <div> <Button type='primary'>返回</Button><h3>项目名称AAAA</h3></div> */}

              <div className="ib">
                {' '}
                <label>成员姓名:</label> <input type="text" onChange={this.getUserName} style={{ width: '168px' }} />
              </div>
              <div className="ib">
                {' '}
                <label>项目名称:</label> <input type="text" onChange={this.getPmName} style={{ width: '128px' }} />
              </div>
              <div className="ib">
                {' '}
                <label>状态:</label>{' '}
                <Select style={{ width: 128 }} onChange={this.handleChange} value={this.state.status}>
                  <Option value="0">
                    <Tag color="orange">待审核</Tag>
                  </Option>
                  <Option value="1">
                    <Tag color="orange">待确认</Tag>
                  </Option>
                  <Option value="2">
                    <Tag color="blue">已确认</Tag>
                  </Option>
                </Select>
              </div>
              <div className="ib btn">
                <Button type="primary" onClick={this.findPm}>
                  查询
                </Button>
              </div>
            </div>

            <div className="pmContent">
              <div className="addPro">
                {this.state.pList.indexOf('project:hour_time_check:batchThrough') > -1 ? (
                  this.state.showCheckbox ? (
                    <Button onClick={this.passAll} type="primary">
                      批量通过
                    </Button>
                  ) : (
                    ''
                  )
                ) : (
                  ''
                )}
              </div>
              <div className="proTabel">
                <div className="tableHeader">
                  {this.state.showCheckbox ? (
                    <label style={{ position: 'relative', right: '12px' }}>
                      {' '}
                      <Checkbox onChange={this.onCheckAllChange}></Checkbox>
                    </label>
                  ) : (
                    ''
                  )}
                  <label style={{ width: '100px' }}>姓名</label>
                  <label style={{ width: '100px' }}>所属部门</label>
                  <label style={{ width: '100px' }}>项目名称</label>
                  <label style={{ width: '100px' }}>工作日期</label>
                  <label style={{ width: '100px' }}>工作占比</label>
                  <label style={{ width: '200px' }}>提交时间</label>
                  <label style={{ width: '100px', marginLeft: '14px' }}>状态</label>
                  <label style={{ width: '100px' }}>操作</label>
                </div>
                <Checkbox.Group style={{ width: '100%' }} value={this.state.NumList} onChange={this.onChangeGetCheck}>
                  {msgList}
                </Checkbox.Group>

                <div className="page">
                  <Pagination
                    showSizeChanger={false}
                    defaultCurrent={1}
                    total={this.state.allCount}
                    hideOnSinglePage={false}
                    onChange={this.changePage}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </Fragment>
    );
  }
}

export default TimeCheck;
