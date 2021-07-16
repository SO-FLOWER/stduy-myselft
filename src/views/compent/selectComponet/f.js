import React,{Component,Fragment} from 'react';
import { withRouter ,Link} from 'react-router-dom';
import {getPersonTree,addcopyUser,delcopyUser} from './../../../api/api'
import { UserOutlined,CaretLeftOutlined,CaretRightOutlined ,CloseCircleFilled,CheckOutlined,CloseOutlined,LockOutlined,EditOutlined} from '@ant-design/icons';
import { Tree  ,Select, Input  ,Avatar , Button,Radio ,Modal,Image ,message,ConfigProvider } from 'antd';
import  './index.less'
const { TreeNode } = Tree;
const { Search } = Input;
const { Option } = Select;
let a1=[]
let a2=[]
class selectComponet extends React.Component {
    constructor(props, context) {
        super(props)
        this.state = {
            addPerson:true,
            chaosongPerson:[],
            personTree:[],
            expandedKeys: [], //展开节点（受控）
            autoExpandParent: true,    //是否自动展开父节点
            checkedKeys: [],  //（受控）选中复选框的树节点（受控）选中复选框的树节点
            selectedKeys: [], //	（受控）设置选中的树节点
            chaosongList :[], //头像抄送
            
        }
        console.log('弹窗组件',props)
        a1=props.departmenList
        a2=props.personList

    }

    componentWillMount() {
      
    }
    componentDidMount(){
        console.log('eeee',this.props)
        let vvv= [];
        let personList = {};
        if(this.props.type=='departmenList'){
            vvv = this.props.departmenList
            personList = [...this.props.departmenList];
        }else if(this.props.type=='personList'){
            vvv = this.props.personList
            personList = [...this.props.personList];
        }   
        this.setState({allPersonTree:vvv,  })
         this.changeList(personList);
          let num =[]
          num[0] = personList[0].key;
          this.setState({
              personTree:personList,
              expandedKeys:num
          })
    };
    //	展开/收起节点时触发
    onExpand = expandedKeys => {
        this.setState({
          expandedKeys,
          autoExpandParent: false,
        });
      };
    delectChaosong=(id)=>{
        console.log(id,this.state.checkedKeys);
        let removeId =  this.state.checkedKeys;
        let list = this.state.chaosongPerson;
        　for(var i = 0; i < removeId.length; i++){
                if(removeId[i].length>4){
                    removeId.splice(i,1);
                }

            　　if(removeId[i] == list[id].id){
                     removeId.splice(i,1);
            　　　　}
            　　}
        list.splice(id,1);
        this.setState({
            chaosongPerson:list,
            checkedKeys:removeId
        })
    }  
      addChaosongPerson=(list , id,a) =>{
        if(list.length > 0 ){
          list.map(val=>{
              if(val.id == id){  
                  a.push(val);
                  this.setState({
                    chaosongPerson:a,
                  })
              }
              this.addChaosongPerson(val.children,id,a)
          })
        }
    }
    changeList= (list) =>{
        if(list.length > 0 ){
            for(let i = 0 ;i<list.length ;i++){              
                let linshi = {
                    title : list[i].name,
                    key  : list[i].id.toString(),
                    children :list[i].children,
                }
                list[i]=linshi;
                this.changeList(list[i].children);
            }
          
        }
    }
    onSearch  = (val)=>{
        this.findPerson(this.state.personTree,val)
       //  let 
     
           this.setState({
               expandedKeys:this.state.findlist
           })
     }
     inputNull = () =>{
       this.setState({
           findlist:[]
       })
     }
     
    //点击树节点触发
    onSelect = (selectedKeys, info) => {
        console.log('onSelect', info);
        this.setState({ selectedKeys });
    };
    renderTreeNodes = data =>
    data.map(item => {
      if (item.children) {
        return (
          <TreeNode title={item.title} key={item.key} dataRef={item}>
            {this.renderTreeNodes(item.children)}
          </TreeNode>
        );
      }
      return <TreeNode key={item.key} {...item} />;
    });
    addPer = e => {
        console.log(e);
        this.setState({
            addPerson: false,
        });
        let userList=[]
        this.state.chaosongPerson.map((val,index)=>{
            userList.push({
                "userId":val.userId,
                "username":val.name
            })
        })
        let copyData={
            "deptId": this.state.deptId,
            "userList": userList
        }
        console.log('判断下是否是空数组',copyData)
        if(userList.length>0){
          addcopyUser(copyData).then(res=>{
            if(res.data.code==1){
              message.success('添加成功');
              this.comon(this.state.deptId)  
            }else{
              message.error(res.data.message)
            }
         })
       
        }
       
      
      };
      delectChaosongSend=(id)=>{
        delcopyUser({
          "deptId": this.state.deptId,
          "userId": id
        }).then(res=>{
          if(res.data.code==1){
            message.success('删除成功');
            this.comon(this.state.deptId)  // 操作dom执行局部刷新
          }else{
            message.error('删除失败!')
          }
        })
     
  
      }
    onCheck = checkedKeys => {
     
        let a = [];
        if(checkedKeys.length == 0){
            this.setState({
                chaosongPerson :[],
            })
        }else{
            checkedKeys.map(val=>{
                if(val.length < 6){
                    this.addChaosongPerson(this.state.allPersonTree,val,a);
                }
            })
         
        }
      
        console.log(a)
        this.setState({ checkedKeys });
      };
      hiddenAddPer = e => {this.setState({addPerson: false,});};
    render() {
        let caosongL = '';
        // console.log(this.state.chaosongPerson)
        if(this.state.chaosongPerson.length>0){
         caosongL = this.state.chaosongPerson.map((val,index)=>{
             return ( <div className='caosongList'>
             {val.name}  <label onClick={()=>this.delectChaosong(index)}><CloseOutlined /></label>
         </div>)
         })
        }else{
         caosongL = <p></p>
        }
        let  caosongList = '';
       if(this.state.chaosongList.length> 0 ){
           caosongList = this.state.chaosongList.map((val,index) =>{
               console.log(val)
               return (
                <div className="CC">
               {val.avatar?<img  src={val.avatar}/>:<div className='headerPic125'>{val.name[val.name.length-1]}</div>}
                    <span onClick={()=>this.delectChaosongSend(index)}><CloseCircleFilled /></span>
                    <p>{val.name}</p>   
                </div>
               )
           })
       }
       
        return (
            <div  >
                 <div  className='personTree'>
                <div className='l'>
                                {caosongL}
                              
                            </div>
                    <div className='r'> 
                        <Search style={{ marginBottom: 8 }} placeholder="请输入姓名"  onChange={this.inputNull} onSearch ={this.onSearch } />
                        <Tree
                                    checkable
                                    onExpand={this.onExpand}
                                    expandedKeys={this.state.expandedKeys}
                                    autoExpandParent={this.state.autoExpandParent}
                                    onCheck={this.onCheck}
                                    checkedKeys={this.state.checkedKeys}
                                    onSelect={this.onSelect}
                                    selectedKeys={this.state.selectedKeys}
                                    defaultExpandAll={true}>
                                {this.renderTreeNodes(this.state.personTree)}
                        </Tree> 
                </div>
                </div>
            </div>
        )
    }
}
export default withRouter  (selectComponet);
// export default selectComponet
