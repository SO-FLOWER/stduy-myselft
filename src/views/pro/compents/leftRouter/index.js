/*
 * @Description: file content
 * @Author: 琚志强 1020814597
 * @Date: 2021-01-18 14:12:25
 * @LastEditors: 琚志强
 * @LastEditTime: 2021-01-28 15:15:50
 */
import React, { Component, Fragment } from 'react';
// import { browserHistory } from 'react-router';
import { withRouter, Link } from 'react-router-dom';
import './index.less';

// import axios from 'axios';

class Left extends Component {
  state = {
    pathName: '',
    pList: [],
  };
  componentWillUnmount() {}
  componentDidMount() {
    let pathName = this.props.location.pathname;
    pathName = pathName.substring(8, pathName.length);
    console.log(pathName);
    this.setState({
      pathName: pathName,
    });
   
    const lets = setTimeout(()=>{
        if(window.sessionStorage.getItem('powerList')){
            let pList = window.sessionStorage.getItem('powerList') ? window.sessionStorage.getItem('powerList') : [];
            if (pList.length > 0) {
              pList = pList.split(',');
            }
            clearTimeout(lets);
            this.setState({
                pList: pList,
            });
        };
    },300)
   
  }

  render() {
    return (
      <Fragment>
        <ul>
          {this.state.pList.indexOf('project:assign') > -1 ? (
            <Link to="/project/assigned">
              <li className={this.state.pathName == '/assigned' ? 'active' : ''}>项目指派</li>
            </Link>
          ) : (
            ''
          )}
          {this.state.pList.indexOf('project:manage') > -1 ? (
            <Link to="/project/management">
              <li className={this.state.pathName.substring(0, 11) == '/management' ? 'active' : ''}>项目管理</li>
            </Link>
          ) : (
            ''
          )}
          {this.state.pList.indexOf('project:hour_time_check') > -1 ? (
            <Link to="/project/check">
              <li className={this.state.pathName == '/check' ? 'active' : ''}> 工时审核</li>{' '}
            </Link>
          ) : (
            ''
          )}
        </ul>
      </Fragment>
    );
  }
}

export default withRouter(Left);
