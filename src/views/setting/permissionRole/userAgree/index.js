import React,{Component,Fragment} from 'react';
import {Select, Button,DatePicker,Pagination ,Tag ,message,Empty,Table,Checkbox,Modal,Input } from 'antd';
import {getPersonTree,getrolesUserList,delUserRole,getTreeDeptById,authorizeUser,authorizeOneUser} from './../../../../api/api'
import { BrowserRouter as Router,Route} from 'react-router-dom';
import Titler from '../../../compent/headerTitle/headerTitle'
import Nav from '../../nav/index.js'//项目类别
import SelectComponet from '../../../compent/selectComponet/j.js'
import UseragreeChild from './useragreeChild.js';
// useragreeChild.js
const { Option } = Select;
let personList=[]
let departmenList=[]
console.log('跳转后取值',JSON.parse(sessionStorage.getItem('params')))// JSON 字符串转换为对象

class userAgree extends Component {
  
    state={
        personList:[],
        departmenList:[],
        userName : '',
        pmName:'',
        status:'',
        allCount:1,
        page:1,
        dataList:[],
        NumList:[],
        addPm:[],
        isShow:false,
        flag1:false,
        flag: false , // 控制子组件的显示和隐藏
        roleId:Number(window.location.pathname.split('/').slice('-1')[0]),
        deptIds: [],
        userIds: [],
        userId:'',
        clearData:false,//清除子组件的数据
        // data
    }

    componentDidMount(){
        let parent ={//传给父组件的值 roleId
            "deptIds": [],
            "roleId":this.state.roleId,//角色ID
            "userId": 0,
            "userIds": []
        }
       this.unitTable({
        "current": 1,
        "size": 10,
        "roleId": this.state.roleId
      })
      let clickData=JSON.parse(sessionStorage.getItem('jeuseparams'))
      console.log('取数据',clickData)
        getTreeDeptById(clickData.deptId).then(res=>{
            console.log('获取数据范围',res.data.data.rows)
           if(res.data.code == 1){
            departmenList=res.data.data.rows
            }else{
                message.error(res.data.message);
             }
        })
        getPersonTree().then(res=>{
            if(res.data.code == 1){
                personList=res.data.data.rows
            }else{
                message.error(res.data.message);
            }
           
        })
   
    }
    getChildrenMsg = (result, msg,type,userIds) => {//父组件通过这个方法获取子组件传过来的值
        console.log('父组件通过这个方法获取子组件传过来的值',result, msg,type)
        if(type=='cancle'){this.setState({ addPm:[]})
        }else if(type=='authorizeOneUser'){
            this.setState({flag1:true,deptIds:result,userId:msg})
            // result 所选的数据范围
            console.log('修改数据范围',result, msg,type,userIds)
        }else if(type=='delete'){
            console.log('点击删除',{"roleId":result,"userIds":userIds})
            delUserRole( {"roleId":result,"userIds":userIds}).then(res=>{
                if(res.data.code==1){
                    message.success('删除人员成功')
                    this.unitTable({
                        "current": 1,
                        "size": 10,
                        "roleId": this.state.roleId
                      })
                }else{
                    message.error(res.data.message);
                }
              })
        }
    }
    unitTable = (data) =>{
        getrolesUserList(data).then(res=>{
            if(res.data.code==1){
                this.setState({dataList:res.data.data.rows,allCount:res.data.data.count})
            }
          })
         
    } 
    handleChange = (value) => {

        this.setState({
            status:value
    })
    }
    handleCanceldata= (value) => {
    this.setState({flag1:false,clearData:true})
    }
    handleOkdata= (value) => {//修改数据范围
        console.log('valu',this.state.deptIds)
        authorizeOneUser({
            "deptIds":this.state.deptIds,
            "roleId":this.state.roleId,
            "userId": this.state.userId,
        }).then(res=>{
            if(res.data.code==1){
              message.success('修改数据范围成功')
              this.unitTable({
                "current": 1,
                "size": 10,
                "roleId": this.state.roleId
              })
            }else{
                message.success('修改数据范围失败')
            }
           
        })
        this.setState({flag1:false,deptIds:[]})
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
          this.unitTable({
            "current": page,
            "size": 10,
            "roleId": this.state.roleId
          })
       
      }

