import React, { Component, Fragment } from 'react';
import { Input, Button, Select, Tooltip, Table, Tag, Space, Checkbox, Icon, Tree, Popconfirm, message } from 'antd';
import { getmenuChecked, authorizeMenu } from './../../../../api/api';
import Titler from '../../../compent/headerTitle/headerTitle';
import Nav from '../../nav/index.js'; //项目类别
import './index.less';
const { Option } = Select;
const CheckboxGroup = Checkbox.Group;
let roleList = [];
let alltableData = [];
let treeSelect = [];
let autoTree1 = [];
class membersManagement extends Component {
  constructor(props) {
    super(props);
    this.myref = React.createRef();
    this.state = {
      rolelistData: [],
      mydata1: [],
      mydata: [],
      roleName: '',
      treeSlect: [],
      autoTree: [],
      tableListData: [
        ,
        {
          title: '角色',
          dataIndex: 'roleName',
          key: 'roleName',
        },
        {
          title: '所属部门',
          dataIndex: 'deptName',
          key: 'deptName',
        },
        {
          title: '创建人',
          dataIndex: 'createBy"',
          key: 'createBy"',
        },
        {
          title: '创建时间',
          dataIndex: 'createTime',
          key: 'createTime',
        },
        {
          title: '角色权限',
          dataIndex: '',
          key: 'operation',
          width: '32%',
          render: (text, record, index) => (
            <span>
              <a className="roleSetting" href="#">
                权限设置
              </a>
              <a className="roleSetting " href="#">
                人员授权
              </a>
              <Popconfirm title="是否删除?" onConfirm={this.confirm} onCancel={this.cancel} okText="是" cancelText="否">
                <a className="roleSetting" href="#">
                  删除
                </a>
              </Popconfirm>
            </span>
          ),
        },
      ],
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
      submitData: []
    };
  }

  componentWillUnmount() {}
  async componentWillMount() {
    let jeuseparams = JSON.parse(sessionStorage.getItem('jeuseparams'));
    this.setState({ roleName: jeuseparams.roleName });
    await this.unitTable(window.location.pathname.split('/').slice('-1')[0]);
  }
  unitTable = (data) => {
    getmenuChecked(data).then((res) => {
      alltableData = res.data.data.rows;
      const test = this.treeData(alltableData);
      console.log(test)
      this.setState({
        rolelistData: res.data.data.rows,
        test,
        treeSlect: treeSelect,
        autoTree: autoTree1,
      });
    });
  };

  treeData = (data) => {
    return data.map((item) => {
      if(item.checked){
        treeSelect.push(item.id);
      }
      autoTree1.push(item.id);
      return {
        checked: item.checked,
        key: item.id,
        title: item.name,
        children: item.children.length ? this.treeData(item.children) : [],
      };
    });
  };

  confirm = (e) => {
    console.log(e);
    message.success('删除成功');
  };

  cancel = (e) => {
    console.log(e);
    message.error('删除失败');
  };
  onDelete = () => {};
  handleuser = () => {
    this.props.history.push({ pathname: `/setting/PermissionRole` });
  };
  handlesave = () => {

    
    console.log(this.state.submitData)

    let authorizeMenuData = {
      menuIds: this.state.submitData,
      roleId: Number(window.location.pathname.split('/').slice('-1')[0]),
    };

    authorizeMenu(authorizeMenuData).then((res) => {
      if (res.data.code == 1) {
        message.success('保存成功');
      } else {
        message.error(res.data.message);
      }
    });
  };
  //点击选中按钮
  checkThis = (item, e, fatherMsg, item1) => {
    console.log(item, e.type);
    let index = item;
    item1.children.map((val) => {
      val.checked = !item1.checked;
    });
    fatherMsg.children[item].checked = !fatherMsg.children[item].checked;
    fatherMsg.checked = false;
    fatherMsg.children.map((val) => {
      if (val.checked == true) {
        fatherMsg.checked = true;
      }
    });
    this.setState({
      checked: fatherMsg.children[item].checked,
    });
    console.log(fatherMsg);
  };
  // checkThis=(item,e)=>{
  //   console.log(item,e.type)
  //   item.checked=!item.checked
  //   this.setState({
  //     checked: item.checked
  //   })
  // }
  render() {
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

    const onCheck = (checkedKeys, info) => {
      this.setState({
        treeSlect: checkedKeys,
        submitData: [...checkedKeys,...info.halfCheckedKeys]
      });
    };

    // 收起展开tree
    const onExpand = (expandedKeys, info) => {
      this.setState({
        autoTree: expandedKeys,
      });
    };
    return (
      <Fragment>
        <div className="settingBox">
          <Titler />
          <div className="content setttingWrap">
            <div className="left">
              {' '}
              <Nav />
            </div>
            <div style={{ width: '100%' }}>
              <ul className="selctWrap">
                <li>
                  <Button type="primary" onClick={this.handleuser}>
                    返回
                  </Button>
                </li>
                <li className="selctWrap-title">{this.state.roleName}</li>
                <li>
                  <Button type="primary" onClick={this.handlesave}>
                    保存
                  </Button>
                </li>
              </ul>
              <div className="Settingright">
                <div className="weekconfigWrap">
                  <div className="tableWrap">
                    <Tree
                      checkable
                      expandedKeys={this.state.autoTree}
                      checkedKeys={this.state.treeSlect}
                      onCheck={onCheck}
                      treeData={this.state.test}
                      onExpand={onExpand}
                    />
                    {/* {this.state.rolelistData.map((e1, index1) => (
                      <table
                        border="1"
                        cellSpacing="0"
                        cellPadding="0"
                        style={{ borderCollapse: 'collapse', border: '1px solid #ddd' }}
                      >
                        <tbody>
                          <tr key={index1}>
                            <td className="activerowSpan" rowSpan={e1.children.length + 1}>
                              {e1.name}
                            </td>
                          </tr>
                          {e1.children.map((e2, index2) => (
                            <tr key={index2}>
                              {e2.name ? (
                                <td className="secondeNam">
                                  <div>
                                    <input
                                      checked={e2.checked}
                                      type="checkbox"
                                      onChange={(e) => {
                                        this.checkThis(index2, e, e1, e2);
                                      }}
                                      name="favorite"
                                      value={e2.id}
                                    />
                                    {e2.name}
                                  </div>{' '}
                                </td>
                              ) : null}
                              <td>
                                {e2.children.map((e3, index3) => (
                                  <span key={index3}>
                                    {e3.name ? (
                                      <span className="textWrap">
                                        <input
                                          type="checkbox"
                                          onChange={(e) => {
                                            this.checkThis(index3, e, e2, e3);
                                          }}
                                          name="favorite"
                                          checked={e3.checked}
                                          value={e3.id}
                                        />
                                        {e3.name}{' '}
                                      </span>
                                    ) : null}{' '}
                                  </span>
                                ))}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    ))} */}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Fragment>
    );
  }
}

export default membersManagement;
