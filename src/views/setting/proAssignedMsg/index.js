import React,{Component,Fragment} from 'react';
import {Select, Button,DatePicker,Pagination ,TimePicker ,Tag,Avatar, message } from 'antd';
import { DownOutlined} from '@ant-design/icons';
import {getCategoryTree,addPm} from '../../../api/api'
import moment from 'moment';
import './index.less';
const { Option } = Select;

const dateFormat = 'YYYY/MM/DD';
// import axios from 'axios';

class proAssignedMsg extends Component {
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
            startTime:'1901-01-01',
            endTime:'1901-01-01',
        }
    }
  
    componentWillUnmount(){
        
    };
    componentDidMount(){
 

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
                                        <div className='tableMsg' >{this.props.id}
                                                        <label style={{width:'85px'}}>{this.state.projNum}</label>
                                                        <label  style={{width:'85px'}}>{this.state.projName}</label>
                                                        <label  style={{width:'85px'}} onClick={this.getCategoryTree}><span className='deptNameMsg' ><em className='deptName'>{this.state.deptName}</em><DownOutlined /></span></label>
                                                        <label  style={{width:'96px'}}><Select defaultValue={this.state.categoryName} style={{ width: 94 }} onChange={this.handleChange}>
                                                                {categoryList}
                                                        </Select></label>
                                                        <label  style={{width:'124px'}}><DatePicker onChange={this.onChange} value={moment(this.state.startTime, dateFormat)} /></label>
                                                         <label  style={{width:'124px'}}> <DatePicker onChange={this.onChange} value={moment(this.state.endTime, dateFormat)}/> </label>
                                                        <label  style={{width:'94px'}}>
                                                      
                                                  
                                                    </label>
                                                    <label className='operation'  style={{width:'190px'}} ><span>成员管理</span><span>项目分析</span><span className='red'>删除</span></label>
                                                    

                                                </div>           
                      
            </Fragment>
            
        )
    }
}


export default proAssignedMsg;