import React,{Component,Fragment} from 'react';
import { withRouter ,Link} from 'react-router-dom';
import {getPersonTree,addcopyUser,getAllDepartment} from './../../../api/api'
import { UserOutlined,CaretLeftOutlined,CaretRightOutlined ,CloseCircleFilled,CheckOutlined,CloseOutlined,LockOutlined,EditOutlined} from '@ant-design/icons';
import { Tree  ,Select, Input  ,Avatar , Button,Radio ,Modal,Image ,message,ConfigProvider } from 'antd';
const { TreeNode } = Tree;
const { Search } = Input;
const { Option } = Select;
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
            // visible: this.props.visible ,//由父组件的props决定，this.props.xx
            personListData:[],
            
            
        }
      
    }

    componentWillMount() {
        console.log('弹窗组件',this.props)
        if(this.props.type=='personList'){
            console.log('获取人员列表',this.props.personList)
            this.setState({personListData:this.props.personList})
            console.log( '??//',this.props.personList)
             let vvv= [];vvv = this.props.personList;
            this.setState({ allPersonTree:vvv, })
            let personList = {};
            personList =this.props.personList;
            console.log( '??//',this.props.personList)
            this.changeList(personList);
            let num =[]
            num[0] = personList[0].key;
            this.setState({
                personTree:personList,
                expandedKeys:num
            })
        }
        if(this.props.type=='departmenList'){
            console.log('获取数据范围列表',this.props.departmenList)
            let vvv= [];vvv = this.props.departmenList;
            this.setState({ allPersonTree:vvv, })
            let personList = {};
            personList =this.props.departmenList;
            console.log( '??//',this.props.departmenList)
            this.changeList(personList);
            let num =[]
            num[0] = personList[0].key;
            this.setState({
                personTree:personList,
                expandedKeys:num
            })
       
        }
        let vvv= [];vvv = this.state.personListData;
        this.setState({ allPersonTree:vvv, })
        let personList = {};
        personList = this.state.personListData;
     
        // this.changeList(personList);
        // let num =[]
        // num[0] = personList[0].key;
        // this.setState({
        //     personTree:personList,
        //     expandedKeys:num
        // })

    }
    componentWillReceiveProps(nextProps){

      
        console.log('props',nextProps)
        // this.setState({personListData:nextProps.personList})
        // getPersonTree().then(res=>{
            // let vvv= [];vvv = this.state.personListData;
            // this.setState({ allPersonTree:vvv, })
            // let personList = {};
            // personList = this.state.personListData;
            // console.log( '??//',this.state.personListData)
            // this.changeList(personList);
            // let num =[]
            // num[0] = personList[0].key;
            // this.setState({
            //     personTree:personList,
            //     expandedKeys:num
            // })
        // })
        // console.log('获取弹窗父组件传过来的数据',this.props.personList)
        // this.setState({
        //     visible: nextProps.visible
        // })
    }
    componentDidMount(){
       
       
    };
    //	展开/收起节点时触发
    onExpand = expandedKeys => {
        this.setState({
          expandedKeys,
          autoExpandParent: false,
        });
      };
  
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
    onCheck = checkedKeys => {
  
        let a = [];
        if(checkedKeys.length == 0){
            this.setState({
                chaosongPerson :[],
            })
        }else{
            checkedKeys.map(val=>{
                console.log(val)
                this.addChaosongPerson(this.state.allPersonTree,val,a);
                if(val.length < 6){
                 
                    // this.addChaosongPerson(this.state.allPersonTree,val,a);
                }
            })
         
        }
      
        console.log(a)
        this.setState({ checkedKeys });
      };
      addChaosongPerson=(list , id,a) =>{
        console.log('执行',list)
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
    console.log('看下是否能获取点击的复选框',this.state.chaosongPerson)
    }
    //   hiddenAddPer = e => {this.setState({visible: false,});};
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
            <div  className='personTree'>
            <div className='l'>  {caosongL} </div>
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
          
        )
    }
}
export default withRouter  (selectComponet);
// export default selectComponet
