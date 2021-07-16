/*
 * @Description: file content
 * @Author: 琚志强 1020814597
 * @Date: 2021-02-06 17:49:30
 * @LastEditors: 琚志强
 * @LastEditTime: 2021-03-17 15:53:34
 */
import React, { Component, Fragment } from 'react';
import Titler from '../../compent/headerTitle/headerTitle';
import Nav from '../nav/index.js';
import 'moment/locale/zh-cn';
import locale from 'antd/lib/locale/zh_CN';
import {
  Tree,
  Select,
  Input,
  Avatar,
  Tag,
  Button,
  Radio,
  Modal,
  Switch,
  message,
  ConfigProvider,
  DatePicker,
  TimePicker,
} from 'antd';
import { CloseCircleFilled, CloseOutlined, PlusOutlined } from '@ant-design/icons';
import {
  copyUserList,
  getRemindTime,
  getPersonTree,
  addcopyUser,
  RemindTime,
  submitTime,
  endsubmitTime,
  delcopyUser,
  getDepartmentList,
  getRemindScope,
  updateRemindScope,
  getTreeDeptById,
  getMakeUpDate,
  getCanMakeUpDate,
  makeUp,
} from './../../../api/api';
import './weekreportConfig.less';
import moment from 'moment';
import DepartList from '../departList/index.js'; //项目类别
import itemCategory from '../itemCategory/itemCategory';
const format = 'HH:mm';
const { TreeNode } = Tree;
const { Search } = Input;
const { RangePicker } = DatePicker;
const { Option } = Select;
const dateFormat = 'YYYY/MM/DD';
let newremindTimeList = [
  {
    dayOfWeek: 5,
    remindTime: '16:30',
  },
  {
    dayOfWeek: 6,
    remindTime: '',
  },
];
class weekreportConfig extends Component {
  constructor(props) {
    super(props);
    this.state = {
      page: this.props.msg,
      addPerson: false,
      imgList: [],
      personTree: [],
      expandedKeys: [], //展开节点（受控）
      autoExpandParent: true, //是否自动展开父节点
      checkedKeys: [], //（受控）选中复选框的树节点（受控）选中复选框的树节点
      selectedKeys: [], //	（受控）设置选中的树节点
      chaosongPerson: [],
      checkStrictly: false,
      deptId: '', //部门ID
      endTime: '', //周报截至时间
      defaultdayOfWeekStart: '', //提醒时间默认值（周）
      defaultdayOfWeekend: '', //提醒时间默认值（周）
      endDayOfWeekName: '',
      endDayOfWeekVal: '', //周报截至事件（星期选select）
      treeData: [],
      treeData1: [],
      alldata: [],
      chooseData: [],
      chooseName: [], //选中框的列表
      endDayOfWeekList: [
        { key: 1, text: '星期一' },
        { key: 2, text: '星期二' },
        { key: 3, text: '星期三' },
        { key: 4, text: '星期四' },
        { key: 5, text: '星期五' },
        { key: 6, text: '星期六' },
        { key: 7, text: '星期日' },
      ], //周报截至周
      chaosongList: [], //头像抄送
      endDayOfWeek: '', //周报截至周
      remindWeekName1: '', //
      remindWeekName2: '', //
      endTimer: undefined,
      remindTimeList: [
        {
          dayOfWeek: 5,
          remindTime: '16:30',
        },
        {
          dayOfWeek: 6,
          remindTime: '',
        },
      ],
      weeklyRange: [],
      flag: false,
      detData: [],
      detData1: [],
      isMarkUp: false,
      markUpVal: null,
      markUpList: [],
    };
  }

  componentWillUnmount() {}
  week = (data) => {};
  inputNull = () => {
    this.setState({
      findlist: [],
    });
  };

  handleCancel = () => {
    this.setState({ flag: false });
  };

  //添加周报提醒范围标签
  handleOk = () => {
    this.setState({
      flag: false,
    });
    const DATA = this.state.weeklyRange;
    let submitD = [];
    DATA.forEach((item) => {
      submitD.push(item.deptId);
    });

    updateRemindScope({
      deptId: this.state.deptId,
      remindDeptIdList: [...submitD, this.state.currentIndex],
    }).then((res) => {
      message.success('添加成功');
      this.setState({
        weeklyRange: [
          ...DATA,
          {
            deptId: this.state.currentIndex,
            deptName: this.state.deptName1,
            id: 0,
          },
        ],
      });
    });
  };

