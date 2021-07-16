import React,{Component,Fragment} from 'react';
import {Input, Button,Select,Tooltip,Table, Tag, Space ,Pagination} from 'antd';
import {getUserList,getRolesList} from './../../../api/api'
import Titler from '../../compent/headerTitle/headerTitle'
import '../index.less'
import Nav from '../nav/index.js'
import DepartList from '../departList/index.js'//项目类别
const { Option } = Select;
let  tableListData = [,
    {
      title: '姓名',
      dataIndex: 'userName',
      key: 'username',
    },
    {
      title: '联系方式',
      dataIndex: 'mobile',
      key: 'mobile',
    },
    {
      title: '所属部门',
      dataIndex: 'deptName',
      key: 'deptName',
    },
    {
        title: '岗位',
        dataIndex: 'position',
        key: 'position',
      },
      {
        title: '状态',
        dataIndex: 'status',
        key: 'status',
      },
      {
        title: '权限角色',
        dataIndex: 'roleNames',
        key: 'roleNames',
      }
  ];
let roleList=[]
class membersManagement extends Component {
  constructor(props){
    super(props)
      this.myref=React.createRef();

      this.state={
        headData:[],
        roleNames:'',
        status:'',
        statusList:[{
          id:'',
          text:'全部'
      },{
            id:0,
            text:'在职'
        },{
           id:1,
           text:'离职'
       }],
       }
    }
    
    componentWillUnmount(){
           
    };
    componentDidMount(){
        let userData = {
            "current":1,
            "name": "",
            "size": '',
            "status": 0
        }   
        let rolesData={
          "current": 1,
          "roleName": "",
          "size": 1000
        }
        getRolesList(rolesData).then(res=>{
          if(res.data.code==1){
            let roleRows=res.data.data.rows;
            roleRows.map((val,key)=>{
              roleList.push({
                roleId:roleRows[key].roleId,
                roleName:roleRows[key].roleName
              })
              console.log('获取权限角色数据',roleList)
            })
          }
        })

        this.unitTable(userData)
    }; 
    handleChange =(value,type) => {
      console.log(value)
      if(type=='roleNames'){
        this.setState({roleNames:value,})
      }else{
        this.setState({status:value,})
      }
      
     
    }
    unitTable = (data) =>{
        getUserList(data).then(res=>{
          this.setState({headData:res.data.data.rows})
        })
    }  
    handleSearch = () =>{
      console.log(  document.getElementsByClassName('statusList')[0].value,)
      let a={
        "current":1,
        "roleId": this.state.roleNames,
        "name": document.getElementsByClassName('ant-input')[0].value,
        "size": 10,
        "status":this.state.status
      }
      this.unitTable(a)
    } 
    render(){
        let  statusvalue = this.state.statusList.map(val=>{
            return(
            <Option value={val.id}  key={val.id}>{val.text}</Option>
            )
          })
       let  rolelistValue=roleList.map(val=>{
            return(
            <Option value={val.roleId}  key={val.roleId}>{val.roleName}</Option>
            )
          })
        return (
          <Fragment>
              <div className='settingBox'>
                <Titler />
                <div className='content setttingWrap'>
                <div className='left'><Nav/> </div>
                    <div className='Settingright' >
                            <div className='weekconfigWrap' style={{width:'100%'}}>
                              {/* <div>人员管理</div> */}
                              <ul className='selctWrap'>
                                  <li><label>姓名：</label>  <Input ref='userName' style={{width:'170px'}} placeholder="请输入" /></li>
                                  <li>
                                    <label>状态：</label>
                                    <div className='Item'> 
                                        <Select defaultValue="请选择"  className='statusList' onChange={e => {this.handleChange(e,'status');}}>
                                        { statusvalue}
                                        </Select>
                                    </div>
                                  </li>
                                  <li>
                                    <label>权限角色：</label>
                                    <div className='Item' > 
                                        <Select defaultValue="请选择"  className='roleList' onChange={e => {this.handleChange(e,'roleNames');}}>
                                        { rolelistValue}
                                        </Select>
                                    </div>
                                  </li>
                                  <li> <Button type="primary" onClick={this.handleSearch}>搜索</Button></li>
                              </ul>
                              <Table  columns={tableListData} dataSource={this.state.headData} />
                          </div>
                        
                            
                        </div>
                </div>
              </div>
        
          </Fragment>
          
         
            
        )
    }
}


export default membersManagement;