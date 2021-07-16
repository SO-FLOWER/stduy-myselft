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
            this.setState({ treeData: this.props.departmenList })

        } else if (this.props.type == 'personList') {
            // let newData=this.huidiao(this.props.personList);
            // console.log('看下扭数据的结构',this.huidiao(this.props.personList))
            // this.setState({treeData:newData})
            this.setState({ treeData: this.props.personList })
        } else if (this.props.type == 'personList2') {
            this.setState({ treeData: this.props.departmenList })
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
        if (this.props.type == 'departmenList') {
        this.setState(({ checkedKeys: checkedKeys, chooseName: info.checkedNodes }));
        this.setState({ chooseData: checkedKeys.checked }, () => {
                this.props.handleClick(this.state.chooseData)//子组件接受父组件的值并将值传给父组件
            })
        } else if (this.props.type == 'personList2') {
        this.setState(({ checkedKeys: checkedKeys, chooseName: info.checkedNodes }));
       
        this.setState({ chooseData: checkedKeys.checked }, () => {
                this.props.handleClick3(this.state.chooseData)//子组件接受父组件的值并将值传给父组件

            })
        } else {
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

        console.log('onCheck', checkedKeys, info);
        if (info.node.children > 0) {
            console.log('取下变形后的数据', this.huidiao(this.state.chooseData))
        } else {

        }

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
    delectChaosong = (index, info) => {
        console.log('删除的数据', this.state.chooseData)
        let data = this.state.chooseData.concat([])
        data.splice(index,1);
        let chooseName = this.state.chooseName.concat([])
        chooseName.splice(index,1);
        console.log("data")
        console.log(data)
        console.log(chooseName)
        this.setState({ chooseData: data, chooseName: chooseName })
        if (this.props.type == 'departmenList') {
            this.props.handleClick(this.state.chooseData)//子组件接受父组件的值并将值传给父组件
        } else if (this.props.type == 'personList') {
            this.props.handleClick2(this.state.chooseData)//子组件接受父组件的值并将值传给父组件
        } else if (this.props.type == 'personList2') {
            this.props.handleClick3(this.state.chooseData)
        }


    };

    render() {
        let caosongL = '';
        console.log(this.state.chooseName)
        if (this.state.chooseName.length > 0) {
            caosongL = this.state.chooseName.map((val, index) => {
                return (val.type == 1 && <div className='caosongList'>
                    {val.name}  <label onClick={() => this.delectChaosong(index)}><CloseOutlined /></label>
                </div>)
            })
        }
        //	展开/收起节点时触发
        return (
            <div  >
                <div className='personTree'>
                    <div className='l'>{caosongL}</div>
                    <div className='r'>
                        <Search style={{ marginBottom: 8 }} placeholder="请输入姓名" onChange={this.inputNull} onSearch={this.onSearch} />
                        <lebel>{this.props.type == 'departmenList' ? "数据范围" : '授权人员'}</lebel>
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
                        />
                    </div>
                </div>

            </div>
        )
    }
}
export default withRouter(selectComponet);