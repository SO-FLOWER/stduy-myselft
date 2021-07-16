import React, { Component, Fragment } from 'react';
import { findDOMNode } from 'react-dom';
import { DownOutlined } from '@ant-design/icons';
import { Select, Avatar, Button, message, DatePicker, Input, Modal, Tree } from 'antd';
import {
  weeklyLeftMyteam,
  weeklyLeftUnread,
  weeklyLeftMine,
  weeklyLeftAll,
  login,
  getunreadWeeklyList,
  getWeeklyList,
  getunreadCount,
  getmyTeamWeeklyList,
  getmyWeeklyList,
  getWeeklyDetail,
  getMessagePosition,
  userIdLogin,
  getPersonTree,
  getAllDepartment,
  getUserProList,
} from './../../../api/api';
import './index.less';
import Titler from './../../compent/headerTitle/headerTitle';
import WeeklyMsg from './../compontent/weeklyMsg/weeklyMsg';
import { Link } from 'react-router-dom';
import { parseURL } from '../../../utils/index';
import Filter from './../../../img/find.png';
import moment from 'moment';

const dateFormat = 'YYYY-MM-DD';

const { RangePicker } = DatePicker;
const { Option } = Select;
const { Search, TextArea } = Input;
let leftFlage=true;


class Weekly extends Component {
  
