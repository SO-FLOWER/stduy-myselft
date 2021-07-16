import React, { Component, Fragment } from 'react';
import { Input, Select, Button, Pagination, message, Empty, Checkbox, Tree, Modal } from 'antd';
import { CloseOutlined } from '@ant-design/icons';

import {
  getUserList,
  getRolesList,
  getWorkTime,
  getDepartmentList,
  getAllDepartment,
  getPersonTree,
  deleteSuperior,
  setSuperior,
} from './../../../api/api'; // import ProAssignedMsg from '../proAssignedMsg/index.js'
import './index.less';
import Nav from '../nav/index.js';
import Titler from '../../compent/headerTitle/headerTitle';
import TimeCheckMsg from './memberChild.js';
const { Search } = Input;
const { Option } = Select;
let roleList = [];
let userIds = [];
let addSuperiorList = [];
class TimeCheck extends Component {
  state = {
    pagecurrent: 1,
    userName: '',
    pmName: '',
    status: '',
    allCount: 1,
    page: 1,
    dataList: [],
    treeData: [],
    treeKey: '',
    expandedKeys: [],
    chaosongPerson: [],
    levelData: {
      expandedKeys: [], //展开节点（受控）
      autoExpandParent: true, //是否自动展开父节点
      checkedKeys: [], //（受控）选中复选框的树节点（受控）选中复选框的树节点
      selectedKeys: [], //	（受控）设置选中的树节点
      allPersonTree: [],
      personTree: [],
    },
    defaultExpandParent: true,
    searchValue: '',
    chooseDeptId: '',
    autoExpandParent: true,
    NumList: [],
    addPm: [],
    statusList: [
      {
        id: '',
        text: '全部',
      },
      {
        id: 0,
        text: '在职',
      },
      {
        id: 1,
        text: '离职',
      },
    ],
  };

  componentDidMount() {
    // 获取全部部门
    getAllDepartment().then((res) => {
      if (res.data.code == 1) {
        console.log('获取全部部门', res.data.data.rows);
        this.setState({ treeData: res.data.data.rows, treeKey: res.data.data.rows[0].key });
        this.setState({ chooseDeptId: res.data.data.rows[0].id }, () => {
          this.unitTable({
            current: 1,
            deptId: this.state.chooseDeptId,
            name: '',
            roleId: '',
            size: 10,
            status: '',
          });
        });
      }
    });
    getDepartmentList().then((res) => {
      if (res.data.code == 1) {
        if (res.data.data.rows[0].children.length > 0) {
          this.unitTable({
            current: 1,
            deptId: res.data.data.rows[0].children[0].id,
            name: '',
            roleId: 0,
            size: 10,
            status: 0,
          });
        }
      }
    });
    let rolesData = {
      current: 1,
      roleName: '',
      size: 10,
    };
    getRolesList(rolesData).then((res) => {
      //获取角色下拉列表的数据
      if (res.data.code == 1) {
        let roleRows = res.data.data.rows;
        console.log('看下数据', res.data.data.rows);
        roleList = res.data.data.rows;
      }
    });

    getPersonTree().then((res) => {
      if (res.data.code === 1) {
        const personTree = res.data.data.rows;
        this.setState({
          levelData: {
            personTree,
            allPersonTree: personTree,
            expandedKeys: [personTree[0].key],
          },
        });
      } else {
        message.error(res.data.message);
      }
    });
  }
  getChildrenMsg = (result, msg, type) => {
    //父组件通过这个方法获取子组件传过来的值
  };
  unitTable = (data) => {
    getUserList(data).then((res) => {
      this.setState({
        dataList: res.data.data.rows,
        allCount: res.data.data.count,
        current: 1,
      });
    });
  };
  handleChange = (value, type) => {
    console.log(value);
    if (type == 'roleNames') {
      this.setState({ roleNames: value });
    } else {
      this.setState({ status: value });
    }
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
    console.log('走这里', page);
    this.setState({
      pagecurrent: page,
    });
    let data = {
      current: page,
      size: 10,
      deptId: this.state.chooseDeptId,
      checkStatus: this.state.status,
      username: this.state.userName,
      projName: this.state.pmName,
    };
    this.unitTable(data);
  };
  onChangeGetCheck = (checkedValues) => {
    this.setState({
      NumList: checkedValues,
    });
  };
  onCheckAllChange = (e) => {
    let a = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
    let aaa = e.target.checked ? a : [];
    this.setState({
      NumList: aaa,
    });
  };
  passAll = () => {
    let pmList = this.state.addPm;
    pmList.unshift({ newOne: true });
    console.log(pmList);
    this.setState({
      addPm: pmList,
    });
  };
  onSelect = (selectedKeys, info) => {
    console.log('selected', selectedKeys, info);
    this.setState({ chooseDeptId: selectedKeys[0] });
    this.unitTable({
      current: 1,
      deptId: selectedKeys[0],
      name: '',
      roleId: '0',
      size: 10,
      status: '',
    });
    // getUserList
  };
  message = (msg) => {
    // 通过形参接受到子组件的值并打印到控制台
    this.unitTable({
      current: 1,
      deptId: msg.deptId,
      name: '',
      roleId: 0,
      size: 10,
      status: 0,
    });
  };
  handleSearch = () => {
    this.setState({ pagecurrent: 1 });
    let a = {
      current: 1,
      roleId: this.state.roleNames,
      deptId: this.state.chooseDeptId,
      name: document.getElementsByClassName('ant-input')[0].value,
      size: 10,
      status: this.state.status,
    };
    this.unitTable(a);
  };
  findPm = () => {
    let a = {
      current: 1,
      size: 10,
      roleName: document.getElementsByClassName('roleName')[0].value,
    };
    this.unitTable(a);
  };

