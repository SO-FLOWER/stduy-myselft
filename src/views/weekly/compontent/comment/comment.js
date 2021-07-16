import React, { Component, Fragment } from 'react';
import { Avatar, Button, Checkbox, message } from 'antd';
import { weeklyComment, delectComment } from '../../../../api/api.js';
import './comment.less';

class WeeklyComment extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showInput: false,
      sfToDD: false,
      commentText: '',
      userId: (JSON.parse(window.sessionStorage.getItem('userMsg')) || {}).userId,
      inputMaxLength: 140,
    };
  }
  componentDidMount() {}
  onChange = (e) => {
    this.setState({
      sfToDD: e.target.checked,
    });
  };

  showInput = () => {
    this.setState({
      showInput: !this.state.showInput,
    });
  };

  sendComment = () => {
    if (this.state.commentText) {
      let data = {};
      data = {
        content: this.state.commentText,
        forwardDingtalk: this.state.sfToDD,
        toUserId: this.props.comment.userId,
        type: 1,
        weekReportId: this.props.weekId,
        toId: this.props.comment.id,
      };

      weeklyComment(data).then((res) => {
        if (res.data.code === 1) {
          message.info('评论成功！');
          this.setState({
            commentText: '', //评论内容
            showInput: false,
          });
          this.props.getComment();
        }
      });
    } else {
      message.info('评论内容为空');
    }
  };

  delectWeekly = () => {
    let id = this.props.comment.id;
    console.log(this.props);
    delectComment(id).then((res) => {
      if (res.data.code == 1) {
        message.info('删除成功');
        this.setState({
          hiddenAll: true,
        });
        this.props.getComment();
      } else {
        message.error(res.data.message);
      }
    });
  };
  changeCommentF = (e) => {
    //input输入什么，就监听这个方法，然后再修改state，然后返回到视图
    this.setState({
      commentText: e.target.value,
    });
  };

  render() {
    const { comment } = this.props;
    const { commentText, showInput, userId, inputMaxLength } = this.state;
    return (
      <Fragment>
        <div className="commentList1" id={'commentId' + comment.id}>
          <label className="commentHeader">
            {comment.avatar === '' ? (
              <div className="headerPic">{comment.name[comment.name.length - 1]}</div>
            ) : (
              <Avatar size={32} src={comment.avatar} />
            )}
          </label>
          <div className="commentMsg">
            <div className="commentM">
              <span>
                {comment.name}
                <label className={comment.type === 1 ? '' : 'hidden'}>
                  回复<i>{comment.toName}</i>
                </label>
                :
              </span>
              {comment.content}
            </div>
            <div className={comment.citeContent ? 'commentCite' : 'hidden'}>引用：{comment.citeContent}</div>
            <div className="commentTime">{comment.commentDate}</div>
            <div className={!showInput ? 'commentOperation ' : 'hidden'}>
              <span onClick={this.showInput}> 回复</span>
              {userId === comment.userId && <span onClick={this.delectWeekly}>删除</span>}
            </div>
            <div className={showInput ? 'commentOperation ' : 'hidden'}>
              <span onClick={this.showInput}>取消回复</span>
            </div>
            <div className={showInput ? 'inputC ' : 'hidden'}>
              <div>
                <input
                  placeholder="小小鼓励，让团队更凝聚"
                  value={commentText}
                  onChange={this.changeCommentF}
                  maxLength={inputMaxLength}
                />
                <span>
                  {commentText.length}/{inputMaxLength}
                </span>
              </div>
              <Button type="primary" onClick={this.sendComment}>
                发布
              </Button>
            </div>
            <p className={showInput ? 'sendPer ' : 'hidden'}>
              <Checkbox onChange={this.onChange}>
                评论通过聊天转发到<b>{comment.name}</b>
              </Checkbox>
            </p>
          </div>
        </div>
      </Fragment>
    );
  }
}

export default WeeklyComment;
