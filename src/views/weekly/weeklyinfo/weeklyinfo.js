import React, { Component, Fragment } from 'react';
import imgURL from './../../../img/logo.png';
import { message, Button, Select, Tooltip, Table, Tag, Space, Pagination, Modal, Tree, Input } from 'antd';
import { UserOutlined, CaretLeftOutlined, CaretRightOutlined, DownOutlined } from '@ant-design/icons';
import {
  getAllDepartment,
  callAll,
  downWeekly,
  getSubmitRecordApi,
  submitRecordStatisticsApi,
} from './../../../api/api';
import './weeklyinfo.less';
import Titler from './../../compent/headerTitle/headerTitle';
import { Link } from 'react-router-dom';
// import axios from 'axios';
const { Search, TextArea } = Input;
const { Option } = Select;
const columns = [
  {
    title: '成员姓名',
    dataIndex: 'username',
    key: 'username',
    render: (text) => <a>{text}</a>,
  },
  {
    title: '所属部门',
    dataIndex: 'deptName',
    key: 'deptName',
  },
  {
    title: '周报日期',
    dataIndex: 'weekReportDate',
    key: 'weekReportDate',
  },

  {
    title: '提交状态',
    key: 'submit',
    dataIndex: 'submit',
    render: (submit) => (
      <>
        {submit ? (
          <Tag color={'geekblue'} key={submit}>
            已提交
          </Tag>
        ) : (
          <Tag color={'red'} key={submit}>
            未提交
          </Tag>
        )}
      </>
    ),
  },
  {
    title: '提交时间',
    dataIndex: 'submitDate',
    key: 'submitDate',
  },
];

// let departmentList = []

class WeeklyInfo extends Component {
  constructor() {
    super();
  }
  state = {
    name: '刷新',
    buttonName: '点击',
    btnStatus: false,
    departmentList: [],
    deptId: '',
    deptId1: '',
    deptName: '',
    deptName1: '',
    departmentList1: [],
    weekOffset: 0,
    weeklyInfo: '',
    submitPercent: 0, //提交百分比
    weekOffset: 0, //周偏移量
    weeklyList: [],
    pageNum: 1,
    pageCount: 1,
    pList: [],
    flag: false,
    weelyTip: false,
  };
  componentDidMount() {
    let pList = window.sessionStorage.getItem('powerList') ? window.sessionStorage.getItem('powerList') : [];

    if (pList.length > 0) {
      pList = pList.split(',');
    }
    this.setState({
      pList: pList,
    });
    getAllDepartment().then((res) => {
      let departmentList = res.data.data.rows;
      this.setState({
        departmentList,
        departmentList1: departmentList,
        deptId: res.data.data.rows[0].id,
        deptName: res.data.data.rows[0].name,
        deptId1: res.data.data.rows[0].id,
        deptName1: res.data.data.rows[0].name,
      });
      let data = {
        current: 1,
        deptId: this.state.deptId,
        size: 10,
        weekOffset: this.state.weekOffset,
      };
      let data1 = {
        deptId: this.state.deptId,
        weekOffset: this.state.weekOffset,
      };
      this.getSubmitRecord(data);
      this.getsubmitRecordStatistics(data1);
      // this.getName(res.data.data.rows)
    });
  }

  changeWeek = (add) => {
    if (this.state.weekOffset + add >= 0) {
      this.setState({
        weekOffset: this.state.weekOffset + add,
        pageNum: 1,
      });
      let data = {
        current: 1,
        deptId: this.state.deptId,
        size: 10,
        weekOffset: this.state.weekOffset + add,
      };
      let data1 = {
        deptId: this.state.deptId,
        weekOffset: this.state.weekOffset + add,
      };
      this.getSubmitRecord(data);
      this.getsubmitRecordStatistics(data1);
    }
  };
  downWeekly = () => {
    let deptId = this.state.deptId ? this.state.deptId : this.state.departmentList[0].deptId;
    let weekOffset = this.state.weekOffset;
    downWeekly(deptId, weekOffset)
      .then((res) => {
        let fileName = '周报统计.xlsx';
        let blob = new Blob([res.data], { type: 'application/x-xls' });
        if (window.navigator.msSaveOrOpenBlob) {
          //兼容 IE & EDGE
          navigator.msSaveBlob(blob, fileName);
        } else {
          var link = document.createElement('a');
          // 兼容不同浏览器的URL对象
          const url = window.URL || window.webkitURL || window.moxURL;
          // 创建下载链接
          link.href = url.createObjectURL(blob);
          //命名下载名称
          link.download = fileName;
          //点击触发下载
          link.click();
          //下载完成进行释放
          url.revokeObjectURL(link.href);
        }
      })
      .catch((res) => {
        message.info(123);
      });
  };
  callAll = () => {
    this.setState({ weelyTip: true });
  };
  onWeeklyTip = () => {
    let deptId = this.state.deptId ? this.state.deptId : this.state.departmentList[0].deptId;
    let data = {
      deptId: deptId,
    };
    callAll(data).then((res) => {
      if (res.data.code == 1) {
        this.setState({ weelyTip: false });
        message.info('提醒成功');
      } else {
        message.error('提醒失败');
      }
    });
  };
  getName = (list) => {
    if (list.length > 0) {
      list.map((val) => {
        let dataList = {
          name: val.name,
          deptId: val.id,
        };
        let departmentList = this.state.departmentList;
        departmentList.push(dataList);
        this.setState({
          departmentList: departmentList,
        });
        let list = val.children;
        return this.getName(list);
      });
    } else {
      // console.log(departmentList);
      return;
    }
  };

