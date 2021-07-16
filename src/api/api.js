import service from ' ./../../src/utils/axios.js';
import { message } from 'antd';
service.defaults.timeout = 100000;
// service.defaults.baseURL = "http://202.104.149.204:8040/"  //正式
service.defaults.baseURL = 'http://139.199.226.68:8070'; //测试
// const instance = service.create({
//      baseURL:"http://202.104.149.204:8070",
//      timeout:10000
// })

// service.defaults.headers.common["Content-Type"] = 'application/json';
// if( window.sessionStorage.getItem('accessToken')){
//      service.defaults.headers.common["Authorization"] = window.sessionStorage.getItem('accessToken');

// }
// //添加拦截
// instance.interceptors.request.use(config => {
//      console.log('请求被拦截')
//      return config
//  },error => {

//  })

//  instance.interceptors.response.use(res => {

//      return res.data
//  },error => {
//      return error;
//  })

//公共方法
//上传文件
export function upFile(data) {
  return service.request({
    url: '/common/file/upload',
    method: 'POST',
    data: data,
  });
}

export function getPersonTree(data) {
  if (data) {
    var params = new URLSearchParams();
    params.append('name', data);
  }
  return service.request({
    url: '/user/userTreeList',
    method: 'GET',
    params: params,
  });
}

//userId登录

export function userIdLogin(id) {
  return service.request({
    url: '/api/login/' + id,
    method: 'GET',
  });
}

//周报大厅
export function login(data) {
  return service.request({
    url: '/api/login',
    method: 'GET',
    //  headers:  {
    //     'Content-Type': 'application/x-www-form-urlencoded'
    // },
    //  data:data,
  });
}
export function getUserInfo(data) {
  var params = new URLSearchParams();
  params.append('code', data);
  return service.request({
    url: '/api/login',
    method: 'GET',
    params: params,
  });
}
//获取评论信息
export function getWeeklyList(data) {
  return service.request({
    url: '/detail/list',
    method: 'POST',
    data: data,
  });
}
//获取我发出的周报列表内容详情
export function getmyWeeklyList(data) {
  return service.request({
    url: '/detail/mine',
    method: 'POST',
    data: data,
  });
}
//获取左边导航栏大厅的未读周报列表
export function weeklyLeftUnread(data) {
  return service.request({
    url: '/weekReport/unread',
    method: 'POST',
    data: data,
  });
}
//获取左边导航栏大厅的周报列表
export function weeklyLeftAll(data) {
  return service.request({
    url: '/weekReport/list',
    method: 'POST',
    data: data,
  });
}
//获取左边导航栏大厅的自己发出周报列表
export function weeklyLeftMine(data) {
  return service.request({
    url: '/weekReport/mine',
    method: 'POST',
    data: data,
  });
}
//获取左边导航栏我的团队的周报列表
export function weeklyLeftMyteam(data) {
  return service.request({
    url: '/weekReport/myteam',
    method: 'POST',
    data: data,
  });
}
//获取我的团队的周报列表内容详情
export function getmyTeamWeeklyList(data) {
  return service.request({
    url: '/detail/myteam',
    method: 'POST',
    data: data,
  });
}
//获取未读的周报列表内容详情
export function getunreadWeeklyList(data) {
  return service.request({
    url: '/detail/unread',
    method: 'POST',
    data: data,
  });
}
//获取工时
export function getWeeklyTime(data) {
  return service.request({
    url: '/manhour/detail',
    method: 'POST',
    data: data,
  });
}
//点赞
export function zan(data) {
  return service.request({
    url: '/praise',
    method: 'POST',
    data: data,
  });
}

//获取点赞列表
export function zanList(id) {
  return service.request({
    url: '/weekReport/getPraiseList/' + id,
    method: 'GET',
  });
}

//评论
export function weeklyComment(data) {
  return service.request({
    url: '/comment/save',
    method: 'POST',
    data: data,
  });
}
//获取评论
export function getWeeklyComment(data) {
  return service.request({
    url: '/comment/list',
    method: 'POST',
    data: data,
  });
}
//获得用户未读周报数量