  urlParams = {};
  state = {
    name: '刷新',
    buttonName: '点击',
    btnStatus: false,
    weeklyList: [],
    pageNum: 1,
    weeklyStatus: 0, //0 全部 1未读 2 我 3 我的团队
    unreadCount: 0,
    leftPageNum: 1,
    leftList: [],
    projList: [
      {
        projId: 110825651,
        projName: '测试',
      },
    ],
    filterPorJId: '',
    rleftList: [],
    allLeftNum: 0,
    positionWeekly: null,
    pList: [],
    addPerson: false,
    personTree: [],
    allPersonTree: [],
    userIdList: '',
    userIdName: '',
    userIdList1: '',
    userIdName1: '',
    treeData: [],
    treeData1: [],
    flag: false,
    deptName: '',
    deptName1: '',
    deptId: '',
    deptId1: '',
    startTime: '',
    endTime: '',
    showFilter: false,
    leftFlage:true
  };
  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll);
    window.removeEventListener('scroll', this.leftScroll);
  }
  async componentDidMount() {
    this.urlParams = parseURL();
    if (this.urlParams.userId) {
      await userIdLogin(this.urlParams.userId).then((res) => {
        let accessToken = 'Bearer ' + res.data.data.result.accessToken;
        let userMsg = res.data.data.result.userInfoVO;
        let powerList = [];
        console.log(res.data.data.result.menuInfoVOs);
        res.data.data.result.menuInfoVOs.map((val) => {
          powerList.push(val.perms);
          console.log('val:', val.perms);
        });
        // this.props.getPowerList(powerList)
        window.sessionStorage.setItem('accessToken', accessToken);
        window.sessionStorage.setItem('userMsg', JSON.stringify(userMsg));
        window.sessionStorage.setItem('powerList', powerList);
      });
    }
    let pList = window.sessionStorage.getItem('powerList') ? window.sessionStorage.getItem('powerList') : [];

    if (pList.length > 0) {
      pList = pList.split(',');
    }
    this.setState({
      pList: pList,
    });

    document.querySelector(".left1").addEventListener('scroll', this.leftScroll);

    window.addEventListener('scroll', this.handleScroll);
    window.addEventListener(
      'click',
      (e) => {
        const target = e.target;
        if (this.refs.weeklybody === target) {
            this.setState({
              showFilter: false,
            });
        }
      },
      true,
    );

    let data = {};
    data = {
      current: 1,
      size: 5,
    };
    this.getWeeklyList(data);
    getunreadCount().then((res) => {
      if (res.data.code === 1) {
        this.setState({
          unreadCount: res.data.data.result.unreadCount,
        });
      } else {
        message.error(res.data.message);
      }
    });
    let data1 = {
      current: 1,
      size: 15,
    };

    // 获取项目列表
    getUserProList().then((res) => {
      const projList = (res.data.data && res.data.data.rows) || [];
      this.setState({
        projList,
      });
    });

    weeklyLeftAll(data1).then((res) => {
      if (res.data.code == 1) {
        let linshiList = this.state.leftList;
        let leftPageNum = this.state.leftPageNum + 1;
        linshiList.push(...res.data.data.rows);
        let rleftList = this.showLeftList(linshiList);
        this.setState({
          leftList: linshiList,
          rleftList: rleftList,
          allLeftNum: res.data.data.count,
          leftPageNum: leftPageNum,
        });
      }
    });

    if (this.urlParams.weekReportId) {
      if (this.urlParams.commentId && !this.urlParams.currentComment) {
        const reuslt = await getMessagePosition(this.urlParams);
        this.urlParams = {
          ...reuslt,
          ...this.urlParams,
        };
      }
      this.readWeekAndPosition(+this.urlParams.weekReportId);
    }
    getPersonTree().then((res) => {
      if (res.data.code === 1) {
        const personTree = res.data.data.rows;
        this.setState({
          personTree,
          allPersonTree: personTree,
          expandedKeys: [personTree[0].key],
        });
      } else {
        message.error(res.data.message);
      }
    });
    getAllDepartment().then((res) => {
      if (res.data.code == 1) {
        this.setState({
          treeData: res.data.data.rows,
          treeData1: res.data.data.rows,
        });
      } else {
        message.error(res.data.message);
      }
    });
  }

  leftScroll=()=>{
    if(!leftFlage) return;
    let scrollTop = this.refs.leftList.scrollTop;
    let clientHeight = this.refs.leftList.clientHeight;
    let scrollHight = this.refs.leftList.scrollHeight;
    let condition = scrollHight - scrollTop - clientHeight;
    if(leftFlage && condition < 100){
      console.warn("dayin")
      // this.setState({
      //   leftFlage:false
      // })
      leftFlage=false;
      this.getLeftWeeklyList1();
    }
    return;
  }


  showLeftList = (list) => {
    let timeList = [];
    let timeList1 = [];
    list.map((val) => {
      let time = val.reportDate;
      let aaa = time.slice(0, 4) + '年' + time.slice(5, 7) + '月' + time.slice(8, 10) + '日';
      val.reportDate = aaa;

      timeList1.push(aaa);
    });
    timeList1 = [...new Set(timeList1)];
    timeList1.map((val) => {
      let bbb = { date: val };
      timeList.push(bbb);
    });
    timeList.map((val) => {
      val.weekly = [];
      for (let i = 0; i < list.length; i++) {
        if (val.date == list[i].reportDate) {
          val.weekly.push(list[i]);
        }
      }
    });
    return timeList;
  };
  getWeeklyList = (data, status = this.state.weeklyStatus) => {
    switch (status) {
      case 0:
        getWeeklyList(data).then((res) => {
          if (res.data.code == 1) {
            let list = this.state.weeklyList;
            list.push(...res.data.data.rows);
            this.setState({
              weeklyList: list,
            });
          } else {
            message.error(res.data.message);
          }
        });
        break;
      case 1:
        getunreadWeeklyList(data).then((res) => {
          if (res.data.code == 1) {
            let list = this.state.weeklyList;

            list.push(...res.data.data.rows);
            this.setState({
              weeklyList: list,
            });
          } else {
            message.error(res.data.message);
          }
        });
        break;
      case 2:
        getmyWeeklyList(data).then((res) => {
          if (res.data.code == 1) {
            let list = this.state.weeklyList;
            list.push(...res.data.data.rows);
            this.setState({
              weeklyList: list,
            });
          } else {
            message.error(res.data.message);
          }
        });
        break;
      case 3:
        getmyTeamWeeklyList(data).then((res) => {
          if (res.data.code == 1) {
            let list = this.state.weeklyList;
            list.push(...res.data.data.rows);
            this.setState({
              weeklyList: list,
            });
          } else {
            message.error(res.data.message);
          }
        });
        break;
      default:
    }
  };
  getLeftWeeklyList1 = () => {
    let leftPageNum = this.state.leftPageNum + 1;
    this.setState({
      leftPageNum: leftPageNum,
    });
    let data = {
      current: this.state.leftPageNum,
      size: 5,
    };
    data.projId = this.state.filterPorJId;

    this.getLeftWeeklyList(data);
   
  
  };
  getLeftWeeklyList = (data, status = this.state.weeklyStatus) => {
    switch (status) {
      case 0:
        weeklyLeftAll(data).then((res) => {
          if (res.data.code == 1) {
            let linshiList = this.state.leftList;

            linshiList.push(...res.data.data.rows);
            let rleftList = this.showLeftList(linshiList);
            this.setState({
              leftList: linshiList,
              rleftList: rleftList,
              allLeftNum: res.data.data.count,
            });
            // 控制左侧下拉
            leftFlage = true
          }
        });
        break;
      case 1:
        weeklyLeftUnread(data).then((res) => {
          if (res.data.code == 1) {
            let linshiList = this.state.leftList;
            linshiList.push(...res.data.data.rows);
            let rleftList = this.showLeftList(linshiList);

            this.setState({
              leftList: linshiList,
              rleftList: rleftList,
              allLeftNum: res.data.data.count,
            });
            // 控制左侧下拉
            leftFlage = true
          } else {
            message.error(res.data.message);
          }
        });
        break;
      case 2:
        weeklyLeftMine(data).then((res) => {
          if (res.data.code == 1) {
            let linshiList = this.state.leftList;
            linshiList.push(...res.data.data.rows);
            let rleftList = this.showLeftList(linshiList);
            this.setState({
              leftList: linshiList,
              rleftList: rleftList,
              allLeftNum: res.data.data.count,
            });
            // 控制左侧下拉
            leftFlage = true
          } else {
            message.error(res.data.message);
          }
        });
        break;
      case 3:
        weeklyLeftMyteam(data).then((res) => {
          if (res.data.code == 1) {
            let linshiList = this.state.leftList;
            linshiList.push(...res.data.data.rows);
            let rleftList = this.showLeftList(linshiList);
            this.setState({
              leftList: linshiList,
              rleftList: rleftList,
              allLeftNum: res.data.data.count,
            });
            // 控制左侧下拉
            leftFlage = true
          } else {
            message.error(res.data.message);
          }
        });
        break;
      default:
    }
  };

  handleScroll = () => {
    let height = document.body.scrollHeight - window.scrollY - document.documentElement.clientHeight;

    if (height < 100) {
      this.setState({
        pageNum: this.state.pageNum + 1,
      });
      let data = {};
      data = {
        current: this.state.pageNum,
        size: 5,
      };
      if (this.state.userIdList1 != '') {
        data.userIdList = [this.state.userIdList1];
      }
      if (this.state.deptId1 != '') {
        data.deptCodeList = [this.state.deptId1];
      }
      data.projId = this.state.filterPorJId;
      if (this.state.startTime != '') {
        data.startSubmitDate = this.state.startTime;
        data.endSubmitDate = this.state.endTime;
      }
      this.getWeeklyList(data);
      // this.getLeftWeeklyList(data);

    }
  };

  getText = (event) => {
    event.stopPropagation();
    event.nativeEvent.stopImmediatePropagation();

    let textMsg = '';
    var e = event || window.event;
    let citeTextS = {
      top: e.clientY + (document.documentElement.scrollTop || document.body.scrollTop) - 40,
      left: e.clientX + 20,
      display: 'block',
    };
    if (window.getSelection) {
      textMsg = window.getSelection().toString();
    } else if (document.getSelection) {
      textMsg = document.getSelection();
    } else if (document.selection) {
      textMsg = document.selection.createRange().text;
    }
    if (textMsg == '') {
      this.setState({
        citeTextS: {
          top: 0,
          left: 0,
          display: 'none',
        },
      });
    } else {
      this.setState({
        citeTextS: citeTextS,
      });
    }
  };
  login = () => {
    let data = '';

    login(data).then((res) => {
      // this.state.name = 'xinyi'
    });
  };
  getInput = (e) => {
    let value = e.target.value;
    // console.log(value);
    this.setState({
      name: value,
    });
  };
  onChange = (e) => {
    console.log(`checked = ${e.target.checked}`);
  };
  changeStatus = (status) => {
    this.setState({
      positionWeekly: null,
      weeklyStatus: status,
      pageNum: 1,
      weeklyList: [],
      rleftList: [],
      leftList: [],
      leftPageNum: 2,
      userIdList1: '',
      userIdList: '',
      userIdName: '',
      userIdName1: '',
      deptId: '',
      deptId1: '',
      deptName1: '',
      deptName: '',
      startTime: '',
      endTime: '',
    });
    let data = {};
    data = {
      current: 1,
      size: 5,
    };

    if (this.state.userIdList1 != '') {
      data.userIdList = [this.state.userIdList1];
    }
    if (this.state.deptId1 != '') {
      data.deptCodeList = [this.state.deptId1];
    }
    if (this.state.startTime != '') {
      data.startSubmitDate = this.state.startTime;
      data.endSubmitDate = this.state.endTime;
    }

    data.projId = this.state.filterPorJId;

    this.getWeeklyList(data, status);

    this.getLeftWeeklyList(data, status);
  };
  /**
   * 定位周报 用于左侧已读列表点击 / 地址参数获取
   * @param {number} weekId
   */
  readWeekAndPosition = (weekId) => {
    //获取周报详情
    getWeeklyDetail({
      weekReportId: weekId,
    }).then((res) => {
      if (res.data.code === 1) {
        this.setState({
          positionWeekly: {
            urlParams: this.urlParams,
            ...res.data.data.result.reportDetail,
          },
        });
      }
    });
    this.changeReadStatusAndCount(weekId);
    document.body.scrollTop = document.documentElement.scrollTop = 0;
  };
  /**
   * 根据id设置已读和未读数
   * @param {number} weekId
   */
  changeReadStatusAndCount = (weekId) => {
    const rleftList = this.state.rleftList.concat([]);
    let result = null;
    for (let i = 0; i < rleftList.length; i++) {
      for (let j = 0; j < rleftList[i].weekly.length; j++) {
        if (rleftList[i].weekly[j].weekId === weekId) {
          result = rleftList[i].weekly[j];
          break;
        }
      }
      if (result) {
        break;
      }
    }
    if (result && !result.isRead) {
      result.isRead = 1;
      this.setState({
        unreadCount: this.state.unreadCount - 1,
        rleftList,
      });
    }
  };
  //选择人员
  hiddenAddPer = (e) => {
    this.setState({
      addPerson: false,
    });
  };
  ChangePer = () => {
    this.setState({
      addPerson: true,
      personTree: this.state.allPersonTree,
    });
  };
  clicked1 = (id, name, pic, e) => {
    this.setState({ userIdList: id, userIdName: name });
  };
  addPer = () => {
    this.setState({ userIdList1: this.state.userIdList, userIdName1: this.state.userIdName, addPerson: false });
  };
  onSearch1 = (val) => {
    if (val === '') {
      this.setState({
        personTree: this.state.allPersonTree,
      });
      // treeData1 = treeData;
    } else {
      let result = this.getSearch(val, 3);
      console.log('打印下查询到的数据', result);
      if (result.length > 0) {
        // treeData1 = result
        this.setState({
          personTree: result,
        });
      } else {
        // treeData1=[]
        this.setState({
          personTree: [],
        });
      }
    }
  };
  //选择部门
  handleCancel = (e) => {
    this.setState({
      flag: false,
    });
  };
  ChangeDept = () => {
    this.setState({
      flag: true,
      treeData: this.state.treeData1,
    });
  };
  clicked = (id, name, pic, e) => {
    this.setState({ deptId: id, deptName: name });
  };
  handleOk = () => {
    this.setState({ deptId1: this.state.deptId, deptName1: this.state.deptName, flag: false });
  };
  onSearch2 = (val) => {
    if (val === '') {
      this.setState({
        treeData1: this.state.treeData,
      });
      // treeData1 = treeData;
    } else {
      let result = this.getSearch(val, 1);
      console.log('打印下查询到的数据', result);
      if (result.length > 0) {
        // treeData1 = result
        this.setState({
          treeData1: result,
        });
      } else {
        // treeData1=[]
        this.setState({
          treeData1: [],
        });
      }
    }
  };
  getSearch = (name, index) => {
    let data = {};
    if (index == 1) {
      data = this.state.treeData;
    } else if (index == 2) {
    } else if (index == 3) {
      data = this.state.allPersonTree;
    }

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
  getOnChange = (date, dateString) => {
    this.setState({
      endTime: dateString[1],
      startTime: dateString[0],
    });
  };
  filterFind = () => {
    // if (
    //   this.state.userIdName1 == '' &&
    //   this.state.deptName1 == '' &&
    //   this.state.startTime == '' &&
    //   this.state.filterPorJId == ''
    // ) {
    //   this.setState({
    //     showFilter: false,
    //   });
    //   return true;
    // }
    this.setState({
      positionWeekly: null,
      pageNum: 1,
      weeklyList: [],
      rleftList: [],
      leftList: [],
      leftPageNum: 2,
      weeklyStatus: 0,
    });
    let data = {};
    data = {
      current: 1,
      size: 5,
    };
    if (this.state.userIdList1 != '') {
      data.userIdList = [this.state.userIdList1];
    }
    if (this.state.deptId1 != '') {
      data.deptCodeList = [this.state.deptId1];
    }
    if (this.state.startTime != '') {
      data.startSubmitDate = this.state.startTime;
      data.endSubmitDate = this.state.endTime;
    }

    data.projId = this.state.filterPorJId;
    this.getWeeklyList(data, 0);

    this.getLeftWeeklyList(data, 0);
    this.setState({
      showFilter: false,
    });
  };

  filteRest = () => {
    const data = {
      current: 1,
      size: 5,
    };
    this.setState({
      positionWeekly: null,
      pageNum: 1,
      weeklyList: [],
      rleftList: [],
      leftList: [],
      filterPorJId: '',
      leftPageNum: 2,
      userIdName1:"",
      deptName1:"",
      startTime: "",
      endTime: "",
      weeklyStatus: 0,
    });

    this.getWeeklyList(data, 0);

    this.getLeftWeeklyList(data, 0);
    this.setState({
      showFilter: false,
    });
  };

  proSelect = (projId) => {
    this.setState({
      filterPorJId: projId,
    });
  };

  // 查询本人所有周报
  selPersonWeekList=(res)=>{
    // 处理userID,注意setState的异步问题,调用filterFind函数
    res=res.toString();
    console.log(res);
    this.setState({
      userIdList1:res
    },()=>{
      this.filterFind();
    })
  }

  render() {
    const { weeklyList, positionWeekly, weeklyStatus, unreadCount, pageNum, allLeftNum, leftPageNum } = this.state;
    let rleftList = this.state.rleftList.map((val) => {
      return (
        <div className="readList" key={val.date}>
          <div className="timeTag">{val.date}</div>
          <ul>
            {val.weekly.map((val) => {
              return (
                <li
                  key={val.weekId}
                  onClick={() => {
                    this.readWeekAndPosition(val.weekId);
                  }}
                >
                  {val.avatar ? (
                    <Avatar size={20} src={val.avatar} />
                  ) : (
                    <div className="headerIndex">{val.name[val.name.length - 1]}</div>
                  )}

                  <label>{val.name}的周报</label>
                  {val.isRead === 1 ? <b>已读</b> : <b className="underReader">未读</b>}
                </li>
              );
            })}
          </ul>
        </div>
      );
    });

    return (
      <Fragment>
        <div onClick={this.hiddenCite}>
          <Titler />
          <div className="content">
            <div
              className="fff"
              style={{
                width: '1200px',
                height: '188px',
                background: '#F0F3F7',
                position: 'fixed',
                top: '0',
                zIndex: 10,
              }}
            ></div>
            <div className="changeModel" style={{ position: 'fixed', width: '1200px', top: '72px', zIndex: 11 }}>
              <ul>
                {this.state.pList.indexOf('week_report:hall') > -1 ? <li className="active">大厅</li> : ''}

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
                {this.state.pList.indexOf('week_report:count') > -1 ? (
                  <Link to="/weekly/weeklyinfo">
                    <li>周报统计</li>
                  </Link>
                ) : (
                  ''
                )}
              </ul>
              <div>
                <Link to="/weekly/mydata">
                  <Button type="primary"> 填写周报 </Button>
                </Link>
              </div>
            </div>

            <div className="changeMy" style={{ position: 'fixed', width: '1200px', top: '124px', zIndex: 11 }}>
              <div
                onClick={() => this.changeStatus(0)}
                className={weeklyStatus === 0 ? 'active changeBtn' : 'changeBtn'}
              >
                全部
              </div>
              <div
                onClick={() => this.changeStatus(1)}
                className={weeklyStatus === 1 ? 'active changeBtn' : 'changeBtn'}
              >
                未读({unreadCount})
              </div>
              <div
                onClick={() => this.changeStatus(2)}
                className={weeklyStatus === 2 ? 'active changeBtn' : 'changeBtn'}
              >
                我发出的
              </div>
              <div
                onClick={() => this.changeStatus(3)}
                className={weeklyStatus === 3 ? 'active changeBtn' : 'changeBtn'}
              >
                我的团队
              </div>
              <p className="filter" ref="filters" onClick={() => this.setState({ showFilter: !this.state.showFilter })}>
                <img src={Filter} />
                过滤
              </p>
              <div className="showFilter" ref="filters1" hidden={!this.state.showFilter}>
                <div className="filterMsg">
                  <label>姓名</label>
                  <div className="filterInput" onClick={this.ChangePer}>
                    {this.state.userIdName1} <DownOutlined className="filterMsgIcon" />
                  </div>
                </div>
                <div className="filterMsg">
                  <label>所属部门</label>
                  <div className="filterInput" onClick={this.ChangeDept}>
                    {this.state.deptName1} <DownOutlined className="filterMsgIcon" />
                  </div>
                </div>
                <div className="filterMsg">
                  <label>项目选择</label>
                  <div>
                    <Select
                      showSearch
                      style={{ width: 234 }}
                      value={this.state.filterPorJId}
                      optionFilterProp="children"
                      onChange={this.proSelect}
                      dropdownClassName="proSelect"
                    >
                      <Option value="">全部</Option>
                      {this.state.projList.map((item) => {
                        return <Option value={item.projId}>{item.projName}</Option>;
                      })}
                    </Select>
                  </div>
                </div>
                <div className="filterMsg">
                  <label>提交时间</label>
                  <div className="filterInput" style={{ padding: 0 }}>
                    <RangePicker value={this.state.startTime? [moment(this.state.startTime, dateFormat), moment(this.state.endTime, dateFormat)]: []} bordered={false} onChange={this.getOnChange} />
                  </div>
                </div>
                <div className="filterBtn">
                  <div className="rest" onClick={this.filteRest}>
                    重置
                  </div>
                  <div onClick={this.filterFind}>确定</div>
                </div>
              </div>
            </div>

            <div className="box" style={{ marginTop: '124px' }}>
              <div className="left1" ref="leftList">
                {rleftList}
                {/* <div
                  className={allLeftNum + 5 < leftPageNum * 5 ? 'hidden' : 'showMoreL'}
                  onClick={this.getLeftWeeklyList1}
                >
                  查看更多
                </div> */}
              </div>
              <div className="right">
                {positionWeekly && (
                  <WeeklyMsg
                    weekly={positionWeekly}
                    key={positionWeekly.weekId}
                    showAll={true}
                    changeReadStatusAndCount={this.changeReadStatusAndCount}
                  />
                )}
                {weeklyList.map((val, index) => (
                  <WeeklyMsg 
                      weekly={val} 
                      key={val.weekId} 
                      changeReadStatusAndCount={this.changeReadStatusAndCount} 
                      personId={val.userId}
                      selPersonWeekList={this.selPersonWeekList} 
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="model-c"  ref="weeklybody" hidden={!this.state.showFilter}></div>
        <Modal
          ref="filters3"
          width={400}
          title="人员选择"
          visible={this.state.addPerson}
          onCancel={this.hiddenAddPer}
          footer={[
            <Button type="primary" key="confirm" onClick={this.addPer}>
              确定
            </Button>,
            <Button key="cancel" onClick={this.hiddenAddPer}>
              取消
            </Button>,
          ]}
        >
          <div className="border1">
            <Search style={{ marginBottom: 8 }} placeholder="请输入快速搜索" onSearch={this.onSearch1} />
            <Tree
              treeData={this.state.personTree}
              titleRender={(nodeData) => (
                <div className="oprateWrap" key={nodeData.id}>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    {nodeData.type == '1' ? (
                      <span
                        onClick={(event) => this.clicked1(nodeData.userId, nodeData.title, nodeData.avatar, event)}
                        className={` ${this.state.userIdList == nodeData.userId ? 'nocheckedCircle' : 'checkedCircle'}`}
                      ></span>
                    ) : (
                      ''
                    )}
                    <span>{nodeData.title}</span>
                  </div>
                </div>
              )}
            />
          </div>
        </Modal>
        <Modal
          title="所属部门选择 "
          visible={this.state.flag}
          onCancel={this.handleCancel}
          width={400}
          footer={[
            <Button type="primary" key="confirm" onClick={this.handleOk}>
              确定
            </Button>,
            <Button key="cancel" onClick={this.handleCancel}>
              取消
            </Button>,
          ]}
        >
          <div className="border1" ref="filters2">
            <Search style={{ marginBottom: 8 }} placeholder="请输入快速搜索" onSearch={this.onSearch2} />
            <Tree
              treeData={this.state.treeData1}
              titleRender={(nodeData) => (
                <div className="oprateWrap" key={nodeData.id}>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <span
                      onClick={(event) => this.clicked(nodeData.permitCode, nodeData.title)}
                      className={` ${this.state.deptId == nodeData.permitCode ? 'nocheckedCircle' : 'checkedCircle'}`}
                    ></span>
                    <span>{nodeData.title}</span>
                  </div>
                </div>
              )}
            />
          </div>
        </Modal>
      </Fragment>
    );
  }
}
export default Weekly;
