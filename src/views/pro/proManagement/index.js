import React,{Component,Fragment} from 'react';
import {Select, Button,DatePicker ,Pagination,Tag ,message,Empty } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import {getPmProjList} from '../../../api/api'
import ProManagementMsg from './proManagementMsg/index.js'
import './index.less';
import Left from '../compents/leftRouter/index';
import Titler from '../../compent/headerTitle/headerTitle'
const { Option } = Select;
// import axios from 'axios';

class Management extends Component {
  
    state={
        pjbName : '',
        pmName : '',
        proAssignedMsg :[],
        proStatus:'',
        pageNum :1,
        allCount : 0,
        page:1
    }
    componentWillUnmount(){
    };
    componentDidMount(){
        

       let data =  {
            "current": 1,
            "size": 10,
         
        }

        const timer = setTimeout(()=>{
            if(window.sessionStorage.getItem('accessToken')){
                clearTimeout(timer);
                getPmProjList(data).then(res=>{
                    if(res.data.code == 1){
                        this.setState({
                            proAssignedMsg : res.data.data.rows,
                            allCount :res.data.data.count
                        })
                    }else{
                        message.error(res.data.message);
                    }
                })
            };
        },300)
        
        
};

handleChange = (value ) => {
    this.setState({
        proStatus:value
   })
    }


      getProName = (e)=>{
        this.setState({
            pjbName:e.target.value
       })
      }
  
    
      findPm=()=>{
          let data = {
            projName:this.state.pjbName,
            status : this.state.proStatus,
            size : 10,
            current :1
          }
          getPmProjList(data).then(res=>{
            if(res.data.code == 1){
                this.setState({
                    proAssignedMsg : res.data.data.rows,
                    allCount :res.data.data.count
                })
            }else{
                message.error(res.data.message);
            }
          })
      }
      changePage =(page) =>{
        let data = {
            projName:this.state.pjbName,
            status : this.state.proStatus,
            size : 10,
            current :page
          }
           
          getPmProjList(data).then(res=>{
                if(res.data.code == 1){
                    this.setState({
                        proAssignedMsg : res.data.data.rows,
                        allCount :res.data.data.count,
                        pageNum :page
                    })
                }else{
                    message.error(res.data.message);
                }
            })
      }
    render(){
        let  msgList = <Empty />;

        if(this.state.proAssignedMsg){
            msgList = this.state.proAssignedMsg.map((val,index)=>{
              
               return  ( <ProManagementMsg  msg = {val} id = {index}/>) 
                
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
                           
                
                          

                                <div className='pmTitle'>
                                       {/* <div> <Button type='primary'>返回</Button><h3>项目名称AAAA</h3></div> */}
                                   
                                                <div className='ib' > <label>项目名称:</label> <input type="text" onChange={this.getProName} style={{width:'168px'}} /></div> 
                                              
                                                <div   className='ib'> <label>状态:</label> <Select  style={{ width: 128 }} onChange={this.handleChange}>
                                                <Option value="0"><Tag color='blue'>进行中</Tag></Option>
                                                <Option value="1"><Tag color='red'>已暂停</Tag></Option>
                                                <Option value="2"><Tag color='orange'>已结束</Tag></Option>
                                                <Option value="3"><Tag color='green'>已归档</Tag></Option>
                                                </Select></div> 
                                                <div className='ib btn'><Button type='primary' onClick={this.findPm}>查询</Button></div>

                                
                                       
                                </div>

                                <div className='pmContent' >
                                      
                                        <div className='proTabel'>
                                                <div className='tableHeader' style={{display:'flex',justifyContent:'space-between'}}>
                                                    
                                                    <label  style={{width:'140px'}}>项目名称</label>
                                                    <label  style={{width:'85px'}}>所属部门</label>
                                                    <label  style={{width:'88px'}}>项目类别</label>
                                                    <label  style={{width:'114px'}}>项目经理</label>
                                                    <label  style={{width:'124px'}}>开始时间</label>
                                                    <label  style={{width:'124px'}}>结束时间</label>
                                                    <label  style={{width:'94px'}}>状态</label>
                                                    <label  style={{width:'100px'}}>操作</label>
                                                </div>
                                                
                                                {msgList}
                                              
                                               
                                                
                                                <div className='page'><Pagination current={this.state.pageNum} showSizeChanger={false} total={this.state.allCount} hideOnSinglePage={true} onChange={this.changePage}/></div>
                                        </div>
                                </div>

                                </div>
                 </div>
            </Fragment>
            
        )
    }
}


export default Management;