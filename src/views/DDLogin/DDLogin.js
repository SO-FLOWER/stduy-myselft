import React from "react";


/**  config */
// appid：dingoahb6e9x9zsrjht4u1
const APPID = "dingoa3voqmhevyeah2pmx";
const REDIRECTURI = "http://pqca8c.natappfree.cc/";
const goto = `https://oapi.dingtalk.com/connect/oauth2/sns_authorize?appid=${APPID}&response_type=code&scope=snsapi_login&state=STATE&redirect_uri=${REDIRECTURI}`;
class LoginPage extends React.Component {
    constructor(props, context) {
        super(props)
        this.state = {
            name : 'qweqwe',
        }
    }
    componentDidMount() {   
     //钉钉获取二维码登录
        window.DDLogin({
            id: "code",
            goto: encodeURIComponent(goto),
            style: "margin-top: 30px;border:none;background-color:#F6F5F8;",
            width: "318",
            height: "400"
        });

        window.addEventListener(
            "message",
            function(event) {
                const origin = event.origin;
                console.log('event', event)
                if (origin == "https://login.dingtalk.com") {
                    console.log(123)
                    window.location = `${goto}&loginTmpCode=${event.data}`;
                }
            },
            false
        );
    }
    handleMouseEnter = (e)=> {
        e.currentTarget.children[1].className = `${e.currentTarget.children[1].className} moveIn`
    }
    handleMouseLeave = (e)=> {
        e.currentTarget.children[1].className = e.currentTarget.children[1].className.replace(' moveIn', '')
    }

    render() {
        if (!!window.ActiveXObject || "ActiveXObject" in window)
        { console.log('是IE浏览器') 
        var a=2}
        else {
        }
        var userAgent = navigator.userAgent; //取得浏览器的userAgent字符串  
        var ieBg=userAgent.indexOf("Edge")
        // ||(userAgent.indexOf("compatible") > -1 && userAgent.indexOf("MSIE") > -1 && !isOpera)
        console.log(ieBg,44)
        return (
            <div className="Login_page" >
              <div  id="Login_filter"  className={`Login_filter ${ieBg ||a==2? 'ieBg' : ''}`}>
              
              </div>
              <div className="login_body">
                    <div className="login_content">
                        <div className="login_logo"
                             onMouseEnter={this.handleMouseEnter}
                             onMouseLeave={this.handleMouseLeave}>
                            <div className="title" style={
                        {
                            fontSize:'initial',
                            
                        }}>
                                暂不支持
                            </div>
                        </div>
                        <div className="login_img" id="code">
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default LoginPage

