import React, { Component, Fragment } from 'react';
import imgURL from './../../img/logo.png';
import { message } from 'antd';
import { login, getUserInfo } from './../../api/api';
import axios from 'axios';
import './login.less';
import * as dd from 'dingtalk-jsapi';
// const APPID = 'dingoabnfyabvye3c5uavc';

const APPID = 'dingoa2msydmrcabczggdp';
const REDIRECTURI = 'http://pm.theiavis.com:8031'; //测试
// const REDIRECTURI = 'http://pm.theiavis.com:8030/'; //正式
const goto = `https://oapi.dingtalk.com/connect/oauth2/sns_authorize?appid=${APPID}&response_type=code&scope=snsapi_login&state=STATE&redirect_uri=${REDIRECTURI}`;

class Login extends Component {
  constructor() {
    super();
    this.state = {
      name: '刷新',
      buttonName: '点击',
      btnStatus: false,
      code: '1',
    };
  }

  componentDidMount() {
    let that = this;
    if (dd.env.platform !== 'notInDingTalk') {
      dd.ready(() => {
        dd.runtime.permission.requestAuthCode({
          corpId: 'dinge2a49b8c0bc04478',
          onSuccess(result) {
            that.getUserInfo1({ code: result.code }).then((res) => {
              let accessToken = 'Bearer ' + res.data.result.accessToken;
              let userMsg = res.data.result.userInfoVO;
              let powerList = [];
              res.data.result.menuInfoVOs.map((val) => {
                powerList.push(val.perms);
                console.log('val:', val.perms);
              });
              // this.props.getPowerList(powerList)
              window.sessionStorage.setItem('accessToken', accessToken);
              window.sessionStorage.setItem('userMsg', JSON.stringify(userMsg));
              window.sessionStorage.setItem('powerList', powerList);
              console.log('powerList:', powerList);
              if (powerList.indexOf('week_report') > -1) {
                if (powerList.indexOf('week_report:hall') > -1) {
                  that.props.history.push({ pathname: '/weekly' });
                } else if (powerList.indexOf('week_report:mine') > -1) {
                  that.props.history.push({ pathname: '/weekly/mydata' });
                } else if (powerList.indexOf('week_report:call_me') > -1) {
                  that.props.history.push({ pathname: '/weekly/my' });
                } else if (powerList.indexOf('week_report:count') > -1) {
                  that.props.history.push({ pathname: '/weekly/weeklyinfo' });
                }
              } else if (powerList.indexOf('project') > -1) {
                if (powerList.indexOf('project:assign') > -1) {
                  that.props.history.push({ pathname: '/project/assigned' });
                } else if (powerList.indexOf('project:assign') > -1) {
                  that.props.history.push({ pathname: '/project/management' });
                } else if (powerList.indexOf('project:hour_time_check') > -1) {
                  that.props.history.push({ pathname: '/project/check' });
                }
              } else if (powerList.indexOf('data') > -1) {
                that.props.history.push({ pathname: '/data' });
              } else if (powerList.indexOf('setting') > -1) {
                if (powerList.indexOf('setting:week_report_setting') > -1) {
                  that.props.history.push({ pathname: '/setting/WeekreportConfig' });
                } else if (powerList.indexOf('setting:project_type') > -1) {
                  that.props.history.push({ pathname: '/setting/ItemCategory' });
                } else if (powerList.indexOf('setting:user_manage') > -1) {
                  that.props.history.push({ pathname: '/setting/MembersManagement' });
                } else if (powerList.indexOf('week_report:hall') > -1) {
                  that.props.history.push({ pathname: '/setting/PermissionRole' });
                }
              } else {
                // this.props.history.push({ pathname: '/404' });
                message.error('请联系管理员开通系统权限');
              }
            });
          },
          onFail(err) {
            alert('fail');
            alert(JSON.stringify(err));
          },
        });
      });
    }

    let myUrl = this.parseURL(window.location.search);

    // let pList = ["week_report","project","data",'setting',"project:assign","project:manage","project:hour_time_check","project:manage:analysis","data:count","setting:week_report_setting","setting:project_type","setting:user_manage","setting:permit_role","week_report:hall","week_report:mine","week_report:call_me","week_report:count","project:assign:projectCode","project:assign:projectName","project:assign:deptName","project:assign:projectTypeName","project:assign:projectManager","project:assign:startTime","project:assign:endTime","project:assign:operate","project:manage:projectCode","project:manage:projectName","project:manage:deptName","project:manage:projectTypeName","project:manage:projectManager","project:manage:startTime","project:manage:endTime","project:manage:operate","project:hour_time_check:batchThrough","project:hour_time_check:username","project:hour_time_check:deptName","project:hour_time_check:projName","project:hour_time_check:hourTime","project:hour_time_check:hourNum","project:hour_time_check:updateTime","project:hour_time_check:operate","project:assign:createProject","setting:user_manage:userName","setting:user_manage:mobile","setting:user_manage:deptName","setting:user_manage:position","setting:user_manage:status","setting:user_manage:roleNames","setting:permit_role:createProject","setting:permit_role:roleName","setting:permit_role:deptName","setting:permit_role:createBy","setting:permit_role:createTime","setting:permit_role:operate","project:assign:status","project:manage:status"]
    // let list = [...pList]
    // window.sessionStorage.setItem('powerList', list);
    if (myUrl.code) {
      this.getUserInfo({ code: myUrl.code }).then((res) => {
        // if (res.data.code == 1) {
        console.log(res);
        let accessToken = 'Bearer ' + res.data.result.accessToken;
        let userMsg = res.data.result.userInfoVO;
        let powerList = [];
        console.log(res.data.result.menuInfoVOs);
        res.data.result.menuInfoVOs.map((val) => {
          powerList.push(val.perms);
          console.log('val:', val.perms);
        });
        // this.props.getPowerList(powerList)
        window.sessionStorage.setItem('accessToken', accessToken);
        window.sessionStorage.setItem('userMsg', JSON.stringify(userMsg));
        window.sessionStorage.setItem('powerList', powerList);
        console.log('powerList:', powerList);
        if (powerList.indexOf('week_report') > -1) {
          if (powerList.indexOf('week_report:hall') > -1) {
            this.props.history.push({ pathname: '/weekly' });
          } else if (powerList.indexOf('week_report:mine') > -1) {
            this.props.history.push({ pathname: '/weekly/mydata' });
          } else if (powerList.indexOf('week_report:call_me') > -1) {
            this.props.history.push({ pathname: '/weekly/my' });
          } else if (powerList.indexOf('week_report:count') > -1) {
            this.props.history.push({ pathname: '/weekly/weeklyinfo' });
          }
        } else if (powerList.indexOf('project') > -1) {
          if (powerList.indexOf('project:assign') > -1) {
            this.props.history.push({ pathname: '/project/assigned' });
          } else if (powerList.indexOf('project:assign') > -1) {
            this.props.history.push({ pathname: '/project/management' });
          } else if (powerList.indexOf('project:hour_time_check') > -1) {
            this.props.history.push({ pathname: '/project/check' });
          }
        } else if (powerList.indexOf('data') > -1) {
          this.props.history.push({ pathname: '/data' });
        } else if (powerList.indexOf('setting') > -1) {
          if (powerList.indexOf('setting:week_report_setting') > -1) {
            this.props.history.push({ pathname: '/setting/WeekreportConfig' });
          } else if (powerList.indexOf('setting:project_type') > -1) {
            this.props.history.push({ pathname: '/setting/ItemCategory' });
          } else if (powerList.indexOf('setting:user_manage') > -1) {
            this.props.history.push({ pathname: '/setting/MembersManagement' });
          } else if (powerList.indexOf('week_report:hall') > -1) {
            this.props.history.push({ pathname: '/setting/PermissionRole' });
          }
        } else {
          // this.props.history.push({ pathname: '/404' });
          message.error('请联系管理员开通系统权限');
        }

        // this.props.history.push({ pathname: '/weekly' });
        // } else {
        //   message.error('扫码失败');
        // }
      });
    }

    window.DDLogin({
      id: 'login_container', //这里需要你在自己的页面定义一个HTML标签并设置id
      goto: encodeURIComponent(goto),
      style: 'border:none;background-color:#FFFFFF;',
      width: '380',
      height: '400',
    });

    window.addEventListener(
      'message',
      function (event) {
        const origin = event.origin;
        if (origin == 'https://login.dingtalk.com') {
          window.location = `${goto}&loginTmpCode=${event.data}`;
        }
      },
      false,
    );
  }

