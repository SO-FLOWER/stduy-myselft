import React,{Component,Fragment} from 'react';
import Praise from './../../../img/praise.png';
import {Select, Button,DatePicker,Pagination ,Tag ,message,Empty,Table,Checkbox, } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import {getProjList,getWorkTime,updateCheckStatusPM,getPMWorkTime} from '../../../api/api'
import ProAssignedMsg from '../proAssignedMsg/index.js'
import AddProAssignedMsg from '../addProAssignedMsg/index.js'
import './index.less';
import Left from '../compents/leftRouter/index';
import Titler from '../../compent/headerTitle/headerTitle'
import TimeCheckMsg from './timeGLMsg/index';
const { Option } = Select;

 

class TimeCheck extends Component {
  
    state={
        userName : '',
        status:'0',
        allCount:1,
        page:1,
        dataList:[],
        NumList:[],
        proName:'',
        proId:'',
        showCheckbox: true,
    }

    async  componentDidMount(){
        console.log( sessionStorage.getItem('proJdataId'),sessionStorage.getItem('proJdataName'))
        this.setState({
            proName:sessionStorage.getItem('proJdataName'),
            proId:sessionStorage.getItem('proJdataId')
            
        })
       
        let data = {
            current : 1,
            size : 10,
            projId:sessionStorage.getItem('proJdataId'),
            checkStatus: this.state.status*1
        }

        getPMWorkTime(data).then(res=>{
                if(res.data.code == 1){
                        this.setState({
                            dataList :res.data.data.rows,
                            allCount :res.data.data.count,
                            current :1  
                        })
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
    
    
 
      changePage =(page) =>{
        let data = {
            current:page,
            size:10,
            checkStatus:this.state.status*1,
            username:this.state.userName,
            projId:this.state.proId
          }
          getPMWorkTime(data).then(res=>{
                if(res.data.code == 1){
                   
                    this.setState({
                        dataList :res.data.data.rows,
                        allCount :res.data.data.count,
                        page :page  
                    })
                    console.log('换页面',this.state)
                }else{
                    message.error(res.data.message);
                }
          })
      }

   
      onChangeGetCheck = (checkedValues) =>{
          
        this.setState({
            NumList:checkedValues
         })

      }
      onCheckAllChange = (e)=>{
        let a  = []
        for(let i = 0 ;i< this.state.dataList.length ;i++){
              a.push(i)
        }
         let aaa =  e.target.checked?a:[];
         this.setState({
            NumList:aaa
         })

      }
      passAll=()=>{
          if(this.state.NumList.length == 0){
              message.error('请选择员工');
              return;
          }
          let list = [];
          console.log(this.state.NumList)
          this.state.NumList.map(val=>{
            if(this.state.dataList[val].checkStatus == 0){
              list.push(this.state.dataList[val].id) 
            }
         
        })
          
          let data= {
            idList:[...list]
        }
        updateCheckStatusPM(data).then(res=>{
            if(res.data.code == 1){
                
                message.info('通过成功')
                window.location.reload();
            }else{
                message.error(res.data.message);
            }
        })
      }
      getBox =(e)=>{
          
            console.log(`checked = ${e.target.checked}`);
      }
      findPm=()=>{
          let data = {
            current:1,
            size:10,
            checkStatus:this.state.status,
            username:this.state.userName,
            projId:this.state.proId,
            checkStatus: this.state.status*1
          }
          getPMWorkTime(data).then(res=>{
                if(res.data.code == 1){
                    this.setState({
                        dataList :res.data.data.rows,
                       
                        allCount :res.data.data.count,
                        current :1  
                    })
                }else{
                    message.error(res.data.message);
                }
          })
          if(this.state.status == 0 ){
                this.setState({
                    showCheckbox:true
                })
          }else{
            this.setState({
                showCheckbox:false
            })
          }
      }
      goBackPage = () => {
        this.props.history.goBack();  //返回上一页这段代码
         
      }
    render(){
       

          let msgList = <Empty />
          if(this.state.dataList.length>0){
         
              msgList = this.state.dataList.map((val,index)=>{
                    return (<div className='tableMsg'>
                        {this.state.showCheckbox? <Checkbox onChange={this.getBox} value={index}></Checkbox>:''}
                       <TimeCheckMsg  key={index} msg = {val}/>
                        </div>
                    )
              })
          }
        return (
            <Fragment>
              
              <Titler />
                 <div className='content'>
                        <div className='left'>
                       <Left/>
                        </div>

                        <div className='right'>
                           
                
                        <div className='proName'>
                        <Button type='primary' onClick={this.goBackPage}>返回</Button>
                    <h3>{this.state.proName}</h3>
                                </div>

                                <div className='pmTitle'>
                                       {/* <div> <Button type='primary'>返回</Button><h3>项目名称AAAA</h3></div> */}
                                                
                                                <div className='ib' > <label>成员姓名:</label> <input type="text" onChange={this.getUserName} style={{width:'168px'}} /></div> 
                                               
                                                <div   className='ib'> <label>状态:</label> <Select  style={{ width: 128 }} value={this.state.status} onChange={this.handleChange}>
                                                            <Option value="0"><Tag color='orange'>待审核</Tag></Option>
                                                            <Option value="1"><Tag color='orange'>待确认</Tag></Option>
                                                            <Option value="2"><Tag color='blue'>已确认</Tag></Option>
                                                            </Select></div> 
                                                <div className='ib btn'><Button type='primary' onClick={this.findPm}>查询</Button></div>      

                                </div>

                                <div className='pmContent' >
                                        <div className='addPro' >
                                            {this.state.showCheckbox?   <Button    onClick={this.passAll} type='primary'>批量通过</Button>:''}
                                          
                                        </div>
                                        <div className='proTabel'>
                                            <div className='tableHeader'>
                                                {this.state.showCheckbox? 
                                                  <label style={{position : 'relative',right:'12px'}}> <Checkbox onChange={this.onCheckAllChange} ></Checkbox></label>
                                                  :''
                                                }
                                          
                                            
                                                <label style={{width : '120px'}}>姓名</label>
                                                 
                                                <label  style={{width : '120px'}}>工作日期</label>  
                                                <label  style={{width : '120px'}}>工作占比</label>  
                                                <label  style={{width : '240px'}}>提交时间</label>  
                                                <label style={{width : '120px'}}>状态</label> 
                                                <label style={{width : '120px'}}>操作</label>  
                                            </div>
                                            <Checkbox.Group style={{ width: '100%' }} value={this.state.NumList} onChange={this.onChangeGetCheck   }>
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