export function getunreadCount(data) {
  return service.request({
    url: '/weekReport/unreadCount',
    method: 'POST',
    data: data,
  });
}
//通过id删除评论
export function delectComment(id) {
  return service.request({
    url: '/comment/delete/' + id,
    method: 'DELETE',
  });
}

//@我

//获取@我列表
export function getCallMyList(data) {
  return service.request({
    url: '/message/list',
    method: 'POST',
    data: data,
  });
}

//周报统计

//获取全部部门分类
export function getAllDepartment() {
  return service.request({
    url: '/dept/deptList',
    method: 'GET',
  });
}
//一键提醒周报

export function callAll(data) {
  return service.request({
    url: '/weekReport/remind',
    method: 'POST',
    data: data,
  });
}
//周报下载
export function downWeekly(data, weekOffset) {
  return service.request({
    url: '/weekReport/submitRecordExport/' + data + '?weekOffset=' + weekOffset,
    responseType: 'arraybuffer',
    method: 'GET',
  });
}
//根据部门及周报日期获取所有用户提交周报详情
export function getSubmitRecordApi(data) {
  return service.request({
    url: '/weekReport/submitRecord',
    method: 'POST',
    data: data,
  });
}
//根据部门及日期获取所有用户当周周报提交记录统计
export function submitRecordStatisticsApi(data) {
  return service.request({
    url: '/weekReport/submitRecordStatistics',
    method: 'POST',
    data: data,
  });
}

//我的
//根据时间段获取个人的工时统计详情
export function personWorkTime(data) {
  return service.request({
    url: '/manhour/mine',
    method: 'POST',
    data: data,
  });
}

//周报-大厅:项目列表
export function getUserProList(data) {
  return service.request({
    url: '/proj/weekReport/getProjList',
    method: 'GET',
  });
}

//获得提交周报页面周报时间戳&工时信息&周报信息
export function getMonthWork(data) {
  return service.request({
    url: '/weekReport/timestamp',
    method: 'POST',
    data: data,
  });
}

//提交或者保存周报
export function sendWeekly(data) {
  return service.request({
    url: '/weekReport/insert',
    method: 'POST',
    data: data,
  });
}
//撤回周报
export function recall() {
  return service.request({
    url: '/weekReport/recall',
    method: 'POST',
  });
}

//数据

//导出部门下项目员工工时数据
export function dpetProTime(data) {
  var params = new URLSearchParams();
  params.append('code', data);
  return service.request({
    url: '/manhour/dpetProjUserManhourExport',
    responseType: 'arraybuffer',
    method: 'GET',
    params: data,
  });
}

//工时总览
export function getALLWorkTime(data) {
  return service.request({
    url: '/manhour/getDeptProjManhourStatistics',
    method: 'POST',
    data: data,
  });
}

//部门工时分布
export function getDeptWorkTime(data) {
  return service.request({
    url: '/manhour/getDeptProjManhour',
    method: 'POST',
    data: data,
  });
}
//人员工时分布
export function getUserProjManhour(data) {
  return service.request({
    url: '/manhour/getUserProjManhour',
    method: 'POST',
    data: data,
  });
}
//数据-数据:项目列表
export function getDeptProjInfo(id) {
  return service.request({
    url: '/manhour/getDeptProjInfo/' + id,
    method: 'POST',
  });
}

//项目
//项目-项目指派:获取部门的项目分类
export function getDeptPoj(id) {
  return service.request({
    url: '/proj/getAllProjCategory',
    method: 'GET',
  });
}
//PMO查询项目列表
export function getProjList(data) {
  return service.request({
    url: '/proj/getProjList/PMO',
    method: 'POST',
    data: data,
  });
}
//PM查询项目列表
export function getPmProjList(data) {
  return service.request({
    url: '/proj/getProjList/PM',
    method: 'POST',
    data: data,
  });
}
//获取分类
export function getCategoryTree(data) {
  return service.request({
    url: '/proj/getProjCategory/' + data,
    method: 'GET',
  });
}

