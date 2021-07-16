import React, { Component, Fragment } from 'react';
import Praise from './../../../img/praise.png';
import { Select, Button, DatePicker, Pagination, Tag, message, Empty } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { getProjList, getproWorkTime, getDeptPoj } from './../../../api/api';
import ProAssignedMsg from './../proAssignedMsg/index.js';
import AddProAssignedMsg from './../addProAssignedMsg/index.js';
import './index.less';
import Left from './../compents/leftRouter/index';
import Titler from './../../compent/headerTitle/headerTitle';
const { Option } = Select;
// import axios from 'axios';

class ProAssigend extends Component {
  state = {
    pjbName: '',
    pmName: '',
    proAssignedMsg: [],
    proStatus: '',
    pageNum: 1,
    allCount: 0,
    addPm: [],
    pList: [],
    pmList: [],
    categoryId: '',
  };
  componentWillUnmount() {}
  componentDidMount() {
    let that = this;
    let data = {
      current: 1,
      size: 10,
    };
    // getProjList(data).then((res) => {
    //   if (res.data.code == 1) {
    //     this.setState({
    //       proAssignedMsg: res.data.data.rows,
    //       allCount: res.data.data.count,
    //     });
    //   } else {
    //     message.error(res.data.message);
    //   }
    // });
    let pList = window.sessionStorage.getItem('powerList') ? window.sessionStorage.getItem('powerList') : [];

    if (pList.length > 0) {
      pList = pList.split(',');
    }
    this.setState({
      pList: pList,
    });
    getDeptPoj().then((res) => {
      if (res.data.code == 1) {
        let list = res.data.data.rows;

        list.unshift({
          categoryId: null,
          categoryName: '全部',
        });

        this.setState({
          pmList: list,
        });
        // let  jiaofu = false

        const activeList = list.filter((item) => item.delivery);
        const categoryId = activeList[0] ? activeList[0].categoryId : '';
        that.setState({
          categoryId
        });
        getProjList({
          projName: '',
          pmName: '',
          status: '',
          categoryId,
          size: 10,
          current: 1,
        }).then((res) => {
          if (res.data.code == 1) {
            this.setState({
              proAssignedMsg: res.data.data.rows,
              allCount: res.data.data.count,
              addPm: [],
            });
          } else {
            message.error(res.data.message);
          }
        });
      }
    });
  }
  addpm = () => {
    let pmList = this.state.addPm;
    pmList.unshift({ newOne: true });
    console.log(pmList);
    this.setState({
      addPm: [{ newOne: true }],
    });
  };
  handleChange = (value) => {
    this.setState({
      proStatus: value,
    });
  };

  getProName = (e) => {
    this.setState({
      pjbName: e.target.value,
    });
  };
  getPmName = (e) => {
    this.setState({
      pmName: e.target.value,
    });
  };

  findPm = () => {
    let data = {
      projName: this.state.pjbName,
      pmName: this.state.pmName,
      status: this.state.proStatus,
      categoryId: this.state.categoryId,
      size: 10,
      current: 1,
    };
    getProjList(data).then((res) => {
      if (res.data.code == 1) {
        this.setState({
          proAssignedMsg: res.data.data.rows,
          allCount: res.data.data.count,
          addPm: [],
        });
      } else {
        message.error(res.data.message);
      }
    });
  };
  changePage = (page) => {
    let data = {
      projName: this.state.pjbName,
      pmName: this.state.pmName,
      status: this.state.proStatus,
      categoryId: this.state.categoryId,
      size: 10,
      current: page,
    };

    getProjList(data).then((res) => {
      if (res.data.code == 1) {
        this.setState({
          proAssignedMsg: res.data.data.rows,
          allCount: res.data.data.count,
          pageNum: page,
        });
      } else {
        message.error(res.data.message);
      }
    });
  };
  changeCategoryId = (value) => {
    this.setState({
      categoryId: value,
    });
  };
  render() {
    let msgList = <Empty />;
    let addPm = '';
    let pmList = '';
    if (this.state.pmList.length > 0) {
      pmList = this.state.pmList.map((val) => {
        return <Option value={val.categoryId}>{val.categoryName}</Option>;
      });
    }
    if (this.state.proAssignedMsg) {
      msgList = this.state.proAssignedMsg.map((val, index) => {
        return <ProAssignedMsg msg={val} id={index} />;
      });
    }
    if (this.state.addPm.length > 0) {
      addPm = this.state.addPm.map((val, index) => {
        return <AddProAssignedMsg msg={val} />;
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
              <div className="ib">
                {' '}
                <label>项目名称:</label> <input type="text" onChange={this.getProName} style={{ width: '168px' }} />
              </div>
              <div className="ib">
                {' '}
                <label>项目类别:</label>{' '}
                <Select style={{ width: 140 }} value={this.state.categoryId || null} onChange={this.changeCategoryId}>
                  {pmList}
                </Select>
              </div>
              <div className="ib">
                {' '}
                <label>项目经理:</label> <input type="text" onChange={this.getPmName} style={{ width: '128px' }} />
              </div>
              <div className="ib">
                {' '}
                <label>状态:</label>{' '}
                <Select style={{ width: 128 }} onChange={this.handleChange}>
                  <Option value="0">
                    <Tag color="blue">进行中</Tag>
                  </Option>
                  <Option value="1">
                    <Tag color="red">已暂停</Tag>
                  </Option>
                  <Option value="2">
                    <Tag color="orange">已结束</Tag>
                  </Option>
                  <Option value="3">
                    <Tag color="green">已归档</Tag>
                  </Option>
                </Select>
              </div>
              {/* {this.state.jiaofu} */}
              <div className="ib btn">
                <Button type="primary" onClick={this.findPm}>
                  查询
                </Button>
              </div>
            </div>

            <div className="pmContent">
              <div className="addPro">
                {this.state.pList.indexOf('project:assign:createProject') > -1 ? (
                  <Button icon={<PlusOutlined />} onClick={this.addpm} type="primary">
                    创建项目
                  </Button>
                ) : (
                  '-'
                )}
              </div>
              <div className="proTabel">
                <div className="tableHeader" style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <label style={{ width: '200px' }}>项目名称</label>
                  <label style={{ width: '216px' }}>所属部门</label>
                  <label style={{ width: '83px' }}>项目类别</label>
                  <label style={{ width: '116px' }}>项目经理</label>
                  <label style={{ width: '126px' }}>开始时间</label>
                  <label style={{ width: '126px' }}>结束时间</label>
                  <label style={{ width: '96px' }}>状态</label>
                  <label style={{ width: '100px' }}>操作</label>
                </div>
                {addPm}
                {msgList}

                <div className="page">
                  <Pagination
                    total={this.state.allCount}
                    current={this.state.pageNum}
                    showSizeChanger={false}
                    hideOnSinglePage={true}
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

export default ProAssigend;
