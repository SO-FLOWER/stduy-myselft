import React,{Component,Fragment} from 'react';
import {Select, Button,DatePicker,Pagination ,TimePicker ,Tag,Avatar, message } from 'antd';
import { DownOutlined} from '@ant-design/icons';
import {getCategoryTree,addPm} from '../../../api/api'
import moment from 'moment';
import './index.less';
const { Option } = Select;

const dateFormat = 'YYYY/MM/DD';
// import axios from 'axios';

class addProAssignedMsg extends Component {
    constructor(props) {
        super(props);
        this.state={
            change:false,
            projNum:this.props.msg.projNum,
            projName:this.props.msg.projName,
            deptName:this.props.msg.deptName,
            categoryList :{},
            categoryName:this.props.msg.categoryName,
            avatar : this.props.msg.avatar,
            categoryId :this.props.msg.categoryId,
            id : this.props.msg.id,
            startTime:'',
            endTime:'',
            deptId:'',
        }
    }
  
    componentWillUnmount(){
        
    };
    componentDidMount(){
 
      console.log(this.props.msg);
      if(this.props.newOne ){


      }else{
        if(this.props.msg != ''){
            this.getCategoryTree(this.props.msg.deptId);
          if(this.props.msg.startTime > 0){
            let startTime = this.getTime(this.props.msg.startTime);
            let endTime = this.getTime(this.props.msg.endTime);
            this.setState({
                startTime:startTime,
                endTime:endTime,
            })
            
          }
          }
      }
    
      
        
      
    };
    getTime=(time)=>{
        if(time) {
            let date = new Date(time)
            let Y = date.getFullYear();
            let M = date.getMonth() + 1;
            let D = date.getDate();

            if(M < 10) {
                M = '0' + M;
            }
            if(D < 10) {
                D = '0' + D;
            }

            return Y + '-' + M + '-' + D ;
        } else {
            return '';
        }
    }
   
handleChange = (value ) => {
    console.log(`selected ${value}`);
    }
    getCategoryTree = (id)=>{

        id  = id? id : this.state.deptId
        let data =  '368243720';

        getCategoryTree(id).then(res=>{
            if(res.data.code == 1){
                this.setState({
                    categoryList:res.data.data.rows
                })
            }else{
                message.error(res.data.message);
            }
        })
    }
    getCategoryTree1 = (id)=>{

        // id  = id? id : this.state.deptId
        let data =  '368243720';

        getCategoryTree(data).then(res=>{
            if(res.data.code == 1){
                this.setState({
                    categoryList:res.data.data.rows
                })
            }else{
                message.error(res.data.message);
            }
        })
    }
    sendPro = () =>{
        let data = {}
        // if(this.state.deptId == ''){
        //     message.info('请选择部门');
        //     return;
        // }
        if(this.state.projName == ''){
            message.info('请输入项目名称');
            return;
        }
        data = {
            deptName :  '前端开发组',
            deptId :368479475,
            projName : this.state.projNum,
            categoryId:'2'
        }
        // if(this.state.categoryId != ''){
        //     data.categoryId = this.state.categoryId
        // }
        if(this.state.endTime != ''){
            data.endTime = this.state.endTime
        }
        if(this.state.startTime != ''){
            data.startTime = this.state.startTime
        }
        if(this.state.pmName != ''){
            data.pmName = this.state.pmName
        }
        if(this.state.pmId != ''){
            data.pmId = this.state.pmId
        }
        if(this.state.status != ''){
            data.status = this.state.status
        }

        addPm(data).then(res=>{

        })

    }

 onChange= (date, dateString) =>{
        console.log(date, dateString);
      }
      changeProjNum =(e)=>{
        this.setState({
            projNum:e.target.value
       })
      }

    render(){
       
        let  categoryList = ''
        if(this.state.categoryList.length > 0 ){
            
            categoryList = this.state.categoryList.map(val=>{
                
                return (
                    <Option value={val.id}>{val.categoryName}</Option>
                )
            })
        }
        return (
            <Fragment> 
                                       {!this.props.msg.newOne?   <div className='tableMsg' >{this.props.id}
                                                        <label style={{width:'85px'}}>{this.state.projNum}</label>
                                                        <label  style={{width:'85px'}}>{this.state.projName}</label>
                                                     
                                                        <label  style={{width:'114px'}}><Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />{this.props.msg.pmName}</label>
                                                        <label  style={{width:'124px'}}><DatePicker onChange={this.onChange} value={moment(this.state.startTime, dateFormat)} /></label>
                                                     
                                                    <label className='operation'  style={{width:'190px'}}><span>成员管理</span><span>项目分析</span><span className='red'>删除</span></label>
                                                    

                                                </div>        :<div className='tableMsg' >
                                                     
                                                        <label  style={{width:'85px'}}><input className="inputN" onChange={this.changeProjNum} /></label>
                                                        <label  style={{width:'85px'}} onClick={this.getCategoryTree1}><span className='deptNameMsg' ><em className='deptName'></em><DownOutlined /></span></label>
                                                        <label  style={{width:'96px'}}><Select  style={{ width: 94 }} onChange={this.handleChange}>
                                                                {categoryList}
                                                        </Select></label>
                                                        <label  style={{width:'114px'}}><span className='addPm'>+</span></label>
                                                        <label  style={{width:'124px'}}><DatePicker onChange={this.onChange} /></label>
                                                      
                                                     
                                                    <label className='operation'  style={{width:'190px'}}><span onClick={this.sendPro}>保存</span><span>取消</span></label>
                                                    

                                                </div>  }                    
                      
            </Fragment>
            
        )
    }
}


export default addProAssignedMsg;