      handleuser = () =>{
        this.props.history.push({ pathname: `/setting/PermissionRole`})
      } 
      onChangeGetCheck = (checkedValues) =>{
          
        this.setState({
            NumList:checkedValues
         })

      }
      passAll=()=>{
        this.setState({
            flag: true
        });
      }
    parentCLcik=(val)=>{
        this.setState({deptIds:val})   
        console.log('子组件一,',val)//
    }
    parentCLcik2=(val)=>{
        this.setState( {userIds:val})  
        console.log('子组件二,',val)
    }
    parentCLcik3=(val)=>{
        // this.setState( {deptIds:val.checked})  
        this.setState( {deptIds:val})  
        console.log('子组件三,',val)
    }
    handleOk = e => {
        console.log('添加',this.state.userIds)
        authorizeUser( {
            "deptIds":this.state.deptIds,
            "roleId": this.state.roleId,
            "userIds": this.state.userIds
        }).then(res=>{
            if(res.data.code == 1){
                message.info('添加成功')
                this.unitTable({
                    "current": 1,
                    "size": 10,
                    "roleId": this.state.roleId
                })
            }else{
                message.error(res.data.message);
            }
        })
        this.setState({
            flag: false,
        }, () => {});
      };
    
      handleCancel = e => {
        this.setState({ flag: false}, () => { });
      };
    render(){
         let addPm=''
          let msgList = <Empty />
          if(this.state.dataList.length>0){
         
              msgList = this.state.dataList.map((val,index)=>{
                    return (<div className='tableMsg'>
                        <Checkbox value={index}></Checkbox><UseragreeChild parent={ this } key={index} msg = {val} type = "edit"/>
                        </div>
                    )
              })
          }
        return (
            <Fragment>
              
              <Titler />
                 <div className='content'>
                 <div className='left'> <Nav/></div>

                        <div className='right'>
                                <div className='pmTitle'>
                                    <div className='ib' > <Button type='primary' onClick={this.handleuser}>返回</Button></div> 
                                     {/* <div className='ib btn'><Button type='primary' >保存</Button></div>       */}

                                </div>

                                <div className='pmContent' >
                                        <div className='addPro' >
                                        {/* <div className="addCC" onClick={this.showAddPer}>+ </div>。 */}
                                            <Button    onClick={this.passAll} type='primary' >添加</Button>
                                        </div>
                                        <div className='proTabel'>
                                            <div className='tableHeader'>
                                                <label style={{position : 'relative',right:'12px'}}> <Checkbox onChange={this.onCheckAllChange} ></Checkbox></label>
                                                <label style={{width : '100px'}}>姓名</label>
                                                <label style={{width : '200px'}}>所属部门</label>
                                                <label  style={{width : '200px'}}>数据范围 </label> 
                                                <label style={{width : '100px'}}>授权人</label>  
                                                <label  style={{width : '200px'}}>授权时间</label>  
                                                <label  style={{width : '100px'}}>授权角色</label>  
                                            </div>
                                            {addPm}
                                            <Checkbox.Group style={{ width: '100%' }} value={this.state.NumList} onChange={this.onChangeGetCheck   }>
                                                    {msgList}   
                                            </Checkbox.Group>
                                           
                                                
                                                <div className='page'><Pagination defaultCurrent={1} total={this.state.allCount} hideOnSinglePage={false}   onChange={this.changePage}/></div>
                                        </div>
                                </div>

                                </div>
                 </div>
                 <div> 
               {
                this.state.flag ?   <Modal
                        title="添加授权"
                        visible={this.state.flag}
                        onCancel={this.handleCancel}
                        footer={[
                            <Button type="primary" key='confirm' onClick={this.handleOk}>确定</Button>,
                            <Button key='cancel' onClick={this.handleCancel}>取消</Button>
                        ]}  >
                    <div style={{display:'flex',justifyContent:'space-between',marginBottom:'10px'}}><label  >角色:主管理员</label></div>
                    <SelectComponet departmenList={departmenList} type={'departmenList'} clearData={this.state.clearData} handleClick={this.parentCLcik}/> 
                    <SelectComponet  personList={personList} type={'personList'} clearData={this.state.clearData} handleClick2={this.parentCLcik2}/> 
                </Modal>  : ''
                }
                 {
                this.state.flag1 ? <Modal
                    title="修改数据范围"
                    visible={this.state.flag1}
                    onCancel={this.handleCanceldata}
                    footer={[
                        <Button type="primary" key='confirm' onClick={this.handleOkdata}>确定</Button>,
                        <Button key='cancel' onClick={this.handleCanceldata} clearData={this.state.clearData}>取消</Button>
                    ]}  >
                <SelectComponet departmenList={departmenList} type={'personList2'} handleClick3={this.parentCLcik3}/> 
                </Modal>  : ''
                }
             
                   
                  </div>
            </Fragment>
            
        )
    }
}


export default userAgree;