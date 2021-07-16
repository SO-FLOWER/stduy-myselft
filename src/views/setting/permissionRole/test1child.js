import React,{Component,Fragment} from 'react';
import {Select, Button,Tree,DatePicker,Pagination ,TimePicker ,Tag,Avatar, message ,Input,Modal} from 'antd';
import { DownOutlined} from '@ant-design/icons';
import {departmenList,updateHourNum,passWorkTime,addRole,delRole,getAllDepartment} from '../../../api/api'
import { withRouter } from 'react-router'
import SelectComponet from '../../compent/selectComponet/f.js'
import './index.less';
import moment from 'moment';
const { Option } = Select;
const { Search } = Input;
const dateFormat = 'YYYY/MM/DD';
let depart=[]
let treeData =[];

class TimeCheckMsg extends Component {
    constructor(props) {
        super(props);
        this.state={
            roleName:'',
            createBy:'',
            createTime:'2020-10-01',
            deptName:'',
            newdeptName:'',//选中的时候赋值
            roleName:'',
            roleId:'',
            flag:false,
            type:'',//确定组件 是否是添加或者编辑
            lineHide:'block',// 通过点击当前列表来控制添加的列表组件是否显示隐藏
            currentIndex:0,
            alldata:[],
            pList:[],
            // departName:''
         }
        //  console.log(props.roleName)
      }
    
      changeData(data){
        let that = this
        let jsonObj = data
        data.forEach(function(item){
          item.name && (item.title = item.name)
          item.id && (item.key = item.id)
          delete item.name
          delete item.id
          if(item.children && Array.isArray(item.children)){
            item.children = that.changeData(item.client)
            delete item.client
          }
        })  
        return jsonObj
      }
//   通过递归调用一步步更新格式 再删除之前的格式 有需要的可以参考下 
  
