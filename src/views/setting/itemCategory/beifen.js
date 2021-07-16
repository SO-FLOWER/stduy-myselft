import React,{Component,Fragment} from 'react';
import { Tree, Switch ,Popconfirm ,Popover, Button, message,Input} from 'antd';
import { CarryOutOutlined, FormOutlined } from '@ant-design/icons';
import { DownOutlined } from '@ant-design/icons';
import Titler from '../../compent/headerTitle/headerTitle'
import Nav from '../nav/index.js'
import DepartList from '../departList/index.js'//项目类别
import {getDepartmentList,getCategoryTree,updateNode,deleteNode,addNode,addUpNode,addDownNode,addChildNode} from './../../../api/api'
import './itemCategory.less'
import './../index.less'
const { DirectoryTree } = Tree;
class itemCategory extends Component {
    constructor(props){
        super(props)
          this.state={
            deptId:'',//部门ID
              page:this.props.msg,
              treeData:[],
              iconStatus:false,
              currentIndex:'',
              upstatus:false,
              downstatus:false,
              childtatus:false,
              rename:false,
              Itemname:false,
              msg1:'',
              msg2:'',
              msg3:'',
              msg4:'',
              msg5:'',
          }
        }
    componentWillUnmount(){
          
    };
    componentDidMount(){
        getDepartmentList().then(res=>{
            if(res.data.code==1){
              if(res.data.data.rows[0].children.length>0){
                this.CategoryTree(res.data.data.rows[0].children[0].id)
             
              }
         
            }
        })
      
    }; 
    componentWillReceiveProps (nextProps) {
    //   console.log('点击下拉列表的时候传过来值',this.child.state.partdata)
    //   this.setState({deptId:nextProps.msg.deptId})
    //  this.CategoryTree(0)
    }
    CategoryTree=(id)=>{
        console.log('取值Id',id)
        getCategoryTree(id).then(res=>{
            console.log('获取这个值',res.data.data.rows)
            if(res.data.code==1){
              let a2=res.data.data.rows
              let a3=JSON.parse(JSON.stringify(a2).replace(/categoryName/g, 'title').replace(/childCategoryList/g, 'children'))
              this.setState({treeData:a3})
                //将arr数组复制给a
                // var a = a3.slice(0);
                //使用unshift方法向a开头添加item
                // a.unshift({
                //     categoryName: "节点3",
                //     childCategoryList: [],
                //     createTime: "2020-10-22",
                //     id: '',
                //     key: "0-2",
                //     parentId: 0
                // });
            }
        
        })
    }
    inputChange=(e)=>{
        this.setState({
            msg1:e.target.value
        })
    }
    inputChange5=(e)=>{
        this.setState({
            msg5:e.target.value
        })
    }
    inputChange2=(e)=>{
        this.setState({
            msg2:e.target.value
        })
    }
    inputChange3=(e)=>{
        console.log(e.target.value)
        this.setState({
            msg3:e.target.value
        })
    }
    inputChange4=(e)=>{
        console.log(e.target.value)
        this.setState({
            msg4:e.target.value
        })
    }
    addhide = (e,type,parentId) =>{
        if(type=='up'){
            this.setState({  upstatus:true,downstatus:false,childtatus:false,rename:false})
            console.log('上')
        }else if(type=='down'){
            this.setState({ downstatus:true,upstatus:false,childtatus:false,rename:false})
            console.log('下')
        }else if(type=='rename'){
            this.setState({  childtatus:false,downstatus:false,upstatus:false,rename:true})
        }else{
            this.setState({  childtatus:true,downstatus:false,upstatus:false,rename:false})
        }
    }  
    // 
    inputOnBlur = (e,type,parentId) =>{
        // 失去焦点获取用户的输入框的值
        if(type=='up'){
            this.setState({  upstatus:false,msg1:''})
        }else if(type=='down'){
            this.setState({ downstatus:false,msg2:''})
        }else if(type=='name'){
            this.setState({ rename:false,msg4:''})
        }else{
            this.setState({  childtatus:false,msg3:''})
        }
        if(type=='child'){
            addChildNode({
                "categoryName": this.state.msg3,
                "deptId": this.state.deptId,
                "id":e,
                "parentId":parentId
            }).then(res=>{
                if(res.data.code==1){
                    message.success('添加子节点成功')
                    this.CategoryTree(this.state.deptId)
                }else{
                    message.error(res.data.message)
                }
            })

        }else if(type=='down'){
            console.log('下方的值',this.state.msg2)
            addDownNode({
                "categoryName":this.state.msg2,
                "deptId": this.state.deptId,
                "id":e,
                "parentId":parentId
            }).then(res=>{
                if(res.data.code==1){
                    message.success('添加下方节点成功')
                    this.CategoryTree(this.state.deptId)
                }else{
                    message.error(res.data.message)
                }
            })
        }else if(type=='rename'){
            updateNode({
                "categoryName": this.state.msg4,
                "id": e
            }).then(res=>{
                if(res.data.code==1){
                    message.success('重命名成功')
                    this.CategoryTree(this.state.deptId)
                }else{
                    message.error(res.data.message)
                }
            })
        }else{
            addUpNode({
                "categoryName":this.state.msg1,
                "deptId": this.state.deptId,
                "id":e,
                "parentId":parentId
            }).then(res=>{
                if(res.data.code==1){
                    message.success('添加上方节点成功')
                    this.CategoryTree(this.state.deptId)
                }else{
                    message.error(res.data.message)
                }
            })
        }
    }  
    addNode1=()=>{
        this.setState({Itemname:true})
    }
    addNode  =(e,id,name)=>{
        addNode({
            "categoryName": this.state.msg5,
            "deptId":this.state.deptId
        }).then(res=>{
            if(res.data.code==1){
                message.success('添加节点成功')
                // this.setState({mag5:''})
                this.CategoryTree(this.state.deptId)
            }else{
                message.error(res.data.message)
            }
        })

}
    // updateName =(e,id,name)=>{
       
