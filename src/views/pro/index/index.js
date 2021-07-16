import React,{Component,Fragment} from 'react';
import Praise from './../../../img/praise.png';
import {Select, Button,DatePicker,Pagination} from 'antd';
import { UserOutlined,DownOutlined,CloseCircleFilled ,FormOutlined,PlusOutlined } from '@ant-design/icons';
import {login} from './../../../api/api'
import './index.less';
import Titler from './../../compent/headerTitle/headerTitle'

import ProAssigend from './../proAssigned/index.js'
import ProAnalysis from './../proAnalysis/index.js'
import MembersManagement from './../membersManagement/index.js'

import Left from './../compents/leftRouter/index';
const { Option } = Select;
// import axios from 'axios';

class Project extends Component {
  
    state={
     

    }


    
    render(){
        return (
            <Fragment>
              
                 <Titler />
                 <div className='content'>
                        <div className='left'>
                       <Left/>
                        </div>

                        <div className='right'>
                            {/* <ProAssigend />    */}
                            {/* <ProAnalysis/> */}
                            {/* <MembersManagement/> */}
                     
                        </div>
                 </div>
            </Fragment>
            
        )
    }
}


export default Project;