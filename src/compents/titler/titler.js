import React,{Component,Fragment} from 'react';
import imgURL from './../../img/logo.png';
import { Avatar } from 'antd';
import { UserOutlined} from '@ant-design/icons';
import './titler.less';
// import axios from 'axios';

class Titler extends Component {

    state={
        name:'刷新',
        buttonName :'点击',
        btnStatus:false ,
        citeTextS:{top:'200px',left:'1020px'}
    }
    componentWillUnmount(){
           
    };
    componentDidMount(){
     
};
    
   
 

    
    render(){
        return (
            <Fragment>
               <div className='titleBg' >
               <div className="titleHeader">
               
                   <img className='logo' src={imgURL}/ >
                   <ul>
                       <li className='active'>周报</li>
                       <li>项目</li>
                       <li>数据</li>
                       <li>设置</li>
                   </ul>
                   <div className="userName">
                   <Avatar size={32} icon={<UserOutlined />} />
                   <label>退出</label>
                   </div>
                        </div>
                    </div>

      

   
            </Fragment>
            
        )
    }
}


export default Titler;