import React, { Component, Fragment } from 'react';
import { Button, DatePicker, Radio, Avatar, Tooltip, message } from 'antd';
import { RightOutlined, UserOutlined, AntDesignOutlined, } from '@ant-design/icons';
import { getproWorkTime, getProjUserManhour, getUserWorkTime ,getAllUserWorkTime} from './../../../api/api'
import ReactEcharts from 'echarts-for-react';
import './index.less';
import Left from './../compents/leftRouter/index';
import Titler from './../../compent/headerTitle/headerTitle'
import ProAnalysisMsg from './proAnalysisMsg/index.js';
// import axios from 'axios';
const { RangePicker } = DatePicker;
class ProAnalysis extends Component {

    state = {
        showTime: false, //展示时间段选择
        childDeptUserManhourList: '',
        manhourList: {
            userManhourList:{},
            projManhourList:{}
        },
        lineTableList: '',
        proName: '',
        proId: '',
        gongshiMax: 0,
        bumenMax: 0,
        startTime: '',
        endTime: ''
    }
    componentWillUnmount() {
    };
    componentDidMount() {
        this.setState({
            proName: this.props.location.query.name,
            proId: this.props.location.query.id,
        })
        let data = {};
        let nowdays = new Date();

        let year = nowdays.getFullYear();
        let month = nowdays.getMonth();

        if (month == 0) {
            month = 12;
            year = year - 1;
        }
        if (month < 10) {
            month = '0' + nowdays.getMonth();
        }
        let myDate = new Date(year, month, 0);
        // data.startTime = year + "-" + month +"-01";
        // data.endTime = year + "-" + month +"-"+myDate.getDate();
        // data.projId = this.props.location.query.id;

        data = {
            "startTime": year + "-" + month + "-01",
            "endTime": year + "-" + month + "-" + myDate.getDate(),
            "projId": this.props.location.query.id,

        }
        this.setState({
            startTime: data.startTime,
            endTime: data.endTime
        })
        getproWorkTime(data).then(res => {

            if (res.data.code == 1) {
                let linshi = res.data.data.result.manhour.projManhourList.length ? res.data.data.result.manhour.projManhourList : res.data.data.result.manhour.userManhourList;
                let linshi1 = res.data.data.result.manhour;
                let gongshiMax = 0;
                let bumenMax = 0;
                console.log(linshi)
                linshi.map(val => {
                    console.log(val.hourNumCount , gongshiMax)
                    if (val.hourNumCount > gongshiMax) {
                        gongshiMax = val.hourNumCount
                    }
                })
                linshi1.projManhourList.map(val => {
                    if (val.hourNumCount > bumenMax) {
                        bumenMax = val.hourNumCount
                    }
                })
                this.setState({
                    childDeptUserManhourList: res.data.data.result.childDeptUserManhour,
                    manhourList: res.data.data.result.manhour ? res.data.data.result.manhour : [],
                    gongshiMax: gongshiMax

                })
            } else {
                message.error(res.data.message);
            }
        })
        getProjUserManhour(data).then(res => {
            let linshiData = res.data.data.rows;
            this.setState({
                lineTableList: linshiData,

            })
        })
    };