  handleChange = () => {
    let value = this.state.deptId1;
    this.setState({
      deptId: value,
      pageNum: 1,
    });
    let data = {
      current: 1,
      deptId: value,
      size: 10,
      weekOffset: this.state.weekOffset,
    };
    let data1 = {
      deptId: value,
      weekOffset: this.state.weekOffset,
    };
    this.getSubmitRecord(data);
    this.getsubmitRecordStatistics(data1);
    this.setState({
      flag: false,
      deptName: this.state.deptName1,
    });
  };
  getSubmitRecord = (data) => {
    getSubmitRecordApi(data).then((res) => {
      if (res.data.code == 1) {
        this.setState({
          weeklyList: res.data.data.rows,
          pageCount: res.data.data.count,
        });
      }
    });
  };

  getsubmitRecordStatistics = (data) => {
    // let data = {
    //   deptId:id,
    //   weekOffset :this.state.weekOffset
    // }
    submitRecordStatisticsApi(data).then((res) => {
      this.setState({
        weeklyInfo: `已提交: ${res.data.data.result.submitCount} / ${res.data.data.result.totalCount} ${res.data.data.result.submitPercent}%`,
        submitPercent: res.data.data.result.submitPercent,
      });
    });
  };

  getInput = (e) => {
    let value = e.target.value;
    // console.log(value);
    this.setState({
      name: value,
    });
  };
  getPage = (page) => {
    console.log(page);
    this.setState({
      pageNum: page,
    });
    let data = {
      current: page,
      deptId: this.state.deptId,
      size: 10,
      weekOffset: this.state.weekOffset,
    };
    this.getSubmitRecord(data);
  };
  showTip = () => {
    this.setState({
      flag: true,
      departmentList: this.state.departmentList1,
    });
  };
  handleCancel = () => {
    this.setState({
      flag: false,
    });
  };
  gethandleChange1 = (a, b) => {
    console.log(a, b);
    this.setState({
      deptName1: b,
      deptId1: a,
    });
  };

