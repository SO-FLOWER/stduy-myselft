import React, { useState } from 'react';
import { Modal, Button ,message,Input } from 'antd';
import { withRouter ,Link} from 'react-router-dom';
import {getPersonTree,getAllDepartment,authorizeUser} from './../../../api/api'
import Childigio from './c.js'
let personList=[]
let departmenList=[]
class selectComponet extends React.Component {
    constructor(props, context) {
        super(props)
       this.state = {
            visible: this.props.visible ,//由父组件的props决定，this.props.xx
            personList:[],
            departmenList:[]
        }
    }

    componentWillMount() {
      
    }
    componentDidMount(){
      
    };
    componentWillReceiveProps(nextProps){
        this.setState({
            visible: nextProps.visible
        })
    }
    handleOk = e => {
        authorizeUser( {
            "deptIds": [],
            "roleId": 0,
            "userId": 0,
            "userIds": []
        }).then(res=>{
            console.log('添加人员的数据',res)
        })
       
        this.setState({
          visible: false,
        }, () => {});//console.log(' handleOk visible', this.state.visible)
        //  this.props.AA(); //在子组件中调用父组件的AA方法
      };
    
      handleCancel = e => {
        this.setState({
          visible: false
        }, () => {
        //   console.log('handleCancel visible', this.state.visible)
        });
      };
    render() {
        return (
            <div  >
                
                <Modal
                    title="添加授权"
                    visible={this.state.visible}
                    onCancel={this.handleCancel}
                    footer={[
                        <Button type="primary" key='confirm' onClick={this.handleOk}>确定</Button>,
                        <Button key='cancel' onClick={this.handleCancel}>取消</Button>
                    ]}  >
                 <div style={{display:'flex',justifyContent:'space-between',marginBottom:'10px'}}><label  >角色:</label><Input  style={{width:'400px'}} placeholder="请输入角色" /></div>
                 <Childigio  personList={personList} /> 
                 <Childigio departmenList={departmenList}/> 
             </Modal>   
        </div>
        )
    }
}

export default selectComponet
