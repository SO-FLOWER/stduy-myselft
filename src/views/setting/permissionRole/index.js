import React,{Component,Fragment} from 'react';
import Praise from './../../../img/praise.png';
import {Select, Button,DatePicker,Pagination ,Tag ,message,Empty,Table,Checkbox, } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import {getProjList,getWorkTime,passWorkTime,getRolesList,delRole,addRole} from '../../../api/api'
// import ProAssignedMsg from '../proAssignedMsg/index.js'
// import AddProAssignedMsg from '../addProAssignedMsg/index.js'
import './index.less';
// import Left from '../compents/leftRouter/index';
import Titler from '../../compent/headerTitle/headerTitle'
import TimeCheckMsg from './test1child.js';
// import AddChild from './addChild.js';//添加组件列表
import Nav from '../nav/index.js'
const { Option } = Select;
let addPm=''

class TimeCheck extends Component {
   
    constructor(props) {
        super(props);
        this.state={
            userName : '',
            pmName:'',
            status:'',
            allCount:1,
            page:1,
            dataList:[],
            NumList:[],
            addPm:[],
            childRolename:'',
            pList:[],
        }
     
      }
   

    componentDidMount(){
        let pList = window.sessionStorage.getItem('powerList')? window.sessionStorage.getItem('powerList'):[]
 
    if(pList.length>0){
    

      pList = pList.split(',')
    }
    this.setState({
      pList:pList
    })
        this.uiidata()
    }
    uiidata=()=>{
        this.unitTable({
            "current": 1,
            "roleName": "",
            "size": 10
        }
          )
    }
    getChildrenMsg = (result, msg,type) => {//父组件通过这个方法获取子组件传过来的值
        // result 子组件传过来的输入框的值
        console.log('父组件通过这个方法获取子组件传过来的值',result, msg,type)
        if(type=='cancle'){this.setState({ addPm:[]})
        }else if(type=='delete'){
            delRole({ "roleId":result }).then(res=>{
                if(res.data.code==1){
                    message.success('删除角色成功')
                    this.uiidata()    // 很奇怪这里的result就是子组件那bind的第一个参数this，msg是第二个参数
                }else{
                    message.error(res.data.message);
                }
              })
        }else{
            console.log('是否执行到这里')
            addRole({
                "deptIds": [msg],
                "roleName": result
            }).then(res=>{
                if(res.data.code == 1){
                    // console.log('添加角色成功',res.data)
                    message.info('添加角色成功')
                    // addPm=''
                    this.setState({
                    addPm:[],
                    childRolename:''})//点击确定后清空子组件输入框的值
                     this.uiidata()   
                }else{
                    message.info('网络错误！')
                }
            })

        }
    }
    unitTable = (data) =>{
        getRolesList(data).then(res=>{
            if(res.data.code==1){
                console.log('点击查询后更新数据',res.data.data.rows)
                this.setState({
                    dataList :res.data.data.rows,
                    allCount :res.data.data.count,
                    current :1  })
            }else{
                message.error(res.data.message);
            }
          })
    } 
    handleChange = (value) => {

        this.setState({
            status:value
    })
    }


    getUserName = (e)=>{
        this.setState({
            userName:e.target.value
       })
      }
      getPmName = (e)=>{
        this.setState({
            pmName:e.target.value
       })
      }
    
 
      changePage =(page) =>{
        let data = {
            current:page,
            size:10,
            checkStatus:this.state.status,
            username:this.state.userName,
            projName:this.state.pmName
          }
          this.unitTable (data)
     
        }

   
      onChangeGetCheck = (checkedValues) =>{
          
        this.setState({
            NumList:checkedValues
         })

      }
      onCheckAllChange = (e)=>{
          let a = [0,1,2,3,4,5,6,7,8,9]
         let aaa =  e.target.checked?a:[];
         this.setState({
            NumList:aaa
         })

      }
      passAll=()=>{
        console.log('数组为空执行',this.state.addPm.length)
        if(this.state.addPm.length==0){
            let pmList = this.state.addPm;
            pmList.unshift({newOne : true});
            console.log(pmList)
            this.setState({
                addPm : pmList
            })
        }else{
            message.error('输入框的角色名不能为空！')
        } 
      
        // if(){}
    //   console.log(this.props)
      }
      findPm=()=>{
        let a= {
            "current": 1,
            size:10,
            "roleName": document.getElementsByClassName('roleName')[0].value,
        }
          this.unitTable(a)
      }

    render(){
        
          let msgList = <Empty />
          if(this.state.dataList.length>0){
         
              msgList = this.state.dataList.map((val,index)=>{
                    return (<div className='tableMsg'>
                        <Checkbox value={index}></Checkbox><TimeCheckMsg parent={ this } key={index} msg = {val} type = "edit"/>
                        </div>
                    )
              })
          }
          if(this.state.addPm.length>0){
            addPm = this.state.addPm.map((val,index)=>{
               return  ( <div className='tableMsg'><Checkbox value={index}></Checkbox><TimeCheckMsg   {...this.props} parent={ this }  msg = {val} type = "add"/></div>) 
                
            })
        }else{
            addPm=''
        }
        return (
            <Fragment>
              
              <Titler />
                 <div className='content'>
                 <div className='left'> <Nav/></div>

                        <div className='right'>
                                <div className='pmTitle'>
                                    <div className='ib' > <label>角色:</label> <input type="text" onChange={this.getUserName}  className='roleName' style={{width:'168px'}} /></div> 
                                     <div className='ib btn'><Button type='primary' onClick={this.findPm}>查询</Button></div>      

                                </div>

                                <div className='pmContent' >
                                        <div className='addPro' >
                                        {this.state.pList.indexOf('setting:permit_role:createRole') > -1?
                                            <Button    onClick={this.passAll} type='primary'>创建角色</Button>:''
                                        }
                                        </div>
                                        <div className='proTabel'>
                                            <div className='tableHeader'>
                                            <label style={{position : 'relative',right:'12px'}}> <Checkbox onChange={this.onCheckAllChange} ></Checkbox></label>
                                                <label style={{width : '100px'}}>角色</label>
                                                <label style={{width : '200px'}}>所属部门</label>
                                                <label style={{width : '200px'}}>创建人</label>  
                                                <label  style={{width : '200px'}}>创建时间</label>  
                                                <label  style={{width : '200px'}}>权限角色</label>  
                                            </div>
                                            {addPm}
                                            <Checkbox.Group  style={{ width: '100%' }}  value={this.state.NumList} onChange={this.onChangeGetCheck   }>
                                                    {msgList}   
                                            </Checkbox.Group>
                                           
                                                
                                                <div className='page'><Pagination defaultCurrent={1} total={this.state.allCount} hideOnSinglePage={false}   onChange={this.changePage}/></div>
                                        </div>
                                </div>

                                </div>
                 </div>
            </Fragment>
            
        )
    }
}


export default TimeCheck;