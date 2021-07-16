import React, { Component, Fragment } from 'react';
import { Button, DatePicker, Radio, Avatar, Tooltip, Select, message } from 'antd';


import './index.less';




class DeptTime extends Component {
  constructor(props) {
    super(props);
    this.state = {
      
    }; 
    console.log(this.props)
  }


  render() {
    let time = [];
   
    if(this.props.msg.hourNum.length >0){
      time = this.props.msg.hourNum.map((val,index)=>{
        let staly = {
              background:this.props.color[index],
              width:val*640/this.props.maxLength+'px',
              margin: '1px'
        }
          return (
           
            <Tooltip title={this.props.msg.deptName + ' 工时:'+ val/100} color={this.props.color[index]} placement="topRight">
              <div className="tmsg2" style={staly}> </div>
            </Tooltip>
          )
      })
    }
    return (
      <Fragment>
       <div className="tableMsg1" >
            <label>
                  {this.props.msg.deptName}
            </label>
            {time}
          </div>
      </Fragment>
    );
  }
}

// export default ProAnalysis;
export default DeptTime;