  getUserInfo1(params) {
    return new Promise((resolve, reject) => {
      axios
        .get('http://pm.theiavis.com:8031/api/loginByCode', {
          // axios.get('http://pm.theiavis.com:8030/api/loginByCode', {

          params: params,
        })
        .then((res) => {
          if (res.data.code == 1) {
            resolve(res.data);
          } else {
            message.error('扫码失败');
          }
        });
    });
  }
  
  getUserInfo(params) {
    return new Promise((resolve, reject) => {
      // axios.get('http://pm.theiavis.com:8030/api/login', {
      axios
        .get('http://pm.theiavis.com:8031/api/login', {
          params: params,
        })
        .then((res) => {
          if (res.data.code == 1) {
            resolve(res.data);
          } else {
            message.error('扫码失败');
          }
        });
    });
  }

  parseURL(url) {
    if (!url) return {};

    url = decodeURI(url);

    let url1 = url.split('?')[1];

    let para = url1.split('&');

    let len = para.length;

    let res = {};

    let arr = [];

    for (let i = 0; i < len; i++) {
      arr = para[i].split('=');

      res[arr[0]] = arr[1];
    }

    return res;
  }

  determineIfLoginIsRequired = (code) => {
    // your code。。。
  };

  render() {
    return (
      <Fragment>
        <div className="bg">
          <div className="loginCord">
            <img className="logo" src={imgURL} alt="提亚数字科技" />
            <div id="login_container"></div>
          </div>
        </div>
      </Fragment>
    );
  }
}

export default Login;
