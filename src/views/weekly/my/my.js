import React, { Component, Fragment } from 'react';
import { Avatar, Button, message, Empty } from 'antd';
import { UserOutlined, DownOutlined } from '@ant-design/icons';
import { getCallMyList, getMessagePosition } from './../../../api/api';
import './my.less';
import Titler from './../../compent/headerTitle/headerTitle';
import { Link } from 'react-router-dom';
// import axios from 'axios';
import UserAvatar from '../../../compents/userAvatar/index';

const statusMap = {
  0: {
    actionText: ' 发布了 周报',
    url: '/weekly',
    params: ['weekReportId', 'type'],
  },
  1: {
    actionText: ' 评论了 我的周报',
    url: '/weekly',
    params: ['weekReportId', 'currentComment', 'type', 'commentId'],
    api: getMessagePosition,
  },
  2: {
    actionText: ' 回复了 我的评论',
    url: '/weekly',
    params: ['weekReportId', 'currentComment', 'type', 'commentId'],
    api: getMessagePosition,
  },
  3: {
    actionText: ' 点赞了 我的周报',
    url: '/weekly',
    params: ['weekReportId', 'type'],
  },
  4: {
    actionText: ' 系统提醒你 填写周报',
    url: '/weekly/mydata',
    params: [],
  },
  5: {
    actionText: ' 系统提醒你 填写周报',
    url: '/weekly/mydata',
    params: [],
  },
  6: {
    actionText: ' 您有待审核工时数据{num}条,请及时审核',
    url: '/project/management',
    params: [],
  },
  7: {
    actionText: '您有待确认工时数据{num}条,请及时确认',
    url: '/project/check',
    params: [],
  },
};
class My extends Component {
  constructor() {
    super();
    this.state = {
      pageNum: 1,
      btnStatus: false,
      callMeList: [],
      pList: [],
    };
  }
  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll);
  }
  componentDidMount() {
    let pList = window.sessionStorage.getItem('powerList') ? window.sessionStorage.getItem('powerList') : [];

    if (pList.length > 0) {
      pList = pList.split(',');
    }
    this.setState({
      pList: pList,
    });
    window.addEventListener('scroll', this.handleScroll);
    this.getCallMeList();
  }
  handleScroll = () => {
    let height = document.body.scrollHeight - window.scrollY - document.documentElement.clientHeight;
    if (height < 100) {
      this.setState({
        pageNum: this.state.pageNum + 1,
      });
      this.getCallMeList();
    }
  };
  isMore = true;
  getCallMeList = () => {
    let data = {};
    data = {
      current: this.state.pageNum,
      size: 15,
    };
    getCallMyList(data).then((res) => {
      if (res.data.code === 1) {
        if (!this.isMore) return false;
        this.setState({
          callMeList: this.state.callMeList.concat(res.data.data.rows),
        });
        if (res.data.data.rows.length === 0) {
          this.isMore = false;
          window.removeEventListener('scroll', this.handleScroll);
        }
      } else {
        message.error(res.data.message);
      }
    });
  };
  goToTypeDetail = (data) => {
    const action = statusMap[data.type];
    if (action.api) {
      action.api(data).then((res) => {
        this.goToUrl({ ...data, ...res }, action);
      });
    } else {
      this.goToUrl(data, action);
    }
  };
  goToUrl(data, action) {
    let params = '';
    console.log(action.params);
    action.params.forEach((e) => {
      params += e + '=' + data[e] + '&';
    });

    this.props.history.push(`${action.url}?${params}`);
  }
  render() {
    let showList = <Empty />;
    showList = this.state.callMeList.map((val) => {
      let name = val.username || '系统';

      if (val.type == 5 || val.type == 4) {
        val.avatar = 'https://i01.lw.aliimg.com/media/lALPDeRETJd8GLDM8Mzw_240_240.png';
      }
      return (
        <div
          className="msgList"
          onClick={() => {
            this.goToTypeDetail(val);
          }}
          key={val.id}
        >
          <div className="headerImg">
            <UserAvatar src={val.avatar} name={name}></UserAvatar>
          </div>
          <label>
            {val.type == 4 ? '' : val.username}
            {val.type == 3 ? '等' + val.messageContent + '人' : ''}
            {statusMap[val.type].actionText.replace('{num}', val.messageContent)}
          </label>
          <div className="time">{val.messageTime}</div>
        </div>
      );
    });
    return (
      <Fragment>
        <Titler />
        <div className="content">
          <div className="changeModel">
            <ul>
              {this.state.pList.indexOf('week_report:hall') > -1 ? (
                <Link to="/weekly">
                  <li>大厅</li>
                </Link>
              ) : (
                ''
              )}

              {this.state.pList.indexOf('week_report:mine') > -1 ? (
                <Link to="/weekly/mydata">
                  <li>我的</li>
                </Link>
              ) : (
                ''
              )}
              {this.state.pList.indexOf('week_report:call_me') > -1 ? <li className="active">@我</li> : ''}
              {this.state.pList.indexOf('week_report:count') > -1 ? (
                <Link to="/weekly/weeklyinfo">
                  <li>周报统计</li>
                </Link>
              ) : (
                ''
              )}
            </ul>
            <div>
              <Link to="/weekly/mydata">
                <Button type="primary"> 填写周报 </Button>
              </Link>
            </div>
          </div>

          <div className="msg">{showList}</div>
        </div>
      </Fragment>
    );
  }
}

export default My;