//添加新项目
export function addPm(data) {
  return service.request({
    url: '/proj/create',
    method: 'POST',
    data: data,
  });
}

//PMO修改项目
export function updatePmo(data) {
  return service.request({
    url: '/proj/update/PMO',
    method: 'PUT',
    data: data,
  });
}

//删除项目的项目经理
export function deleteProjPM(data) {
  return service.request({
    url: '/proj/deleteProjPM/' + data,
    method: 'PUT',
  });
}

//查询项目成员信息
export function getProMenMsg(data) {
  console.log(data);
  return service.request({
    url: '/proj/getUserList',
    method: 'GET',
    params: data,
  });
}

//修改项目成员岗位
export function updatePosition(data) {
  return service.request({
    url: '/proj/updatePosition',
    method: 'PUT',
    data: data,
  });
}

//获取权限下职位列表
export function getPositionList(data) {
  return service.request({
    url: '/proj/getPositionList',
    method: 'POST',
    data: data,
  });
}
//插入项目成员
export function addProUser(data) {
  return service.request({
    url: '/proj/projUser',
    method: 'POST',
    data: data,
  });
}
//删除项目成员
export function delectProUser(id) {
  return service.request({
    url: '/proj/projUser/' + id,
    method: 'DELETE',
  });
}
//获取工时
export function getWorkTime(data) {
  return service.request({
    url: '/manhour/getManHourList/supervisor',
    method: 'POST',
    data: data,
  });
}
//获取PM的工时审核列表
export function getPMWorkTime(data) {
  return service.request({
    url: '/manhour/getManHourList/PM',
    method: 'POST',
    data: data,
  });
}
//PM批量通过
export function updateCheckStatusPM(data) {
  return service.request({
    url: '/manhour/updateCheckStatus/PM',
    method: 'PUT',
    data: data,
  });
}
//PM修改工时占比
export function updateHourNumPM(data) {
  return service.request({
    url: '/manhour/updateHourNum/PM',
    method: 'PUT',
    data: data,
  });
}
//PM修改项目
export function updatePM(data) {
  return service.request({
    url: '/proj/update/PM',
    method: 'PUT',
    data: data,
  });
}
//主管修改工时占比
export function updateHourNum(data) {
  return service.request({
    url: '/manhour/updateHourNum/supervisor',
    method: 'PUT',
    data: data,
  });
}
//主管批量通过
export function passWorkTime(data) {
  return service.request({
    url: '/manhour/updateCheckStatus/supervisor',
    method: 'PUT',
    data: data,
  });
}

//部门工时分布&人员工时分布
export function getproWorkTime(data) {
  return service.request({
    url: '/manhour/getProjManhourStatistics',
    method: 'POST',
    data: data,
  });
}

//人员工时明细
export function getProjUserManhour(data) {
  return service.request({
    url: '/manhour/getProjUserManhour',
    method: 'POST',
    data: data,
  });
}
//用户工时数据导出
export function getUserWorkTime(data) {
  var params = new URLSearchParams();
  params.append('code', data);
  return service.request({
    url: '/manhour/projUserManhourExport',
    responseType: 'arraybuffer',
    method: 'GET',
    params: data,
  });
}
//项目-项目管理-项目分析:汇总数据导出
export function getAllUserWorkTime(data) {
  var params = new URLSearchParams();
  params.append('code', data);
  return service.request({
    url: '/manhour/projManhourExport',
    responseType: 'arraybuffer',
    method: 'GET',
    params: data,
  });
}

//删除项目

// export function delectPro(id){

//      return service.request({
//           url:"/proj/delete/"+id,
//           method:'DELETE',
//       })
//  }

//
export function delectPro(id) {
  return service.request({
    url: '/proj/delete/' + id,
    method: 'DELETE',
  });
}

//

//  人员管理-人员列表

