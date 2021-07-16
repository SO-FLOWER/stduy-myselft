import React, { Component, Fragment } from 'react';
import { Select, Button, DatePicker, Pagination, Tree, TimePicker, Tag, Avatar, message, Input, Modal } from 'antd';
import { DownOutlined ,CloseCircleFilled} from '@ant-design/icons';
import { getCategoryTree, addPm, getAllDepartment, delectPro, updatePmo ,getPersonTree,deleteProjPM} from '../../../api/api';
import moment from 'moment';
import { withRouter } from 'react-router-dom';
import './index.less';
import { statusStateMachine } from '../proAssignedMsg/index';

const { Option } = Select;
const { Search } = Input;
let treeData = [];

const dateFormat = 'YYYY/MM/DD';
// import axios from 'axios';

let flage=true;

class addProAssignedMsg extends Component {
  constructor(props) {
    super(props);
    this.state = {
      change: false,
      projNum: '',
      projName: '',
      deptName: '',
      deptName1:'',
      categoryList: [],
      categoryList1:[],
      categoryName: '',
      categoryName1:'',
      categoryId: '',
      id: '',
      startTime: '',
      endTime: '',
      deptId: '',
      flag: false,
      treeData: [],
      currentIndex: 0,
      deptName: '',
      deptNum: '',
      states: 0,
      getstatus:0,
      pmId: '',
      add: false,
      status: 0,
      addPerson: false,
      pmName: this.props.msg.pmName,
      pmName1: this.props.msg.pmName,
      pmId: this.props.msg.pmId,
      expandedKeys: [], //展开节点（受控）
      personTree:[],
      allPersonTree:[],
      autoExpandParent: true, //是否自动展开父节点
      checkedKeys: [], //（受控）选中复选框的树节点（受控）选中复选框的树节点
      showdeptChoice:false,
      showChange:false,
    };
  }

