import React, { Component, Fragment } from 'react';
import ReactDOM from 'react-dom'
import { Tree, Switch, Popconfirm, Popover, Button, message, Input ,Tooltip} from 'antd';
import { CarryOutOutlined, FormOutlined } from '@ant-design/icons';
import { DownOutlined } from '@ant-design/icons';
import Titler from '../../compent/headerTitle/headerTitle'
import Nav from '../nav/index.js'
import DepartList from '../departList/index.js'//项目类别
import { getDepartmentList, getCategoryTree, updateNode, deleteNode, addNode, addUpNode, addDownNode, addChildNode } from './../../../api/api'
import './itemCategory.less'
import './../index.less'
const { DirectoryTree } = Tree;
const TreeNode = Tree.TreeNode;
let n=0;
let m=0
class itemCategory extends Component {
    constructor(props) {
        super(props)
        this.inputRef = React.createRef();
        this.state = {
            deptId: '',//部门ID
            page: this.props.msg,
            treeData: [],
            iconStatus: false,
            currentIndex: '',
            upstatus: false,
            downstatus: false,
            childtatus: false,
            rename: false,
            Itemname: false,
            msg1: '',
            msg2: '',
            msg3: '',
            msg4: '',
            msg5: '',
            titleMsg:'',
            hideTig:false,
            allData:[],
            hideTitle:false,
            operateType:'',//保留下操作状态
            inputstate: false,//控制输入框的显示和隐藏
            jiedianId:'',//当前节点的ID
            jiedianParentId:'',//当前父节点的ID
            jiedianTitle:'',
            suerEnter : false,
        
        }
    }
    componentWillUnmount() {
        document.removeEventListener('keydown',this.handleKeyDown);
    }
    componentDidMount() {       
        // this.focus = this.focus.bind(this)
        document.addEventListener('keydown',this.handleKeyDown);
        getDepartmentList().then(res => {
            
            if (res.data.code == 1) {
                
                    this.CategoryTree(res.data.data.rows[0].id)
                    this.setState({deptId:res.data.data.rows[0].id})
                

            }
        })

       
    };
    handleKeyDown = (e) => {
        if (e.keyCode === 13) {
            if(this.state.suerEnter)
            this.inputOnBlur()
        }
    }
    focus = () => {
        // 直接使用原生 API 使 text 输入框获得焦点
        this.textInput.focus();
      }
    componentWillReceiveProps(nextProps) {
  
    }
    CategoryTree = (id) => {
        console.log('取值Id', id)
        getCategoryTree(id).then(res => {
            console.log('获取这个值', res.data.data.rows)
            if (res.data.code == 1) {
                let a2 = res.data.data.rows
                let a3 = JSON.parse(JSON.stringify(a2).replace(/categoryName/g, 'title').replace(/childCategoryList/g, 'children'))
                this.setState({ treeData: a3,allData:a3 })
            }

        })
    }
    inputChange = (e) => {
        console.log('改变的值', e.target.value)
        this.setState({
            msg1: e.target.value
        })
    }
    inputOnBlur = (e, type, parentId,title) => {
        if (this.state.operateType == 'child') {
            addChildNode({
                "categoryName": this.state.msg1 == '' ? '新类别' : this.state.msg1,
                "deptId": this.state.deptId,
                "id": this.state.jiedianId,
                "parentId": this.state.jiedianParentId
            }).then(res => {
                if (res.data.code == 1) {
                    message.success('添加子节点成功')
                    this.CategoryTree(this.state.deptId)
                } else {
                    message.error(res.data.message)
                }
            })

        }else if(this.state.operateType == 'item'){
            addNode({
                "categoryName": this.state.msg1 == '' ? '新类别' : this.state.msg1,
                "deptId": this.state.deptId
            }).then(res => {
                if (res.data.code == 1) {
                    message.success('添加节点成功')
                    // this.setState({mag5:''})
                    this.CategoryTree(this.state.deptId)
                } else {
                    message.error(res.data.message)
                }
            })

        } else if (this.state.operateType == 'down') {
            console.log('下方的值', this.state.msg2)
            addDownNode({
                "categoryName": this.state.msg1 == '' ? '新类别' : this.state.msg1,
                "deptId": this.state.deptId,
                "id": this.state.jiedianId,
                "parentId": this.state.jiedianParentId
            }).then(res => {
                if (res.data.code == 1) {
                    message.success('添加下方节点成功')
                    this.CategoryTree(this.state.deptId)
                } else {
                    message.error(res.data.message)
                }
            })
        }else if (this.state.operateType == 'up') {
                console.log('获取这个名字', this.state.msg1)
                addUpNode({
                    "categoryName": this.state.msg1 == '' ? '新类别' : this.state.msg1,
                    "deptId": this.state.deptId,
                    "id": this.state.jiedianId,
                    "parentId": this.state.jiedianParentId
                }).then(res => {
                    if (res.data.code == 1) {
                        message.success('添加上方节点成功')
                        this.CategoryTree(this.state.deptId)
                    } else {
                        message.error(res.data.message)
                    }
                })
           
        }else if (this.state.operateType == 'rename') {
                updateNode({
                    "categoryName": this.state.msg1 == '' ? this.state.jiedianTitle : this.state.msg1,
                    "id":this.state.jiedianId
                }).then(res => {
                    if (res.data.code == 1) {
                        message.success('重命名成功')
                        this.CategoryTree(this.state.deptId)
                    } else {
                        message.error(res.data.message)
                    }
                })
            } 
            this.setState({suerEnter:false,categoryName:'新类别',msg1:''})
    }
    addNode1 = () => {
        this.setState({ Itemname: true })
    }
    addNode = (e, id, name) => {
        this.setState({ operateType: 'item',  currentIndex: "n1"+(m++) },()=>{ })
        
        let redata=this.getSearch('0-0','item',0,e)
        this.setState({allData:redata})  
        console.log(redata)
    }
    onSelect = (selectedKeys, info) => {
    };
    onExpand = () => {
    };
    // 1、在这里中声明一个函数，用于接收子组件的传值
    message = (msg) => {
        // 通过形参接受到子组件的值并打印到控制台
        console.log(msg)
        this.setState({ deptId: msg.deptId })
        this.CategoryTree(msg.deptId)
    }
    cancel = (e, id) => {
        deleteNode(id).then(res => {
            if (res.data.code == 1) {
                message.success('删除节点成功')
                this.setState({ rename: false })
                this.CategoryTree(this.state.deptId)
            } else {
                message.error(res.data.message)
            }
        })
    }
    onDragEnter = (e) => {
        console.log('鼠标移入和移除')
        this.setState({ iconStatus: true })
    };
    onDragLeave = () => {
        this.setState({ iconStatus: false })
    };
    tianjia=(key,id,parentId,type,index,title,e)=>{//id://当前节点的id
        console.log(key,id,parentId,type,index,title)
        // this,item.key,,'rename'
        e.stopPropagation();
        e.nativeEvent.stopImmediatePropagation();
        this.setState({jiedianId:id,jiedianParentId:parentId,hideTig:true,jiedianTitle:title,currentIndex :key})
        console.log('当前节点',key,id,type,index,e)
        if (type == 'up') {
            this.setState({ operateType: 'up',suerEnter:true  })
        } else if (type == 'rename') {
            this.setState({ operateType: 'rename',hideTitle:true,suerEnter:true})
        } else if (type == 'down') {
            this.setState({ operateType: 'down', suerEnter:true})
        } else if(type=='child'){
            this.setState({ operateType: 'child', suerEnter:true})
        }
        if(type=='rename'){
            this.setState({currentIndex: key })
        }else{this.setState({ 
            currentIndex: "n1"+(m++) },()=>{ })
        }   
        let redata=this.getSearch(key,type,index,e)
        let a3 = JSON.parse(JSON.stringify(redata).replace(/categoryName/g, 'title').replace(/childCategoryList/g, 'children'))
        this.setState({allData:a3 })     
        console.log('点击添加',redata)
        
    }
    getSearch= (name,type,index,e) => {
        console.log('添加上方节点inndex',type)
        var val=0
        let data=this.state.allData?this.state.allData:[]
         var hasFound = false, // 表示是否有找到id值
           result = null;
           let resultdata=[]
           let key=[]
        
         var fn = function (data) {
           if (data.length>0) { // 判断是否是数组并且没有的情况下，
           
            for(var i=0;i<data.length;i++){
                let item = data[i]
                if (item.key==name ) { // 数据循环每个子项，并且判断子项下边是否有id值
                    console.log('000w',item.key,'a'+i)
                        if(type=='rename'){//重命名
                            if(item.parentId==0){
                                item.input='input'
                            }else if(item.children.length==0){
                                item.children.push({
                                    'input':'input'
                                })
                            }
                        }else if(type=='down'){//下方节点
                            data.splice(index+1,0, {
                                'input':'input',
                                'children': [],
                                'createTime': "2020-12-04",
                                'key': "n1"+(n++),
                                'parentId': 0,
                                'title': ""
                            })
                        
                        }else if(type=='up'){
                                data.splice(index,0, {//上方节点
                                    'input':'input',
                                    'children': [],
                                    'createTime': "2020-12-04",
                                    'key': "n1"+(n++),
                                    'parentId': 0,
                                    'title': ""
                                })
                        
                        }else if(type=='item'){
                            console.log(Array.isArray(data))
                            data.splice(0,0, {//上方节点
                                'input':'input',
                                'children': [],
                                'createTime': "2020-12-04",
                                'key': "n1"+(n++),
                                'parentId': 0,
                                'title': ""
                            })                                  
                        }else{//添加子节点
                            item.children.push({
                                'input':'input',
                                'children': [],
                                'key': "n1"+(n++),
                                'title': ""
                            })
                        }
                    resultdata=data
                break;
                } else if (item.children) {
                    fn(item.children); // 递归调用下边的子项
                }
            }
           }else{
            data.splice(0,0, {//上方节点
                'input':'input',
                'children': [],
                'createTime': "2020-12-04",
                'key': "n1"+(n++),
                'parentId': 0,
                'title': ""
            })    
           }

         }
         fn(data); // 调用一下
         console.log(data)
         return data;

       } 
      //递归方法遍历树形控件
    renderTree = (data) =>{
        console.log()
        return data.map((item,index) => {
            if (!item.children) {
                return (
                    <Tree>
                        <TreeNode className="first-level" title={
                            <div style={{display:'flex',justifyContent:"space-between",alignItems:"center"}}>
                                <div >{item.title}</div><span className="control">
                                <span  style={{color:'red'}}  onClick={this.tianjia.bind(this,item.key,'rename')}>重命名{item.input=='input'?<Input/>:122}</span>
                                <span  style={{color:'red',margin:'10px'}}  onClick={this.tianjia.bind(this,item.key,'up',index)}>添加上节点</span>
                                <span  style={{color:'red'}}  onClick={this.tianjia.bind(this,item.key)}>添加下节点</span>
                                </span>
                               <span> </span>
                              
                            </div>} key={item.key}>
                        </TreeNode>
                    </Tree>
                )
            } else {
                // console.log(this.state.hideTitle)
                // console.log('树形菜单数据源', item);
                return (
                    <TreeNode title={item.title} key={item.key}  title={
                        <div style={{display:'flex',justifyContent:"space-between",alignItems:"center",position:'relative'}} 
                        onMouseDown={() => { this.setState({ currentIndex: item.key, inputstate: false}) }}>
                            {this.state.inputstate==false?<div >{item.title}</div>:'22' }
                            {/* <Input style={{border:'none'}} defaultValue={item.title}  onChange={this.inputChange}/> */}
                            <div className="control" style={{position:'absolute',background:'#fff'}} >
                                {item.input=='input'?<Input 
                                defaultValue={item.title?item.title:'新类别'} 
                                onChange={this.inputChange}
                                onBlur={this.inputOnBlur.bind(this,item.id,'up',item.parentId)}
                                autoFocus={true} className={` ${this.state.currentIndex == item.key?  'dispalyClass':'noneClass' }`}/>:
                                item.children.map(item2=>{
                                    if(item2.input=='input'){
                                        return <Input 
                                        defaultValue={item.title} 
                                        onChange={this.inputChange}
                                        onBlur={this.inputOnBlur.bind(this,item.id,'up',item.parentId)}
                                        autoFocus={true} className={` ${this.state.currentIndex == item.key ?  'dispalyClass':'noneClass' }`}/>
                                    }
                                })
                                }
                                
                               
                            </div>
                            <div className='linedDottd'></div> 
                            <span className={` ${this.state.currentIndex== item.key? 'dispalyClass' : 'noneClass'}`} >
                                <span style={{display:'flex',justifyContent:"space-between",alignItems:"center"}}>
                                <Popover placement="left"      content={
                                       <div>
                                            <p > <span  onClick={this.tianjia.bind(this,item.key,item.id,item.parentId,'up',index,item.title)}>上方添加节点 </span></p>
                                            <p ><span  onClick={this.tianjia.bind(this,item.key,item.id,item.parentId,'down',index,item.title)}>添加下方节点 </span> </p>
                                            <p ><span  onClick={this.tianjia.bind(this,item.key,item.id,item.parentId,'child',index,item.title)}>添加子节点 </span> </p>
                                        </div>
                                 } trigger="hover">
                                 <a className='addSetting' href="#"></a>
                                </Popover>
                                <Popover  placement="left"    content={
                                        <div>
                                            <p > <span   onClick={this.tianjia.bind(this,item.key,item.id,item.parentId,'rename',index,item.title)}>重命名 </span></p>
                                            <p >  <span onClick={this.cancel.bind(this,item.id,item.id)} >移除 </span> </p>  
                                        </div>
                                         } trigger="click">
                                         <a className='roleSetting' style={{marginLeft:'10px'}} href="#"></a>
                                        </Popover>
                                </span>
                            </span>  
                        </div>} key={item.key}>
                        {this.renderTree(item.children)}
                    </TreeNode>
                )
            }
        })

    };
    render() {
        
        return (
            <Fragment>
                <div className='settingBox'>
                    <Titler />
                    <div className='content setttingWrap'>
                        <div className='left'> <Nav /></div>
                        <div className='Settingright'>
                            <div className='groupBox'><DepartList msg={this.message} /></div>
                            <div className='weekconfig' style={{ background: 'white' }}>
                                <div className='itemCategory'>
                                    <div className='weekconfigWrap' >
                                        <div className='itemTitle'><h3>项目类别</h3>  
                                            {/* <Popover placement="left" content={
                                                <div>
                                                    <p >
                                                        <a className='addSetting' href="#">添加类别</a>
                                                    
                                                    </p>
                                                </div>
                                            } trigger="hover"> */}
                                                <a className='addSetting' onClick={this.addNode.bind(this, 'item')} href="#"></a>
                                            {/* </Popover> */}
                                        </div>
                                        <DirectoryTree
                                            multiple
                                            showIcon={false}
                                            defaultExpandAll
                                            onSelect={this.onSelect}
                                            onExpand={this.onExpand}
                                            
                                        >
                                            {this.renderTree (this.state.allData,this.state.operateType)}   {/*调用上面的递归方法*/}
                                        </DirectoryTree>
                                       
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

