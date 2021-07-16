import React,{Component,Fragment} from 'react';
import {Button,DatePicker,Radio,Avatar, Tooltip,Select,message } from 'antd';
import { RightOutlined , UserOutlined, AntDesignOutlined ,DownOutlined } from '@ant-design/icons';
import {getALLWorkTime} from '../../../api/api'

import './../index.less';
import { connect } from 'react-redux';
import Msg from './../allWorkTimeMsg1/index.js'
// import axios from 'axios';
const { RangePicker } = DatePicker;
const { Option } = Select;
let aaa = []
  //2.这里把state里的数据映射到props里，可以通过Props使用
  const stateToProps = (state) => {
    return {
        dataParentDeptId: state.dataParentDeptId,
    }
}

//3.这里把action里的方法绑定到props上，可以通过Props使用，一般用于修改store里的数据
const dispatchTOProps = (dispatch) => {
    return {
        changeDataId(id){
          
            let action = {
                type: 'changeDataId',
                value: id
            }
            //inputChange方法会通过dispatch触发reducer.js里的修改方法
            dispatch(action)
        }
    }
}
class ProAnalysis extends Component {
    constructor(props) {
        super(props);
    }
    state={ 
        id:"",
        name:'',
        hourNumCount:'',
        imgList:[],
        showChidren:false,
        allTimeList:[],
        userManhourList:[], 
    }
    
    componentDidMount(){
        this.setState({
            id : this.props.msg.id,
            name : this.props.msg.name,
            hourNumCount :  this.props.msg.hourNumCount,
            imgList : this.props.msg.avatarList,
            data :this.props.data
        })
};
componentWillReceiveProps(props){
    //fix: 修复未传 projId
    this.setState({
        id : props.msg.id,
        name : props.msg.name,
        hourNumCount :  props.msg.hourNumCount, 
        imgList : props.msg.avatarList,
        projId:props.data.projId,
    })
}
changeDept=()=>{
  
    if(!this.state.showChidren ){
        let data = this.state.data;
        data.parentDeptId = this.state.id;
        data.projId = this.state.projId;
        getALLWorkTime(data).then(res=>{
          if(res.data.code == 1){
              this.setState({
                  allTimeList: res.data.data.result.projManhourList,
                  showChidren: !this.state.showChidren,
                  userManhourList : res.data.data.result.userManhourList
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
        let picList = '';
        if(this.state.imgList.length > 0){
            picList = this.state.imgList.map((val,key)=>{
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
                 return <Msg key={key} msg={val} data={this.props.data} maxLength={this.props.maxLength} level = {num+1}/>
            })
        }
        let userManhourList = '';
        
        if(this.state.userManhourList.length > 0){
            userManhourList = this.state.userManhourList.map((val,key)=>{
                let list = <div className='tableMsg1'>
                <label className='textleft pl20' ><span style={{display:'inline-block',width:num*10+'px',height:'10px'}}></span>{val.avatar ? (
                    <Avatar size={20} src={val.avatar} />
                  ) : (
                    <div className="headerIndex">{val.username[val.username.length - 1]}</div>
                  )}{val.username}</label>
                            <div className='tmsg' style={{width : 620*val.hourNumCount/this.props.maxLength+'px'}}>
                                    
                                    <b>{val.hourNumCount/100}</b>
                            </div>
                
                </div>
                 return list;
            })
        }
        
        return (
            
            <Fragment>
                    <div className='tableMsg1'>
                       <label className='textleft' onClick={(e)=>{this.props.changeDataId(this.state.id);this.changeDept()}}><span style={{display:'inline-block',width:num*10+'px',height:'10px'}}></span>{this.state.showChidren? <DownOutlined />:<RightOutlined />}{this.state.name}</label>
                                    <div className='tmsg1'  style={{width : 620*this.state.hourNumCount/this.props.maxLength+'px'}}>
                                            <Avatar.Group>
                                                {picList}
                                            </Avatar.Group>
                                         <b>{this.state.hourNumCount/100}</b>
                                         
                                    </div>
                                       
                    </div>
                    {allTimeList}
                    {userManhourList}  
            </Fragment>
            
        )
    }
}


export default connect(stateToProps, dispatchTOProps)(ProAnalysis);