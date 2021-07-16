import React, { Component, Fragment } from 'react';
import { Button, DatePicker, Radio, Avatar, Tooltip, Select, message } from 'antd';


import './index.less';




class DeptTime extends Component {
  constructor(props) {
    super(props);
    this.state = {
      
    }; 
  }


  render() {
    let time = [];
    console.log(this.props.maxLength)
    if(this.props.msg.hourNum.length >0){
      time = this.props.msg.hourNum.map((val,index)=>{
        let staly = {
              background:this.props.color[index],
              width:val*500/this.props.maxLength+'px',
              margin: '1px'
        }
          return (
           
            <Tooltip title={this.props.msg.userName + ' 工时:'+ val/100} color={this.props.color[index]} placement="topRight">
              <div className="tmsg2" style={staly}> </div>
            </Tooltip>
          )
      })
    }
    return (
      <Fragment>
       <div className="tableMsg1" >
            <label>
            {this.props.msg.avatar ? (
                    <Avatar size={20} src={this.props.msg.avatar} />
                  ) : (
                    <div className="headerIndex">{this.props.msg.userName[this.props.msg.userName.length - 1]}</div>
                  )} {this.props.msg.userName}
            </label>
            {time}
          </div>
      </Fragment>
    );
  }
}

// export default ProAnalysis;
export default DeptTime;
