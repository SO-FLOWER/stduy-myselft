import React, { Component, Fragment } from 'react';
import { Avatar, Button, Checkbox, Pagination, message, Image } from 'antd';
import {
  DownOutlined,
  CloseCircleFilled,
  LikeOutlined,
  FormOutlined,
  MessageOutlined,
  PieChartOutlined,
  UpOutlined,
} from '@ant-design/icons';
import {
  getWeeklyTime,
  zan,
  zanList,
  weeklyComment,
  getWeeklyComment,
  getWeeklyRead,
} from './../../../../api/api.js';
import './weeklyMsg.less';
import WeeklyComment from './../comment/comment.js';

class Weekly extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showZan: false,
      weekId: this.props.weekly.weekId,
      showAll: false,
      showComment: false,
      readList: false,
      readListData: [],
      weeklyTime: {},
      zanList: {},
      citeTextS: { top: '200px', left: '1020px' },
      importText: '',
      showImportText: '', //引用文字
      showImport: false, //展示引用文字
      commentText: '', //评论内容
      toDD: false,
      weeklyCommentList: {},
      weeklyFlag:false,
      commentPageNum: (this.props.weekly.urlParams && this.props.weekly.urlParams.currentComment) || 1,
    };
  }

  //任意位置关闭已读人员弹窗
  closeReadDialog = (e) => {
    const ELE = Array.from(e.path);
    for (let i = 0; i < ELE.length; i++) {
      if (i > 5) break;
      if (ELE[i].className === 'blue read-box') {
        return;
      }
    }

    if (e.target.className === 'read-text') {
      return;
    }
    if (this.state.readList) {
      this.setState({
        readList: false,
      });
    }
  };
  componentDidMount() {
    if (this.props.weekly.isLike === 1) {
      this.setState({ showZan: true });
      let data = {
        weekReportId: this.props.weekly.weekId,
      };
      zanList(data.weekReportId).then((res) => {
        if (res.data.code == 1) {
          this.setState({
            zanList: res.data.data.result.avatarList,
          });
          console.log(this.state.zanList);
        } else {
          message.error(res.data.message);
        }
      });
    }
    //判断是否要展示全部
    if (this.props.showAll) {
      this.showAll();
    }
    //暂时只有定位使用
    if (this.props.weekly.urlParams) {
      console.log(this.props.weekly.urlParams);
      //判断是否打开评论 暂时只有定位使用
      if (this.props.weekly.urlParams.currentComment) {
        this.showComment();
      }
    }


    // 开启监听
    window.addEventListener('click', this.closeReadDialog, true);
  }
  componentWillUnmount() {
    //销毁监听
    window.removeEventListener('click', this.closeReadDialog, true);
  }

  hiddenCite = () => {
    let citeTextS = {
      top: 0,
      left: 0,
      display: 'none',
    };
    this.setState({
      citeTextS: citeTextS,
    });
  };
  getText = (event) => {
    event.stopPropagation();
    event.nativeEvent.stopImmediatePropagation();

    let textMsg = '';
    var e = event || window.event;
    let citeTextS = {
      top: e.clientY + (document.documentElement.scrollTop || document.body.scrollTop) - 40,
      left: e.clientX + 20,
      display: 'block',
    };
    if (window.getSelection) {
      textMsg = window.getSelection().toString();
      this.setState({
        importText: textMsg,
      });
    } else if (document.getSelection) {
      textMsg = document.getSelection();
      this.setState({
        importText: textMsg,
      });
    } else if (document.selection) {
      textMsg = document.selection.createRange().text;
      this.setState({
        importText: textMsg,
      });
    }
    if (textMsg === '') {
      this.setState({
        citeTextS: {
          top: 0,
          left: 0,
          display: 'none',
        },
      });
    } else {
      this.setState({
        citeTextS: citeTextS,
      });
    }
  };
  showImportText = () => {
    this.setState({
      showComment: true,
      citeTextS: {
        top: 0,
        left: 0,
        display: 'none',
      },
      showImportText: this.state.importText,
      showImport: true,
    });
  };
  hiddenImport = () => {
    this.setState({
      showImport: false,
    });
  };
  getInput = (e) => {
    let value = e.target.value;
    this.setState({
      name: value,
    });
  };
  onChange = (e) => {
    this.setState({
      toDD: e.target.checked,
    });
  };
  changZan = () => {
    let data = {};
    data.weekReportId = this.props.weekly.weekId;
    data.isLike = !this.state.showZan ? '1' : '0'; //1 点赞 0 取消

    zan(data).then((res) => {
      if (res.data.code == 1) {
        zanList(this.props.weekly.weekId).then((res) => {
          if (res.data.code == 1) {
            this.setState({
              zanList: res.data.data.result.avatarList,
              showZan: !this.state.showZan,
            });
          } else {
            message.error(res.data.message);
          }
        });
      } else {
        message.error(res.data.message);
      }
    });
  };
  showAll = () => {
    const { weekly, changeReadStatusAndCount } = this.props;
    this.setState({
      showAll: !this.state.showAll,
    });
    let data = {
      userId: weekly.userId,
      weekReportDate: weekly.reportDate.substring(0, 10),
      weekReportId: weekly.weekId,
    };
    //判断是否要提示外部更新
    if (weekly.isRead === 0) {
      changeReadStatusAndCount(weekly.weekId);
    }
    getWeeklyTime(data).then((res) => {
      if (res.data.code === 1) {
        this.setState({
          weeklyTime: res.data.data,
        });
      } else {
        message.error(res.data.message);
      }
    });
  };
  readList = async (weekReportId, num, e) => {
    let data = {};
    if (!num) {
      return;
    }

    if (!this.state.readList) {
      const { rows, count } = await getWeeklyRead({
        current: 1,
        size: 30,
        weekReportId: +weekReportId,
      });
      data.readListData = {
        count,
        rows,
      };
    }
    data.readList = !this.state.readList;
    this.setState(data);
  };
  showComment = () => {
    this.setState({
      showComment: !this.state.showComment,
    });
    this.getComment();
  };
  getComment = (pageNumber) => {
    const { weekly } = this.props;
    let data = {
      current: pageNumber ? pageNumber : this.state.commentPageNum,
      size: 5,
      weekReportId: weekly.weekId,
    };
    getWeeklyComment(data).then((res) => {
      if (res.data.code === 1) {
        if (res.data.data.count > 0) {
          this.setState(
            {
              weeklyCommentList: res.data.data,
            },
            () => {
              if (weekly.urlParams && weekly.urlParams.currentComment) {
                window.location.hash = '#commentId' + weekly.urlParams.commentId;
                window.scrollTo(window.scrollX, window.scrollY - 128);
              }
            },
          );
          console.log(res.data.data);
        }
      } else {
        message.error(res.data.message);
      }
    });
  };
  //评论发送
  sendComment = () => {
    if (this.state.commentText) {
      let data = {};
      data = {
        content: this.state.commentText,
        forwardDingtalk: this.state.toDD,
        toUserId: this.props.weekly.userId,
        type: 0,
        weekReportId: this.props.weekly.weekId,
      };
      if (this.state.showImportText) {
        data.citeContent = this.state.showImportText;
      }
      weeklyComment(data).then((res) => {
        if (res.data.code == 1) {
          message.info('评论成功！');
          this.setState({
            showImportText: '', //引用文字
            showImport: false, //展示引用文字
            commentText: '', //评论内容
          });
          this.getComment();
        }
      });
    } else {
      message.info('评论内容为空');
    }
  };
  changeCommentF = (e) => {
    //input输入什么，就监听这个方法，然后再修改state，然后返回到视图
    this.setState({
      commentText: e.target.value,
    });
  };
  hiddenCite = () => {
    let citeTextS = {
      top: 0,
      left: 0,
      display: 'none',
    };
    this.setState({
      citeTextS: citeTextS,
    });
  };
  pageNum = (pageNumber) => {
    this.setState({
      commentPageNum: pageNumber,
    });
    this.getComment(pageNumber);
  };

  selPersonWeekList=()=>{
    const personId=this.props.personId;
    this.props.selPersonWeekList(personId);
    
    this.setState({
      weeklyFlag:true
    })
  }
  render() {
    let weeklyTime, showTime, zanList, commentList, picList;
    if (this.state.weeklyTime.result) {
      weeklyTime = this.state.weeklyTime.result.countHour.map((val) => {
        return <label>{val}</label>;
      });
      showTime = this.state.weeklyTime.result.timeStampManHourList.map((val) => {
        return (
          <div className="tableMsg1">
            <label className="tableName1">{val.projName}</label>
            <label>{val.hourInfos[0].hourNum}</label>
            <label>{val.hourInfos[1].hourNum}</label>
            <label>{val.hourInfos[2].hourNum}</label>
            <label>{val.hourInfos[3].hourNum}</label>
            <label>{val.hourInfos[4].hourNum}</label>
            <label>{val.hourInfos[5].hourNum}</label>
            <label>{val.hourInfos[6].hourNum}</label>
          </div>
        );
      });
    }
    if (this.state.zanList[0]) {
      zanList = this.state.zanList.map((val) => {
        if (val.avatar) {
          return (
            <li>
              <img src={val.avatar} alt="" />
            </li>
          );
        } else {
          return (
            <li>
              <span className="headerPic50">{val.username[val.username.length - 1]}</span>
            </li>
          );
        }
      });
    }
    if (this.state.weeklyCommentList.count > 0) {
      commentList = this.state.weeklyCommentList.rows.map((val, index) => {
        return <WeeklyComment comment={val} weekId={this.props.weekly.weekId} getComment={this.getComment} />;
      });
    }
    if (this.state.weeklyTime.result) {
      picList = this.state.weeklyTime.result.picUrlList.map((val) => {
        return (
          <div className="leftM10">
            <Image width={88} height={88} src={val} />
          </div>
        );
      });
    }
    return (
      <Fragment>
        <div className="weeklyList" onClick={this.hiddenCite}>
          <div className="weeklyTitle">
            <div className="weeklyName">
              {this.props.weekly.avatar === '' ? (
                <div className="headerPic">{this.props.weekly.name[this.props.weekly.name.length - 1]}</div>
              ) : (
                <Avatar size={32} src={this.props.weekly.avatar} />
              )}
              <label> {this.props.weekly.name}的周报</label>
            </div>
            <div className="personweeklist" onClick={this.selPersonWeekList} hidden={this.state.weeklyFlag} >
                  查询本人全部周报
            </div>
            <div className="weeklyTime">{this.props.weekly.reportDate}</div>
          </div>
          <div className="weeklyMsg">
            <div className="msgShow">
              <p>本周工作内容:</p>
              <pre onClick={this.getText} className="div1">
                {this.props.weekly.weekContent}
              </pre>
            </div>
            <div className={this.state.showAll ? 'msgShow' : 'hidden'}>
              <p>下周工作计划：</p>
              <pre className="div1" onClick={this.getText}>
                {this.props.weekly.weekPlan}
              </pre>
            </div>
            <div className={this.state.showAll ? 'msgShow' : 'hidden'}>
              <p>备注：</p>
              <pre className="div1" onClick={this.getText}>
                {this.props.weekly.remark}
              </pre>
            </div>
            <div className={this.state.showAll && this.state.weeklyTime ? 'tableShow1' : 'hidden'}>
              <div className="div1 tableTitle">
                <label className="tableName1">项目名称</label>
                <label>星期一</label>
                <label>星期二</label>
                <label>星期三</label>
                <label>星期四</label>
                <label>星期五</label>
                <label>星期六</label>
                <label>星期天</label>
              </div>
              {showTime}
              <div className="tableAll">
                <label className="tableName1">合计</label>
                {weeklyTime}
              </div>
            </div>
            <div className={this.state.showAll ? 'msgShow ' : 'hidden'}>
              <p>图片：</p>
              <div className="notextindent">
                <Image.PreviewGroup>{picList}</Image.PreviewGroup>
              </div>
            </div>
          </div>
          <div className="commentList">
            <div className="commentL">
              <div onClick={this.changZan} className={this.state.showZan ? 'blue' : ''}>
                <LikeOutlined />
                <span>点赞</span>
              </div>
              <div onClick={this.showComment} className={this.state.showComment ? 'blue' : ''}>
                <MessageOutlined />
                <span>{this.state.weeklyCommentList.count || this.props.weekly.commentCount}条评论</span>
              </div>
              <div
                onClick={(e) => this.readList(this.props.weekly.weekId, this.props.weekly.readCount, e)}
                className={`${this.state.readList ? 'blue' : ''} read-box`}
              >
                <ul
                  onClick={(e) => e.stopPropagation()}
                  className="week_dia-box"
                  style={{ display: this.state.readList ? 'flex' : 'none' }}
                >
                  {(this.state.readListData.rows || []).map((item, index) => {
                    return (
                      <li key={index}>
                        <Avatar size={40} src={item.avatar} className="avatar">
                          {item.avatar ? '' : item.username}
                        </Avatar>
                        <div className="week_dia-name">{item.username}</div>
                      </li>
                    );
                  })}
                </ul>
                <PieChartOutlined />
                <span className="read-text">{this.props.weekly.readCount}人已读</span>
              </div>
            </div>
            <div className="selperallweekly" onClick={this.selPersonWeekList} hidden={!this.state.showAll}>查看本人所有周报</div>
            <div className={!this.state.showAll ? 'commentR' : 'hidden'} onClick={this.showAll}>
              <DownOutlined />
              <label>展开详情</label>
            </div>
            <div className={this.state.showAll ? 'commentR' : 'hidden'} onClick={this.showAll}>
              <UpOutlined />
              <label>收起详情</label>
            </div>
            

          </div>

          <ul className={this.state.showZan ? 'like' : 'hidden'}>
            {zanList}
            <div>{this.state.zanList.length}人赞</div>
          </ul>
          <div className={this.state.showComment ? 'comment' : 'hidden'}>
            <div className="inputComment">
              <div>
                <input
                  placeholder="小小鼓励，让团队更凝聚"
                  value={this.state.commentText}
                  onChange={this.changeCommentF}
                  maxLength={140}
                />
                <span>{this.state.commentText.length}/140</span>
              </div>
              <Button type="primary" onClick={this.sendComment}>
                发布
              </Button>
            </div>
            <div className={this.state.showImport ? 'cite' : 'hidden'}>
              <label className="citeHead">引用</label>

              <div>{this.state.showImportText}</div>
              <em onClick={this.hiddenImport}>
                <CloseCircleFilled size={16} />
              </em>
            </div>
            <p className="sendPer">
              <Checkbox onChange={this.onChange}>
                评论通过聊天转发到<b>{this.props.weekly.name}</b>
              </Checkbox>
            </p>
            <div className={this.state.weeklyCommentList.count == null ? 'hidden' : 'otherComment'}>
              <h3> {this.state.weeklyCommentList.count}条评论</h3>

              {commentList}

              <div className="pageChange">
                <Pagination
                  current={this.state.commentPageNum}
                  defaultPageSize={5}
                  total={this.state.weeklyCommentList.count}
                  hideOnSinglePage={true}
                  onChange={this.pageNum}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="citeText aaa" style={this.state.citeTextS} onClick={this.showImportText}>
          <FormOutlined />
          引用
        </div>
      </Fragment>
    );
  }
}

export default Weekly;
