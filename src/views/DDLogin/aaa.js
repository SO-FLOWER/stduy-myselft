﻿import React from "react"

import './index.less'

import axios from 'axios'

import { withRouter } from 'react-router-dom'

import { browserHistory } from 'react-router'





class UserInfo extends React.Component {

    constructor(props, context) {

        super(props,context)

        this.state = {

            userInfo :{

                name: ''

            },

            userRoot:'',

            listOptionStyle: {

                display: 'none'

            }

        }

    }



    componentWillMount() {

        

    }

    componentDidMount() {

        this.handelLogin()

    }



    parseURL (url) {

        if (!url) return {};

        url = decodeURI(url);

        let url1 = url.split("?")[1];

        let para = url1.split("&");

        let len = para.length;

        let res = {};

        let arr = [];

        for (let i = 0; i < len; i++) {

            arr = para[i].split("=");

            res[arr[0]] = arr[1];

        }

        return res;

    }

    

    getUserInfo(params) {

        return  new Promise( (resolve, reject) => {

            axios.get('http://cec.theiavis.com/yxyadmin/api/login', {

                // axios.get('http://ff72d7.natappfree.cc/yxyadmin/api/getUserInfo', {

                params: params

            }).then(res => {

                // debugger

                if (res.data.errcode === 0) {

                // this.$http.get('/yxyadmin/api/index/product/getProductList')

                // .then(res => {

                // if(res.code == 0) {

                //    localStorage.setItem('productDict', JSON.stringify(res.data))

                // }

                // })

                // .catch(err => {

                

                // })                   

                    resolve(res.data)

                } else {

                    reject({errcode: 1})

                    // this.props.history.push('/login');

                    localStorage.removeItem('userInfo')

                    this.props.history.push('/login');

                }

            })

        })

    }



    handelLogin () {

        // 处理登陆

        let hrefArr = window.location.href.split('/')

        if(!localStorage.getItem("userInfo")) {

            if(window.dd.env.platform === "notInDingTalk") {

                let params = this.parseURL(window.location.search);

                if (params.code) {

                    this.getUserInfo({ code: params.code}).then(res => {

                        localStorage.setItem("userInfo", JSON.stringify(res));

                        this.setState({

                            userInfo: JSON.parse(localStorage.getItem("userInfo"))

                        })

                        this.props.history.push('/');



                    }).catch((err) => {



                        localStorage.removeItem('userInfo')

                        this.props .history.push('/login');

                    });

                } else if(hrefArr.indexOf('share')==-1) {

                    localStorage.removeItem('userInfo')

                    this.props.history.push('/login');

                }

            }

        } else {

            this.setState({

                userInfo: JSON.parse(localStorage.getItem("userInfo"))

            })

        }

    }



    handleMouseEnter(e) {

        if(e.target.className === 'move_out_control') {

            this.setState({

                listOptionStyle : {

                    display: 'none'

                }

            })

        }



        if(e.currentTarget.className === 'avatar') {

            this.setState({

                listOptionStyle : {

                    display: 'block'

                }

            })

        }

    }



    handleMouseLeave(e) {

        if(e.currentTarget.className === 'user' || e.currentTarget.className === "list_option" || e.currentTarget.className === 'user_comp') {

            this.setState({

                listOptionStyle : {

                    display: 'none'

                }

            })

        }

    }

    logout () {

        localStorage.removeItem('userInfo')

        this.props.history.push('/login');

    }

    setAvatar(res) {

        if(res !== null && Object.keys(res).length !== 0) {

            let name = res.name

            let nameLength = name.length

            return name.slice(nameLength >2 ? 1: 0, nameLength)

        }

    }



    render() {

        var sectionStyle = {

            backgroundImage:`url(${this.state.userInfo.avatar})`

          };

        let Message ;

        let hearderLogo;

        if (this.state.userInfo.avatar=="") {

            Message = (

                <div className="option_item_name" >

                    {this.setAvatar(this.state.userInfo)}

                </div>

            )

            hearderLogo =  (

                <div className="img">

                   {this.setAvatar(this.state.userInfo)}

              </div>

           ) 

           

        } else {

           

           Message = (

            <div className="option_item_avatar"  style={ sectionStyle }>

                {/* {this.setAvatar(this.state.userInfo.avatar)} */}

            </div>

            )

       

        hearderLogo =  (

            <div className="option_item_icon" style={ sectionStyle }>

                   

            </div>

        )   

        }

        // backgroundImage:`url(${this.state.mainBody})`

        return (

            <div

                onMouseLeave={this.handleMouseLeave.bind(this)}

                className="user_comp" >

                <div

                    onMouseEnter={this.handleMouseEnter.bind(this)}

                    className="move_out_control"> </div>

                <div

                    onMouseEnter={this.handleMouseEnter.bind(this)}

                    className="avatar">

                        {hearderLogo}

                    {/* <div className="img">

                        {this.setAvatar(this.state.userInfo)}

                    </div> */}

                    <div className="triangle_down"></div>

                </div>

                <div

                    onMouseLeave={this.handleMouseLeave.bind(this)}

                    className="list_option"

                    style={this.state.listOptionStyle}>

                    <div className="triangle_up"></div>

                    <div className="option_item">

                        {Message}

                        {/* <div className="option_item_avatar" >

                            {this.setAvatar(this.state.userInfo)}

                        </div> */}

                        <span> {this.state.userInfo.name}</span>

                    </div>

                    <div className="option_item">

                        <img width="16px" height="16px" src={require('./user_management.svg')}/>

                        <span onClick={() => { this.props.history.push('/account/userInfo');}}> 账户设置</span>

                    </div>

                    <div className={` ${this.state.userInfo.goToUserInfo==true ? 'diactive' : 'noactive'}`} >

                    <div className="option_item" >

                        <img width="16px" height="16px" src={require('./账户管理.svg')}/>

                        <span onClick={() => {window.open("http://cec.theiavis.com/yxyadmin/index?path=/yxy/userinfo") }}> 后台管理</span>

                    </div>

                    </div>

                    <div className="option_item">

                        <img width="16px" height="16px" src={require('./退出登录.svg')}/>

                        <span onClick={this.logout.bind(this)}> 退出登录</span>

                    </div>

                </div>

            </div>

        )

    }

}

export default withRouter(UserInfo)