  onSearch1 = (val) => {
    console.log(val);
    if (val === '') {
      this.setState({
        departmentList: this.state.departmentList1,
      });
      // treeData1 = treeData;
    } else {
      let result = this.getSearch(val);
      if (result.length > 0) {
        // treeData1 = result
        this.setState({
          departmentList: result,
        });
      } else {
        // treeData1=[]
        this.setState({
          departmentList: [],
        });
      }
    }
  };
  getSearch = (name) => {
    let data = this.state.departmentList1;

    var hasFound = false, // 表示是否有找到id值
      result = null;
    let resultdata = [];
    let key = [];
    var fn = function (data) {
      if (Array.isArray(data) && !hasFound) {
        // 判断是否是数组并且没有的情况下，
        data.forEach((item) => {
          if (item.title.indexOf(name) != -1) {
            // 数据循环每个子项，并且判断子项下边是否有id值
            result = item; // 返回的结果等于每一项
            if (key.indexOf(result.key) == -1) {
              resultdata.push(result);
              key.push(result.key);
            }
            // hasFound = true; // 并且找到id值
          } else if (item.children) {
            fn(item.children); // 递归调用下边的子项
          }
        });
      }
    };
    fn(data); // 调用一下
    return resultdata;
  };
  render() {
    let department;

    // console.log(123)
    department = this.state.departmentList.map((val) => {
      return <Option value={val.deptId}>{val.name}</Option>;
    });

    return (
      <Fragment>
        <Titler />
        <div className="content">
          <div className="changeModel">
            <ul>
              {this.state.pList.indexOf('week_report:hall') > -1 ? (
                <Link to="/weekly">
                  {' '}
                  <li>大厅</li>
                </Link>
              ) : (
                ''
              )}

              {this.state.pList.indexOf('week_report:mine') > -1 ? (
                <Link to="/weekly/mydata">
                  <li>我的</li>
                </Link>
              ) : (
                ''
              )}
              {this.state.pList.indexOf('week_report:call_me') > -1 ? (
                <Link to="/weekly/my">
                  <li>@我</li>
                </Link>
              ) : (
                ''
              )}
              {this.state.pList.indexOf('week_report:count') > -1 ? <li className="active">周报统计</li> : ''}
            </ul>
            <div>
              <Link to="/weekly/mydata">
                <Button type="primary"> 填写周报 </Button>
              </Link>
            </div>
          </div>

          <div className="msg">
            <div className="weeklyInfoKind">
              <div className="changeKind">
                <label>人员所属部门：</label>
                <div className="getName" onClick={this.showTip}>
                  {/* <Select
                 showSearch
                placeholder={this.state.deptName}
                filterOption={(input, option) =>
                 option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
               }
                 style={{ width: 240 }}
                  onChange={this.handleChange}>
                  {department}
                </Select> */}
                  {this.state.deptName}
                  <DownOutlined style={{ float: 'right', marginTop: '8px', marginRight: '10px' }} />
                </div>
                {/* <div className='kind'> 
                                <Select 
                                showSearch
                                // value={this.state.deptId} 
                                style={{ width: 240 }} 
                                onChange={this.handleChange}
                                 placeholder={this.state.deptName}
                                 filterOption={(input, option) =>
                                  option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                }
                                 > 
 
                                      {department}
                                </Select>
                                </div> */}
              </div>
              <div>
                <Space>
                  {' '}
                  <Button type="primary" ghost onClick={this.callAll}>
                    一键提醒
                  </Button>
                  <Button type="primary" onClick={this.downWeekly} ghost>
                    导出历史数据
                  </Button>
                </Space>
              </div>
            </div>

            <div className="weeklyProgress">
              <h3>本周提交进度</h3>
              <div className="progress">
                <label onClick={() => this.changeWeek(1)}>
                  {' '}
                  <CaretLeftOutlined />
                  上周
                </label>
                <div className="progressBar">
                  <div>
                    <Tooltip title={this.state.weeklyInfo} color="#108ee9" placement="topRight" key="#108ee9">
                      <div
                        className="realyProgress"
                        style={{ width: this.state.submitPercent + '%', height: '32px' }}
                      ></div>
                    </Tooltip>
                  </div>
                </div>
                <label className={this.state.weekOffset == 0 ? 'cantClick' : ''} onClick={() => this.changeWeek(-1)}>
                  {' '}
                  下周 <CaretRightOutlined />
                </label>
              </div>

              <h3>人员周报明细</h3>
              <div>
                <Table columns={columns} dataSource={this.state.weeklyList} pagination={false} />
              </div>
              <div className="pageStyle">
                {' '}
                <Pagination
                  current={this.state.pageNum}
                  total={this.state.pageCount}
                  hideOnSinglePage={true}
                  onChange={this.getPage}
                  showSizeChanger={false}
                />
              </div>
            </div>
          </div>
        </div>
        <Modal
          title="所属部门选择"
          visible={this.state.flag}
          onCancel={this.handleCancel}
          width={400}
          footer={[
            <Button type="primary" key="confirm" onClick={this.handleChange}>
              确定
            </Button>,
            <Button key="cancel" onClick={this.handleCancel}>
              取消
            </Button>,
          ]}
        >
          <div className="border1">
            <Search
              style={{ marginBottom: 8 }}
              placeholder="请输入快速搜索"
              // onChange={this.inputNull}
              onSearch={this.onSearch1}
            />
            <Tree
              onExpand={this.onExpand}
              treeData={this.state.departmentList}
              titleRender={(nodeData) => (
                <div className="oprateWrap" key={nodeData.id}>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <span
                      onClick={(event) => this.gethandleChange1(nodeData.id, nodeData.title)}
                      className={` ${this.state.deptId1 == nodeData.id ? 'nocheckedCircle' : 'checkedCircle'}`}
                    ></span>
                    {/* <input style={{marginRight:'5px'}} type="radio"
                                         
                                           className={` ${this.state.currentIndex== nodeData.id? 'dispalyClass1' : 'noneClass2'}`}
                                              value={nodeData.id} name="cheakRadios"/> */}

                    <span>{nodeData.title}</span>
                  </div>
                </div>
              )}
            />
          </div>
        </Modal>
        <Modal
          title="提示"
          width={480}
          visible={this.state.weelyTip}
          onOk={this.onWeeklyTip}
          onCancel={() => {
            this.setState({ weelyTip: false });
          }}
        >
          <p>确定发起周报一键提醒?</p>
        </Modal>
      </Fragment>
    );
  }
}

export default WeeklyInfo;
