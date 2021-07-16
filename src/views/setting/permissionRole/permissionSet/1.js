import React,{Component,Fragment} from 'react';
import {Input, Button,Select,Tooltip,Table, Tag, Space ,Pagination,Icon,Popconfirm, message } from 'antd';
import {getmenuChecked} from './../../../../api/api'
import './index.less'
const { Option } = Select;
let roleList=[]
// let ddd=[
//   {
//     "rowspan1": 6,
//     "projectName": "项目一",
//     "rowspan2": 3,
//     "modelName": "博客",
//     "taskName": "任务一",
//     "completeRate": "34%"
//   },
//   {
//     "taskName": "任务二",
//     "completeRate": "50%"
//   },
//   {
//     "taskName": "任务三",
//     "completeRate": "80%"
//   },
//   {
//     "rowspan2": 3,
//     "modelName": "相册",
//     "taskName": "任务一",
//     "completeRate": "50%"
//   },
//   {
//     "taskName": "任务二",
//     "completeRate": "14%"
//   },
//   {
//     "taskName": "任务三",
//     "completeRate": "62%"
//   }
// ]
class membersManagement extends Component {
  constructor(props){
    super(props)
      this.myref=React.createRef();
      this.state={
        rolelistData:[],
        mydata1:[],
       mydata:[],
        tableListData : [,
            {
              title: '角色',
              dataIndex: 'roleName',
              key: 'roleName',
            },
            {
              title: '所属部门',
              dataIndex: 'deptName',
              key: 'deptName',
            },
            {
              title: '创建人',
              dataIndex: 'createBy"',
              key: 'createBy"',
            },
            {
                title: '创建时间',
                dataIndex: 'createTime',
                key: 'createTime',
              },
              { title: '角色权限', dataIndex: '', key: 'operation', width:'32%',render: (text,record,index)=>(
                <span>
                    <a className='roleSetting' href="#">权限设置</a>
                    <a className='roleSetting' href="#">人员授权</a>
                   <Popconfirm
                    title="是否删除?"
                    onConfirm={this.confirm}
                    onCancel={this.cancel}
                    okText="是"
                    cancelText="否">
                    <a className='roleSetting' href="#">删除</a>
                </Popconfirm>
                </span>
              ) },
          ],
        statusList:[{
          id:'',
          text:'全部'
      },{
            id:0,
            text:'在职'
        },{
           id:1,
           text:'离职'
       }],
       }
    }
    
    componentWillUnmount(){
           
    };
    componentDidMount(){
        this.unitTable(1)
    }; 
    unitTable = (data) =>{
        getmenuChecked(data).then(res=>{
            console.log('获取表格数据',res.data.data.rows)
            this.setState({rolelistData:res.data.data.rows})
            let data=res.data.data.rows
            this.mydata = [];
            this.mydata1 = [];
            // this.mydata2 = []
 
// data.forEach((item,index) => {
//     this.mydata.push({
//     firstName: item.name,
//     le:item.children.length
//   })
//   item.children.forEach((item2,index2) => {
//     this.mydata1.push({
//       secondName: item2.name,
//       children:item2.children,
//       r:3
//     })

//     })
  
  // this.mydata.push({
  //   firstName: item.name,
  //   le:item.children.length
  // })
  // item.children.forEach((item2,index2) => {
  //   this.mydata.push({
  //     secondName: item2.name,
  //     children:item2.children,
  //     r:3
  //   })
  //   item2.children.forEach((item3, index3) => {
  //       if(item.id==item2.parentId){
          
  //       }
  //       })
  //   })
})
// console.log('?',this.mydata1)
this.setState({ mydata:this.mydata,mydata1:this.mydata1})
// this.setState({ rolelistData:this.mydata})
console.log('看下最终的数据结构',this.mydata1)
          //   let data = res.data.data.rows.map(item => {
          //     console.log("看下这是啥",item)
          //     let rows = 0
          //     item.children.forEach(item2 => {
          //         rows = item2.children.length
          //     })
          //     item.rowspan = rows
          //     return item
          // })
          // console.log('s', data )
          //   if(res.data.code==1){
              
          //   }
          // })
    } 
    confirm=(e)=>{
        console.log(e);
        message.success('删除成功');
      }
      
    cancel=(e)=>{
        console.log(e);
        message.error('删除失败');
    } 
    onDelete=()=>{
        console.log('删除')
    }
    handleuser = () =>{

    } 
    render(){
        let  statusvalue = this.state.statusList.map(val=>{
            return(
            <Option value={val.id}  key={val.id}>{val.text}</Option>
            )
          })
       let  rolelistValue=roleList.map(val=>{
            return(
            <Option value={val.roleId}  key={val.roleId}>{val.roleName}</Option>
            )
          })
        return (
            <div className='weekconfigWrap'>
               <ul className='selctWrap'>
                   <li> <Button type="primary" onClick={this.handleuser}>返回</Button></li>
                   <li>角色名称AAAAAA</li>
                   <li> <Button type="primary" onClick={this.handleuser}>保存</Button></li>
               </ul>
              <div className='tableWrap'>
              {/* <table border="1" cellSpacing="0" cellpadding="0" width="50%" height="150"   style={{borderCollapse:'collapse'}}>
                <tbody>
                {this.state.rolelistData.map((e, index1) =>
                  <tr key={index1}>
                    {e.firstName? (<td className='activerowSpan' rowSpan={e.le+1}>{e.firstName} </td>):null} 
                    {e.secondName? (<td><input type="checkbox" name="favorite" value="1" />{e.secondName} </td>):null} 
                <td> {e.children?e.children.map((e2, index2) =><span key={index2}> <input type="checkbox" name="favorite" value="1" />{e2.name}</span> ):''}</td>
                  </tr>
                  ) }
                </tbody>
              </table>   */}
              
               {this.state.rolelistData.map((e, index1) =>
              <table  border="1" cellSpacing="0" cellpadding="0" width="50%" height="150"   style={{borderCollapse:'collapse'}}>
                <tbody>
               <tr key={index1}>
                 <td  rowSpan={e.children.length}>{e.name}</td>
                
            
              </tr>
              {e.children.map((e2, index2) =>  <tr> {e2.name? (<td><input type="checkbox" name="favorite" value="1" />{e2.name} </td>):null} </tr>) }
                {/* {this.state.rolelistData.map((e, index1) => */}
                  {/* <tr key={index1}>
                    {e.firstName? (<td className='activerowSpan' rowSpan={e.le+1}>{e.firstName} </td>):null} 
                    {e.secondName? (<td><input type="checkbox" name="favorite" value="1" />{e.secondName} </td>):null} 
                <td> {e.children?e.children.map((e2, index2) =><span key={index2}> <input type="checkbox" name="favorite" value="1" />{e2.name}</span> ):''}</td>
                  </tr> */}
                  {/* ) } */}
                </tbody>
              </table> 
                 ) }
              {/* {this.state.rolelistData.map((e, index1) =>
                <ul className=''>
                    <li><div className='firstText'><span>{e.name}</span></div></li>
                    <li>
                      <div>
                      {e.children.map((e2, index2) =>
                            <ul className='number1Ul'>
                                <li> <span><input type="checkbox" name="favorite" value="1" /><label>{e2.name}</label></span> <div>{e2.children.map((e3, index3) =><span><input type="checkbox" name="favorite" value="1" /><label>{e3.name}</label></span> ) }</div></li>
                            </ul>
                        ) }
                      </div>
                    </li>
                </ul>
            ) } */}
              </div>
            </div>
            
            
        )
    }
}


export default membersManagement;