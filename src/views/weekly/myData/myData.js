import React, { Component, Fragment } from 'react';
import { Tree, Input, Button, Radio, DatePicker, Modal, Image, message, Spin, Popover } from 'antd';
import {
  LockFilled,
  CaretLeftOutlined,
  CaretRightOutlined,
  CloseCircleFilled,
  CheckOutlined,
  CloseOutlined,
  LockOutlined,
  EditOutlined,
  QuestionCircleOutlined,
} from '@ant-design/icons';
import {
  personWorkTime,
  getMonthWork,
  upFile,
  getPersonTree,
  sendWeekly,
  userIdLogin,
  recall,
} from './../../../api/api';
import './myData.less';
import Titler from './../../compent/headerTitle/headerTitle';
import PersonTree from './../compontent/personTree/personTree';
import { Link } from 'react-router-dom';
import { parseURL } from './../../../utils/index';
const { TreeNode } = Tree;
const { Search, TextArea } = Input;
const { RangePicker } = DatePicker;

let baocun;

const weekly_status = {
  0: {
    className: 'fail',
    icon: CloseOutlined,
  },
  1: {
    className: 'success',
    icon: CheckOutlined,
  },
  2: {
    className: 'success',
    icon: EditOutlined,
  },
  3: {
    className: 'lock',
    icon: LockOutlined,
  },
};
class MyData extends Component {
  urlParams = {};

  state = {
    editorContent: '',
    btnStatus: false,
    visible: false,
    addPerson: false,
    showTime: false, //展示时间段选择
    isUploadImg: false,
    list: [],
    remarkLen: '0/500',
    weekContentLen: '0/300',
    weekPlanLen: '0/300',
    textareaData: {
      remark: null,
      weekContent: null,
      weekPlan: null,
    },
    myWeek: {
      report: {
        weekId: 'null',
        picUrlList: [],
        userInfoList: [],
        status: 1,
        remark: null,
        weekContent: null,
        weekPlan: null,
      },
      timeStampList: '',
    },
    monthNum: '',
    pianyiNum: 0,
    expandedKeys: [], //展开节点（受控）
    autoExpandParent: true, //是否自动展开父节点
    checkedKeys: [], //（受控）选中复选框的树节点（受控）选中复选框的树节点
    selectedKeys: [], //	（受控）设置选中的树节点
    allPersonTree: [],
    personTree: [],
    findlist: [],
    chaosongPerson: [],
    chaosongList: [], //头像抄送
    lastSunday: '',
    remark: '',
    weekPlan: '',
    mustCasongsong: [],
    timeStampListIndex: -1, //展示周报进度条的时间
    timeStampListWidth: 0, //展示周报进度条位置
    getPersonWorkTimeLoading: true,
    getMonthWorkLoading: true,
    pList: [],
    onlyReceiverVisible: 0,
    sureonlyReceiverVisible: true,
    showBack: false,
  };

