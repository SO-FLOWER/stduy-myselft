import React from 'react';
import { BrowserRouter as Router, Redirect, Route, Switch } from 'react-router-dom';
import { parseURL } from './utils/index';
import Login from './views/login/login.js';
import Weekly from './views/weekly/index/index.js';
import MyData from './views/weekly/myData/myData.js';
import WeeklyInfo from './views/weekly/weeklyinfo/weeklyinfo.js';
import My from './views/weekly/my/my.js';
import Project from './views/pro/index/index.js';
// import Setting from './views/setting/setting/index.js'
import Data from './views/data/index.js';
import DDLogin from './views/DDLogin/DDLogin.js';
import NoMacth from './views/404.js';
import Assigned from './views/pro/proAssigned/index';
import Management from './views/pro/proManagement/index';
import MembersManagement from './views/pro/membersManagement/index';
import Analysis from './views/pro/proAnalysis/index';
import Check from './views/pro/timeCheck/index';
import GL from './views/pro/timeGL/index';
import Setting from './views/setting/index/index.js';
import WeekreportConfig from './views/setting/weekreportConfig/weekreportConfig'; //z周报配置
import SettingManagement from './views/setting/membersManagement/index';
import ItemCategory from './views/setting/itemCategory/itemCategory'; //项目类别
import PermissionRole from './views/setting/permissionRole/index.js'; //项目类别
import permissionSet from './views/setting/permissionRole/permissionSet/index.js'; //项目类别
import userAgree from './views/setting/permissionRole/userAgree/index.js'; //项目类别
import Test from './views/setting/test/index.js'; //项目类别

// import Test1 from './views/compent/selectComponet/index.js'//测试子组件
 let urlParams = parseURL();
function userLogin() {
  let userInfo = window.sessionStorage.getItem('accessToken');
  if (userInfo !== null) {
    return true;
  } else if (window.dd.env.platform !== 'notInDingTalk') {
    return true;
  }
}
// 登录验证
function requireAuth(Layout) {
  return (props) => {
    let res = userLogin();
    if (urlParams.userId) {
      // 未登录
      return <Layout {...props} />;
    }else if(!res){
      
      return <Redirect to="/" />;
    } else {
      return <Layout {...props} />;
    }
  };
}
{/* <Route exact component={requireAuth(Weekly)} path="/weekly" /> */}
{/* <Route exact component={requireAuth(My)} path="/weekly/my" /> */}
export default function IRouter() {
  return (
    <Router>
      <Switch>
        <Route exact component={DDLogin} path="/aaa" />
        <Route exact component={Login} path="/" />
        <Route exact component={requireAuth(Weekly)} path="/weekly" />
        <Route exact component={requireAuth(My)} path="/weekly/my" />
        <Route exact component={requireAuth(MyData)} path="/weekly/mydata" />
        <Route exact component={requireAuth(WeeklyInfo)} path="/weekly/weeklyinfo" />
        <Route exact component={requireAuth(Data)} path="/data" />
        <Route exact component={requireAuth(Setting)} path="/setting" />
        <Route exact component={requireAuth(WeekreportConfig)} path="/setting/WeekreportConfig" />
        <Route exact component={requireAuth(ItemCategory)} path="/setting/ItemCategory" />
        <Route exact component={requireAuth(PermissionRole)} path="/setting/PermissionRole" />
        <Route exact component={requireAuth(SettingManagement)} path="/setting/MembersManagement" />
        <Route exact component={requireAuth(userAgree)} path="/setting/PermissionRole/userAgree/:id" />
        <Route exact component={requireAuth(permissionSet)} path="/setting/PermissionRole/permissionSet/:id" />
        <Route exact component={requireAuth(Test)} path="/test/" />
        <Route exact component={requireAuth(Project)} path="/project" />
        <Route exact component={requireAuth(Assigned)} path="/project/assigned" />
        <Route exact component={requireAuth(Check)} path="/project/check" />
        <Route exact component={requireAuth(Management)} path="/project/management" />
        <Route exact component={requireAuth(MembersManagement)} path="/project/management/membersManagement" />
        <Route exact component={requireAuth(Analysis)} path="/project/management/analysis" />
        <Route exact component={requireAuth(GL)} path="/project/management/gl" />
        <Route component={NoMacth} path="*" />
      </Switch>
    </Router>
  );
}