  showAddPer = (ids) => {
    if (this.state.NumList.length === 0 && ids === 'all') {
      return message.warn('请勾选需要批量直属上级的人');
    }

    // 群体设置
    if (ids === 'all') {
      const DATA = this.state.dataList;
      for (let i = 0; i < DATA.length; i++) {
        if (this.state.NumList.includes(i)) {
          userIds.push(DATA[i].userId);
        }
      }
    } else if (!userIds.includes(ids)) {
      // 单独设置
      userIds.push(ids);
    }
    this.setState({
      addPerson: true,
      chaosongPerson: [],
      levelData: {
        ...this.state.levelData,
        checkedKeys: [], //（受控）选中复选框的树节点（受控）选中复选框的树节点
        selectedKeys: [], //	（受控）设置选中的树节点
      },
    });
  };

  hiddenAddPer = (e) => {
    userIds = [];
    this.setState({
      addPerson: false,
    });
  };

  //	展开/收起节点时触发
  onExpand = (expandedKeys) => {
    this.setState({
      levelData: {
        ...this.state.levelData,
        expandedKeys,
        autoExpandParent: false,
      },
    });
  };

  //点击复选框触发
  onCheck = (checkedKeys, { checkedNodes }) => {
    let checkedNodes1 = [...checkedNodes];
    let aaa = this.state.chaosongPerson;
    if (checkedNodes.length == 0) {
      this.state.levelData.personTree.map((val1, index) => {
        this.state.chaosongPerson.map((val2, index1) => {
          if (val1.id == val2.id) {
            aaa.splice(index1, 1);
          }
        });
      });
    }

    if (this.state.levelData.personTree != this.state.levelData.allPersonTree) {
      checkedNodes1 = [...checkedNodes, ...aaa];
    }

    let chaosongPerson = checkedNodes1.filter((e) => e.type === 1);
    addSuperiorList = chaosongPerson;

    this.setState({
      chaosongPerson,
      levelData: {
        ...this.state.levelData,
        checkedKeys: chaosongPerson.map((e) => e.key),
        personTree: this.state.levelData.allPersonTree,
      },
    });
  };

  // 模糊搜索数据范围
  getSearch = (name) => {
    let data = this.state.levelData.allPersonTree;
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
    let obj = {
      levelData: {
        ...this.state.levelData,
      },
    };

    if (val === '') {
      obj.levelData.personTree = this.state.levelData.allPersonTree;
    } else {
      let result = this.getSearch(val);
      obj.levelData.personTree = result.length > 0 ? result : [];
    }
    this.setState(obj);
  };

  // 设置直属上级
  onSetSuperior = (e) => {
    let aaa = this.state.chaosongPerson;
    const superiorUserIdList = aaa.map((val) => {
      return val.userId;
    });

    setSuperior({
      superiorUserIdList,
      userIdList: userIds,
    }).then((res) => {
      message.success('直属上级设置成功');
      const newDataList = this.state.dataList.map((item) => {
        if (userIds.includes(item.userId)) {
          const LEN = item.superiorList.length;
          const superIds = item.superiorList.map((list) => {
            return list.userId;
          });

          for (let i = 0; i < addSuperiorList.length; i++) {
            const { avatar, userId, name: username } = addSuperiorList[i];
            if (i >= 3 - LEN || superIds.includes(userId)) {
              break;
            }

            item.superiorList.push({
              avatar,
              userId,
              username,
            });
          }
        }
        return item;
      });
      userIds = [];
      this.setState({
        addPerson: false,
        dataList: newDataList,
      });
    });
  };

  // 删除直属上级
  onDeleteSuperior = (delData) => {
    deleteSuperior({
      superiorUserId: delData.superiorId,
      userId: delData.userId,
    }).then(() => {
      message.success('删除成功');
      const newDataList = this.state.dataList.map((item) => {
        if (item.userId === delData.userId) {
          item.superiorList = item.superiorList.filter((level) => !delData.superiorId.includes(level.userId));
        }
        return item;
      });
      this.setState({
        dataList: newDataList,
      });
    });
  };

  // 删除弹窗选中
  delectChaosong = (id) => {
    let checkedKeys = this.state.levelData.checkedKeys;
    let chaosongPerson = this.state.chaosongPerson;
    checkedKeys.splice(id, 1);
    chaosongPerson.splice(id, 1);

    this.setState({
      chaosongPerson,
      levelData: {
        ...this.state.levelData,
        checkedKeys: [...checkedKeys],
      },
    });
  };

