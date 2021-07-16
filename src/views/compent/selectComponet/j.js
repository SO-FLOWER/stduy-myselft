import React, { Component, Fragment } from 'react';
import { withRouter, Link } from 'react-router-dom';
import { getPersonTree, addcopyUser, delcopyUser } from './../../../api/api'
import { UserOutlined, CaretLeftOutlined, CaretRightOutlined, CloseCircleFilled, CheckOutlined, CloseOutlined, LockOutlined, EditOutlined } from '@ant-design/icons';
import { Tree, Select, Input, Avatar, Button, Radio, Modal, Image, message, ConfigProvider } from 'antd';
const { TreeNode } = Tree;
const { Search } = Input;
const { Option } = Select;
class selectComponet extends React.Component {
    constructor(props, context) {
        super(props)
        this.state = {
            addPerson: true,
            chaosongPerson: [],
            personTree: [],
            expandedKeys: [], //展开节点（受控）
            autoExpandParent: true,    //是否自动展开父节点
            checkedKeys: [],  //（受控）选中复选框的树节点（受控）选中复选框的树节点
            selectedKeys: [], //	（受控）设置选中的树节点
            chaosongList: [], //头像抄送
            chooseData: [],
            check1: false,
            treeData: [],
            chooseName: [],//选中框的列表
            checkStrictly: this.props.type == 'personList' ? false : true

        }

    }