  async componentDidMount() {
    document.addEventListener('paste', function (event) {
      console.log(123);
    });

    this.urlParams = parseURL();
    if (this.urlParams.userId) {
      await userIdLogin(this.urlParams.userId).then((res) => {
        let accessToken = 'Bearer ' + res.data.data.result.accessToken;
        let userMsg = res.data.data.result.userInfoVO;
        let powerList = [];
        res.data.data.result.menuInfoVOs.map((val) => {
          powerList.push(val.perms);
          console.log('val:', val.perms);
        });
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
    let data = {};
    let nowdays = new Date();

    let year = nowdays.getFullYear();
    let month = nowdays.getMonth();

    if (month === 0) {
      month = 12;
      year = year - 1;
    }
    if (month < 10) {
      month = '0' + nowdays.getMonth();
    }
    let myDate = new Date(year, month, 0);
    data.startTime = year + '-' + month + '-01';
    data.endTime = year + '-' + month + '-' + myDate.getDate();
    this.personWorkTime(data);
    this.getMonthWork({});
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
    let that = this;
    baocun = setInterval(function () {
      that.handleOk(0, 0);
    }, 5000);
  }

  componentWillUnmount() {
    clearInterval(baocun);
  }

  // 定位div(contenteditable = "true")；超过字数光标定位到末端
  set_focus = (e) => {
    let el = document.getElementById(e.target.id);
    el.focus();
    // if ($.support.msie) {
    //     let range = document.selection.createRange();
    //     this.last = range;
    //     range.moveToElementText(el);
    //     range.select();
    //     document.selection.empty(); // 取消选中
    // } else {
    //     let range = document.createRange();
    //     range.selectNodeContents(el);
    //     range.collapse(false);
    //     let sel = window.getSelection();
    //     sel.removeAllRanges();
    //     sel.addRange(range);
    // }
  };

  aaa = () => {
    console.log(123);
  };
  personWorkTime = (data) => {
    this.setState({ getPersonWorkTimeLoading: true });
    personWorkTime(data).then((res) => {
      if (res.data.code === 1) {
        this.setState({
          list: res.data.data.result,
          getPersonWorkTimeLoading: false,
        });
      } else {
        message.error(res.data.message);
      }
    });
  };
  getMonthWork = (data, updateIndex = true) => {
    this.setState({ getMonthWorkLoading: true });
    getMonthWork(data).then((res) => {
      if (res.data.code === 1) {
        let sureonlyReceiverVisible = false;
        if (res.data.data.result.thisWeek && res.data.data.result.report.status != 1) {
          sureonlyReceiverVisible = true;
        }
        const result = res.data.data.result;
        let timeStampListIndex = this.state.timeStampListIndex;
        let timeStampListWidth = 0;
        let isThisMonth = result.thisWeek;
        console.log(result.timeStampList);

        for (let i = 0, l = result.timeStampList.length; i < l; i++) {
          const { status } = result.timeStampList[i];
          if (status === 3) {
            if (updateIndex) {
              timeStampListIndex = i > 0 ? i - 1 : 0;
            }
            // if (timeStampListIndex >= i) {
            //   timeStampListIndex = i ;
            // }
            const item = 100 / l;
            const item_half = item * 0.5;
            timeStampListWidth = item_half + timeStampListIndex * item;
            isThisMonth = true;
            break;
          }
          if (isThisMonth && status !== 3 && i == l - 1) {
            timeStampListIndex = i;
            const item = 100 / l;
            const item_half = item * 0.5;
            timeStampListWidth = item_half + timeStampListIndex * item;
            isThisMonth = true;
          }
        }
        if (!isThisMonth) {
          if (updateIndex) {
            // 原来0
            timeStampListIndex = 0;
          }
          timeStampListWidth = 100;
        }

        let list1 = [];
        let list2 = [];
        let list3 = [];
        result.report.userInfoList.map((val) => {
          list1.push(val);
        });
        let showBack = false;
        if (result.thisWeek && result.submit) {
          showBack = true;
        }
        let obj = {};
        if (result.report) {
          ['remark', 'weekContent', 'weekPlan'].forEach((item) => {
            var Odiv = document.createElement('div');
            Odiv.innerHTML = result.report[item];
            obj[`${item}Len`] = this.state[`${item}Len`].replace('0', Odiv.innerText.length);
            Odiv = null;
          });
        }

        this.setState({
          myWeek: result,
          mustCasongsong: list1,
          chaosongList: list2,
          checkedKeys: list3,
          chaosongPerson: list2,
          timeStampListIndex,
          getMonthWorkLoading: false,
          timeStampListWidth,
          sureonlyReceiverVisible: sureonlyReceiverVisible,
          showBack: showBack,
          textareaData: {
            ...result.report,
          },
          ...obj,
        });
      } else {
        message.error(res.data.message);
      }
    });
  };

  //	展开/收起节点时触发
  onExpand = (expandedKeys) => {
    // if not set autoExpandParent to false, if children expanded, parent can not collapse.
    // or, you can remove all expanded children keys.
    this.setState({
      expandedKeys,
      autoExpandParent: false,
    });
  };

  //点击复选框触发
  onCheck = (checkedKeys, { checkedNodes }) => {
    console.log(checkedNodes);
    let checkedNodes1 = [...checkedNodes];
    let aaa = this.state.chaosongPerson;
    if (checkedNodes.length == 0) {
      this.state.personTree.map((val1, index) => {
        this.state.chaosongPerson.map((val2, index1) => {
          console.log(val1.id, val2.id, val1.name, val2.name);
          if (val1.id == val2.id) {
            console.log(index1);
            aaa.splice(index1, 1);
          }
        });
      });
    }
    if (this.state.personTree != this.state.allPersonTree) {
      checkedNodes1 = [...checkedNodes, ...aaa];
    }

    let chaosongPerson = checkedNodes1.filter((e) => e.type === 1);
    this.setState({
      chaosongPerson,
      checkedKeys: chaosongPerson.map((e) => e.key),
      personTree: this.state.allPersonTree,
    });
    console.log(this.state.checkedKeys);
  };
  //点击树节点触发
  onSelect = (selectedKeys, info) => {
    console.log('onSelect', info);
    this.setState({ selectedKeys });
  };

  // 模糊搜索数据范围
  getSearch = (name) => {
    let data = this.state.allPersonTree;
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
      this.setState({ personTree: this.state.allPersonTree });
    } else {
      let result = this.getSearch(val);
      console.log('打印下查询到的数据', result);
      if (result.length > 0) {
        this.setState({ personTree: result });
      } else {
        console.log('空？');
        this.setState({ personTree: [] });
      }
    }
  };
  inputNull = () => {
    // this.setState({
    //   findlist: [],
    // });
  };

  // 上传图片
  upLoadImg = async (e) => {
    const file = e.target.files;
    const { myWeek } = this.state;
    const { picUrlList } = myWeek.report;
    const fileArr = Array.from(file);
    let LEN = picUrlList.length;
    if (LEN + file.length > 5) {
      message.warn('最大上传5张图片，默认上传前5张');
    }

    var formData = new FormData();

    for (let i = 0; i < fileArr.length; i++) {
      const item = fileArr[i];
      if (item.size > 5 * 1024 * 1024) {
        return message.error('图片超过5M');
      }
      if (LEN < 5) {
        formData.append('files', item);
        LEN++;
      }
    }

    e.target.value = '';
    const { data } = await upFile(formData);
    const { code, data: imgData } = data;

    if (code !== 1) {
      return message.error('网络错误！');
    }

    const newImgList = imgData.rows.map((item) => {
      return {
        url: item.url,
        id: item.fileUniqueId,
      };
    });

    this.setState({
      myWeek: {
        ...myWeek,
        report: {
          ...myWeek.report,
          picUrlList: picUrlList.concat(newImgList),
        },
      },
    });
  };

  onChange = (e) => {
    if (e.target.value == '3') {
      this.setState({
        showTime: true,
      });
      return;
    }
    this.setState({
      showTime: false,
    });
    let data = {};
    let nowdays = new Date();

    let year = nowdays.getFullYear();
    let month = nowdays.getMonth();

    let week = nowdays.getDay();
    let day = nowdays.getDate();
    // let day   =  1;
    let myDate;
    console.log(year, month, week, day);
    switch (e.target.value) {
      case '0':
        if (month == 0) {
          month = 12;
          year = year - 1;
        }
        if (month < 10) {
          month = '0' + nowdays.getMonth();
        }
        myDate = new Date(year, month, 0);
        data.startTime = year + '-' + month + '-01';
        data.endTime = year + '-' + month + '-' + myDate.getDate();
        break;
      case '1':
        if (day <= week + 7) {
          if (month == 0) {
            month = 12;
            year = year - 1;
          }
          if (month < 10) {
            month = '0' + nowdays.getMonth();
          }
          myDate = new Date(year, month, day - week - 7);
          myDate = myDate.getDate();
          if (myDate < 10) {
            myDate = '0' + myDate;
          }
          data.startTime = year + '-' + month + '-' + myDate;
        } else {
          month = nowdays.getMonth() * 1 + 1;
          if (month < 10) {
            month = '0' + month;
          }
          myDate = new Date(year, month, day - week - 7);
          myDate = myDate.getDate();
          if (myDate < 10) {
            myDate = '0' + myDate;
          }
          data.startTime = year + '-' + month + '-' + myDate;
        }
        if (day <= week) {
          if (month == 0) {
            month = 12;
            year = year - 1;
          }
          if (month < 10) {
            month = '0' + nowdays.getMonth();
          }
          myDate = new Date(year, month, day - week);
          myDate = myDate.getDate();
          if (myDate < 10) {
            myDate = '0' + myDate;
          }
          data.endTime = year + '-' + month + '-' + myDate;
        } else {
          month = nowdays.getMonth() * 1 + 1;
          if (month < 10) {
            month = '0' + month;
          }
          myDate = new Date(year, month, day - week);
          myDate = myDate.getDate();
          if (myDate < 10) {
            myDate = '0' + myDate;
          }
          data.endTime = year + '-' + month + '-' + myDate;
        }

        break;
      case '2':
        month = month * 1 + 1;
        if (month < 10) {
          month = '0' + month;
        }
        myDate = new Date(year, month, 0);
        data.startTime = year + '-' + month + '-01';
        data.endTime = year + '-' + month + '-' + myDate.getDate();
        break;
      default:
    }
    this.personWorkTime(data);
  };

  montList = (num) => {
    this.setState({
      pianyiNum: this.state.pianyiNum + num,
      chaosongList: [],
    });
    let data = {};
    if (num === -1) {
      data = {
        startDate: this.state.myWeek.preMonth.startDate,
        endDate: this.state.myWeek.preMonth.endDate,
      };
    } else if (num === 1) {
      data = {
        startDate: this.state.myWeek.nextMonth.startDate,
        endDate: this.state.myWeek.nextMonth.endDate,
      };
    }
    this.getMonthWork(data);
  };

  changeMsg = (startDate, endDate, timeStampListIndex) => {
    console.log(startDate, endDate);
    this.getMonthWork(
      {
        startDate: startDate,
        endDate: endDate,
      },
      false,
    );
    this.setState({
      timeStampListIndex,
      chaosongList: [],
    });
  };

  showModal = () => {
    this.setState({ visible: true });
  };

  handleOk = (status = 1, tip = 1) => {
    if (this.state.myWeek.timeStampList.length && this.state.sureonlyReceiverVisible) {
      const { myWeek, chaosongList, mustCasongsong, timeStampListIndex, textareaData } = this.state;
      const userInfoList = mustCasongsong.concat(
        chaosongList.map((val) => ({
          avatar: val.avatar,
          userId: val.userId,
          username: val.name,
        })),
      );
      const timeStampList = myWeek.timeStampList.concat([]);
      timeStampList[timeStampListIndex].status = 1;
      const data = {
        status,
        manHourInsertVO: myWeek.weekReportManHour.timeStampManHourList,
        picList: myWeek.report.picUrlList.map((e) => e.id),
        reportInsertVO: {
          ...myWeek.report,
          ...textareaData,
          endTime: myWeek.submitStartEndTime.endTime,
          userInfoList,
        },
        onlyReceiverVisible: this.state.onlyReceiverVisible,
      };
      sendWeekly(data).then((res) => {
        if (res.data.code === 1) {
          if (status === 1) {
            this.setState({
              visible: false,
              myWeek: {
                ...myWeek,
                report: {
                  ...myWeek.report,
                  status: 1,
                },
                timeStampList,
              },
            });
            window.location.reload();
            message.info('提交成功');
          }
          if (status === 0 && tip === 1) {
            message.info('保存成功');
          }
        } else {
          message.error(res.data.message);
        }
      });
    }
  };
  handleCancel = (e) => {
    console.log(e);
    this.setState({
      visible: false,
    });
  };
  showAddPer = () => {
    this.setState({
      addPerson: true,
    });
  };

  addPer = (e) => {
    let csL = [];
    console.log(this.state.chaosongPerson, this.state.mustCasongsong);
    let aaa = this.state.chaosongPerson;
    this.state.chaosongPerson.map((val, index) => {
      for (let i = 0; i < this.state.mustCasongsong.length; i++) {
        if (this.state.mustCasongsong[i].username == val.name) {
          aaa.splice(index, 1);
        }
      }
    });
    csL.push(...aaa);
    this.setState({
      addPerson: false,
      chaosongList: csL,
    });
  };

  hiddenAddPer = (e) => {
    console.log(e);
    this.setState({
      addPerson: false,
    });
  };

  getInput = (e) => {
    let value = e.target.value;
    // console.log(value);
    this.setState({
      name: value,
    });
  };
  getPickTime = (time, timeString) => {
    console.log(time, timeString);
    let data = {
      startTime: timeString[0],
      endTime: timeString[1],
    };
    this.personWorkTime(data);
  };
  changeData = (e, a, b) => {
    const { value } = e.target;
    const reg = /^\d*?$/;
    console.log(e.target.value);
    if (reg.test(value)) {
      let { timeStampManHourList, countHour } = this.state.myWeek.weekReportManHour;
      const _timeStampManHourList = timeStampManHourList.concat([]);
      const item = _timeStampManHourList[a].hourInfos[b];
      const _countHour = countHour.concat([]);
      const allNum = countHour[b];
      const otherAllNum = allNum - item.hourNum;
      let newValue = e.target.value * 1;
      let newAllNum = otherAllNum + newValue;
      if (newAllNum > 100) {
        newValue = 100 - otherAllNum;
        newAllNum = 100;
      }
      item.hourNum = newValue;
      _countHour[b] = newAllNum;
      console.log({
        countHour: _countHour,
        timeStampManHourList: _timeStampManHourList,
      });
      this.setState({
        myWeek: {
          ...this.state.myWeek,
          weekReportManHour: {
            countHour: _countHour,
            timeStampManHourList: _timeStampManHourList,
          },
        },
      });
    } else {
      console.log('菲数字');
    }
  };
  delectChaosong = (id) => {
    console.log(id, this.state.checkedKeys);
    let checkedKeys = this.state.checkedKeys.concat([]);
    let chaosongPerson = this.state.chaosongPerson.concat([]);
    checkedKeys.splice(id, 1);
    chaosongPerson.splice(id, 1);
    this.setState({
      chaosongPerson,
      checkedKeys,
    });
  };
  delectChaosongSend = (id) => {
    let list = this.state.chaosongList;
    let list1 = this.state.chaosongPerson;
    list.splice(id, 1);
    list1.splice(id, 1);
    this.setState({
      chaosongList: list,
      chaosongPerson: list1,
    });
  };
  delectChaosongSend1 = (id) => {
    let list = this.state.mustCasongsong;
    if(this.state.myWeek.submit) return;
    list.splice(id, 1);
    this.setState({
      mustCasongsong: list,
    });
  };
  delectPic = (index) => {
    const { myWeek } = this.state;
    let picUrlList = myWeek.report.picUrlList.concat([]);
    picUrlList.splice(index, 1);
    this.setState({
      myWeek: {
        ...myWeek,
        report: {
          ...myWeek.report,
          picUrlList,
        },
      },
    });
  };
  changeMyWeekText = (e, key) => {
    this.setState({
      // myWeek: {
      //   ...this.state.myWeek,
      //   report: {
      //     ...this.state.myWeek.report,
      //     [key]: key === 'remark' ? e : e.target.value,
      //   },
      // },
      textareaData: {
        ...this.state.myWeek.report,
        ...this.state.textareaData,
        [key]: e.target.value,
      },
    });
    console.log(this.state.textareaData);
  };

  //
  textareaWeekText = (data, maxLen, type) => {
    let htmlStr = data.innerHTML;
    const len = data.innerText.length;
    console.log(htmlStr);
    if (len > maxLen) {
      htmlStr = htmlStr.slice(0, maxLen - len);
    }

    this.setState({
      [`${type}Len`]: `${len > maxLen ? maxLen : len}/${maxLen}`,
      textareaData: {
        ...this.state.myWeek.report,
        [type]: htmlStr,
      },
    });
  };

  remark = (e) => {
    // this.textareaWeekText(e.target, 500, 'remark');
    this.changeMyWeekText(e, 'remark');
  };
  weekPlan = (e) => {
    // this.textareaWeekText(e.target, 300, 'weekPlan');
    this.changeMyWeekText(e, 'weekPlan');
  };
  weekContent = (e) => {
    console.log(e);
    this.changeMyWeekText(e, 'weekContent');
    // this.textareaWeekText(e.target, 300, 'weekContent');
  };

  /**
   *  /**
   * 去除年份/
   * @param {string} date  YY-MM-DD
   * @returns MM-DD
   */
  removeYear = (date) => {
    const a = date.split('-');
    a.shift();
    return a.join('-');
  };
  onlyReceiverVisible = (e) => {
    this.setState({
      onlyReceiverVisible: this.state.onlyReceiverVisible ? 0 : 1,
    });
    console.log(this.state.onlyReceiverVisible);
  };
  recall = () => {
    recall().then((res) => {
      if (res.data.code == 1) {
        window.location.reload();
        message.info('撤销成功');
      } else {
        message.error(res.data.message);
      }
    });
  };
  showInput = (index, hIndex, kind) => {
    let myWeek = this.state.myWeek;
    myWeek.weekReportManHour.timeStampManHourList[index].hourInfos[hIndex].flag = kind;
    this.setState({
      myWeek: myWeek,
    });
  };

  render() {
    const {
      myWeek,
      timeStampListIndex,
      getPersonWorkTimeLoading,
      getMonthWorkLoading,
      timeStampListWidth,
    } = this.state;
    const picList = myWeek.report.picUrlList;
    const isEdit = myWeek.thisWeek && myWeek.report.status === 0;
    let weekMsg = '';
    if (myWeek.timeStampList) {
      let l = myWeek.timeStampList.length - 1;
      weekMsg = myWeek.timeStampList.map((e, i) => {
        const Icon = weekly_status[e.status].icon;
        const statusDisable = e.status === 3;
        return (
          <React.Fragment key={e.startDate + e.endDate}>
            <label
              className={weekly_status[e.status].className}
              onClick={() => !statusDisable && this.changeMsg(e.startDate, e.endDate, i)}
            >
              <Icon />
              <p className="choiceTime" hidden={timeStampListIndex !== i}>
                {this.removeYear(e.startDate)} 至 {this.removeYear(e.endDate)}
              </p>
            </label>
          </React.Fragment>
        );
      });
    }

    let showWTime;
    if (myWeek.weekReportManHour) {
      const timeStampManHourList = myWeek.weekReportManHour.timeStampManHourList;
      showWTime = timeStampManHourList.map((item, index) => {
        return (
          <div className="tableList">
            <label>{item.projName == '其他' ? '内勤或其它' : item.projName}</label>
            {item.hourInfos.map((hourInfoItem, hIndex) => {
              let opNum = 1;
              if (hourInfoItem.hourNum == 0 && hourInfoItem.flag) {
                opNum = 0;
              }
              return (
                <label key={hourInfoItem.id}>
                  <span style={{ opacity: opNum }}>
                    <input
                      onChange={(e) => this.changeData(e, index, hIndex)}
                      disabled={!isEdit}
                      value={hourInfoItem.hourNum}
                      onClick={() => this.showInput(index, hIndex, false)}
                      onBlur={() => this.showInput(index, hIndex, true)}
                    />
                    %
                  </span>
                </label>
              );
            })}
          </div>
        );
      });
    }

    const caosongL = this.state.chaosongPerson.map((val, index) => {
      return (
        <div className="caosongList" key={val.name}>
          {val.name}
          <label onClick={() => this.delectChaosong(index)}>
            <CloseOutlined />
          </label>
        </div>
      );
    });

    const chaosongList = this.state.chaosongList.map((val, index) => {
      return (
        <div className="CC" key={val.name}>
          {val.avatar ? (
            <img src={val.avatar} alt="" />
          ) : (
            <div className="headerPic125">{val.name[val.name.length - 1]}</div>
          )}
          <span className="close" onClick={() => this.delectChaosongSend(index)}>
            <CloseCircleFilled />
          </span>
          <p>{val.name}</p>
        </div>
      );
    });

    const mustcaosongList = this.state.mustCasongsong.map((val, index) => {
      return (
        <div className="CC" key={val.username}>
          {val.avatar ? (
            <img src={val.avatar} alt="" />
          ) : (
            <div className="headerPic125">{val.username[val.username.length - 1]}</div>
          )}
          {val.isDefault === 1 ? (
            <span className="lock">
              <LockFilled />
            </span>
          ) : (
            <span className="close" onClick={() => this.delectChaosongSend1(index)}>
              <CloseCircleFilled />
            </span>
          )}

          <p>{val.username}</p>
        </div>
      );
    });
    const imgList = picList.map((val, index) => {
      return (
        <li key={val.id}>
          <Image width={'auto'} src={val.url} height={104} />
          <span onClick={() => this.delectPic(index)} hidden={!isEdit}>
            <CloseCircleFilled style={{ fontSize: '16px', color: '#666666' }} />
          </span>
        </li>
      );
    });

    return (
      <Fragment>
        <Titler />
        <div className="content my_data">
          <div className="changeModel">
            <ul>
              {this.state.pList.indexOf('week_report:hall') > -1 ? (
                <Link to="/weekly">
                  <li>大厅</li>
                </Link>
              ) : (
                ''
              )}

              {this.state.pList.indexOf('week_report:mine') > -1 ? (
                <Link to="/weekly/mydata">
                  <li className="active">我的</li>
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
            {/* <div>
                            <Button type="primary"> 填写周报 </Button>
                        </div> */}
          </div>

          <div className="myDataMsg">
            <div className="myDataList">
              <div className="timeTitle">
                <h3>我的工时 </h3>
                <div className="changeTime">
                  <Radio.Group onChange={this.onChange} defaultValue="0">
                    <Radio.Button value="0">上月</Radio.Button>
                    <Radio.Button value="1">上周</Radio.Button>
                    <Radio.Button value="2">本月</Radio.Button>
                    <Radio.Button value="3">时间段</Radio.Button>
                  </Radio.Group>
                </div>
                <div className={this.state.showTime ? 'timePicker' : 'hidden'}>
                  <RangePicker onChange={this.getPickTime} />
                </div>
              </div>

              <Spin spinning={getPersonWorkTimeLoading} delay={100}>
                <div className="timeData">
                  {this.state.list.projManHourList
                    ? this.state.list.projManHourList.map((item, index) => {
                        return (
                          <div className="dataList" key={item.projId}>
                            <label>{item.projName}</label>
                            <div
                              className="addAmin"
                              style={{ width: (item.countManHour * 580) / this.state.list.totalManhour + 'px' }}
                            >
                              {(item.countManHour / 100).toFixed(2)}
                            </div>
                          </div>
                        );
                      })
                    : ''}
                </div>
              </Spin>
            </div>
            <Spin spinning={getMonthWorkLoading} delay={100}>
              <div className="myDataList">
                <div className="timeTitle">
                  <h3>我的周报</h3> <b>注：周报截止时间为周日 23:59:59</b>
                </div>
                <div className="WeeklyLoading">
                  <label className="WeeklyTime" onClick={() => this.montList(-1)}>
                    <CaretLeftOutlined />
                    上月
                  </label>
                  <div className="progressBar">
                    <div className="process-bar-item" style={{ width: timeStampListWidth + '%' }}></div>
                    {weekMsg}
                  </div>
                  {this.state.pianyiNum == 0 ? (
                    <label className="WeeklyTime bgccc">
                      下月 <CaretRightOutlined />
                    </label>
                  ) : (
                    <label className="WeeklyTime" onClick={() => this.montList(1)}>
                      下月 <CaretRightOutlined />
                    </label>
                  )}
                </div>
                {/* <p className="choiceTime">
                {this.state.fristDay} 至 {this.state.lastDay}
              </p> */}

                <div className="weeklyMsg" key={myWeek.report.weekId}>
                  <div className="man_hour">
                    <h3>
                      本周工时填写
                      <Popover
                        placement="bottomRight"
                        content={
                          <div className="my_data-tip-txt">
                            <p>
                              1）如果考勤时长T=上班打卡-下班打卡 &gt;
                              8小时，那么工时计为100%，用户则根据实际情况将100%分配到各项目（含‘其他’项目）
                            </p>
                            <p>
                              2）如果考勤时长T=上班打卡-下班打卡 &lt;
                              8小时，那么工时计为T/8*100%，用户则根据实际情况将T/8*100%分配到各项目（含‘其他’项目）
                            </p>
                          </div>
                        }
                        title={<div class="my_data-tip-tit">填写规则</div>}
                        trigger="hover"
                      >
                        <QuestionCircleOutlined className="tip_icon" />
                      </Popover>
                    </h3>
                    <div className="weeklyTable">
                      <div className=" tableList tableTitle">
                        <label>项目名称</label>
                        <label>星期一</label>
                        <label>星期二</label>
                        <label>星期三</label>
                        <label>星期四</label>
                        <label>星期五</label>
                        <label>星期六</label>
                        <label>星期日</label>
                      </div>
                      {showWTime}

                      <div className="tableList tableAll">
                        <label>合计</label>
                        {myWeek.weekReportManHour &&
                          myWeek.weekReportManHour.countHour.map((e, i) => (
                            <label key={i}>
                              <b>{e}%</b>
                            </label>
                          ))}
                      </div>
                    </div>
                  </div>

                  {/* 工作输入 */}
                  <h3>本周工作内容</h3>
                  {isEdit && (
                    <TextArea
                      className="myDataText"
                      onChange={this.weekContent}
                      showCount
                      maxLength={300}
                      autoSize={true}
                      defaultValue={myWeek.report.weekContent}
                    />
                    // <div
                    //   className="myDataTextarea"
                    //   contentEditable="true"
                    //   onInput={this.weekContent}
                    //   dangerouslySetInnerHTML={{ __html: myWeek.report.weekContent }}
                    //   data-count={this.state.weekContentLen}
                    // ></div>
                  )}
                  <pre
                    hidden={isEdit}
                    style={{ marginBottom: 24 }}
                    // dangerouslySetInnerHTML={{ __html: myWeek.report.weekContent }}
                  >
                    {myWeek.report.weekContent}
                  </pre>
                  <h3>下周工作计划</h3>
                  {isEdit && (
                    <TextArea
                      className="myDataText"
                      onChange={this.weekPlan}
                      showCount
                      maxLength={300}
                      autoSize={true}
                      defaultValue={myWeek.report.weekPlan}
                    />
                    // <div
                    //   className="myDataTextarea"
                    //   contentEditable="true"
                    //   onInput={this.weekPlan}
                    //   dangerouslySetInnerHTML={{ __html: myWeek.report.weekPlan }}
                    //   data-count={this.state.weekPlanLen}
                    // ></div>
                  )}

                  <pre
                    hidden={isEdit}
                    style={{ marginBottom: 24 }}
                    // dangerouslySetInnerHTML={{ __html: myWeek.report.weekPlan }}
                  >
                    {myWeek.report.weekPlan}
                  </pre>
                  <h3>备注</h3>
                  {isEdit && (
                    <TextArea
                      className="myDataText"
                      onChange={this.remark}
                      showCount
                      maxLength={500}
                      autoSize={true}
                      defaultValue={myWeek.report.remark}
                    />
                    // <div
                    //   className="myDataTextarea"
                    //   contentEditable="true"
                    //   onInput={this.remark}
                    //   dangerouslySetInnerHTML={{ __html: myWeek.report.remark }}
                    //   data-count={this.state.remarkLen}
                    // ></div>
                  )}
                  <pre
                    hidden={isEdit}
                    style={{ marginBottom: 24 }}
                    // dangerouslySetInnerHTML={{ __html: myWeek.report.remark }}
                  >
                    {myWeek.report.remark}
                  </pre>
                  {/* 图片相关功能 */}
                  <div hidden={!isEdit && imgList.length === 0}>
                    <h3>图片</h3>
                    <div className="PicList">
                      <div className="Pic">
                        <ul>
                          <Image.PreviewGroup>{imgList}</Image.PreviewGroup>
                          <div className="addPic" hidden={!isEdit || picList.length === 5} onClick={this.showUploadImg}>
                            <b>+</b>
                            <p>上传照片</p>
                            <input type="file" accept=".png,.jpg,.gif" multiple onChange={this.upLoadImg} />
                          </div>
                        </ul>
                      </div>
                      <p className="picTip" hidden={!isEdit}>
                        单张图片大小不超过5M，最多可上传5张图片，支持PNG、JPG、GIF图片格式
                      </p>
                    </div>
                  </div>
                  <h3>抄送</h3>
                  <div className="CCList">
                    {mustcaosongList}
                    {chaosongList}
                    <div className="addCC" onClick={this.showAddPer} hidden={!isEdit}>
                      +
                    </div>
                  </div>

                  <div hidden={!isEdit}>
                    <Radio onClick={this.onlyReceiverVisible} checked={this.state.onlyReceiverVisible}>
                      仅抄送人可见
                    </Radio>
                  </div>
                  <div className="btn" hidden={!isEdit}>
                    <Button type="primary" onClick={this.showModal}>
                      提交
                    </Button>
                    <Button
                      onClick={() => {
                        this.handleOk(0);
                      }}
                    >
                      保存
                    </Button>
                  </div>
                  {this.state.showBack ? (
                    <div className="btn">
                      <Button type="primary" onClick={this.recall}>
                        撤回
                      </Button>
                    </div>
                  ) : (
                    ''
                  )}
                </div>
              </div>
            </Spin>
          </div>
        </div>
        <Modal
          title="提示"
          visible={this.state.visible}
          onCancel={this.handleCancel}
          footer={[
            <Button
              type="primary"
              key="confirm"
              onClick={() => {
                this.handleOk();
              }}
            >
              确定
            </Button>,
            <Button key="cancel" onClick={this.handleCancel}>
              取消
            </Button>,
          ]}
        >
          <p>确认提交周报？</p>
        </Modal>
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
                placeholder="请输入姓名"
                // onChange={this.inputNull}
                onSearch={this.onSearch}
              />
              <Tree
                checkable
                onExpand={this.onExpand}
                expandedKeys={this.state.expandedKeys}
                autoExpandParent={this.state.autoExpandParent}
                defaultExpandedKeys={this.state.expandedKeys}
                onCheck={this.onCheck}
                checkedKeys={this.state.checkedKeys}
                // onSelect={this.onSelect}
                // selectedKeys={this.state.selectedKeys}
                defaultExpandAll={true}
                treeData={this.state.personTree}
              />
            </div>
          </div>
        </Modal>
      </Fragment>
    );
  }
}

export default MyData;
