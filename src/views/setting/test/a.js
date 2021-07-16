import React,{Component,Fragment} from 'react';
import Praise from './../../../img/praise.png';
import {Select, Button,DatePicker,Pagination ,Tag ,message,Empty } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import {getProjList,getproWorkTime} from './../../../api/api'
// import ProAssignedMsg from './../proAssignedMsg/index.js'
import AddProAssignedMsg from './../addProAssignedMsg/index.js'
// import './index.less';
// import Left from './../compents/leftRouter/index';
import Titler from './../../compent/headerTitle/headerTitle'
const { Option } = Select;
// import axios from 'axios';

class ProAssigend extends Component {
  
    state={
        pjbName : '',
        pmName : '',
        proAssignedMsg :[],
        proStatus:'',
        pageNum :1,
        allCount : 0,
        addPm:[],
        tableData:[{roleId: 1, deptId: 145554519, roleName: "主管理员", deptName: "深圳提亚数字科技有限公司", createBy: "张三"},
         {roleId: 1, deptId: 145554519, roleName: "主管理员", deptName: "深圳提亚数字科技有限公司", createBy: "张三"},
       {roleId: 2, deptId: 145554519, roleName: "测试", deptName: "深圳提亚数字科技有限公司", createBy: "cs"},
        {roleId: 5, deptId: 145554519, roleName: "cs", deptName: "深圳提亚数字科技有限公司", createBy: "万庆翠"}
       ]
    }
    componentWillUnmount(){
    };
    componentDidMount(){
        console.log('耶耶耶耶耶耶',this.getTableData(1, 10, this.state.tableData))
       let data =  {
            "current": 1,
            "size": 10,
         
        }
        getProjList(data).then(res=>{
            if(res.data.code == 1){
                this.setState({
                    proAssignedMsg : res.data.data.rows,
                    allCount :res.data.data.count
                })
            }else{
                message.error(res.data.message);
            }
        })
};
addpm = () =>{
    let pmList = this.state.addPm;
    pmList.unshift({newOne : true});
    console.log(pmList)
    this.setState({
        addPm : pmList
    })
}
/**
 * @name  getTableData
 * @desc  纯JS前端分页方法
 * @param  {Number} page 当前页码，默认1
 * @param  {Number} pageSize 每页最多显示条数，默认10
 * @param  {Array} totalData 总的数据集，默认为空数组
 * @return {Object} {
    data, //当前页展示数据，数组
    page, //当前页码
    pageSize, //每页最多显示条数
    length, //总的数据条数
  }
**/
 getTableData = (page = 1, pageSize = 10, totalData = []) => {
    const { length } = totalData;
    const tableData = {
      data: [],
      page,
      pageSize,
      length,
    };
    if (pageSize >= length) { //pageSize大于等于总数据长度，说明只有1页数据或没有数据
      tableData.data = totalData;
      tableData.page = 1;//直接取第一页
    } else { //pageSize小于总数据长度，数据多余1页
      const num = pageSize * (page - 1);//计算当前页（不含）之前的所有数据总条数
      if (num < length) { //如果当前页之前所有数据总条数小于（不能等于）总的数据集长度，则说明当前页码没有超出最大页码
        const startIndex = num;//当前页第一条数据在总数据集中的索引
        const endIndex = num + pageSize - 1;//当前页最后一条数据索引
        tableData.data = totalData.filter((_, index) => index >= startIndex && index <= endIndex);//当前页数据条数小于每页最大条数时，也按最大条数范围筛取数据
      } else { //当前页码超出最大页码，则计算实际最后一页的page，自动返回最后一页数据
        const size = parseInt(length / pageSize); //取商
        const rest = length % pageSize; //取余数
        if (rest > 0) { //余数大于0，说明实际最后一页数据不足pageSize，应该取size+1为最后一条的页码
          tableData.page = size + 1;//当前页码重置，取size+1
          tableData.data = totalData.filter((_, index) => index >= (pageSize * size) && index <= length);
        } else if (rest === 0) { //余数等于0，最后一页数据条数正好是pageSize
          tableData.page = size;//当前页码重置，取size
          tableData.data = totalData.filter((_, index) => index >= (pageSize * (size - 1)) && index <= length);
        } //注：余数不可能小于0
      }
    }
    return tableData;
  };
handleChange = (value ) => {
    this.setState({
        proStatus:value
   })
    }


      getProName = (e)=>{
        this.setState({
            pjbName:e.target.value
       })
      }
      getPmName = (e)=>{
        this.setState({
            pmName:e.target.value
       })
      }
    
      findPm=()=>{
          let data = {
            projName:this.state.pjbName,
            pmName :this.state.pmName,
            status : this.state.proStatus,
            size : 10,
            current :1
          }
          getProjList(data).then(res=>{
            if(res.data.code == 1){
                this.setState({
                    proAssignedMsg : res.data.data.rows,
                    allCount :res.data.data.count
                })
            }else{
                message.error(res.data.message);
            }
          })
      }
      changePage =(page) =>{
        let data = {
            projName:this.state.pjbName,
            pmName :this.state.pmName,
            status : this.state.proStatus,
            size : 10,
            current :this.state.pageNum
          }
           
            getProjList(data).then(res=>{
                if(res.data.code == 1){
                    this.setState({
                        proAssignedMsg : res.data.data.rows,
                        allCount :res.data.data.count,
                        current :page
                    })
                }else{
                    message.error(res.data.message);
                }
            })
      }
    render(){
        let  msgList = <Empty />;
        let addPm = '';

        if(this.state.proAssignedMsg){
            msgList = this.state.proAssignedMsg.map((val,index)=>{
              
            //    return  ( <ProAssignedMsg  msg = {val} id = {index}/>) 
                
            })
        }
        if(this.state.addPm.length>0){
            addPm = this.state.addPm.map((val,index)=>{
              
            //    return  ( <AddProAssignedMsg  msg = {val}/>) 
                
            })
        }
        
        
        return (
            <Fragment>
              
              <Titler />
                 <div className='content'>
                        <div className='left'>
                       {/* <Left/> */}
                        </div>
                        <div className='right'>
                                <div className='pmTitle'>
                                    <div className='ib' > <label>角色:</label> <input type="text" onChange={this.getProName} style={{width:'168px'}} /></div> 
                                     <div className='ib btn'><Button type='primary' onClick={this.findPm}>搜索</Button></div>
                                </div>
                                <div className='pmContent' >
                                        <div className='addPro' >
                                            <Button icon={<PlusOutlined /> }   onClick={this.addpm} type='primary'>创建角色</Button>
                                        </div>
                                        <div className='proTabel'>
                                                <div className='tableHeader'>
                                                    <label style={{width:'85px'}}>角色</label>
                                                    <label  style={{width:'85px'}}>所属部门</label>
                                                    <label  style={{width:'95px'}}>创建人</label>
                                                    <label  style={{width:'96px'}}>创建时间</label>
                                                    <label  style={{width:'114px'}}>项目经理</label>
                                                    <label  style={{width:'124px'}}>权限角色</label>
                                                </div>
                                                <div>
                                                    <table>
                                                        <tr >
                                                            <td></td>
                                                        </tr>
                                                    </table>
                                                </div>
                                                {/* {addPm}
                                                {msgList} */}
                                    <div className='page'><Pagination defaultCurrent={1} total={this.state.allCount} hideOnSinglePage={false} current={1}  onChange={this.changePage}/></div>
                                        </div>
                                </div>

                                </div>
                 </div>
            </Fragment>
            
        )
    }
}


export default ProAssigend;