  componentWillUnmount() {}
  componentDidMount() {
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
          treeData : res.data.data.rows,
          treeData1 : res.data.data.rows,
        })
      
      } else {
        message.error(res.data.message);
      }
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
      categoryId: value,
    });
    if (this.state.add) {
      let data = {
        id: this.state.id,
        categoryId: value,
      };
      updatePmo(data).then((res) => {
        if (res.data.code == 1) {
          message.info('修改成功');
        } else {
          message.error(res.data.message);
        }
      });
    }
  };
  getCategoryTree = (id) => {
    id = id ? id : this.state.deptId;
    let data = '368243720';

    getCategoryTree(id).then((res) => {
      if (res.data.code == 1) {
        this.setState({
          categoryList: res.data.data.rows,
          categoryList1: res.data.data.rows,
        });
      } else {
        message.error(res.data.message);
      }
    });
  };
  startTime = (date, dateString) => {
    this.setState({
      startTime: dateString,
    });
    if (this.state.add) {
      if (dateString != '') {
        this.setState({
          startTime: moment(dateString, dateFormat),
        });
  
        let data = {
          id: this.state.id,
          startTime: dateString,
        };
        updatePmo(data).then((res) => {
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
  
        updatePmo(data).then((res) => {
          if (res.data.code == 1) {
            message.info('修改成功');
          } else {
            message.error(res.data.message);
          }
        });
      }
    }
  };
  endTime = (date, dateString) => {
    this.setState({
      endTime: dateString,
    });
    if (this.state.add) {
      if (dateString != '') {
        this.setState({
          endTime: moment(dateString, dateFormat),
        });
  
        let data = {
          id: this.state.id,
          endTime: dateString,
        };
        updatePmo(data).then((res) => {
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
  
        updatePmo(data).then((res) => {
          if (res.data.code == 1) {
            message.info('修改成功');
          } else {
            message.error(res.data.message);
          }
        });
      }
    }
  };
  sendPro = () => {
    if (this.state.projNum == '') {
      message.error('请输入项目名称');
      return;
    }
    if (this.state.deptName == '') {
      message.error('请选择所属部门');
      return;
    }

    let data = {};

    data = {
      deptName: this.state.deptName,
      deptId: this.state.currentIndex,
      projName: this.state.projNum,
    };
    if (this.state.categoryId != '') {
      data.categoryId = this.state.categoryId;
    }
    if (this.state.endTime != '') {
      data.endTime = this.state.endTime;
    }
    if (this.state.startTime != '') {
      data.startTime = this.state.startTime;
    }
    if (this.state.pmId != '') {
      data.pmId = this.state.pmId;
      data.pmName = this.state.pmName;
    }

    if (this.state.states != '') {
      data.status = this.state.states;
    }

    addPm(data).then((res) => {
      if (res.data.code == 1) {
        this.setState({
          deptNum: res.data.data.result.projNum,
          add: true,
          id: res.data.data.result.projId,
        });
        window.location.reload();
        message.info('添加成功！');

      } else {
        message.error(res.data.message);
      }
    });
  };

  changeProjNum = (e) => {
    this.setState({
      projNum: e.target.value,
    });
  };
  changeStatus = (value) => {
    this.setState({
      getstatus:value,
      showChange:true
    });
    if (this.state.add) {
      let data = {
        id: this.state.id,
        status: value,
      };
      updatePmo(data).then((res) => {
        if (res.data.code == 1) {
          message.info('修改成功');
        } else {
          message.error(res.data.message);
        }
      });
    }
  };
  toCYGL = () => {
    this.props.history.push({
      pathname: '/project/management/membersManagement',
      query: { id: this.state.id, name: this.state.projNum },
    });
  };
  toXMFX = () => {
    this.props.history.push({
      pathname: '/project/management/analysis',
      query: { id: this.state.id, name: this.state.projNum },
    });
  };
  hiddenAll = () => {
    console.log(123);
    this.setState({
      change: true,
    });
    window.location.reload();
  };
  delectPro = () => {
    let id = this.state.id;
    delectPro(id).then((res) => {
      if (res.data.code == 1) {
        this.setState({
          showAll: false,
        });
        message.info('删除成功');
        
        window.location.reload()
      } else {
        message.error(res.data.message);
      }
    });
  };
  delectPm=()=>{
    let id = this.state.id; 
    this.setState({
      pmName:''
    })
    if(id > 0){
      deleteProjPM(id).then(res=>{
        if(res.data.code == 1){
          message.info('删除成功')
        }else{
          message.error(res.data.message)
        }
      })
    }
  
  }
  //单选弹框
  handleOk = () => {
    this.setState({
      flag: false,
    });
    let data = this.state.currentIndex;

    getCategoryTree(data).then((res) => {
      if (res.data.code == 1) {
        this.setState({
          categoryList: res.data.data.rows,
          categoryList1: res.data.data.rows,
          deptName: this.state.deptName1
        });
      } else {
        message.error(res.data.message);
      }
    });

    if (this.state.add) {
      let data1 = {
        id: this.state.id,
        deptId: this.state.currentIndex,
        deptName: this.state.deptName1,
      };
      updatePmo(data1).then((res) => {
        if (res.data.code == 1) {
          message.info('修改成功');
        } else {
          message.error(res.data.message);
        }
      });
    }
  };
  handleCancel = () => {
    this.setState({ flag: false });
  };
  getCategoryTree1 = () => {

    this.setState({ flag: true,treeData1:this.state.treeData });
  };
  clicked = (id, name, e) => {
    this.setState({ currentIndex: id, deptName1: name }, () => {
      console.log('获取点击的id', id, name);
    });
  };
  onSearch1=(val)=>{
    console.log(val)
    if (val === '') {
      this.setState({
        treeData1 : this.state.treeData
      })
      // treeData1 = treeData;
    } else {
      let result = this.getSearch(val,1);
      console.log('打印下查询到的数据', result);
      if (result.length > 0) {
        // treeData1 = result
        this.setState({
          treeData1 : result
        })
      } else {
        // treeData1=[]
        this.setState({
          treeData1 : []
        })
      }
    }
  }
  onSearch2=(val)=>{
    console.log(val)
    if (val === '') {
      this.setState({
        categoryList : this.state.categoryList1
      })
      // treeData1 = treeData;
    } else {
      let result = this.getSearch(val,2);
      if (result.length > 0) {
        // treeData1 = result
        this.setState({
          categoryList : result
        })
      } else {
        // treeData1=[]
        this.setState({
          categoryList : []
        })
      }
    }
  }
  onSearch3=(val)=>{
    console.log(val)
    if (val === '') {
      this.setState({
        personTree : this.state.allPersonTree
      })
      // treeData1 = treeData;
    } else {
      let result = this.getSearch(val,3);
      console.log('打印下查询到的数据', result);
      if (result.length > 0) {
        // treeData1 = result
        this.setState({
          personTree : result
        })
      } else {
        // treeData1=[]
        this.setState({
          personTree : []
        })
      }
    }
  }
  getSearch = (name,index) => {
    let data = {};
    if(index == 1){
       data = this.state.treeData;
    }else if(index ==2){
        data = this.state.categoryList
    }else if(index == 3){
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
    //项目经理弹框
    hiddenAddPer = (e) => {
      console.log(e);
      this.setState({
        addPerson: false,
      });
    };
     addPer = (e) => {
  
      this.setState({
        addPerson: false,
        
      });
    };
    clicked1 = (id, name, pic,e) => {
      this.setState({ pmId: id, pmName: name ,avatar:pic}, () => {
        console.log('获取点击的id', id, name,pic);
      });
      let data = {
        id: this.state.id,
        pmId: id,
         pmName: name ,
         avatar:pic
      };
      updatePmo(data).then((res) => {
        if (res.data.code == 1) {
          message.info('修改成功');
        } else {
          message.error(res.data.message);
        }
      });
    };
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
     
      let chaosongPerson = checkedNodes.filter((e) => e.type === 1);
      this.setState({
        chaosongPerson,
        checkedKeys: chaosongPerson.map((e) => e.key),
      });
    };
    showAddPer = () => {
      this.setState({
        addPerson: true,
        personTree:this.state.allPersonTree
      });
    };
     //项目类别
  getdeptTree=()=>{
    console.log(this.state.categoryList1,this.state.categoryList)
    this.setState({
      showdeptChoice:true,
      categoryList:this.state.categoryList1
    })
  }
  hiddendeptTree=()=>{
    this.setState({
      showdeptChoice:false
    })
  }
  handleOk1 = () => {
    if(this.state.add){
      let data = {
        id: this.state.id,
        categoryId: this.state.categoryId,
      };
      updatePmo(data).then((res) => {
        if (res.data.code == 1) {
          this.setState({
            showdeptChoice: false,
            categoryName:this.state.categoryName1
          });
          message.info('修改成功');
        } else {
          message.error(res.data.message);
        }
      });
    }else{
      this.setState({
        showdeptChoice: false,
        categoryName:this.state.categoryName1
      });
    }
    
   
  };
  clicked2 = (id, name, pic,e) => {
    this.setState({ categoryId: id, categoryName1: name }, () => {
      console.log('获取点击的id', id, name,pic);
    });
    
  };
        //确定改变状态
        showSurestate=()=>{
          this.setState({
            showChange:false,
            status: this.state.getstatus,
          })
          if(this.state.add){
          let data = {
            id: this.state.id,
            status: this.state.getstatus,
          };
         
          updatePmo(data).then((res) => {
            if (res.data.code == 1) {
              message.info('修改成功');
              this.setState({
                
              });
            } else {
              message.error(res.data.message);
            }
          });
        }
        }
        hiddenSureState=()=>{
          this.setState({
            showChange:false
          })
        }
  render() {
   
    const statusState = statusStateMachine[this.state.status || 0];
    let statusOptions = [
      <Option value={statusState.value}>
        <Tag color={statusState.color}>{statusState.text}</Tag>
      </Option>,
    ];
    if (this.state.add) {
      statusOptions = statusOptions.concat(
        statusState.toStatus.map((val) => (
          <Option value={statusStateMachine[val].value}>
            <Tag color={statusStateMachine[val].color}>{statusStateMachine[val].text}</Tag>
          </Option>
        )),
      );
    }

    return (
      <Fragment>
        <div className={this.state.change ? 'hidden' : 'tableMsg'}  style={{display:'flex',justifyContent:'space-between'}}>
          {/* <label style={{ width: '85px' }}>{this.state.deptNum === '' ? '-' : this.state.deptNum}</label> */}
          {this.state.add ? (
            <label style={{ width: '210px' }}>{this.state.projNum}</label>
          ) : (
            <label style={{ width: '210px' }}>
              <input className="inputN" onChange={this.changeProjNum} />
            </label>
          )}

          <label style={{ width: '175px' }} onClick={this.getCategoryTree1}>
            <span className={['deptNameMsg',flage ? 'border' : null].join(' ')}>
              <em className="deptName">{this.state.deptName}</em>
              <DownOutlined />
            </span>
          </label>
          <label style={{ width: '100px' }} onClick={this.getdeptTree}>
            <span className={['deptNameMsg',flage ? 'border' : null].join(' ')}>
              <em className="deptName">{this.state.categoryName}</em>
              <DownOutlined />
            </span>
          </label>
          <label style={{ width: '105px' }} onClick={this.showAddPer} className={!this.state.pmName   ? '' : 'hidden'}>
            <span className="addPm">+</span>
          </label>
          <label style={{ width: '114px' }} className={this.state.pmName ? '' : 'hidden'} >
           <spn className='showAvatar'>
           {this.state.avatar ? (
                    <Avatar size={20} src={this.state.avatar} />
                  ) : this.state.pmName?(
                    <div className="headerIndex">{this.state.pmName[this.state.pmName.length - 1]}</div>
                  ):'-'}
                  <span className='close' onClick={this.delectPm}> <CloseCircleFilled /></span>
           </spn>
           {this.state.pmName}
         </label>
          <label style={{ width: '124px' }}>
            <DatePicker onChange={this.startTime} />
          </label>
          <label style={{ width: '124px' }}>
            <DatePicker onChange={this.endTime} />
          </label>
          <label style={{ width: '94px' }}>
            <Select value={this.state.status} style={{ width: 90 }} onChange={this.changeStatus}>
              {statusOptions}
            </Select>
          </label>
          {this.state.add ? (
            <label className="operation" style={{ width: '100px' }}>
              <span onClick={this.toCYGL}>成员管理</span>
              <span onClick={this.toXMFX}>项目分析</span>
              <span className="red" onClick={this.delectPro}>
                删除
              </span>
            </label>
          ) : (
            <label className="operation" style={{ width: '100px' }}>
              <span onClick={this.sendPro}>保存</span>
              <span onClick={this.hiddenAll}>取消</span>
            </label>
          )}
        </div>
        <Modal
          title="所属部门选择"
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
         <Search
                style={{ marginBottom: 8 }}
                placeholder="请输入快速搜索"
                // onChange={this.inputNull}
                onSearch={this.onSearch1}
              />
          <Tree
            
            onExpand={this.onExpand}
            treeData={this.state.treeData1}
            titleRender={(nodeData) => (
              <div className="oprateWrap" key={nodeData.id}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <span
                    onClick={(event) => this.clicked(nodeData.id, nodeData.title)}
                    className={` ${this.state.currentIndex == nodeData.id ? 'nocheckedCircle' : 'checkedCircle'}`}
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
          title="项目类别选择"
          visible={this.state.showdeptChoice}
          onCancel={this.hiddendeptTree}
          width={400}
          footer={[
            <Button type="primary" key="confirm" onClick={this.handleOk1}>
              确定
            </Button>,
            <Button key="cancel" onClick={this.hiddendeptTree}>
              取消
            </Button>,
          ]}
        >
         <div className="border1">
         <Search
                style={{ marginBottom: 8 }}
                placeholder="请输入快速搜索"
                // onChange={this.inputNull}
                onSearch={this.onSearch2}
              />
          <Tree
            
            onExpand={this.onExpand}
            treeData={this.state.categoryList}
            titleRender={(nodeData) => (
              <div className="oprateWrap" key={nodeData.id}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <span
                    onClick={(event) => this.clicked2(nodeData.id, nodeData.title, event)}
                    className={` ${this.state.categoryId == nodeData.id ? 'nocheckedCircle' : 'checkedCircle'}`}
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
        width={400}
          title="项目经理选择"
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
            <Search
                style={{ marginBottom: 8 }}
                placeholder="请输入快速搜索"
                // onChange={this.inputNull}
                onSearch={this.onSearch3}
              />
            <Tree
            onExpand={this.onExpand}
            treeData={this.state.personTree}
            titleRender={(nodeData) => (
              <div className="oprateWrap" key={nodeData.id}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  {nodeData.type == '1'? <span
                    onClick={(event) => this.clicked1(nodeData.userId, nodeData.title,nodeData.avatar, event)}
                    className={` ${this.state.pmId == nodeData.userId? 'nocheckedCircle' : 'checkedCircle'}`}
                  ></span>:''}
                

                  <span>{nodeData.title}</span>
                </div>
              </div>
            )}
          />
            
         
          </div>
        </Modal>
        <Modal title="提示" width={480} visible={this.state.showChange} onOk={this.showSurestate} onCancel={this.hiddenSureState}>
                                                        <p>请确认是否将项目状态调整为
                                                        {this.state.getstatus == 0?<Tag color='blue'>进行中</Tag>:''}
                                                        {this.state.getstatus == 1?<Tag color='red'>已暂停</Tag>:''}
                                                        {this.state.getstatus == 2?<Tag color='orange'>已结束</Tag>:''}
                                                        {this.state.getstatus == 3?<Tag color='green'>已归档</Tag>:''}
                                                        </p>
                                                </Modal>
      </Fragment>
    );
  }
}

export default withRouter(addProAssignedMsg);