export function getUserList(data) {
  return service.request({
    url: '/user/list',
    method: 'POST',
    data: data,
  });
}
//  获取一二级部门
export function getDepartmentList(data) {
  return service.request({
    url: '/dept/twoLevelDept',
    method: 'GET',
    data: data,
  });
}
//  获取权限角色
export function getRolesList(data) {
  return service.request({
    url: '/role/getRoles',
    method: 'POST',
    data: data,
  });
}
//  获取角色人员列表（人员授权）
export function getrolesUserList(data) {
  return service.request({
    url: '/role/userList',
    method: 'POST',
    data: data,
  });
}
//  角色菜单设置回显
export function getmenuChecked(id) {
  return service.request({
    url: '/role/menuChecked?roleId=' + id,
    method: 'GET',
  });
}
//  人员授权--菜单权限设置
export function authorizeMenu(data) {
  return service.request({
    url: '/role/authorizeMenu',
    method: 'POST',
    data: data,
  });
}

//  周报配置模块
//  根据部门id查询抄送人列表
export function copyUserList(id) {
  return service.request({
    url: '/dept/copyUserList/' + id,
    method: 'GET',
  });
}
//  添加或更新部门周报提醒时间
export function RemindTime(data) {
  return service.request({
    url: '/dept/RemindTime',
    method: 'POST',
    data: data,
  });
}
//  获得部门周报提醒时间
export function getRemindTime(data) {
  return service.request({
    url: '/dept/getRemindTime/' + data,
    method: 'POST',
    data: data,
  });
}
//  添加或更新部门周报可提交时间
export function submitTime(id) {
  return service.request({
    url: '/dept/submitTime/' + id,
    method: 'GET',
  });
}
//  默认抄送人:添加
export function addcopyUser(data) {
  return service.request({
    url: '/dept/copyUser',
    method: 'POST',
    data: data,
  });
}
//  周报截至时间
export function endsubmitTime(data) {
  return service.request({
    url: '/dept/submitTime',
    method: 'POST',
    data: data,
  });
}
// 删除节点
// Request URL: http://139.199.226.68:8070/proj/deleteNode/4
export function deleteNode(data) {
  return service.request({
    url: '/proj/deleteNode/' + data,
    method: 'DELETE',
    data: data,
  });
}
// 添加节点
export function addNode(data) {
  return service.request({
    url: '/proj/addNode/',
    method: 'POST',
    data: data,
  });
}
// 修改项目类别名
export function updateNode(data) {
  return service.request({
    url: '/proj/updateNode',
    method: 'PUT',
    data: data,
  });
}
// addDownNode
// 下方添加节点
export function addDownNode(data) {
  return service.request({
    url: '/proj/addDownNode',
    method: 'POST',
    data: data,
  });
}
// 上方添加节点
export function addUpNode(data) {
  return service.request({
    url: '/proj/addUpNode',
    method: 'POST',
    data: data,
  });
}
// 添加子节点
export function addChildNode(data) {
  return service.request({
    url: '/proj/addChildNode',
    method: 'POST',
    data: data,
  });
}
// 权限角色-添加角色
export function addRole(data) {
  return service.request({
    url: '/role/addRole',
    method: 'POST',
    data: data,
  });
}

// 删除角色
export function delRole(data) {
  return service.request({
    url: '/role/delRole',
    method: 'POST',
    data: data,
  });
}
// 人员授权--删除人员
export function delUserRole(data) {
  return service.request({
    url: '/role/delUser',
    method: 'POST',
    data: data,
  });
}
// 默认抄送人:删除
export function delcopyUser(data) {
  return service.request({
    url: '/dept/copyUser',
    method: 'DELETE',
    data: data,
  });
}
// 人员授权--添加人员

export function authorizeUser(data) {
  return service.request({
    url: '/role/authorizeUser',
    method: 'POST',
    data: data,
  });
}
// 根据部门id获取部门

export function getTreeDeptById(id) {
  return service.request({
    url: '/dept/getTreeDeptById?deptId=' + id,
    method: 'GET',
  });
}
//  人员授权--修改个人数据权限范围
//  authorizeOneUser
//
export function authorizeOneUser(data) {
  return service.request({
    url: '/role/authorizeOneUser',
    method: 'POST',
    data: data,
  });
}

