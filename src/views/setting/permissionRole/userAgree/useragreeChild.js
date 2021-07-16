import React,{Component,Fragment} from 'react';
import {Select, Button,DatePicker,Pagination ,TimePicker ,Tag,Avatar, message, } from 'antd';
import SelectComponet from '../../../compent/selectComponet/f.js'
import { UserOutlined,CaretLeftOutlined,CaretRightOutlined ,CloseCircleFilled,CheckOutlined,CloseOutlined,LockOutlined,EditOutlined} from '@ant-design/icons';
import {updateHourNum,passWorkTime,addRole,authorizeOneUser,getTreeDeptById} from './../../../../api/api'
import { DownOutlined} from '@ant-design/icons';
import '../index.less';
import { withRouter } from 'react-router'
import moment from 'moment';
const { Option } = Select;
const dateFormat = 'YYYY/MM/DD';

class useragreeChild extends Component {
    constructor(props) {
        super(props);
        this.state={
            authorizerName:'',
            deptName:'',
            userName:'',
            authorizerTime: "2020-11-18 16:48:33",
            roleId:'',
            userIds:'',
            F:[]
         }
      }
    

    componentDidMount(){
        console.log('看下父组件传过来的值',this.props.msg)
       this.setState({
        authorizerName:this.props.msg.authorizerName,
        deptName:this.props.msg.deptName,
        userName:this.props.msg.userName,
        authorizerTime: this.props.msg.authorizerTime,
        roleId: this.props.msg.roleId,
        userIds:this.props.msg.userIds,
        deptVOs:this.props.msg.deptVOs
       })
      
    }
    componentWillReceiveProps(props) {
        console.log('看下父组件传过来的值',this.props.msg)
        this.setState({
            authorizerName:props.msg.authorizerName,
            deptName:props.msg.deptName,
            userName:props.msg.userName,
            authorizerTime: props.msg.authorizerTime,
            roleId: props.msg.roleId,
            userIds:props.msg.userIds,
            deptVOs:props.msg.deptVOs
           })
    }
    linechange=()=>{
        this.props.parent.getChildrenMsg(this, '保存数据','cancle')//触发父组件方法更新数据
    }
    toParent=(e,type,val,userId)=>{//子组件通过调用父组件的方法保存值传给子组件
        e.nativeEvent.stopImmediatePropagation();
        // console.log('为何',type)
       if(type=='add'){
            // addRole({
            //     "deptIds": [145554519],
            //     "roleName": this.state.roleName
            // }).then(res=>{
            //     if(res.data.code == 1){
            //         message.info('修改成功')
            //     }else{
            //         message.info('网络错误！')
            //     }
            // })
            // this.props.parent.getChildrenMsg(this, '保存数据')//触发父组件方法更新数据
       }else if(type=='del'){
        // this.toParent(e,'del',this.props.msg.roleId,this.props.msg.userId)}
        this.props.parent.getChildrenMsg(this.props.match.params.id, '删除数据','delete',userId)
       }else if(type=='authorizeOneUser'){
           console.log(e,type,val)
           let  deptIds=[]
           if(val.length>0){
                val.map((v,index)=>{
                    deptIds.push(v.deptId)
                })
           }
           console.log(e,type,val,userId)
           this.props.parent.getChildrenMsg(deptIds,userId,'authorizeOneUser')
       }else{
         
        // this.props.parent.getChildrenMsg(this.props.match.params.id, '保存数据','delete')//删除传参
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
    clickNav1=(e,val)=>{
        console.log(this.props)
        this.props.history.push({ pathname: `/PermissionRole/permissionSet/${ e }`, state: {deptId: e}})
        // console.log('是否执行点击事件',e)
      }
      clickNav2=(e,val)=>{
        this.props.history.push({ pathname: `/PermissionRole/userAgree/${ e }`, state: {deptId: e }})
        console.log('是否执行点击事件',e)
      }
    delete=(id,v)=>{
        console.log('点击删除角色',this)
        this.props.parent.getChildrenMsg(this, '','delete')//触发父组件方法删除角色信息
        // delRole
    }
    nochange = () =>{
        this.setState({
            showChange:false
        })
    }
    changeTime = (e) =>{
        this.setState({
            changeTime:e.target.value
       })
    }
    sendTIme=()=>{
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
    authorizeOneUser=(e,id)=>{
        console.log(e,id)
        // authorizeOneUser({
        //     "deptIds": [],
        //     "roleId": 0,
        //     "userId": 0
        // }).then(res=>{

        // })
    }
    render(){
   
      
        return (
            <Fragment> 
       
                {
                this.state.type=='add'?(
                    // onClick={this.getCategoryTree}
                    <Fragment >
                        <label  style={{width:'100px'}}><input className="inputN" onChange={this.state.roleName} defaultValue={this.state.roleName}/></label>
                        <label  style={{width:'210px'}} ><span className='deptNameMsg' ><em className='deptName'>
                            {/* {this.state.deptName} */}
                         
                            </em><DownOutlined /></span></label>
                        <label  style={{width:'200px'}}></label>
                        <label  style={{width:'200px'}}></label>
                        <label  style={{width:'200px'}} className='operation' ><span    onClick={(e)=>{this.toParent(e,'add')}}>保存</span><span onClick={this.linechange}>取消</span></label>
                       </Fragment>
                ): <Fragment>
                        <label style={{width : '100px'}}>{this.state.userName}</label>
                        <label style={{width : '200px'}}>{this.state.deptName}</label>
                        <label  style={{width : '200px'}} onClick={(e)=>{this.toParent(e,'authorizeOneUser',this.state.deptVOs,this.props.msg.userId)}}> 
                            {this.props.msg.deptVOs.map((item, idx) => (
                            <span key={idx} className='caosongList'>
                                {item.deptName}<CloseOutlined />
                                </span>
                            ))
                            }   
                        </label> 
                        <label style={{width : '100px'}}>{this.state.authorizerName}</label>  
                        <label  style={{width : '200px'}}>{this.state.authorizerTime}</label>  
                        <label style={{width : '100px'}}  ><a href="#"  style={{color:'red'}}  onClick={(e)=>{this.toParent(e,'del',this.props.msg.roleId,this.props.msg.userId)}}>删除</a></label>

                </Fragment>
                        
           
          
   
            }  
           
        
         </Fragment>
            
        )
    }
}


// export default ;
export default withRouter(useragreeChild)