import React from 'react'
import { withRouter ,Link} from 'react-router-dom';
import './nav.less'


class Nav extends React.Component {
    constructor(props, context) {
        super(props)
        this.homeNavStyle = props.style ? props.style : null
        this.state = {
            navList: [
                {id: 0, name: '周报配置',link:'/setting/WeekreportConfig'},
                {id: 1, name: '项目类别',link:'/setting/ItemCategory'},
                {id: 2, name: '人员管理',link:'/setting/MembersManagement'},
                {id: 3, name: '权限角色',link:'/setting/ItemCategory'},
            ],
            activeNavIndex: 0,
            navMoveStyle: {},
            navItemStyle: {},
            active:0,
            pathName:'',
            pList:[],
        }
    }

    componentWillMount() {
      
    }
    componentDidMount(){
        let pathName = this.props.location.pathname;
        //  pathName = pathName.substring(8,pathName.length);
         console.log(pathName)
        this.setState({
            pathName : pathName
        })
        let pList = window.sessionStorage.getItem('powerList')? window.sessionStorage.getItem('powerList'):[]
 
        if(pList.length>0){
        
    
          pList = pList.split(',')
        }
        this.setState({
          pList:pList
        })
       
    };
    render() {
        return (
            <div className="home_nav" style={this.homeNavStyle}>
               <div>
                    <ul className="nav_content">
                        {this.state.pList.indexOf('setting:week_report_setting') > -1?
                            <Link  to='/setting/WeekreportConfig'>
                                <li className={this.state.pathName == '/setting/WeekreportConfig'?'navActive' :''}>周报配置</li>
                            </Link>: ''}
                        {this.state.pList.indexOf('setting:project_type') > -1?
                            <Link to='/setting/ItemCategory'>
                                <li className={this.state.pathName == '/setting/ItemCategory'?'navActive' :''}>项目类别</li>
                            </Link>: ''}
                        {this.state.pList.indexOf('setting:user_manage') > -1?
                            <Link to='/setting/MembersManagement'>
                              <li className={this.state.pathName == '/setting/MembersManagement'?'navActive' :''}> 人员管理</li> 
                            </Link>  : ''}    
                        {this.state.pList.indexOf('week_report:hall') > -1?
                             <Link to='/setting/PermissionRole'>
                                 <li className={this.state.pathName.substring(0, 23) == '/setting/PermissionRole'?'navActive' :''}>权限角色</li>
                            </Link>: ''}
                        
                        
                        
                       
                        {/* {this.setNavItem(this.state.navList)} */}
                    </ul>
               </div>
            </div>
        )
    }
}

export default withRouter(Nav)