    onChange = (e) => {
        if (e.target.value == '3') {
            this.setState({
                showTime: true
            })
            return;
        }
        this.setState({
            showTime: false
        })
        let data = {};
        let nowdays = new Date();

        let year = nowdays.getFullYear();
        let month = nowdays.getMonth();

        let week = nowdays.getDay();
        let day = nowdays.getDate();
        // let day   =  1;
        let myDate;
        switch (e.target.value) {
            case '0':

                if (month == 0) {
                    month = 12;
                    year = year - 1;
                }
                if (month < 10) {
                    month = '0' + nowdays.getMonth();
                }
                myDate = new Date(year, month, 0);
                data.startTime = year + "-" + month + "-01";
                data.endTime = year + "-" + month + "-" + myDate.getDate()
                break;
            case '1':
                if (day <= week + 7) {
                    if (month == 0) {
                        month = 12;
                        year = year - 1;
                    }
                    if (month < 10) {
                        month = '0' + nowdays.getMonth();
                    }
                    myDate = new Date(year, month, day - week - 7);
                    myDate = myDate.getDate();
                    if (myDate < 10) {
                        myDate = '0' + myDate;
                    }
                    data.startTime = year + "-" + month + "-" + myDate;
                } else {
                    month = nowdays.getMonth() * 1 + 1;
                    if (month < 10) {
                        month = '0' + month;
                    }
                    myDate = new Date(year, month, day - week - 7);
                    myDate = myDate.getDate();
                    if (myDate < 10) {
                        myDate = '0' + myDate;
                    }
                    data.startTime = year + "-" + month + "-" + myDate;

                }
                if (day <= week) {

                    if (month == 0) {
                        month = 12;
                        year = year - 1;
                    }
                    if (month < 10) {
                        month = '0' + nowdays.getMonth();
                    }
                    myDate = new Date(year, month, day - week);
                    myDate = myDate.getDate();
                    if (myDate < 10) {
                        myDate = '0' + myDate;
                    }
                    data.endTime = year + "-" + month + "-" + myDate;

                } else {
                    month = nowdays.getMonth() * 1 + 1;
                    if (month < 10) {
                        month = '0' + month;
                    }
                    myDate = new Date(year, month, day - week);
                    myDate = myDate.getDate();
                    if (myDate < 10) {
                        myDate = '0' + myDate;
                    }
                    data.endTime = year + "-" + month + "-" + myDate;
                }




                break;
            case '2':
                month = month * 1 + 1;
                if (month < 10) {
                    month = '0' + month;
                }
                myDate = new Date(year, month, 0);
                data.startTime = year + "-" + month + "-01";
                data.endTime = year + "-" + month + "-" + myDate.getDate()
                break;

        }

        data.projId = this.state.proId
        this.setState({
            startTime: data.startTime,
            endTime: data.endTime
        })

        getproWorkTime(data).then(res => {

            if (res.data.code == 1) {
                let linshi = res.data.data.result.manhour.projManhourList.length? res.data.data.result.manhour.projManhourList : res.data.data.result.manhour.userManhourList;
                let gongshiMax = 0;
                linshi.map(val => {
                    console.log(val)
                    if (val.hourNumCount > gongshiMax) {
                        gongshiMax = val.hourNumCount
                    }
                })
                console.log(gongshiMax)
                this.setState({
                    childDeptUserManhourList: res.data.data.result.childDeptUserManhour,
                    manhourList: res.data.data.result.manhour ? res.data.data.result.manhour : [],
                    gongshiMax: gongshiMax
                })

            } else {
                message.error(res.data.message);
            }
        })
        getProjUserManhour(data).then(res => {
            let linshiData = res.data.data.rows;
            this.setState({
                lineTableList: linshiData,

            })
        })


    }
    goBackPage = () => {
        this.props.history.goBack(); //返回上一页这段代码

    }
    getOtion = () => {
        let aaa = this.state.lineTableList;
        console.log(aaa)
        let nameList = [];
        let lineList = [];
        let dayList = []
        if (aaa.length > 0) {
            aaa.map((res, index) => {
                nameList.push(res.username);
                let linshi = {
                    name: res.username,
                    type: 'line',
                    // stack: '总量',
                    areaStyle: {},
                    data: res.hourNum
                }
                lineList.push(linshi);


            })
            aaa[0].hourNum.map((val, index) => {
                dayList.push(index)
            })
        }
        let option = {

            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'cross',
                    label: {
                        backgroundColor: '#6a7985'
                    }
                }
            },
            legend: {
                data: nameList
            },
            toolbox: {

            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            xAxis: [
                {
                    type: 'category',
                    boundaryGap: false,
                    data: dayList
                }
            ],
            yAxis: [
                {
                    type: 'value'
                }
            ],
            series: lineList
        };
        return option;
    }
    getUserWorkTime = () => {
        let data = {
            endTime: this.state.endTime,
            projId: this.state.proId,
            startTime: this.state.startTime
        };
        getUserWorkTime(data).then(res => {
            let fileName = '明细数据.xlsx';
            let blob = new Blob([res.data], { type: 'application/x-xls' });
            if (window.navigator.msSaveOrOpenBlob) {
                //兼容 IE & EDGE
                navigator.msSaveBlob(blob, fileName);
            } else {
                var link = document.createElement('a');
                // 兼容不同浏览器的URL对象
                const url = window.URL || window.webkitURL || window.moxURL
                // 创建下载链接
                link.href = url.createObjectURL(blob);
                //命名下载名称
                link.download = fileName;
                //点击触发下载
                link.click();
                //下载完成进行释放
                url.revokeObjectURL(link.href);
            }
        })
    }
    getAllUserWorkTime = () => {
        let data = {
            endTime: this.state.endTime,
            projId: this.state.proId,
            startTime: this.state.startTime
        };
        getAllUserWorkTime(data).then(res => {
            let fileName = '汇总数据.xlsx';
            let blob = new Blob([res.data], { type: 'application/x-xls' });
            if (window.navigator.msSaveOrOpenBlob) {
                //兼容 IE & EDGE
                navigator.msSaveBlob(blob, fileName);
            } else {
                var link = document.createElement('a');
                // 兼容不同浏览器的URL对象
                const url = window.URL || window.webkitURL || window.moxURL
                // 创建下载链接
                link.href = url.createObjectURL(blob);
                //命名下载名称
                link.download = fileName;
                //点击触发下载
                link.click();
                //下载完成进行释放
                url.revokeObjectURL(link.href);
            }
        })
    }
    getPickTime = (time, timeString) => {
        console.log(123)
        let data = {
            startTime: timeString[0],
            endTime: timeString[1],
            projId: this.state.proId
        };
        this.setState({
            startTime: timeString[0],
            endTime: timeString[1]
        })
        getproWorkTime(data).then(res => {
            
            if (res.data.code == 1) {
                let linshi = res.data.data.result.manhour.projManhourList.length ? res.data.data.result.manhour.projManhourList : res.data.data.result.manhour.userManhourList;
                let gongshiMax = 0;
                linshi.map(val => {

                    if (val.hourNumCount > gongshiMax) {
                        gongshiMax = val.hourNumCount
                    }
                 console.log(gongshiMax)
                })
                this.setState({
                    childDeptUserManhourList: res.data.data.result.childDeptUserManhour,
                    manhourList: res.data.data.result.manhour ? res.data.data.result.manhour : [],
                    gongshiMax: gongshiMax
                })
                console.log('manhourList:', this.state.manhourList, this.state.manhourList.length)
            } else {
                message.error(res.data.message);
            }
        })
        getProjUserManhour(data).then(res => {
            let linshiData = res.data.data.rows;
            this.setState({
                lineTableList: linshiData,

            })
        })

    }
    render() {
        let childDeptUserManhour = '';
        let manhourList = '';
        let dataMsg = {
            endTime: this.state.endTime,
            startTime: this.state.startTime,
            projId: this.state.proId
        }
           if (this.state.manhourList.userManhourList.length) {
            console.log('projManhourList', this.state.gongshiMax)
            manhourList = this.state.manhourList.userManhourList.map((res, index) => {
                return (<ProAnalysisMsg msg={res} key={index} maxNum={this.state.gongshiMax} dataMsg={dataMsg} />)
            })
        }

        if (this.state.manhourList.projManhourList.length  ) {
           
            manhourList = this.state.manhourList.projManhourList.map((res, index) => {
                return (<ProAnalysisMsg msg={res} key={index} maxNum={this.state.gongshiMax} dataMsg={dataMsg}  level={1} />)
            })
        }
        if (this.state.childDeptUserManhourList.length > 0) {
            childDeptUserManhour = this.state.childDeptUserManhourList.map((res, index) => {
                return (
                    <div className='tableMsg1'>
                        <label>{res.avatar == '' ? <Avatar size={16} style={{ color: '#fff', backgroundColor: '#1677FF' }}>{res.username[res.username.length - 1]}</Avatar> : <Avatar size={16} src={res.avatar} />}{res.username}</label>
                        <Tooltip title={res.username + ' 工时：' + res.hourNum / 100} color={'#628DD6'} placement="topRight"><div className='tmsg' style={{ width: res.hourNum + 30 + 'px' }} > </div></Tooltip>

                    </div>
                )
            })
        }
        return (
            <Fragment>
                <Titler />
                <div className='content'>
                    <div className='left'>
                        <Left />
                    </div>

                    <div className='right'>

                        <div className='ProAnalysis'>
                            <div className='analysisName' >
                                <Button type='primary' onClick={this.goBackPage}>返回</Button>
                                <h3>{this.props.location.query.name}</h3>
                            </div>
                            <div className='analysisMsg' style={{ paddingBottom: '40px' }}>
                                <div className='msgTitle'>
                                    <h3>部门工时分布</h3>
                                    <div className='tRight'>
                                        <div className='pickTime'>
                                            <Radio.Group onChange={this.onChange} defaultValue="0">
                                                <Radio.Button value="0">上月</Radio.Button>
                                                <Radio.Button value="1">上周</Radio.Button>
                                                <Radio.Button value="2">本月</Radio.Button>
                                                <Radio.Button value="3">时间段</Radio.Button>
                                            </Radio.Group>
                                        </div>
                                        <Button type="primary"  onClick={this.getUserWorkTime} ghost style={{marginRight:'10px'}}>明细数据导出</Button>
                                        <Button type="primary" onClick={this.getAllUserWorkTime} ghost>汇总数据导出</Button>
                                        <div className={this.state.showTime ? 'getTime' : 'hidden'}>  <RangePicker onChange={this.getPickTime} /></div>
                                    </div>
                                </div>

                                <div className='tableBg'>
                                    {manhourList}
                                </div>
                            </div>
                            {/* 
                        <div className='analysisMsg'>
                           <div className='msgTitle'>
                                <h3>人员工时分布</h3>
                              
                            </div>  

                            <div className='tableBg'>
                              
                                {childDeptUserManhour}
                             
                            </div>
                        </div>

                        <div className='analysisMsg'>
                           <div className='msgTitle'>
                                <h3>人员工时明细</h3>
                              
                            </div>  

                            <div className='echartsBg'>


                            <ReactEcharts
                                option={this.getOtion()}
                                style={{height: '380px', width: '820px'}}
                                className='react_for_echarts' />
                                
                            
                            </div>
                        </div> */}

                        </div>

                    </div>
                </div>

            </Fragment>

        )
    }
}


export default ProAnalysis;