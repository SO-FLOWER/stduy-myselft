import React,{Component,Fragment} from 'react';
import {Button,DatePicker,Radio,Avatar, message } from 'antd';
import { RightOutlined , UserOutlined, AntDesignOutlined ,DownOutlined } from '@ant-design/icons';
import {getproWorkTime} from '../../../../api/api'
import ReactEcharts from 'echarts-for-react';
import './index.less';
import Msg from './../proAnalysisMsg1/index.js';
// import ProAnalysisMsg from './proAnalysisMsg/index.js';
// import axios from 'axios';
const { RangePicker } = DatePicker;
class ProAnalysis extends Component {
    constructor(props) {
        super(props);
    
    }
    state={
        showTime:false, //展示时间段选择
        maxNum :this.props.maxNum*1+1,
        showChidren:false,
        allTimeList:{},
        userManhourList:[], 
    }
    componentWillUnmount(){
    };
    componentDidMount(){

    };
    componentWillReceiveProps(props) {
        console.log(props.maxNum)
        this.setState({
            maxNum :props.maxNum*1+1,
           })
          
           
            
        
    }
   
    changeDept=()=>{
        console.log(this.state.showChidren)
        if(!this.state.showChidren ){
            let data =this.props.dataMsg;
            data.parentDeptId = this.props.msg.id;
            getproWorkTime(data).then(res=>{
            
                if(res.data.code == 1){
                    this.setState({
                        allTimeList:res.data.data.result.manhour.projManhourList,
                        userManhourList:res.data.data.result.manhour.userManhourList,
                        showChidren:true
                    })
                }else{
                    message.error(res.data.message);
                }
              })
        }else{
            this.setState({
                allTimeList: [],
                showChidren: false,
                userManhourList :[],
            })  
        }
     
    }
    
    render(){
        let num = this.props.level;
        console.log(this.props.dataMsg)
        let picList = '';
        if(this.props.msg.avatarList){
            picList = this.props.msg.avatarList.map((val,key)=>{
                let  aaa = '';
                if(val.avatar != ''){
                    aaa = <Avatar size={16} src={val.avatar} />
                }else{
                    aaa = <Avatar size={16} style={{ color: '#fff', backgroundColor: '#1677FF' }}>{val.username[val.username.length - 1]}</Avatar>
                }
                return (aaa)
            })
        }
        let allTimeList = '';
        
        if(this.state.allTimeList.length > 0){
            allTimeList = this.state.allTimeList.map((val,key)=>{
                 return <Msg key={key} msg={val}  dataMsg={this.props.dataMsg} level={num+1} maxLength={this.state.maxNum}/>
            })
        }
        let userManhourList = '';
        
        if(this.state.userManhourList.length > 0){
            userManhourList = this.state.userManhourList.map((val,key)=>{
                let list = <div className='tableMsg1'>
                <label className='textleft pl20'><span style={{display:'inline-block',width:num*10+'px',height:'10px'}}></span>{val.avatar ? (
                    <Avatar size={20} src={val.avatar} />
                  ) : (
                    <div className="headerIndex">{val.username[val.username.length - 1]}</div>
                  )}{val.username}</label>
                            <div className='tmsg' style={{width : 620*val.hourNumCount/this.state.maxNum+'px'}}>
                                    
                                    <b>{val.hourNumCount/100}</b>
                            </div>
                
                </div>
                 return list;
            })
        }
        console.log(this.state.maxNum)
        return (
            <Fragment>
         
                                <div className='tableMsg1'>
                                    {this.props.msg.name? <label onClick={this.changeDept}><span style={{display:'inline-block',width:num*10+'px',height:'10px'}}></span>{!this.state.showChidren?<RightOutlined />:<DownOutlined/> }{this.props.msg.name}</label>:''}
                                    {this.props.msg.username? <label ><div className="headerIndex">{this.props.msg.username[this.props.msg.username.length - 1]}</div>{this.props.msg.username}</label>:''}
        {/* <label onClick={this.changeDept}>{!this.state.showChidren?<RightOutlined />:<DownOutlined/> }{this.props.msg.name}</label> */}
                                    <div className='tmsg' style={{width:620*this.props.msg.hourNumCount/this.state.maxNum+'px'}} >
                                    <Avatar.Group>
                                        {picList}
                                    </Avatar.Group>
                                    <b>{this.props.msg.hourNumCount/100}</b>
                                  
                                    </div>
                                    {allTimeList}
                                    {userManhourList}
                                </div>
               
            </Fragment>
            
        )
    }
}


export default ProAnalysis;