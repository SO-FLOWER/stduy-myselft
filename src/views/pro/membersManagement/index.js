import React, { Component, Fragment } from 'react';
import { Tree, Input, Button, message, Modal, Avatar, Tooltip, Select } from 'antd';
import { PlusOutlined, CloseOutlined } from '@ant-design/icons';
import {
  getProMenMsg,
  getPositionList,
  getPersonTree,
  addProUser,
  delectProUser,
  updatePosition,
} from './../../../api/api';
import './index.less';
import MembersManagementMsg from './../membersManagementMsg/index';
import Left from '../compents/leftRouter/index';
import Titler from '../../compent/headerTitle/headerTitle';
const { Option } = Select;
const { Search } = Input;
// import axios from 'axios';

class MembersManagement extends Component {
  state = {
    proName: '',
    proJobList: [],
    list: [],
    addPerson: false,
    chaosongPerson: [],
    personTree: [],
    expandedKeys: [],
    autoExpandParent: true, //是否自动展开父节点
    checkedKeys: [], //（受控）选中复选框的树节点（受控）选中复选框的树节点
    selectedKeys: [], //	（受控）设置选中的树节点
  };
  componentWillUnmount() {}
  componentDidMount() {
    console.log(this.props.location.query);
    let data = {
      current: 1,
      size: 50,
      projId: this.props.location.query.id,
    };
    this.setState({
      proName: this.props.location.query.name,
    });
    getProMenMsg(data).then((res) => {
      if (res.data.code == 1) {
        this.setState({
          proJobList: res.data.data.rows,
        });
      } else {
        message.error(res.data.message);
      }
      getPositionList().then((res) => {
        if (res.data.code == 1) {
          this.setState({
            list: res.data.data.rows,
          });
        } else {
          message.error(res.data.message);
        }
      });
    });
    getPersonTree().then((res) => {
      let vvv = [];
      vvv = JSON.parse(JSON.stringify(res.data.data.rows));

      this.setState({
        allPersonTree: vvv,
      });
      console.log('aaa', this.state.allPersonTree);
      if (res.data.code == 1) {
        let personList = {};
        personList = [...res.data.data.rows];
        this.changeList(personList);
        let num = [];
        num[0] = personList[0].key;
        this.setState({
          personTree: personList,
          expandedKeys: num,
        });
      } else {
        message.error(res.data.message);
      }
    });
  }
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
  inputNull = () => {
    this.setState({
      findlist: [],
    });
  };
  showAddPer = () => {
    this.setState({
      addPerson: true,
    });
  };

  handleChange = (value) => {
    console.log(`selected ${value}`);
  };