  onSearch1 = (val) => {
    if (val === '') {
      this.setState({
        detData: this.state.treeData1,
      });
    } else {
      let result = this.getSearch(val, 1);
      this.setState({
        detData: result.length > 0 ? result : [],
      });
    }
  };

  clicked = (id, name, e) => {
    console.log('获取点击的id', id, name);
    this.setState({ currentIndex: id, deptName1: name });
  };

  findPerson = (list, name) => {
    if (list.length > 0) {
      list.map((val) => {
        if (val.title == name) {
          let findlist = this.state.findlist;
          findlist.push(val.key);
          this.setState({
            findlist: findlist,
          });
        }
        this.findPerson(val.children, name);
      });
    }
  };
  delectChaosongSend = (id) => {
    delcopyUser({
      deptId: this.state.deptId,
      userId: id,
    }).then((res) => {
      if (res.data.code == 1) {
        message.success('删除成功');
        this.comon(this.state.deptId); // 操作dom执行局部刷新
      } else {
        message.error('删除失败!');
      }
    });
  };
  // 1、在这里中声明一个函数，用于接收子组件的传值
  message = (msg) => {
    // 通过形参接受到子组件的值并打印到控制台
    this.setState({ deptId: msg.deptId });
    this.comon(msg.deptId);
  };
  renderTreeNodes = (data) =>
    data.map((item) => {
      if (item.children) {
        return (
          <TreeNode title={item.title} key={item.key} dataRef={item}>
            {this.renderTreeNodes(item.children)}
          </TreeNode>
        );
      }
      return <TreeNode key={item.key} {...item} />;
    });
  showAddPer = () => {
    this.setState({
      addPerson: true,
    });
  };
  changeList = (list) => {
    if (list.length > 0) {
      for (let i = 0; i < list.length; i++) {
        let linshi = {
          title: list[i].name,
          key: list[i].id.toString(),
          children: list[i].children,
          // icon: ({ true}) => (selected ? <FrownFilled /> : <FrownOutlined />)
        };
        list[i] = linshi;
        this.changeList(list[i].children);
      }
    }
  };
  hiddenAddPer = (e) => {
    this.setState({ addPerson: false });
  };
  handleChange = (value, type) => {
    this.defaultweekName(value, type);
    let newarr = this.state.remindTimeList;
    if (type == 'week1') {
      this.setState({ endDayOfWeekVal: value }, () => {}); //设置选取的下拉框的值
      this.getendsubmitTime(this.state.endTime, value);
    } else if (type == 'week2') {
      newarr[0].dayOfWeek = value;
      this.updateRemindTime(newarr); // updateRemindTime
    } else {
      newarr[1].dayOfWeek = value;
      this.updateRemindTime(newarr); // updateRemindTime
    }

    // dayOfWeek
  };
  //	展开/收起节点时触发
  onExpand = (expandedKeys) => {
    this.setState({
      expandedKeys,
      autoExpandParent: false,
    });
  };
  addChaosongPerson = (list, id, a) => {
    if (list.length > 0) {
      list.map((val) => {
        if (val.id == id) {
          a.push(val);
          this.setState({
            chaosongPerson: a,
          });
        }
        this.addChaosongPerson(val.children, id, a);
      });
    }
  };
  //点击复选框触发
  onCheck = (checkedKeys, info) => {
    console.log(checkedKeys, info);
    let chooseData = [];
    let chooseData2 = [];
    info.checkedNodes.forEach((e) => {
      e.type == 1 && chooseData.push(e.key);
      e.type == 1 && chooseData2.push(e);
    });
    console.log(this.state.treeData);
    console.log('chooseData', chooseData);
    this.setState({ checkedKeys: chooseData, chooseName: chooseData2 });
    this.setState({ chooseData: chooseData }, () => {});
  };
  //点击树节点触发
  onSelect = (selectedKeys, info) => {
    this.setState({ selectedKeys });
  };
  addPer = (e) => {
    console.log('点击确定', this.state.chooseName);
    this.setState({
      addPerson: false,
    });
    let userList = [];
    this.state.chooseName.map((val, index) => {
      userList.push({
        userId: val.userId,
        username: val.name,
      });
    });
    let copyData = {
      deptId: this.state.deptId,
      userList: userList,
    };
    if (userList.length > 0) {
      addcopyUser(copyData).then((res) => {
        if (res.data.code == 1) {
          message.success('添加成功');
          this.comon(this.state.deptId);
        } else {
          message.error(res.data.message);
        }
      });
    }
  };
  componentDidMount() {
    getDepartmentList().then((res) => {
      if (res.data.code == 1) {
        if (res.data.data.rows[0]) {
          this.setState({ deptId: res.data.data.rows[0].id });
          this.comon(res.data.data.rows[0].id);
        }
      }
    });
    // this.week()
    getPersonTree().then((res) => {
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
  componentWillReceiveProps(nextProps) {}
  //  获取周报提醒范围
  getWeeklyRange = (id) => {
    getRemindScope(id).then((res) => {
      this.setState({
        weeklyRange: res.rows,
      });
    });
  };
  comon = (id) => {
    this.getWeeklyRange(id);

    // 获取当前周报补交状态
    getMakeUpDate(id).then((res) => {
      const DATA = res.result;
      this.setState({
        isMarkUp: !!DATA.active,
        markUpVal: DATA.startDate === null ? DATA.startDate : `${DATA.startDate} 至 ${DATA.endDate}`,
      });
    });

    // 获取周报可补交列表
    getCanMakeUpDate().then((res) => {
      this.setState({
        markUpList: res.rows,
      });
    });

    getTreeDeptById(id).then((res) => {
      this.setState({
        detData: res.data.data.rows,
        detData1: res.data.data.rows,
      });
    });
    copyUserList(id).then((res) => {
      if (res.data.code == 1) {
        this.setState({ imgList: res.data.data.rows });
      }
    });
    // this.setState({deptId:id})
    getRemindTime(id).then((res) => {
      //获取周报提醒时间
      console.log('获取周报提醒时间', res);
      if (res.data.code == 1) {
        if (res.data.data.result.remindTimeList.length > 0) {
          let remindTimeList = res.data.data.result.remindTimeList;
          if (remindTimeList.length > 1) {
            if (remindTimeList[1].remindTime == '') {
              this.setState({ remindTimeList: remindTimeList, endTimer: undefined });
            } else {
              this.setState({ remindTimeList: remindTimeList, endTimer: remindTimeList[1].remindTime });
            }
          } else {
            this.setState({ remindTimeList: newremindTimeList, endTimer: undefined });
          }
        } else {
          this.setState({
            remindTimeList: [
              {
                dayOfWeek: 4,
                remindTime: '',
              },
              {
                dayOfWeek: 6,
                remindTime: '',
              },
            ],
          });
        }
      }
    });
    submitTime(id).then((res) => {
      //获取周报截至时间
      if (res.data.code == 1) {
        this.setState({
          endTime: res.data.data.result.endTime,
          endDayOfWeek: res.data.data.result.endDayOfWeek,
        });
        this.defaultweekName(res.data.data.result.endDayOfWeek);
      }
    });
  };
  defaultweekName = (value, type) => {
    //修改下拉框选中的周时间
    let endDayOfWeekName = '';
    this.state.endDayOfWeekList.map((val, text) => {
      if (val.key == value) {
        endDayOfWeekName = val.text;
      }
    });
    if (type == 'week2') {
      this.setState({ remindWeekName1: endDayOfWeekName });
    } else if (type == 'week3') {
      this.setState({ remindWeekName2: endDayOfWeekName });
    } else {
      this.setState({ endDayOfWeekName: endDayOfWeekName });
    }
  };
  delectChaosong = (index, info) => {
    let data = this.state.chooseData.concat([]);
    data.splice(index, 1);
    let chooseName = this.state.chooseName.concat([]);
    chooseName.splice(index, 1);
    console.log('data', this.state.chooseName);
    this.setState({ chooseData: data, chooseName: chooseName }, () => {});
  };
  onChangeTime = (value, dateString) => {
    if (value == null) {
      this.setState({ endTimer: undefined }, () => {
        this.onOk('', 'remindTime2');
      });
    }
  };
  getendsubmitTime = (value, endDayOfWeek, type) => {
    //修改截至时间
    endsubmitTime({
      deptId: this.state.deptId,
      endDayOfWeek: endDayOfWeek,
      endTime: value,
    }).then((res) => {
      if (res.data.code == 1) {
        message.success('修改时间成功');
      } else {
        message.error('修改时间失败!');
      }
    });
  };
  onOk = (value, type) => {
    if (value != '') {
      value = moment(value).format('HH:mm');
    }
    let copyTimeList = this.state.remindTimeList;
    this.setState({ endTime: value });
    copyTimeList[1].remindTime = value;
    this.setState(
      {
        remindTimeList: copyTimeList,
      },
      () => {},
    );
    this.updateRemindTime(this.state.remindTimeList);
  };
  // 修改周报提醒时间
  updateRemindTime(value) {
    RemindTime({
      //修改提醒时间
      deptId: this.state.deptId,
      remindTimeList: value,
    }).then((res) => {
      if (res.data.code == 1) {
        message.success('修改时间成功');
        this.comon(this.state.deptId);
      } else {
        message.error('修改时间失败!');
      }
      console.log('获取返回的时间', res);
    });
  }
  // 模糊搜索数据范围
  getSearch = (name, index) => {
    let data = {};
    if (index == 1) {
      data = this.state.detData1;
    } else {
      data = this.state.alldata;
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
  // 查询
  onSearch = (val) => {
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
  getSearch = (name) => {
    let data = this.state.treeData;

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
  searchChange = (e) => {
    this.onSearch(e.target.value);
  };
  render() {
    let caosongL = '';
    // console.log(this.state.chooseName)
    if (this.state.chooseName.length > 0) {
      caosongL = this.state.chooseName.map((val, index) => {
        if (this.props.type == 'personList') {
          return (
            val.type == 1 && (
              <div className="caosongList">
                {val.name}{' '}
                <label onClick={() => this.delectChaosong(index)}>
                  <CloseOutlined />
                </label>
              </div>
            )
          );
        } else {
          return (
            <div className="caosongList">
              {val.name}{' '}
              <label onClick={() => this.delectChaosong(index)}>
                <CloseOutlined />
              </label>
            </div>
          );
        }
      });
    }

    let endDayOfWeekList = this.state.endDayOfWeekList.map((val) => {
      return (
        <Option value={val.key} key={val.key}>
          {val.text}
        </Option>
      );
    });

    // 删除周报提醒范围
    const removeTag = (e) => {
      const DATA = this.state.weeklyRange;
      let submitD = [];
      DATA.forEach((item) => {
        if (item.id !== e) {
          submitD.push(item.deptId);
        }
      });
      updateRemindScope({
        deptId: this.state.deptId,
        remindDeptIdList: submitD,
      }).then((res) => {
        message.success('删除成功');
        this.setState({
          weeklyRange: DATA.filter((item) => item.id !== e),
        });
      });
    };

    // 唤醒部门弹窗
    const addWeeklyRange = (e) => {
      this.setState({
        flag: true,
      });
    };

    const weeklyStatus = (checked) => {
      if (!checked) {
        makeUp({
          active: 0,
          deptId: this.state.deptId,
          makeUpDate: '',
        }).then((res) => {
          message.success('关闭成功');
        });
      }
      this.setState({
        isMarkUp: !this.state.isMarkUp,
      });
    };

    const setMarkUp = (e) => {
      makeUp({
        active: this.state.isMarkUp === true ? 1 : 0,
        deptId: this.state.deptId,
        makeUpDate: e.replace(/至.*/g, ''),
      }).then((res) => {
        message.success('设置成功');
        this.setState({
          markUpVal: e,
        });
      });
    };

    return (
      <div className="settingBox">
        <Fragment>
          <Titler />
          <div className=" content  setttingWrap">
            <div className="left">
              <Nav />
            </div>
            <div className="Settingright">
              <div className="groupBox">
                <DepartList msg={this.message} />
              </div>

              <ul className="weekUl">
                <li>
                  {' '}
                  <div className="weekconfigTitle">周报配置</div>
                </li>
                <li>
                  <label className="weekLabel">周报截至时间：</label>
                  <Select disabled value={this.state.endDayOfWeekName} style={{ width: 120 }} className="roleList">
                    {endDayOfWeekList}
                  </Select>
                  <ConfigProvider locale={locale}>
                    <TimePicker
                      disabled
                      format={format}
                      value={this.state.endTime === '' ? '' : moment(this.state.endTime, 'HH:mm')}
                    />
                  </ConfigProvider>
                </li>
                <li style={{ display: 'flex' }}>
                  <label className="weekLabel">周报提醒时间：</label>
                  <div>
                    <p>
                      <Select disabled value={'周五'} style={{ width: 120 }} className="roleList">
                        {endDayOfWeekList}
                      </Select>
                      <ConfigProvider locale={locale}>
                        <TimePicker
                          disabled
                          format={format}
                          value={
                            this.state.remindTimeList[0].remindTime === ''
                              ? ''
                              : moment(this.state.remindTimeList[0].remindTime, 'HH:mm')
                          }
                        />
                      </ConfigProvider>
                    </p>
                    <p>
                      <Select disabled style={{ width: 120 }} disabled value={'周六'} className="roleList">
                        {endDayOfWeekList}
                      </Select>
                      <ConfigProvider locale={locale}>
                        <TimePicker
                          onOk={(e) => {
                            this.onOk(e, 'remindTime2');
                          }}
                          onChange={this.onChangeTime}
                          value={this.state.endTimer == undefined ? undefined : moment(this.state.endTimer, 'HH:mm')}
                          format={format}
                        />
                      </ConfigProvider>
                    </p>
                  </div>
                </li>
                <li className="weekly-tip_range">
                  <label className="weekLabel">周报补交开关：</label>
                  <div>
                    <Switch className="weekly_status-check" checked={this.state.isMarkUp} onChange={weeklyStatus} />
                    <Select
                      className="weekly_status-select"
                      placeholder="请选择补交日期"
                      hidden={!this.state.isMarkUp}
                      value={this.state.markUpVal}
                      onChange={setMarkUp}
                    >
                      {this.state.markUpList.map((item) => {
                        return (
                          <Option key={item.startTime} value={item.startTime + '至' + item.endTime}>
                            {item.startTime} 至 {item.endTime}
                          </Option>
                        );
                      })}
                    </Select>
                  </div>
                </li>
                <li className="weekly-tip_range">
                  <label className="weekLabel">周报提醒范围：</label>
                  <div>
                    {this.state.weeklyRange.map((item) => {
                      return (
                        <Tag className="tags" key={item.id} closable onClose={() => removeTag(item.id)}>
                          {item.deptName}
                        </Tag>
                      );
                    })}
                    <Tag className="tags tags_add" onClick={addWeeklyRange}>
                      <PlusOutlined />
                    </Tag>
                  </div>
                </li>
                <li className="weekUser">
                  <label className="weekLabel">默认抄送人：</label>

                  <div className="CCList">
                    {this.state.imgList.map((item, i) => (
                      <div className="CC" key={i}>
                        {item.avatar ? (
                          <img src={item.avatar} />
                        ) : (
                          <div className="headerPic125">{item.username[item.username.length - 1]}</div>
                        )}
                        <span onClick={() => this.delectChaosongSend(item.userId)}>
                          <CloseCircleFilled />
                        </span>
                        <p>{item.username}</p>
                      </div>
                    ))}
                    <div className="addCC" onClick={this.showAddPer}>
                      +{' '}
                    </div>
                  </div>
                </li>
              </ul>
            </div>
          </div>
          {this.state.addPerson ? (
            <Modal
              title="添加人员"
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
              <div className="personTree">
                <div className="l">{caosongL}</div>
                <div className="r">
                  <Search
                    style={{ marginBottom: 8 }}
                    onChange={this.searchChange}
                    placeholder="请输入姓名"
                    onSearch={this.onSearch}
                  />
                  <Tree
                    checkable
                    onExpand={this.onExpand}
                    expandedKeys={this.state.expandedKeys}
                    autoExpandParent={this.state.autoExpandParent}
                    onCheck={this.onCheck}
                    checkedKeys={this.state.chooseData}
                    onSelect={this.onSelect}
                    selectedKeys={this.state.chooseData}
                    treeData={this.state.treeData1}
                    key={this.state.treeData.length == 0 ? 'tree' : this.state.treeData[0].id}
                  />
                </div>
              </div>
            </Modal>
          ) : (
            ''
          )}

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
            <div className="border1">
              <Search style={{ marginBottom: 8 }} placeholder="请输入快速搜索" onSearch={this.onSearch1} />

              <Tree
                treeData={this.state.detData}
                titleRender={(nodeData) => (
                  <div className="oprateWrap" key={nodeData.id}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <span
                        onClick={(event) => this.clicked(nodeData.id, nodeData.title)}
                        className={` ${this.state.currentIndex == nodeData.id ? 'nocheckedCircle' : 'checkedCircle'}`}
                      ></span>
                      <span>{nodeData.title}</span>
                    </div>
                  </div>
                )}
              />
            </div>
          </Modal>
        </Fragment>
      </div>
    );
  }
}

export default weekreportConfig;
