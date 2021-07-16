import React,{Component,Fragment} from 'react';
import {Tree  , Input  ,message  } from 'antd';
import { } from '@ant-design/icons';
import {getPersonTree} from './../../../../api/api.js'
import './personTree.less';
// import axios from 'axios';

const { TreeNode } = Tree;
const { Search } = Input;


class PersonTree extends Component {
    constructor(){
        super();
        this.state={
            expandedKeys: [], //展开节点（受控）
            autoExpandParent: true,    //是否自动展开父节点
            checkedKeys: [],  //（受控）选中复选框的树节点（受控）选中复选框的树节点
            selectedKeys: [], //	（受控）设置选中的树节点
            personTree:[],
            findlist:[],
        };
        
    }
    componentDidMount(){
       
        getPersonTree().then(res=>{
                if(res.data.code == 1){
                    let personList = res.data.data.rows;
                   this.changeList(personList);
                    console.log(personList);
                    let num =[]
                    num[0] = personList[0].key;
                    this.setState({
                        personTree:personList,
                        expandedKeys:num
                    })
                    
                }else{
                    message.error(res.data.message);
                }
        })
    };
    changeList= (list) =>{
        if(list.length > 0 ){
            for(let i = 0 ;i<list.length ;i++){              
                let linshi = {
                    title : list[i].name,
                    key  : list[i].id.toString(),
                    children :list[i].children,
                    // icon: ({ true}) => (selected ? <FrownFilled /> : <FrownOutlined />)
                }
                list[i]=linshi;
                this.changeList(list[i].children);
            }
          
        }
    }
    //	展开/收起节点时触发
    onExpand = expandedKeys => {
        console.log('onExpand', expandedKeys);
        // if not set autoExpandParent to false, if children expanded, parent can not collapse.
        // or, you can remove all expanded children keys.
        this.setState({
          expandedKeys,
          autoExpandParent: false,
        });
      };

      //点击复选框触发
    onCheck = checkedKeys => {
        console.log('onCheck', checkedKeys);
        this.setState({ checkedKeys });
      };
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
      findPerson = (list , name) =>{
          if(list.length > 0 ){
            list.map(val=>{
                if(val.title == name){
                    let findlist = this.state.findlist;

                    findlist.push(val.key   );
                    this.setState({
                        findlist:findlist,
                     
                    })
                }
                this.findPerson(val.children,name)
            })
          }
      }
      onSearch  = (val)=>{
        //  let findlist = [];
         this.findPerson(this.state.personTree,val)
        //  let 
            this.setState({
                expandedKeys:this.state.findlist
            })
            console.log(this.state.findlist)
            
            
      }
      inputNull = () =>{
        this.setState({
            findlist:[]
        })
      }
    render(){
        
        return (
            <Fragment>
            <Search style={{ marginBottom: 8 }} placeholder="Search"  onChange={this.inputNull} onSearch ={this.onSearch } />
                <Tree
                checkable
                onExpand={this.onExpand}
                expandedKeys={this.state.expandedKeys}
                autoExpandParent={this.state.autoExpandParent}
                onCheck={this.onCheck}
                checkedKeys={this.state.checkedKeys}
                onSelect={this.onSelect}
                selectedKeys={this.state.selectedKeys}
                defaultExpandAll={true}
        >
            {this.renderTreeNodes(this.state.personTree)}
        </Tree>
            </Fragment>
            
        )
    }
}   


export default PersonTree;