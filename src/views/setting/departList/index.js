import React,{Component,Fragment} from 'react';
import {getDepartmentList} from './../../../api/api'
import { UpOutlined ,DownOutlined,CaretRightOutlined,CaretDownOutlined} from '@ant-design/icons';
import './index.less'
class departList extends Component {
    constructor(props){
        super(props)
          this.myref=React.createRef();
          this.state={
            departList:[],
            departListName:'',
            departListId:'',
            partdata:'',
            active:-1,
            close:'up'
        }
        }
   
    componentDidMount(){
        getDepartmentList().then(res=>{
            this.setState({
                departListName:res.data.data.rows[0].name,
                departListId:res.data.data.rows[0].id,
                departList:res.data.data.rows[0].children
            })
        })
    };
    getdepartList=(e,id,item,index)=>{
        e.stopPropagation()
        console.log("获取选择的部门",id,item,index)
        let partdata={
            "deptId": id,
        }
        this.setState({partdata:partdata,active:index})
        this.props.msg(partdata)
    }  
    getdepartList1=()=>{
     
        let partdata={
            "deptId": this.state.departListId,
        }
        this.setState({partdata:partdata,active:-1})
        this.props.msg(partdata)
    } 
    chageStatus=(type)=>{
        console.log('执行点击事件')
        if(type=='down'){
            this.setState({close:'up'})
        }else{
            this.setState({close:'down'})
        }
        console.log(this.state.close)
    }
    render(){
        return (
        <div>
            {/* */}
                <div  style={{display:"flex"}}  > 
                    {/* {
                        this.state.close=='up'?<span  onClick={e =>this.chageStatus('down')}><UpOutlined style={{ fontSize: '16px' }}  /></span> : <span  onClick={e =>this.chageStatus('up')} > <DownOutlined   style={{ fontSize: '16px' }} /></span> 
                    } */}
                    <div style={{marginRight:'3px'}} className='departiconsvg'>
                     <span  className={'up'==this.state.close?'noneclass':'displayclass'} >< CaretRightOutlined  onClick={e =>this.chageStatus('down')}  style={{ fontSize: '16px' }} /></span>
                     <span className={'down'==this.state.close?'noneclass':'displayclass'}> < CaretDownOutlined   onClick={e =>this.chageStatus('up')}  style={{ fontSize: '16px' }} /></span>
                    </div>
                    <div className={this.state.active == -1?'departActive':''} onClick={this.getdepartList1}>{this.state.departListName}</div>
                     
               </div>
               
                <ul  className={`departList ${'up'==this.state.close?'displayclass':'noneclass'}`}>  {this.state.departList.map((item, index) => {
                    return (
                        <li className={index==this.state.active?'departActive':''} key={index } onClick={e =>this.getdepartList(e,item.id,item,index)} id={index} >{item.name}</li>
                    );
                })}
            </ul> 
        </div>
            
        )
    }
}
export default departList;