  render() {
    let addPm = '';
    let msgList = <Empty />;
    if (this.state.dataList.length > 0) {
      msgList = this.state.dataList.map((val, index) => {
        return (
          <div className="tableMsg" key={val.id}>
            <Checkbox value={index}></Checkbox>
            <TimeCheckMsg
              parent={this}
              key={val.id}
              msg={val}
              delete={this.onDeleteSuperior.bind(this)}
              onShowPer={this.showAddPer.bind(this)}
              type="edit"
            />
          </div>
        );
      });
    }
    if (this.state.addPm.length > 0) {
      addPm = this.state.addPm.map((val, index) => {
        return (
          <div className="tableMsg">
            <Checkbox value={index}></Checkbox>
            <TimeCheckMsg {...this.props} parent={this} msg={val} type="add" />
          </div>
        );
      });
    } else {
      addPm = '';
    }
    let statusvalue = this.state.statusList.map((val) => {
      return (
        <Option value={val.id} key={val.id}>
          {val.text}
        </Option>
      );
    });
    let rolelistValue = roleList.map((val) => {
      return (
        <Option value={val.roleId} key={val.roleId}>
          {val.roleName}
        </Option>
      );
    });
    let aaa = [this.state.treeKey];

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
    return (
      <Fragment>
        <Titler />
        <div className="content" style={{ display: 'flex' }}>
          <div className="left">
            {' '}
            <Nav />
          </div>
          <div className="Settingright" style={{ display: 'flex' }}>
            <div className="groupBox">
              {this.state.treeKey ? (
                <Tree
                  className="draggable-tree"
                  defaultSelectedKeys={aaa}
                  draggable
                  blockNode
                  // expandedKeys={this.state.expandedKeys}
                  // autoExpandParent={this.state.autoExpandParent}
                  // onDragEnter={this.onDragEnter}
                  onSelect={this.onSelect}
                  // defaultSelectedKeys
                  treeData={this.state.treeData}
                />
              ) : (
                ''
              )}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <div className="pmTitle">
                <ul className="selctWrap">
                  <li>
                    <label>姓名：</label> <Input ref="userName" style={{ width: '170px' }} placeholder="请输入" />
                  </li>
                  <li>
                    <label>状态：</label>
                    <div className="Item">
                      <Select
                        style={{ width: '120px' }}
                        defaultValue="请选择"
                        className="statusList"
                        onChange={(e) => {
                          this.handleChange(e, 'status');
                        }}
                      >
                        {statusvalue}
                      </Select>
                    </div>
                  </li>
                  <li>
                    <label>权限角色：</label>
                    <div className="Item">
                      <Select
                        style={{ width: '120px' }}
                        defaultValue="请选择"
                        className="roleList"
                        onChange={(e) => {
                          this.handleChange(e, 'roleNames');
                        }}
                      >
                        {rolelistValue}
                      </Select>
                    </div>
                  </li>
                  <li>
                    {' '}
                    <Button type="primary" onClick={this.handleSearch}>
                      搜索
                    </Button>
                  </li>
                </ul>
              </div>
              <div className="pmContent">
                <div className="addPro">
                  <Button onClick={() => this.showAddPer('all')} type="primary">
                    批量设置直属上级
                  </Button>
                </div>
                <div className="proTabel">
                  <div className="tableHeader">
                    <label style={{ position: 'relative', right: '1px' }}>
                      {' '}
                      <Checkbox onChange={this.onCheckAllChange}></Checkbox>
                    </label>
                    <label style={{ width: '100px' }}>姓名</label>
                    <label style={{ width: '100px', marginLeft: '5px' }}>联系方式</label>
                    <label style={{ width: '100px' }}>所属部门</label>
                    <label style={{ width: '100px' }}>岗位</label>
                    <label style={{ width: '100px', marginLeft: '14px' }}>状态</label>
                    <label style={{ width: '130px' }}>直属上级</label>
                  </div>
                  {addPm}
                  <Checkbox.Group style={{ width: '100%' }} value={this.state.NumList} onChange={this.onChangeGetCheck}>
                    {msgList}
                  </Checkbox.Group>

                  <div className="page">
                    <Pagination
                      total={this.state.allCount}
                      hideOnSinglePage={false}
                      current={this.state.pagecurrent}
                      onChange={this.changePage}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Modal
          title="添加人员"
          visible={this.state.addPerson}
          onCancel={this.hiddenAddPer}
          footer={[
            <Button type="primary" key="confirm" onClick={this.onSetSuperior}>
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
              <Search style={{ marginBottom: 8 }} placeholder="请输入姓名" onSearch={this.onSearch} />
              <Tree
                checkable
                onExpand={this.onExpand}
                expandedKeys={this.state.levelData.expandedKeys}
                autoExpandParent={this.state.levelData.autoExpandParent}
                defaultExpandedKeys={this.state.levelData.expandedKeys}
                onCheck={this.onCheck}
                checkedKeys={this.state.levelData.checkedKeys}
                defaultExpandAll={true}
                treeData={this.state.levelData.personTree}
              />
            </div>
          </div>
        </Modal>
      </Fragment>
    );
  }
}

export default TimeCheck;