  hiddenAddPer = (e) => {
    console.log(e);
    this.setState({
      addPerson: false,
    });
  };
  addPer = (e) => {
    let list = [];
    if (this.state.chaosongPerson.length > 0) {
      this.state.chaosongPerson.map((val) => {
        console.log(val);
        let aa = {
          avatar: val.avatar,
          userId: val.userId,
          username: val.name,
        };
        list.push(aa);
      });
    }
    let data = {
      projId: this.props.location.query.id,
      projName: this.props.location.query.name,
      userInfoList: list,
    };
    addProUser(data).then((res) => {
      if (res.data.code == 1) {
        message.info('添加成功');
        let data1 = {
          current: 1,
          size: 50,
          projId: this.props.location.query.id,
        };
        getProMenMsg(data1).then((res) => {
          if (res.data.code == 1) {
            this.setState({
              proJobList: res.data.data.rows,
              addPerson: false,
            });
          } else {
            message.error(res.data.message);
          }
        });
      } else {
        message.error(res.data.message);
      }
    });
  };
  exitPro = (id) => {
    delectProUser(id).then((res) => {
      if (res.data.code == 1) {
        const proJobList = this.state.proJobList.filter((item) => item.id !== id);
        this.setState({
          proJobList,
        });
      } else {
        message.error(res.data.message);
      }
    });
  };
  //点击复选框触发
  // onCheck = (checkedKeys) => {
  //   let a = [];
  //   if (checkedKeys.length == 0) {
  //     this.setState({
  //       chaosongPerson: [],
  //     });
  //   } else {
  //     checkedKeys.map((val) => {
  //       if (val.length < 6) {
  //         this.addChaosongPerson(this.state.allPersonTree, val, a);
  //       }
  //     });
  //   }
  //   this.setState({ checkedKeys });
  // };
  addChaosongPerson = (list, id, a) => {
    if (list.length > 0) {
      list.map((val) => {
        // console.log(id,val);
        if (val.id == id) {
          //   let chaosongPerson = this.state.chaosongPerson;
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
  // onSearch = (val) => {
  //   this.findPerson(this.state.personTree, val);
  //   //  let

  //   this.setState({
  //     expandedKeys: this.state.findlist,
  //   });
  // };
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
  onExpand = (expandedKeys) => {
    // if not set autoExpandParent to false, if children expanded, parent can not collapse.
    // or, you can remove all expanded children keys.
    this.setState({
      expandedKeys,
      autoExpandParent: false,
    });
  };
  onSelect = (selectedKeys, info) => {
    console.log('onSelect', info);
    this.setState({ selectedKeys });
  };
  goBackPage = () => {
    this.props.history.goBack(); //返回上一页这段代码
  };
  // delectChaosong = (id) => {
  //   console.log(id, this.state.checkedKeys);
  //   let removeId = this.state.checkedKeys;
  //   let list = this.state.chaosongPerson;
  //   for (var i = 0; i < removeId.length; i++) {
  //     if (removeId[i].length > 4) {
  //       removeId.splice(i, 1);
  //     }

  //     if (removeId[i] == list[id].id) {
  //       removeId.splice(i, 1);
  //     }
  //   }
  //   list.splice(id, 1);
  //   this.setState({
  //     chaosongPerson: list,
  //     checkedKeys: removeId,
  //   });
  // };

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

  editJob = (id) => {
    const proJobList = this.state.proJobList.map((item) => {
      item.isEditJob = item.id === id;
      return item;
    });
    setTimeout(() => {
      this.refs.inputRef.focus();
    }, 100);
    this.setState({
      proJobList,
    });
  };

  enterJob = (e, id) => this.refs.inputRef.blur() && this.submitJob(e, id);

  submitJob = (e, id) => {
    const proJobList = this.state.proJobList.map((item) => {
      if (item.id === id) {
        item.isEditJob = false;
        item.projPosition = e.target.value;
      }
      return item;
    });
    let data = {
      id: id,
      projPosition: e.target.value,
    };
    updatePosition(data).then((res) => {
      if (res.data.code == 1) {
        message.info('修改成功');
        this.setState({
          proJobList,
        });
      } else {
        message.info('网络错误');
      }
    });
  };

  render() {
    let caosongL = '';
    if (this.state.chaosongPerson.length > 0) {
      caosongL = this.state.chaosongPerson.map((val, index) => {
        return (
          <div className="caosongList" key={val.name}>
            {val.name}{' '}
            <label onClick={() => this.delectChaosong(index)}>
              <CloseOutlined />
            </label>
          </div>
        );
      });
    } else {
      caosongL = <p></p>;
    }
    let msgList = '';
    if (this.state.proJobList.length > 0) {
      msgList = this.state.proJobList.map((val) => {
        return <MembersManagementMsg key={Math.random()} msg={val} />;
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
            <div className="membersManagement">
              <div className="proName">
                <Button type="primary" onClick={this.goBackPage}>
                  返回
                </Button>
                <h3>{this.state.proName}</h3>
              </div>
              <div className="members">
                <div className="addMember">
                  {' '}
                  <Button type="primary" onClick={this.showAddPer} icon={<PlusOutlined />}>
                    添加成员
                  </Button>
                </div>
                <table className="pro_member">
                  <tr>
                    <th>序号</th>
                    <th>成员姓名</th>
                    <th>所属部门</th>
                    <th>岗位</th>
                    <th>电话</th>
                    <th>首次加入</th>
                    <th>最近加入</th>
                    <th>操作</th>
                  </tr>
                  <tbody>
                    {this.state.proJobList.map((val) => {
                      return (
                        <tr key={val.id}>
                          <td>{val.serialNumber}</td>
                          <td>
                            {val.avatar == '' ? (
                              <div className="headerPic">{val.username[val.username.length - 1]}</div>
                            ) : (
                              <Avatar src={val.avatar} />
                            )}
                            {val.username}
                          </td>
                          <td>{val.deptName}</td>
                          <td className="pro_member-jobs">
                            {!val.isEditJob ? (
                              <div className="pro_member-edit-box">
                                <div className="pro_member-edit">{val.projPosition}</div>
                                <i className="pro_member-edit-ico" onClick={() => this.editJob(val.id)}></i>
                              </div>
                            ) : (
                              <Input
                                className="pro_member-edit-ipt"
                                onBlur={(e) => this.submitJob(e, val.id)}
                                ref="inputRef"
                                maxLength="10"
                                defaultValue={val.projPosition}
                                onPressEnter={(e) => this.enterJob(e, val.id)}
                              />
                            )}
                          </td>
                          <td>{val.mobile}</td>
                          <td>{val.firstJoinTime}</td>
                          <td>{val.updateTime}</td>
                          <td>
                            <a href="javascript:;" className="pro_member-quit" onClick={() => this.exitPro(val.id)}>
                              退出
                            </a>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
                {/* <div className="memberTable">
                  <div className="tableTitle">
                    <label style={{ width: '140px' }}>成员姓名</label>
                    <label style={{ width: '140px' }}>所属部门</label>
                    <label style={{ width: '140px' }}>岗位</label>
                    <label style={{ width: '140px' }}>电话</label>
                    <label style={{ width: '140px' }}>首次加入</label>
                    <label style={{ width: '140px' }}>最近加入</label>
                    <label style={{ width: '140px' }}></label>
                  </div>
                  {msgList}
                </div> */}
              </div>
            </div>

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
          </div>
        </div>
      </Fragment>
    );
  }
}

export default MembersManagement;
