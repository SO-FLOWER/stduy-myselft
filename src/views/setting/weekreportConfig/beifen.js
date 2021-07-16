import React,{Component,Fragment} from 'react';
import { DatePicker, Space,TimePicker } from 'antd';
import Titler from '../../compent/headerTitle/headerTitle'
import Nav from '../nav/index.js'
import 'moment/locale/zh-cn';
import locale from 'antd/lib/locale/zh_CN';
import { Tree  ,Select, Input  ,Avatar , Button,Radio ,Modal,Image ,message,ConfigProvider } from 'antd';
import { UserOutlined,CaretLeftOutlined,CaretRightOutlined ,CloseCircleFilled,CheckOutlined,CloseOutlined,LockOutlined,EditOutlined} from '@ant-design/icons';
import {copyUserList,getRemindTime,getPersonTree,addcopyUser,RemindTime,submitTime,endsubmitTime,delcopyUser,getDepartmentList} from './../../../api/api';
import './weekreportConfig.less'
import moment from 'moment';
import DepartList from '../departList/index.js'//项目类别
import itemCategory from '../itemCategory/itemCategory';
const format = 'HH:mm';
const { TreeNode } = Tree;
const { Search } = Input;
const { RangePicker } = DatePicker;
const { Option } = Select;
const dateFormat = 'YYYY/MM/DD';
class weekreportConfig extends Component {
    constructor(props){
   
        super(props)
          this.state={
              page:this.props.msg,
              addPerson:false,
              imgList:[],
              personTree:[],
              expandedKeys: [], //展开节点（受控）
              autoExpandParent: true,    //是否自动展开父节点
              checkedKeys: [],  //（受控）选中复选框的树节点（受控）选中复选框的树节点
              selectedKeys: [], //	（受控）设置选中的树节点
              chaosongPerson:[],
              deptId:'',//部门ID
              endTime:'',//周报截至时间
              defaultdayOfWeekStart:'',//提醒时间默认值（周）
              defaultdayOfWeekend:'',//提醒时间默认值（周）
              endDayOfWeekName:'',
              endDayOfWeekVal:'',//周报截至事件（星期选select）
              endDayOfWeekList:[
                {key:1,text:'星期一'},
                {key:2,text:'星期二'},
                {key:3,text:'星期三'},
                {key:4,text:'星期四'},
                {key:5,text:'星期五'},
                {key:6,text:'星期六'},
                {key:7,text:'星期日'},
              ],//周报截至周
              chaosongList :[], //头像抄送
              endDayOfWeek:'',//周报截至周
              remindWeekName1:'',//
              remindWeekName2:'',//
              remindTimeList:[
                {
                  "dayOfWeek": 4,
                  "remindTime": ''
                },
                {
                  "dayOfWeek": 6,
                  "remindTime": ""
                }
              ],
  
          }
    }
    componentWillUnmount(){
       
    };
    week = (data) =>{
          
    }  
    onSearch  = (val)=>{
      this.findPerson(this.state.personTree,val)
     //  let 
   
         this.setState({
             expandedKeys:this.state.findlist
         })
   }
   inputNull = () =>{
     this.setState({
         findlist:[]
     })
   }
   findPerson = (list , name) =>{
    if(list.length > 0 ){
      list.map(val=>{
          if(val.title == name){
              let findlist = this.state.findlist;
              findlist.push(val.key);
              this.setState({
                  findlist:findlist,
               
              })
          }
          this.findPerson(val.children,name)
      })
    }
}
    delectChaosongSend=(id)=>{
      delcopyUser({
        "deptId": this.state.deptId,
        "userId": id
      }).then(res=>{
        if(res.data.code==1){
          message.success('删除成功');
          this.comon(this.state.deptId)  // 操作dom执行局部刷新
        }else{
          message.error('删除失败!')
        }
      })
   

    }
    // 1、在这里中声明一个函数，用于接收子组件的传值
    message= (msg) => {
    // 通过形参接受到子组件的值并打印到控制台
        console.log(msg)
        this.setState({deptId:msg.deptId})
        this.comon(msg.deptId)
    }
    renderTreeNodes = data =>
    data.map(item => {
      if (item.children) {
        return (
          <TreeNode title={item.title} key={item.key} dataRef={item}>
            {this.renderTreeNodes(item.children)}
          </TreeNode>
        );
      }
      return <TreeNode key={item.key} {...item} />;
    });
    showAddPer = () => {
        this.setState({
            addPerson: true,
        });
      };
      changeList= (list) =>{
        if(list.length > 0 ){
            for(let i = 0 ;i<list.length ;i++){              
                let linshi = {
                    title : list[i].name,
                    key  : list[i].id.toString(),
                    children :list[i].children,
                    // icon: ({ true}) => (selected ? <FrownFilled /> : <FrownOutlined />)
                }
                list[i]=linshi;
                this.changeList(list[i].children);
            }
          
        }
    }
    hiddenAddPer = e => {this.setState({addPerson: false,});};
    handleChange =(value,type) => {
        this.defaultweekName(value,type)
        let newarr= this.state.remindTimeList
       if(type=='week1'){ 
           this.setState({endDayOfWeekVal:value},()=>{
             console.log('chaegshi',this.state.endDayOfWeekVal)
           })//设置选取的下拉框的值
           this.getendsubmitTime(this.state.endTime,value)
        }else  if(type=='week2'){ 
          newarr[0].dayOfWeek=value
          this.updateRemindTime(newarr)// updateRemindTime
       }else{
        newarr[1].dayOfWeek=value
        this.updateRemindTime(newarr)// updateRemindTime
       }
        console.log(`selected ${value}`,type);

        // dayOfWeek
      }
    //	展开/收起节点时触发
    onExpand = expandedKeys => {
        this.setState({
          expandedKeys,
          autoExpandParent: false,
        });
      };
      addChaosongPerson=(list , id,a) =>{
        if(list.length > 0 ){
          list.map(val=>{
              if(val.id == id){  
                  a.push(val);
                  this.setState({
                    chaosongPerson:a,
                  })
              }
              this.addChaosongPerson(val.children,id,a)
          })
        }
    }
      //点击复选框触发
    onCheck = checkedKeys => {
     
        let a = [];
        if(checkedKeys.length == 0){
            this.setState({
                chaosongPerson :[],
            })
        }else{
            checkedKeys.map(val=>{
                if(val.length < 6){
                   
                    this.addChaosongPerson(this.state.allPersonTree,val,a);
                  
                }
            })
         
        }
      
        console.log(a)
        this.setState({ checkedKeys });
      };
      //点击树节点触发
      onSelect = (selectedKeys, info) => {
        console.log('onSelect', info);
        this.setState({ selectedKeys });
      };
      addPer = e => {
        console.log(e);
        this.setState({
            addPerson: false,
        });
        let userList=[]
        this.state.chaosongPerson.map((val,index)=>{
            userList.push({
                "userId":val.userId,
                "username":val.name
            })
        })
        let copyData={
            "deptId": this.state.deptId,
            "userList": userList
        }
        console.log('判断下是否是空数组',copyData)
        if(userList.length>0){
          addcopyUser(copyData).then(res=>{
            if(res.data.code==1){
              message.success('添加成功');
              this.comon(this.state.deptId)  
            }else{
              message.error(res.data.message)
            }
         })
       
        }
       
      
      };
    componentDidMount(){
        getDepartmentList().then(res=>{
          if(res.data.code==1){
            if(res.data.data.rows[0].children.length>0){
              this.comon(res.data.data.rows[0].children[0].id)
            }
       
          }
      })
        // this.week()  
        getPersonTree().then(res=>{
            console.log('aaa',res.data);
            let vvv= [];
              vvv = JSON.parse(JSON.stringify(res.data.data.rows));
            
            this.setState({
                allPersonTree:vvv,
           
            })
            console.log('aaa',this.state.allPersonTree)
            if(res.data.code == 1){
                let personList = {};
                 personList = [...res.data.data.rows];
               this.changeList(personList);
                let num =[]
                num[0] = personList[0].key;
                this.setState({
                    personTree:personList,
                    expandedKeys:num
                })
               
            }else{
                message.error(res.data.message);
            }
        })
    }; 
    componentWillReceiveProps (nextProps) {
    
     
    }
    comon=(id)=>{
      copyUserList(id).then(res=>{
        if(res.data.code==1){
            this.setState({imgList:res.data.data.rows})
        }
      })
      // this.setState({deptId:id})
      getRemindTime(id).then(res=>{//获取周报提醒时间
        console.log('获取周报提醒时间',res)
          if(res.data.code==1){
              if(res.data.data.result.remindTimeList.length>0){
                let remindTimeList=res.data.data.result.remindTimeList;
                this.setState({  remindTimeList:remindTimeList })
                this.defaultweekName(remindTimeList[0].dayOfWeek,'week2')
                this.defaultweekName(remindTimeList[1].dayOfWeek,'week3')
              }else{
                this.setState({ remindTimeList:[
                    {
                      "dayOfWeek": 4,
                      "remindTime": ''
                    },
                    {
                      "dayOfWeek": 6,
                      "remindTime": ""
                    }
                  ] })
              }
          
          }
         
      })
      submitTime(id).then(res=>{//获取周报截至时间
        if(res.data.code==1){
            this.setState({
                endTime:res.data.data.result.endTime,
                endDayOfWeek:res.data.data.result.endDayOfWeek,
            })
            this.defaultweekName(res.data.data.result.endDayOfWeek)
        }
       
    })
    }
    defaultweekName=(value,type)=>{//修改下拉框选中的周时间
        let endDayOfWeekName=''
        this.state.endDayOfWeekList.map((val,text)=>{
           if(val.key==value){ endDayOfWeekName=val.text }
       })
        if(type=='week2'){
            this.setState({ remindWeekName1:endDayOfWeekName })
        }else if(type=='week3'){
            this.setState({ remindWeekName2:endDayOfWeekName })
        }else{
            this.setState({ endDayOfWeekName:endDayOfWeekName, })
        }
    }
    delectChaosong=(id)=>{
        console.log(id,this.state.checkedKeys);
        let removeId =  this.state.checkedKeys;
        let list = this.state.chaosongPerson;
        　for(var i = 0; i < removeId.length; i++){
                if(removeId[i].length>4){
                    removeId.splice(i,1);
                }

            　　if(removeId[i] == list[id].id){
                     removeId.splice(i,1);
            　　　　}
            　　}
        list.splice(id,1);
        this.setState({
            chaosongPerson:list,
            checkedKeys:removeId
        })
    }
     onChangeTime=(value, dateString)=> {
        console.log('Formatted Selected Time: ', dateString);
        
    }
    onOk2  =(value, type)=> {
        value = moment(value).format('HH:mm') //这么解决的
        this.setState({endTime:value})
        console.log('取值',this.state.endDayOfWeekVal)
        this.getendsubmitTime(value,this.state.endDayOfWeekVal)
        console.log('看下depat',this.state.deptId)
    }
    getendsubmitTime =(value,endDayOfWeek, type)=> {//修改截至时间
    console.log('修改截至时间')
        endsubmitTime({
            "deptId":this.state.deptId,
            "endDayOfWeek":endDayOfWeek,
            "endTime": value
        }).then(res=>{
            if(res.data.code==1){
                message.success('修改时间成功');
            }else{
                message.error('修改时间失败!')
              }
        })
    }
    onOk=(value, type)=> {
        value = moment(value).format('HH:mm') //这么解决的
      let  copyTimeList=this.state.remindTimeList
        if(type=='remindTime1'){
            copyTimeList[0].remindTime=value
        }else if(type=='remindTime2'){
            copyTimeList[1].remindTime=value
        }
        this.setState({
            remindTimeList:copyTimeList
        })
       this.updateRemindTime(this.state.remindTimeList)
    }
    // 修改周报提醒时间
    updateRemindTime (value){
        RemindTime({//修改提醒时间
            "deptId": this.state.deptId,
            "remindTimeList": value
        }).then(res=>{
            if(res.data.code==1){
                message.success('修改时间成功');
            }else{
                message.error('修改时间失败!')
              }
            console.log('获取返回的时间',res)
        })
    }
    render(){
        let caosongL = '';
        // console.log(this.state.chaosongPerson)
        if(this.state.chaosongPerson.length>0){
         caosongL = this.state.chaosongPerson.map((val,index)=>{
             return ( <div className='caosongList'>
             {val.name}  <label onClick={()=>this.delectChaosong(index)}><CloseOutlined /></label>
         </div>)
         })
        }else{
         caosongL = <p></p>
        }
        let  caosongList = '';
       if(this.state.chaosongList.length> 0 ){
           caosongList = this.state.chaosongList.map((val,index) =>{
               console.log(val)
               return (
                <div className="CC">
               {val.avatar?<img  src={val.avatar}/>:<div className='headerPic125'>{val.name[val.name.length-1]}</div>}
                    <span onClick={()=>this.delectChaosongSend(index)}><CloseCircleFilled /></span>
                    <p>{val.name}</p>   
                </div>
               )
           })
       }
       
        let  endDayOfWeekList=this.state.endDayOfWeekList.map(val=>{
            return(
            <Option value={val.key}  key={val.key}>{val.text}</Option>
            )
          })
        return (
          <div className='settingBox'>
            <Fragment >
              <Titler />
            <div className=' content  setttingWrap'>
              <div className='left'>
                    <Nav />
              </div>
              <div className='Settingright'>
              <div className='groupBox'>
                 <DepartList msg={this.message}/>
              </div>   
           
            
               <ul className='weekUl'><li>  <div className='weekconfigTitle'>周报配置</div></li>
                   <li>
                    <label>周报截至时间：</label> 
                        <Select value={this.state.endDayOfWeekName}  style={{ width: 120 }} className='roleList'  onChange={e => {this.handleChange(e,'week1');}}>
                            { endDayOfWeekList}
                        </Select>
                        <ConfigProvider locale={locale}>
                            <TimePicker
                            onOk={e => {this.onOk2(e,'remindTime3');}}
                            onChange={this.onChangeTime}
                            format={format}
                            value={this.state.endTime===''? '' : moment(this.state.endTime,'HH:mm') } />
                        </ConfigProvider>
                       
                   </li>
                   <li style={{display:'flex'}}>
                     <label>周报提醒时间：</label>
                    <div>
                    <p>
                        <Select  value={this.state.remindTimeList[0].dayOfWeek===''? '星期一' : this.state.remindWeekName1}
                          style={{ width: 120 }}  className='roleList' onChange={e => {this.handleChange(e,'week2');}}>
                            { endDayOfWeekList}
                        </Select>
                        <ConfigProvider locale={locale}>
                            <TimePicker
                            onOk={e => {this.onOk(e,'remindTime1');}}
                            onChange={this.onChangeTime}
                            format={format}
                            value={this.state.remindTimeList[0].remindTime===''? '' : moment(this.state.remindTimeList[0].remindTime,'HH:mm') } />
                        </ConfigProvider>
                     </p>
                     <p>
                        <Select  style={{ width: 120 }}  
                         value={this.state.remindTimeList[1].dayOfWeek===''? '星期一' : this.state.remindWeekName2}
                         className='roleList' onChange={e => {this.handleChange(e,'week3');}}>
                         { endDayOfWeekList}
                        </Select>
                         <ConfigProvider locale={locale}>
                         <TimePicker
                        onOk={e => {this.onOk(e,'remindTime2');}}
                        onChange={this.onChangeTime}
                        format={format}
                         value={this.state.remindTimeList[1].remindTime===''? '' : moment(this.state.remindTimeList[1].remindTime,'HH:mm') } />
                        </ConfigProvider>
                     </p>
                    </div>
                   </li>
                   <li>
                   <label>默认抄送人：</label>
                
                   <div className='CCList'>
                        {this.state.imgList.map((item, i) => <div className="CC" key={i}> 
                           {item.avatar? <img  src={item.avatar}/>:<div className='headerPic125'>{item.username[item.username.length-1]}</div>}
                            <span  onClick={()=>this.delectChaosongSend(item.userId)}><CloseCircleFilled /></span>
                        <p>{item.username}</p>   
                    </div>)}
                    <div className="addCC" onClick={this.showAddPer}>+ </div>   
                    </div>                     
                    </li>
               </ul>
           
              
             </div>
            </div>
                <Modal
                title="添加人员"
                visible={this.state.addPerson}
                onCancel={this.hiddenAddPer}
                footer={[
                    <Button type="primary" key='confirm' onClick={this.addPer}>确定</Button>,
                    <Button key='cancel' onClick={this.hiddenAddPer}>取消</Button>
                ]}
            >
                <div  className='personTree'>
                <div className='l'>
                                {caosongL}
                              
                            </div>
                    <div className='r'> 
                        <Search style={{ marginBottom: 8 }} placeholder="请输入姓名"  onChange={this.inputNull} onSearch ={this.onSearch } />
                        <Tree
                                    checkable
                                    onExpand={this.onExpand}
                                    expandedKeys={this.state.expandedKeys}
                                    autoExpandParent={this.state.autoExpandParent}
                                    onCheck={this.onCheck}
                                    checkedKeys={this.state.checkedKeys}
                                    onSelect={this.onSelect}
                                    selectedKeys={this.state.selectedKeys}
                                    defaultExpandAll={true}>
                                {this.renderTreeNodes(this.state.personTree)}
                        </Tree> 
                </div>
                </div>
        </Modal>
        </Fragment>
              </div>
          

            
        )
    }
}


export default weekreportConfig;