    // }
    onSelect = (selectedKeys, info) => {
    };
    onExpand = () => {
    };
   // 1、在这里中声明一个函数，用于接收子组件的传值
    message= (msg) => {
    // 通过形参接受到子组件的值并打印到控制台
        console.log(msg)
        this.setState({deptId:msg.deptId})
        this.CategoryTree(msg.deptId)
    }
    cancel=(e,id)=>{
        deleteNode(id).then(res=>{
            if(res.data.code==1){
                message.success('删除节点成功')
                this.setState({rename:false})
                this.CategoryTree(this.state.deptId)
            }else{
                message.error(res.data.message)
            }
        })
    }
    onDragEnter = (e) => {
        console.log('鼠标移入和移除')
        this.setState({iconStatus:true})
    };
    onDragLeave= () => {
        this.setState({iconStatus:false})
    };
    render(){
        console.log(this.state.page)
        return (
            <Fragment>
                <div className='settingBox'>
                <Titler />
                <div className='content setttingWrap'>
                    <div className='left'> <Nav /></div>
                    <div className='Settingright'>
                    <div className='groupBox'><DepartList msg={this.message}/></div>   
                            <div className='weekconfig' style={{background:'white'}}>
                            <div className='itemCategory'>
                                <div className='weekconfigWrap' >
                                    <div className='itemTitle'><h3>项目类别</h3>
                                    <Popover  placement="left"   content={
                                                <div>
                                                    <p >
                                                    {
                                                        this.state.Itemname?(
                                                            <Input placeholde={this.state.msg5}  value={this.state.msg5} onChange={this.inputChange5}  onBlur={this.addNode.bind(this)} />
                                                            // <input type="text" value={this.state.msg5}  onChange={this.inputChange5}  onBlur={this.addNode.bind(this)}/>
                                                        ):    <a className='addSetting' href="#"  onClick={this.addNode1.bind(this,'项目类别')}>添加类别</a>
                                                        }
                                                    </p>    
                                                </div>
                                            } trigger="hover">
                                           <a className='addSetting' href="#"></a>
                                        </Popover>
                                  </div>
                                    <DirectoryTree
                                    showIcon={false}
                                    defaultExpandAll
                                    onSelect={this.onSelect}
                                    onExpand={this.onExpand}
                                    treeData={this.state.treeData}
                                    titleRender={(nodeData)=>(<div className='oprateWrap' 
                                    key={nodeData.id}
                                    onClick={ (  ) => { this.setState({ currentIndex : nodeData.id }) } } 
                                    // onMouseEnte={ (  ) => { this.setState({ currentIndex : nodeData.id }) } }     
                                    // onMouseLeave={ (  ) => { this.setState({ currentIndex : nodeData.id }) } }  
                                    >   
                                        <h3>{nodeData.title}</h3>
                                        <Input  />

                                        <div className='linedDottd'></div>
                                        <div  className='titleBox'>
                                        {nodeData.createTime}
                                    <div  className={` ${this.state.currentIndex== nodeData.id? 'dispalyClass' : 'noneClass'}`}>
                                            <span>
                                            <Popover  placement="left"   content={
                                                <div>
                                                     <p >
                                                        {
                                                            this.state.upstatus?(
                                                                <Input placeholde={this.state.msg1}  value={this.state.msg1} onChange={this.inputChange} onBlur={this.inputOnBlur.bind(this,nodeData.id,'up',nodeData.parentId)} />
                                                                // <input type="text" value={this.state.msg1} onChange={this.inputChange} onBlur={this.inputOnBlur.bind(this,nodeData.id,'up',nodeData.parentId)}/>
                                                            ):  <span onClick={this.addhide.bind(this,nodeData.id,'up',nodeData.parentId)}>上方添加节点 </span>
                                                        }
                                                    </p>  
                                                    <p > 
                                                        {
                                                            this.state.downstatus?(
                                                                <Input placeholde={this.state.msg2}  value={this.state.msg2}  onChange={this.inputChange2} onBlur={this.inputOnBlur.bind(this,nodeData.id,'down',nodeData.parentId)} />
                                                                // <input type="text" value={this.state.msg2}  onChange={this.inputChange2} onBlur={this.inputOnBlur.bind(this,nodeData.id,'down',nodeData.parentId)}/>  
                                                            ): <span onClick={this.addhide.bind(this,nodeData.id,'down',nodeData.parentId)}>添加下方节点 </span>
                                                        
                                                        }
                                                    </p>   
                                                    <p >
                                                        {
                                                            this.state.childtatus?(
                                                                <Input placeholde={this.state.msg3}  value={this.state.msg3}  onChange={this.inputChange3}  onBlur={this.inputOnBlur.bind(this,nodeData.id,'child',nodeData.parentId)}/>
                                                                // <input type="text" value={this.state.msg3}  onChange={this.inputChange3}  onBlur={this.inputOnBlur.bind(this,nodeData.id,'child',nodeData.parentId)}/>
                                                            ):  <span onClick={this.addhide.bind(this,nodeData.id,'child',nodeData.parentId)}>添加子节点 </span>
                                                        }
                                                    </p>    
                                       
                                                </div>
                                            } trigger="hover">
                                        <a className='addSetting' href="#"></a>
                                        </Popover>
                                        <Popover  placement="left"   content={
                                                <div>
                                                    <p >
                                                        {
                                                            this.state.rename?(
                                                                <Input placeholde={this.state.msg4}   value={this.state.msg4}  onChange={this.inputChange4}  onBlur={this.inputOnBlur.bind(this,nodeData.id,'rename',nodeData.parentId)}/>
                                                                // <input type="text" value={this.state.msg4}  onChange={this.inputChange4}  onBlur={this.inputOnBlur.bind(this,nodeData.id,'rename',nodeData.parentId)}/>
                                                            ):  <span onClick={this.addhide.bind(this,nodeData.id,'rename',nodeData.parentId)}>重命名 </span>
                                                        }
                                                    </p>    
                                                    <p >
                                                         <span onClick={this.cancel.bind(this,nodeData.id,nodeData.id)} >移除 </span>
                                                    </p>   
                                                </div>
                                            } trigger="hover">
                                         <a className='roleSetting' href="#"></a>
                                        </Popover>
                                       
                                       </span>
                                    </div>
                                    </div>
                                    </div>)}
                                    />
                                </div>
                                </div>
                            </div>
                         
                            
                        </div>
                 </div>
                </div>
            
            </Fragment>
           
         
            
        )
    }
}


export default itemCategory;