    componentWillMount() {

    }
    componentDidMount() {
        console.log(this.props)
        if (this.state.clearData == true) {//关掉弹窗清除数据
            // this.setState({treeData:})
        }
        if (this.props.type == 'departmenList') {
            this.setState({ treeData: this.props.departmenList,alldata: this.props.departmenList })

        } else if (this.props.type == 'personList') {
            this.setState({ treeData: this.props.personList ,alldata: this.props.personList })
        } else if (this.props.type == 'personList2') {
            this.setState({ treeData: this.props.departmenList ,alldata: this.props.departmenList  })
        }

    };
    onExpand = expandedKeys => {
        this.setState({
            expandedKeys,
            autoExpandParent: false,
        });
    };
    onCheck = (checkedKeys, info) => {
           console.log('看下这个选中的数据',checkedKeys)
        if (this.props.type == 'departmenList') {//添加授权的第1个弹窗
            this.setState(({ checkedKeys: checkedKeys, chooseName: info.checkedNodes }));
            this.setState({ chooseData: checkedKeys.checked }, () => {
                    this.props.handleClick(this.state.chooseData)//子组件接受父组件的值并将值传给父组件
                })
        } else if (this.props.type == 'personList2') {//修改数据范围弹窗
            
            this.setState(({  chooseName: info.checkedNodes }));
        
            this.setState({ chooseData: checkedKeys.checked }, () => {
                    this.props.handleClick3(this.state.chooseData)//子组件接受父组件的值并将值传给父组件
            })
        } else {//添加授权的第二个弹窗
            let chooseData =[]
            let chooseData2 =[]
            info.checkedNodes.forEach(e=>{
                e.type==1&&chooseData.push(e.key)
                e.type==1&&chooseData2.push(e)
            })
            console.log("chooseData")
            console.log(chooseData)
            this.setState(({ checkedKeys: chooseData, chooseName: chooseData2 }));
            this.setState({ chooseData: chooseData }, () => {
                    if (this.props.type == 'personList') {
                        this.props.handleClick2(this.state.chooseData)//子组件接受父组件的值并将值传给父组件
                    }
                })
            }

        // console.log('onCheck', checkedKeys, info);

    };
    huidiao = (a) => {
        // if (item.children && item.children.length) {
        let allName = []
        var fn = function (a) {
            return a.map((v, indx) => {
                if (v.children && v.children.length) {
                    v.dec = false;
                    allName.push(v.name)
                    // v.disabled=true
                    fn(v.children);
                }// 递归调用下边的子项 
                return v
            })
        }
        console.log(allName)
        return fn(a)

    }
    onSelect = (selectedKeys, info) => {
        console.log('onSelect', info);
        this.setState({ selectedKeys });
    };
    // 模糊搜索数据范围
   getSearch= (name) => {
       let data=this.state.alldata
        var hasFound = false, // 表示是否有找到id值
          result = null;
          let resultdata=[]
          let key=[]
        var fn = function (data) {
          if (Array.isArray(data) && !hasFound) { // 判断是否是数组并且没有的情况下，
            data.forEach(item => {
               if (item.name.indexOf(name) != -1 ) { // 数据循环每个子项，并且判断子项下边是否有id值
                result = item; // 返回的结果等于每一项
               if(key.indexOf(result.key)==-1){
                resultdata.push(result)
                key.push(result.key)
               }
                // hasFound = true; // 并且找到id值
              } else if (item.children) {
                fn(item.children); // 递归调用下边的子项
              }
            })
          }
        }
        fn(data); // 调用一下
        return resultdata;
      } 
    // 查询
    onSearch=(val)=>{
        let alldata=this.state.treeData;
        console.log(val,this.state.alldata)
        if(val==''){
            this.setState({treeData:this.state.alldata})
        }else{
            let result =this.getSearch(val)
            console.log('打印下查询到的数据',result)
            if(result.length>0){
                this.setState({treeData:result})
            }else{
                console.log('空？')
                this.setState({treeData:[]})
            }
          
        }

    }
    delectChaosong = (index, info) => {
     
        let data = this.state.chooseData.concat([])
        data.splice(index,1);
        let chooseName = this.state.chooseName.concat([])
        chooseName.splice(index,1);
        console.log("data")
        console.log(data)
        console.log(chooseName)
        this.setState({ chooseData: data, chooseName: chooseName },()=>{
            console.log('删除的数据', this.state.chooseData)
            if (this.props.type == 'departmenList') {
                this.props.handleClick(this.state.chooseData)//子组件接受父组件的值并将值传给父组件 授权1
            } else if (this.props.type == 'personList') {
                this.props.handleClick2(this.state.chooseData)//子组件接受父组件的值并将值传给父组件 授权1
            } else if (this.props.type == 'personList2') {
                this.props.handleClick3(this.state.chooseData) //修改数据范围
            }
        })
        


    };
    searchChange=(e)=>{
        this.onSearch(e.target.value)
    }
    render() {
        let caosongL = '';
        // console.log(this.state.chooseName)
        if (this.state.chooseName.length > 0) {
            caosongL = this.state.chooseName.map((val, index) => {
                if(this.props.type == 'personList'){
                    return (val.type == 1 && <div className='caosongList'>
                        {val.name}  <label onClick={() => this.delectChaosong(index)}><CloseOutlined /></label>
                    </div>)
                }else{
                    return ( <div className='caosongList'>
                     {val.name}  <label onClick={() => this.delectChaosong(index)}><CloseOutlined /></label>
                    </div>)
                }
               
            })
        }
        console.log(this.state.treeData)
        //	展开/收起节点时触发
        return (
        
            <div  style={{marginBottom:'10px'}}>
                <div className='personTree'>
                    <div className='l ' style={{width:'48%',marginRight:'2%',border:' 1px solid #ddd',maxHeight:'200px',overflow:'auto'}}>{caosongL}</div>
                    <div className='r'>
                       
                        <Search style={{ marginBottom: 8 }} 
                        placeholder= {this.props.type == 'personList' ? '请输入授权人员':"请输入数据范围" }
                         onChange={this.searchChange} onSearch={this.onSearch} />
                        {/* <lebel>{this.props.type == 'departmenList' ? "数据范围" : '授权人员'}</lebel> */}
                        <Tree
                            checkable
                            checkStrictly={this.state.checkStrictly}
                            onExpand={this.onExpand}
                            expandedKeys={this.state.expandedKeys}
                            autoExpandParent={this.state.autoExpandParent}
                            onCheck={this.onCheck}
                            checkedKeys={this.state.chooseData}
                            onSelect={this.onSelect}
                            selectedKeys={this.state.chooseData}
                            treeData={this.state.treeData}
                            key={this.state.treeData.length==0?'tree':this.state.treeData[0].id}
                        />
                    </div>
                </div>

            </div>
        )
    }
}
export default withRouter(selectComponet);