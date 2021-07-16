import React, { Component, Fragment } from 'react';
import imgURL from './../../../img/logo.png';
import { Avatar, message } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { withRouter, Link } from 'react-router-dom';
import { userIdLogin} from './../../../api/api';
import './headerTitle.less';
// import axios from 'axios';
import UserAvatar from '../../../compents/userAvatar/index';
import { parseURL } from './../../../utils/index';


class Titler extends Component {
  urlParams = {};
  state = {
    pathName: '',
    pList:[],
  };
  componentWillUnmount() {}
  async componentDidMount() {
    this.urlParams = parseURL();
    if(this.urlParams.userId){
     
      await  userIdLogin(this.urlParams.userId).then(res=>{
        let accessToken = 'Bearer ' + res.data.data.result.accessToken;
        let userMsg = res.data.data.result.userInfoVO;
        let powerList = [];
        console.log(res.data.data.result.menuInfoVOs)
        res.data.data.result.menuInfoVOs.map(val=>{
          powerList.push(val.perms);
          console.log('val:',val.perms)
        })
        // this.props.getPowerList(powerList)
        window.sessionStorage.setItem('accessToken', accessToken);
        window.sessionStorage.setItem('userMsg', JSON.stringify(userMsg));
        window.sessionStorage.setItem('powerList', powerList);
      })
    }
    if (window.sessionStorage.getItem('username') === null) {
      // message.info('请先登录')
      // this.props.history.push({pathname:'/'})
    }
    let pathName = this.props.location.pathname;
    pathName = pathName.substring(0, pathName.length);

    this.setState({
      pathName: pathName,
    });
    let pList = window.sessionStorage.getItem('powerList')? window.sessionStorage.getItem('powerList'):[]
 
    if(pList.length>0){
    

      pList = pList.split(',')
    }
    this.setState({
      pList:pList
    })
   
  }
  
  loginOut = () => {
    sessionStorage.clear();
    // window.sessionStorage.removeItem('accessToken');
    this.props.history.push({ pathname: '/' });
  };
  weekly=()=>{
    if(this.state.pList.indexOf('week_report:hall') > -1){
      this.props.history.push({ pathname: '/weekly' });
    }else if(this.state.pList.indexOf('week_report:mine') > -1){
      this.props.history.push({ pathname: '/weekly/mydata' });
    }else if(this.state.pList.indexOf('week_report:call_me') > -1){
      this.props.history.push({ pathname: '/weekly/my' });
    }else if(this.state.pList.indexOf('week_report:count') > -1){
      this.props.history.push({ pathname: '/weekly/weeklyinfo' });
    }
  }
  project=()=>{
    if(this.state.pList.indexOf('project:assign') > -1){
      this.props.history.push({ pathname: '/project/assigned' });
    }else if(this.state.pList.indexOf('project:manage') > -1){
      this.props.history.push({ pathname: '/project/management' });
    }else if(this.state.pList.indexOf('project:hour_time_check') > -1){
      this.props.history.push({ pathname: '/project/check' });
    }
  }

  data=()=>{
    this.props.history.push({ pathname: '/data' });
  }

  setting =()=>{
    if(this.state.pList.indexOf('setting:week_report_setting') > -1){
      this.props.history.push({ pathname: '/setting/WeekreportConfig' });
    }else if(this.state.pList.indexOf('setting:project_type') > -1){
      this.props.history.push({ pathname: '/setting/ItemCategory' });
    }else if(this.state.pList.indexOf('setting:user_manage') > -1){
      this.props.history.push({ pathname: '/setting/MembersManagement' });
    }else if(this.state.pList.indexOf('week_report:hall') > -1){
      this.props.history.push({ pathname: '/setting/PermissionRole' });
    }
  }

  render() {
    let userMsg;
    try {
      userMsg = JSON.parse(window.sessionStorage.getItem('userMsg')) || '';
    } catch (e) {
      console.log(e);
    }
  
    return (
      <Fragment>
        <div className="top64"></div>
        <div className="titleBg">
          <div className="titleHeader">
          <img className="logo" src='https://i01.lw.aliimg.com/media/lALPDeRETJd8GLDM8Mzw_240_240.png' alt="" />
            <ul>
              {this.state.pList.indexOf('week_report') > -1?
               
               <li className={this.state.pathName.substring(0, 7) === '/weekly' ? 'active' : ''} onClick={this.weekly}>周报</li>
             : ''}
             {this.state.pList.indexOf('project') > -1?
              
               <li className={this.state.pathName.substring(0, 8) === '/project' ? 'active' : ''}  onClick={this.project}>项目</li>
            : ''}
             
             {this.state.pList.indexOf('data') > -1?
              
               <li className={this.state.pathName.substring(0, 5) === '/data' ? 'active' : ''}  onClick={this.data}>数据</li>
           : ''}
             
             {this.state.pList.indexOf('setting') > -1?
               
               <li className={this.state.pathName.substring(0, 8) === '/setting' ? 'active' : ''}  onClick={this.setting}>设置</li>
             : ''}
            </ul>
            <div className="userName">
              <UserAvatar src={userMsg.avatar} name={userMsg.userName}></UserAvatar>
              <label onClick={this.loginOut}>退出</label>
            </div>
          </div>
        </div>
      </Fragment>
    );
  }
}

export default withRouter(Titler);
