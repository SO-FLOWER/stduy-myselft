import React, { Component, Fragment } from 'react';
import { Button, message, Radio, Avatar, Tooltip, Modal, Select } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { getPositionList, updatePosition, delectProUser } from '../../../api/api';
import './index.less';
const { Option } = Select;

class MembersManagementMsg extends Component {
  constructor(props) {
    super(props);
  }
  state = {
    proJobList: [],
    showAll: true,
  };
  componentWillUnmount() {}
  componentDidMount() {
    getPositionList().then((res) => {
      if (res.data.code == 1) {
        this.setState({
          proJobList: res.data.data.rows,
        });
      } else {
        message.error(res.data.message);
      }
    });
  }
  changeList = (list) => {
    if (list.length > 0) {
      for (let i = 0; i < list.length; i++) {
        let linshi = {
          title: list[i].name,
          key: list[i].id.toString(),
          children: list[i].children,
          // icon: ({ true}) => (selected ? <FrownFilled /> : <FrownOutlined />)
        };
        list[i] = linshi;
        this.changeList(list[i].children);
      }
    }
  };
  exitPro = () => {
    let id = this.props.msg.id;
    delectProUser(id).then((res) => {
      if (res.data.code == 1) {
        this.setState({
          showAll: false,
        });
      } else {
        message.error(res.data.message);
      }
    });
  };
  handleChange = (value) => {
    let data = {
      id: this.props.msg.id,
      projPosition: value,
    };
    updatePosition(data).then((res) => {
      if (res.data.code == 1) {
        message.info('修改成功');
      } else {
        message.info('网络错误');
      }
    });
  };

  render() {
    let list = '';
    if (this.state.proJobList.length > 0) {
      list = this.state.proJobList.map((val, index) => {
        return <Option value={val ? val.position : val}>{val ? val.position : val}</Option>;
      });
      // if(this.state.list.length > 0){
      //     console.log(123)
      //     list = this.state.list.map((val,index) =>{
      //     return (  <Option value={index}>{val.position}</Option>  )
      //     })
      // }
    }
    return (
      <Fragment>
        <div className={this.state.showAll ? 'tableMsg' : 'hidden'}>
          <label style={{ width: '140px' }}>
            {' '}
            {this.props.msg.avatar == '' ? (
              <div className="headerPic">{this.props.msg.username[this.props.msg.username.length - 1]}</div>
            ) : (
              <Avatar src={this.props.msg.avatar} />
            )}
            {this.props.msg.username}
          </label>
          <label style={{ width: '140px' }}>{this.props.msg.deptName}</label>
          <label style={{ width: '140px' }}>
            <Select defaultValue={this.props.msg.projPosition} style={{ width: 120 }} onChange={this.handleChange}>
              {list}
            </Select>
          </label>
          <label style={{ width: '140px' }}>{this.props.msg.mobile}</label>
          <label style={{ width: '140px' }}>{this.props.msg.firstJoinTime}</label>
          <label style={{ width: '140px' }}>{this.props.msg.updateTime}</label>
          <label style={{ width: '140px' }} className="blue" onClick={this.exitPro}>
            退出
          </label>
        </div>
      </Fragment>
    );
  }
}

export default MembersManagementMsg;