//获取周报详细信息
export function getWeeklyDetail(data) {
  return service.request({
    url: '/weekReport/detail',
    method: 'POST',
    data,
  });
}

//获取消息锚点
export function getMessagePosition(data) {
  return new Promise((resolve, reject) => {
    service
      .request({
        url: '/message/position',
        method: 'POST',
        data: {
          ...data,
          commentSize: 5,
          weekReportSize: 5,
        },
      })
      .then((res) => {
        if (res.data.code === 0) {
          message.error(res.data.message);
          reject(res);
        }
        if (res.data.data.result.status === 0) {
          return message.warn('消息内容已被删除');
        }
        resolve(res.data.data.result);
      })
      .catch(reject);
  });
}

//获取周报已读人员列表
export function getWeeklyRead(data) {
  return new Promise((resolve, reject) => {
    service
      .request({
        url: '/weekReport/getReadList',
        method: 'POST',
        data,
      })
      .then((res) => {
        if (res.data.code === 0) {
          message.error(res.data.message);
          return reject(res);
        }
        resolve(res.data.data);
      })
      .catch(reject);
  });
}

// 设置员工直属上级
export function setSuperior(data) {
  return new Promise((resolve, reject) => {
    service
      .request({
        url: '/role/userSuperior',
        method: 'POST',
        data,
      })
      .then((res) => {
        if (res.data.code === 0) {
          message.error(res.data.message);
          return reject(res);
        }
        resolve(res.data.data);
      })
      .catch(reject);
  });
}

// 删除员工直属上级
export function deleteSuperior(data) {
  return new Promise((resolve, reject) => {
    service
      .request({
        url: '/role/userSuperior',
        method: 'DELETE',
        data,
      })
      .then((res) => {
        if (res.data.code === 0) {
          message.error(res.data.message);
          return reject(res);
        }
        resolve(res.data.data);
      })
      .catch(reject);
  });
}

//  查询设置的周报提醒范围
export function getRemindScope(depId) {
  return new Promise((resolve, reject) => {
    service
      .request({
        url: '/dept/RemindScope/' + depId,
        method: 'GET',
      })
      .then((res) => {
        if (res.data.code === 0) {
          message.error(res.data.message);
          return reject(res);
        }
        resolve(res.data.data);
      })
      .catch(reject);
  });
}

//  添加更新周报提醒范围
export function updateRemindScope(data) {
  return new Promise((resolve, reject) => {
    service
      .request({
        url: '/dept/RemindScope',
        method: 'POST',
        data
      })
      .then((res) => {
        if (res.data.code === 0) {
          message.error(res.data.message);
          return reject(res);
        }
        resolve(res.data.data);
      })
      .catch(reject);
  });
}

//  获取补交周报信息
export function getMakeUpDate(data) {
  return new Promise((resolve, reject) => {
    service
      .request({
        url: '/dept/makeUp/makeUpDate/'+data,
        method: 'GET',
      })
      .then((res) => {
        if (res.data.code === 0) {
          message.error(res.data.message);
          return reject(res);
        }
        resolve(res.data.data);
      })
      .catch(reject);
  });
}

//  获取可补交周报列表
export function getCanMakeUpDate(data) {
  return new Promise((resolve, reject) => {
    service
      .request({
        url: '/dept/makeUp/canMakeUpDate',
        method: 'GET',
      })
      .then((res) => {
        if (res.data.code === 0) {
          message.error(res.data.message);
          return reject(res);
        }
        resolve(res.data.data);
      })
      .catch(reject);
  });
}

//  开启补交周报
export function makeUp(data) {
  return new Promise((resolve, reject) => {
    service
      .request({
        url: '/dept/makeUp',
        method: 'POST',
        data
      })
      .then((res) => {
        if (res.data.code === 0) {
          message.error(res.data.message);
          return reject(res);
        }
        resolve(res.data.data);
      })
      .catch(reject);
  });
}