    componentDidMount(){
        let pList = window.sessionStorage.getItem('powerList')? window.sessionStorage.getItem('powerList'):[]
 
    if(pList.length>0){
    

      pList = pList.split(',')
    }
    this.setState({
      pList:pList
    })
        console.log('看下父组件传过来的值',this.props)
        getAllDepartment().then(res=>{
            if(res.data.code==1){
                treeData =res.data.data.rows
                this.setState({alldata:res.data.data.rows})
              console.log('部门数据',res.data.data.rows)
              }else{
                message.error(res.data.message)
              }
        })
       this.setState({
        roleName:this.props.msg.roleName,
        createBy: this.props.msg.createBy,
        deptName: this.props.msg.deptName,
        createTime:this.timestampToTime(this.props.msg.createTime) ,
        type:this.props.type,
        roleId:this.props.roleId
       })
      
    }
    componentWillReceiveProps(props) {
        // console.log('看下父组件传过来的值',this.props)
        this.setState({
            roleName:props.msg.roleName,
            createBy: props.msg.createBy,
            deptName: props.msg.deptName,
            createTime:this.timestampToTime(props.msg.createTime),
            type:props.type,
            roleId:props.roleId
           })
    }
     timestampToTime=(timestamp) =>{
        var date = new Date(timestamp);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
        var Y = date.getFullYear() + '-';
        var M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
        var D = date.getDate() + ' ';
        var h = date.getHours() + ':';
        var m = date.getMinutes() + ':';
        var s = date.getSeconds();
        return Y+M+D;
    }
    linechange=()=>{
        this.props.parent.getChildrenMsg(this, '保存数据','cancle')//触发父组件方法更新数据
    }
    toParent=(e,type,id)=>{//子组件通过调用父组件的方法保存值传给子组件
        e.nativeEvent.stopImmediatePropagation();
        console.log('为何',type)
       if(type=='add'){
          
            this.props.parent.getChildrenMsg(this.state.roleName, this.state.currentIndex)//触发父组件方法更新数据
       }else{
         
        this.props.parent.getChildrenMsg(id, '保存数据','delete')//删除传参
       }
         
    }
    getTime= (data) =>{
        var time = new Date(data);
        var y = time.getFullYear();
        var m = time.getMonth()+1;
        var d = time.getDate();
        var h = time.getHours();
        var mm = time.getMinutes();
        var s = time.getSeconds();
        
        return y+'-'+this.add0(m)+'-'+this.add0(d)+' '+this.add0(h)+':'+this.add0(mm)+':'+this.add0(s);
    }
    add0=(m)=>{return m<10?'0'+m:m }
    passMsg=()=>{
        let idList = []
        idList.push(this.state.id)
        let data= {
            idList:idList
        }
        passWorkTime(data).then(res=>{
            if(res.data.code == 1){
                this.setState({
                    checkStatus:2
                })
                message.info('通过成功')
            }else{
                message.error(res.data.message);
            }
        })
    }
    changeInfo = () =>{
        this.setState({
            showChange:true
        })
    }
    clickNav1=(roleId,deptId,roleName,type,e)=>{
        sessionStorage.setItem('jeuseparams', JSON.stringify({'deptId': deptId,'roleId':roleId, 'roleName':roleName}));
        if(type=='set'){
            this.props.history.push({ pathname: `/setting/PermissionRole/permissionSet/${ roleId }`, state: {roleId: roleId}})
        }else{//人员授权
            this.props.history.push({ pathname: `/setting/PermissionRole/userAgree/${  roleId }`, state: {roleId: roleId }})
        }
        console.log('点击',e,roleId,deptId,roleName,type)
      }
      clickNav2=(e,deptId,val)=>{
        // sessionStorage.setItem('params', JSON.stringify({deptId: deptId,roleId:e }));
        // sessionStorage.setItem('jeuseparams', JSON.stringify({deptId: deptId,roleId:roleId, roleName:roleName}));
        console.log('是否执行点击事件',e,val,deptId)
      }
    delete=(id,v)=>{
        this.props.parent.getChildrenMsg(this, '','delete')//触发父组件方法删除角色信息
    }
    nochange = () =>{
        this.setState({
            showChange:false
        })
    }
    getCategoryTree=()=>{
        console.log('点击获取 部门')
        this.setState({flag:true})
    }
    changeTime = (e) =>{
        this.setState({
            changeTime:e.target.value
       })
    }
    inputOnBlur=(e)=>{
        // console.log('失去焦点事件',e.target.value)
        this.setState({
            roleName:e.target.value
        })
    }
    handleCancel=()=>{
        this.setState({flag:false})
    }
    handleOk=()=>{
        this.setState({flag:false,deptName:this.state.newdeptName})
        this.props.parent.getChildrenMsg(this,this.state.currentIndex,'add')//触发父组件方法更新数据
    }
     // 模糊搜索数据范围
   getSearch= (name) => {
    let data=treeData
     var hasFound = false, // 表示是否有找到id值
       result = null;
       let resultdata=[]
       let key=[]
     var fn = function (data) {
       if (Array.isArray(data) && !hasFound) { // 判断是否是数组并且没有的情况下，
         data.forEach(item => {
            if (item.name.indexOf(name) != -1 ) { // 数据循环每个子项，并且判断子项下边是否有id值
             result = item; // 返回的结果等于每一项
            if(key.indexOf(result.key)==-1){
             resultdata.push(result)
             key.push(result.key)
            }
             // hasFound = true; // 并且找到id值
           } else if (item.children) {
             fn(item.children); // 递归调用下边的子项
           }
         })
       }
     }
     fn(data); // 调用一下
     return resultdata;
   } 
        // 查询
    onSearch=(val)=>{
        let alldata=this.state.treeData;
        console.log(val,this.state.alldata)
        if(val==''){
            this.setState({alldata:treeData})
        }else{
            let result =this.getSearch(val)
            console.log('打印下查询到的数据',result)
            if(result.length>0){
                this.setState({alldata:result})
            }else{
                this.setState({alldata:[]})
            }
          
        }

    }
    searchChange=(e)=>{
        this.onSearch(e.target.value)
    }
    sendTIme=(e)=>{
        if(this.state.changeTime == ''){
            message.error('请输入工时');
            return 
        }
        let data = {
            hourNum: this.state.changeTime,
            id :this.state.id
        }
        updateHourNum(data).then(res=>{
                if(res.data.code == 1){
                    this.setState({
                        hourNum : this.state.changeTime,
                        showChange :false
                    })
                    message.info('修改成功')
                }else{
                    message.info('网络错误！')
                }
        })
    }
    clicked=(id,name,e)=>{
        this.setState({currentIndex:id,newdeptName:name},()=>{
            console.log('获取点击的id',id,name)
        })
       
    }
    render(){
        return (
            <Fragment> 
       
                {
                this.state.type=='add'?(
                    <Fragment >
                        <label  style={{width:'100px'}}>
                             <Input  onChange={this.state.roleName} defaultValue={this.state.roleName} onBlur={this.inputOnBlur.bind(this)} />
                        </label>
                        <label  style={{width:'210px'}} onClick={this.getCategoryTree}><span className='deptNameMsg'
                        style={{width:'200px',display:'inline-block',overflow:'hidden'}}
                        >{this.state.deptName}<DownOutlined /></span></label>
                        <label  style={{width:'200px'}}></label>
                        <label  style={{width:'200px'}}></label>
                        <label  style={{width:'200px'}} className='operation' ><span    onClick={(e)=>{this.toParent(e,'add')}}>保存</span><span onClick={this.linechange}>取消</span></label>
                    </Fragment>
                ): <Fragment>
                     <label style={{width : '100px'}}>{this.state.pList.indexOf('setting:permit_role:roleName') > -1?this.state.roleName:'-'}</label>
                    <label style={{width : '210px'}}>{this.state.pList.indexOf('setting:permit_role:deptName') > -1?this.state.deptName:'-'}</label>
                    <label style={{width : '200px'}}>{this.state.pList.indexOf('setting:permit_role:createBy') > -1?this.state.createBy:'-'}</label>
                    <label style={{width : '200px'}}>{this.state.pList.indexOf('setting:permit_role:createTime') > -1?this.state.createTime:'-'}</label>
                    {this.state.pList.indexOf('setting:permit_role:operate') > -1?
                         <label style={{width : '200px'}}  >
                         <a  href="#"   style={{color:'#1677FF'}} onClick={this.clickNav1.bind(this,this.props.msg.roleId,this.props.msg.deptId,this.props.msg.roleName,'set')}>权限设置</a>
                         <a href="#"   style={{margin:'0 20px',color:'#1677FF'}} onClick={this.clickNav1.bind(this,this.props.msg.roleId,this.props.msg.deptId,this.props.msg.roleName,'user')}>人员授权</a>
                         <a href="#"  style={{color:'red'}}  
                         onClick={(e)=>{this.toParent(e,'del',this.props.msg.roleId)}}
                        >删除</a></label>
                        : <label style={{width : '200px'}}>-</label>}
               
                </Fragment>
                        
             
          
   
            }  
              <div> 
                 <Modal
                    title="所属部门"
                    visible={this.state.flag}
                    onCancel={this.handleCancel}
                    footer={[
                        <Button type="primary" key='confirm' onClick={this.handleOk}>确定</Button>,
                        <Button key='cancel' onClick={this.handleCancel}>取消</Button>
                    ]}  >
                         <Search style={{ marginBottom: 8 }}   
                           placeholder= {'请输入所属部门' }
                           onChange={this.searchChange} onSearch={this.onSearch}/>
                          <Tree
                            onExpand={this.onExpand}
                            treeData={this.state.alldata}
                            titleRender={(nodeData)=>(<div className='oprateWrap' 
                            key={nodeData.id}  >   
                            <div style={{display:"flex",alignItems:"center"}}>
                            <span    onClick={(event)=>this.clicked(nodeData.id,nodeData.title,event)} className={` ${this.state.currentIndex== nodeData.id?'nocheckedCircle': 'checkedCircle' }`}></span>
                            <span>{nodeData.title}</span>
                            </div>
                            </div>)}
                         />

                </Modal>   
                  </div>
        
         </Fragment>
            
        )
    }
}


// export default ;
export default withRouter(TimeCheckMsg)