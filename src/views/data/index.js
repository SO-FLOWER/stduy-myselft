import React, { Component, Fragment } from 'react';
import { Button, DatePicker, Radio, Avatar, Tooltip,Pagination, Select, message, Modal , Tree,Input} from 'antd';
import { DownOutlined } from '@ant-design/icons';
import { getAllDepartment, dpetProTime, getALLWorkTime, getDeptWorkTime, getUserProjManhour,getDeptPoj ,getDeptProjInfo} from './../../api/api';
import Titler from '../compent/headerTitle/headerTitle';
import ReactEcharts from 'echarts-for-react';
import AllWorkTimeMsg from './allWorkTimeMsg';
import './index.less';
import DeptTime from './deptTime.js'
import PerTime from './perTime.js'
import { connect } from 'react-redux';
import store from '../../store';

const { RangePicker } = DatePicker;
const { Option } = Select;
const { Search, TextArea } = Input;
//2.这里把state里的数据映射到props里，可以通过Props使用
const stateToProps = (state) => {
  return {
    dataParentDeptId: state.dataParentDeptId,
  };
};

//3.这里把action里的方法绑定到props上，可以通过Props使用，一般用于修改store里的数据
const dispatchTOProps = (dispatch) => {
  return {
    inputChange(e) {
      let action = {
        type: 'changeInput',
        value: e.target.value,
      };
      //inputChange方法会通过dispatch触发reducer.js里的修改方法
      dispatch(action);
    },
    clickButton() {
      let action = {
        type: 'addItem',
      };
      dispatch(action);
    },
  };
};
class ProAnalysis extends Component {
  constructor(props) {
    super(props);
    this.state = {
      departmentList: [],
      deptId: '',
      deptId1:'',
      partentDeptId:'',
      showTime: false,
      startTime: '',
      endTime: '',
      allTimeList: [],
      randomList: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
      current:1,
      deptTimeList: [],
      deptColorList:[],
      deptHourList:[],
      deptprojInfoList:[],
      deptProList :[],
      deptMaxLength:0,
      perTimeList: [],
      perColorList:[],
      perHourList:[],
      perInfoList:[],
      perProList :[],
      perMaxLength:0,
      allCount:0,
      allMaxLength:0,
      flag:false,
      currentIndex:0,
      deptName:'',
      deptName1:'',
      departmentList1:'',
      deptList:[],
      projId:'',
    }; 
 
  }


  componentWillUnmount() {}
  componentDidMount() {
    getAllDepartment().then((res) => {
      getDeptProjInfo(res.data.data.rows[0].id).then(res=>{
        this.setState({
          deptList:res.data.data.rows,
          projId:res.data.data.rows[0].projId
        })
      })
      let departmentList = res.data.data.rows;
      // let departmentList = this.getName(res.data.data.rows);
      this.setState({ 
        departmentList,
        departmentList1:departmentList,
        deptId:res.data.data.rows[0].id,
        deptName:res.data.data.rows[0].name,
        deptId1:res.data.data.rows[0].id,
        deptName1:res.data.data.rows[0].name
      });
      

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

    this.setState({
      startTime: year + '-' + month + '-01',
      endTime: year + '-' + month + '-' + myDate.getDate(),
    });

    let data1 = {
      projDeptId: this.state.deptId,
      endTime: year + '-' + month + '-' + myDate.getDate(),
      startTime: year + '-' + month + '-01',
    };
    getALLWorkTime(data1).then((res) => {
      let that = this
      if (res.data.code == 1) {
        this.setState({
          allTimeList: res.data.data.result.projManhourList,
          partentDeptId:res.data.data.result.projManhourList[0].id?res.data.data.result.projManhourList[0].id:[],
        });
        let maxLength= 0;
        res.data.data.result.projManhourList.map(val=>{
          maxLength = val.hourNumCount >maxLength?val.hourNumCount :maxLength;
        })
        this.setState({
          allMaxLength:maxLength,
        })
        // let data = {
        //   endTime: this.state.endTime,
        //   partentDeptId:res.data.data.result.projManhourList[0].id,
        //   projDeptId: this.state.deptId,
        //   startTime: this.state.startTime
        // } 
        // this.getDeptWorkTime(data);
        // data.current = this.state.current;
        // data.size = 10;
       
    
        //   getUserProjManhour(data).then(res=>{
        //     this.setState({
        //       perHourList: res.data.data.result.projInfoList,
        //       perProList:res.data.data.result.userHourList,
        //       allCount:res.data.data.result.total
        //     });
        //     let maxTime = 0 ;
        //     let color = [];
        //     if(res.data.data.result.userHourList.length>0){
        //       res.data.data.result.userHourList.map(val=>{
        //         let allTime = 0;
        //         val.hourNum.map(val=>{
        //           allTime = val+allTime;
        //         })
        //         maxTime = maxTime>allTime?maxTime:allTime;
                
        //       })
        //      res.data.data.result.projInfoList.map(val=>{
        //         let aaa= that.getColor();
        //         color.push(aaa)
        //      })
        //      this.setState({
        //       perMaxLength:maxTime,
        //       perColorList:color
        //     })
        //     }
        //   });
      } else {
        message.error(res.data.message);
      }
    });

  
  
     
    });

    
  }

  getPerWorkTime = (data) => {
    let that = this;
    let data1 = {
      projDeptId: this.state.deptId,
      endTime: this.state.endTime,
      startTime: this.state.startTime,
      partentDeptId:this.state.partentDeptId,
      current:this.state.current,
      size :10
    };
    let data2 = data ? data : data1;
    getUserProjManhour(data2).then((res) => {
      this.setState({
        perHourList: res.data.data.result.projInfoList,
        perProList:res.data.data.result.userHourList,
        allCount:res.data.data.result.total
      });
      let maxTime = 0 ;
      let color = [];
      if(res.data.data.result.userHourList.length>0){
        res.data.data.result.userHourList.map(val=>{
          let allTime = 0;
          val.hourNum.map(val=>{
            allTime = val+allTime;
          })
          maxTime = maxTime>allTime?maxTime:allTime;
          
        })
       res.data.data.result.projInfoList.map(val=>{
          let aaa= that.getColor();
          color.push(aaa)
       })
       this.setState({
        perMaxLength:maxTime,
        perColorList:color
      })
      }
    });
  };
  // getDeptWorkTime = (data) => {
  //   let that = this
  //   let data1 = {
  //     projDeptId: this.state.deptId,
  //     endTime: this.state.endTime,
  //     startTime: this.state.startTime,
  //     partentDeptId:this.state.partentDeptId
  //   };
  //   let data2 = data ? data : data1;
  //   getDeptWorkTime(data2).then((res) => {
  //     if (res.data.code == 1) {
  //       this.setState({
  //         deptTimeList: res.data.data.result.deptHourList,
  //         deptProList:res.data.data.result.projInfoList,
  //       });
  //       let maxTime = 0 ;
  //       let color = [];
  //       if(res.data.data.result.deptHourList.length>0){
  //         res.data.data.result.deptHourList.map(val=>{
  //           let allTime = 0;
  //           val.hourNum.map(val=>{
  //             allTime = val+allTime;
  //           })
  //           maxTime = maxTime>allTime?maxTime:allTime;
            
  //         })
  //        res.data.data.result.projInfoList.map(val=>{
  //           let aaa= that.getColor();
  //           color.push(aaa)
  //        })
  //        this.setState({
  //         deptMaxLength:maxTime,
  //         deptColorList:color
  //       })
  //       }
  //     } else {
  //       message.error(res.data.message);
  //     }
  //   });
  // };
  getColor=()=>{
    var i = 0;
    var str = "#";
    var random = 0;
    var aryNum = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "A", "B", "C", "D", "E", "F"];
 
    for(i = 0; i < 6; i++)
    {
    	random = parseInt(Math.random() * 16);
 
    	str += aryNum[random];
    } 
    return str

  }
  gethandleChange1= (a,b )=>{
    console.log(a,b)
    this.setState({
      deptName1: b,
      deptId1: a,
    });
  }
  handleChange = () => {
    let b = this.state.deptName1;
    let a =  this.state.deptId1;
    let lsList = [];
    this.setState({
      deptName: b,
      current:1
    });
    for (let i = 0; i < 100; i++) {
      lsList.push(Math.random());
    }

    this.setState({
      deptId: a,
      randomList: lsList,
    });
    let data = {
      projDeptId:a,
      startTime :this.state.startTime,
      endTime :this.state.endTime
    }
    getALLWorkTime(data).then((res) => {
      if (res.data.code == 1) {
        this.setState({
          allTimeList: res.data.data.result.projManhourList,
          flag:false
        });
        let maxLength= 0;
        res.data.data.result.projManhourList.map(val=>{
          maxLength = val.hourNumCount >maxLength?val.hourNumCount :maxLength;
        })
        this.setState({
          allMaxLength:maxLength,
        })
        getDeptProjInfo(a).then(res=>{
          this.setState({
            deptList:res.data.data.rows
          })
        })
        // if(res.data.data.result.projManhourList.length>0){
          // let data = {
          //   endTime: this.state.endTime,
          //   partentDeptId:res.data.data.result.projManhourList[0].id,
          //   projDeptId: this.state.deptId,
          //   startTime: this.state.startTime
          // } 
          // this.getDeptWorkTime(data);
          // data.current = 1;
          // data.size = 10;
          // let that = this;
      
            // getUserProjManhour(data).then(res=>{
            //   this.setState({
            //     perHourList: res.data.data.result.projInfoList,
            //     perProList:res.data.data.result.userHourList,
            //     allCount:res.data.data.result.total
            //   });
            //   let maxTime = 0 ;
            //   let color = [];
            //   if(res.data.data.result.userHourList.length>0){
            //     res.data.data.result.userHourList.map(val=>{
            //       let allTime = 0;
            //       val.hourNum.map(val=>{
            //         allTime = val+allTime;
            //       })
            //       maxTime = maxTime>allTime?maxTime:allTime;
                  
            //     })
            //    res.data.data.result.projInfoList.map(val=>{
            //       let aaa= that.getColor();
            //       color.push(aaa)
            //    })
            //    this.setState({
            //     perMaxLength:maxTime,
            //     perColorList:color,
            //     flag:false
            //   })
            //   }
            // });
        // }else{
          
        // }
        
      } else {
        message.error(res.data.message);
      }
    });
  };
componentDidUpdate(props){
  if(this.props.dataParentDeptId !=props.dataParentDeptId ){
    
    this.setState({
      partentDeptId:props.dataParentDeptId
    })
    let data = {
      endTime: this.state.endTime,
      partentDeptId:this.props.dataParentDeptId,
      projDeptId: this.state.deptId,
      startTime: this.state.startTime
    } 
  // this.getDeptWorkTime(data);
  data.current = 1;
  data.size = 10;
  let that = this;

  getUserProjManhour(data).then(res=>{
    this.setState({
      perHourList: res.data.data.result.projInfoList,
      perProList:res.data.data.result.userHourList,
      allCount:res.data.data.result.total,
      current:1
    });
    let maxTime = 0 ;
    let color = [];
    if(res.data.data.result.userHourList.length>0){
      res.data.data.result.userHourList.map(val=>{
        let allTime = 0;
        val.hourNum.map(val=>{
          allTime = val+allTime;
        })
        maxTime = maxTime>allTime?maxTime:allTime;
        
      })
     res.data.data.result.projInfoList.map(val=>{
        let aaa= that.getColor();
        color.push(aaa)
     })
     this.setState({
      perMaxLength:maxTime,
      perColorList:color
    })
    }
  });
  }
    
}
changePage =(page) =>{
  let that = this
  let data = {
    endTime: this.state.endTime,
    partentDeptId: this.props.dataParentDeptId,
    projDeptId: this.state.deptId,
    startTime: this.state.startTime
    }
    data.current = page;
    data.size = 10;
   

      getUserProjManhour(data).then(res=>{
        this.setState({
          perHourList: res.data.data.result.projInfoList,
          perProList:res.data.data.result.userHourList,
          allCount:res.data.data.result.total,
          current:page
        });
        let maxTime = 0 ;
        let color = [];
        if(res.data.data.result.userHourList.length>0){
          res.data.data.result.userHourList.map(val=>{
            let allTime = 0;
            val.hourNum.map(val=>{
              allTime = val+allTime;
            })
            maxTime = maxTime>allTime?maxTime:allTime;
            
          })
         res.data.data.result.projInfoList.map(val=>{
            let aaa= that.getColor();
            color.push(aaa)
         })
         this.setState({
          perMaxLength:maxTime,
          perColorList:color
        })
        }
      });
}
  onChange = (e) => {
    if (e.target.value == '3') {
      this.setState({
        showTime: true,
      });
      return;
    }
    let lsList = [];
    for (let i = 0; i < 100; i++) {
      lsList.push(Math.random());
    }
    this.setState({
      showTime: false,
      randomList: lsList,
      current:1
    });
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
        data.startTime = year + '-' + month + '-01';
        data.endTime = year + '-' + month + '-' + myDate.getDate();
        this.setState({
          startTime: year + '-' + month + '-01',
          endTime: year + '-' + month + '-' + myDate.getDate(),
        });
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
          data.startTime = year + '-' + month + '-' + myDate;
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
          data.startTime = year + '-' + month + '-' + myDate;
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
          data.endTime = year + '-' + month + '-' + myDate;
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
          data.endTime = year + '-' + month + '-' + myDate;
        }

        this.setState({
          startTime: data.startTime,
          endTime: data.endTime,
        });

        break;
      case '2':
        month = month * 1 + 1;
        if (month < 10) {
          month = '0' + month;
        }
        myDate = new Date(year, month, 0);

        data.startTime = year + '-' + month + '-01';
        data.endTime = year + '-' + month + '-' + myDate.getDate();
        this.setState({
          startTime: data.startTime,
          endTime: data.endTime,
        });
        break;
      default:
    }
    data.projDeptId = this.state.deptId;
    data.projId = this.state.projId;
console.log(this.state.projId)
    getALLWorkTime(data).then((res) => {
      if (res.data.code == 1) {
        this.setState({
          allTimeList: res.data.data.result.projManhourList,
        });
        let maxLength= 0;
        res.data.data.result.projManhourList.map(val=>{
          maxLength = val.hourNumCount >maxLength?val.hourNumCount :maxLength;
        })
        this.setState({
          allMaxLength:maxLength,
        })
        if(res.data.data.result.projManhourList.length>0){
          let data = {
            endTime: this.state.endTime,
            partentDeptId:res.data.data.result.projManhourList[0].id,
            projDeptId: this.state.deptId,
            startTime: this.state.startTime
          } 
          // this.getDeptWorkTime(data);
          data.current = this.state.current;
          data.size = 10;
         
          let that = this;
            getUserProjManhour(data).then(res=>{
              this.setState({
                perHourList: res.data.data.result.projInfoList,
                perProList:res.data.data.result.userHourList,
                allCount:res.data.data.result.total
              });
              let maxTime = 0 ;
              let color = [];
              if(res.data.data.result.userHourList.length>0){
                res.data.data.result.userHourList.map(val=>{
                  let allTime = 0;
                  val.hourNum.map(val=>{
                    allTime = val+allTime;
                  })
                  maxTime = maxTime>allTime?maxTime:allTime;
                  
                })
               res.data.data.result.projInfoList.map(val=>{
                  let aaa= that.getColor();
                  color.push(aaa)
               })
               this.setState({
                perMaxLength:maxTime,
                perColorList:color
              })
              }
            });
        }else{
          
        }
        
      } else {
        message.error(res.data.message);
      }
    });

  };

 
 
  getName = (list, departmentList = []) => {
    list.forEach((val) => {
      departmentList.push({
        name: val.name,
        deptId: val.id,
      });
      this.getName(val.children, departmentList);
    });
    return departmentList;
  };

  getPickTime = (time, timeString) => {
    let that = this;
    console.log(time, timeString);
    let data = {
      startTime: timeString[0],
      endTime: timeString[1],
      projDeptId:this.state.deptId
    };
    this.setState({
      startTime: timeString[0],
      endTime: timeString[1],
    })
    getALLWorkTime(data).then((res) => {
      if (res.data.code == 1) {
        this.setState({
          allTimeList: res.data.data.result.projManhourList,
        });
        let maxLength= 0;
        res.data.data.result.projManhourList.map(val=>{
          maxLength = val.hourNumCount >maxLength?val.hourNumCount :maxLength;
        })
        this.setState({
          allMaxLength:maxLength,
        })
        if(res.data.data.result.projManhourList.length>0){
          let data = {
            endTime: this.state.endTime,
            partentDeptId:res.data.data.result.projManhourList[0].id,
            projDeptId: this.state.deptId,
            startTime: this.state.startTime
          } 
          this.getDeptWorkTime(data);
          data.current = this.state.current;
          data.size = 10;
         
      
            getUserProjManhour(data).then(res=>{
              this.setState({
                perHourList: res.data.data.result.projInfoList,
                perProList:res.data.data.result.userHourList,
                allCount:res.data.data.result.total
              });
              let maxTime = 0 ;
              let color = [];
              if(res.data.data.result.userHourList.length>0){
                res.data.data.result.userHourList.map(val=>{
                  let allTime = 0;
                  val.hourNum.map(val=>{
                    allTime = val+allTime;
                  })
                  maxTime = maxTime>allTime?maxTime:allTime;
                  
                })
               res.data.data.result.projInfoList.map(val=>{
                  let aaa= that.getColor();
                  color.push(aaa)
               })
               this.setState({
                perMaxLength:maxTime,
                perColorList:color
              })
              }
            });
        }else{
          
        }
        
      } else {
        message.error(res.data.message);
      }
    });
  };
  getExcel = () => {
    let data = {
      deptId: this.state.deptId,
      endTime: this.state.endTime,
      startTime: this.state.startTime,
      projId:this.state.projId
    };
    dpetProTime(data).then(res=>{
      if(res.data.code == 0){
        message.error(res.data.message)
      }else{
        let fileName = '工时统计.xlsx';
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
      }
    });
  };
  showTip=()=>{
    this.setState({
      flag:true,
      departmentList:this.state.departmentList1
    })
  }
  handleCancel=()=>{
    this.setState({
      flag:false
    })
  }
  onSearch1=(val)=>{
    console.log(val)
    if (val === '') {
      this.setState({
        departmentList : this.state.departmentList1
      })
      // treeData1 = treeData;
    } else {
      let result = this.getSearch(val);
      if (result.length > 0) {
        // treeData1 = result
        this.setState({
          departmentList : result
        })
      } else {
        // treeData1=[]
        this.setState({
          departmentList : []
        })
      }
    }
  }
  getSearch = (name) => {
    let data = this.state.departmentList1;
   
    
    var hasFound = false, // 表示是否有找到id值
      result = null;
    let resultdata = [];
    let key = [];
    var fn = function (data) {
      if (Array.isArray(data) && !hasFound) {
        // 判断是否是数组并且没有的情况下，
        data.forEach((item) => {
          if (item.title.indexOf(name) != -1) {
            // 数据循环每个子项，并且判断子项下边是否有id值
            result = item; // 返回的结果等于每一项
            if (key.indexOf(result.key) == -1) {
              resultdata.push(result);
              key.push(result.key);
            }
            // hasFound = true; // 并且找到id值
          } else if (item.children) {
            fn(item.children); // 递归调用下边的子项
          }
        });
      }
    };
    fn(data); // 调用一下
    return resultdata;
  };
 onChange1 = (value)=> {
    let data = {
      startTime :this.state.startTime,
      endTime :this.state.endTime,
      projDeptId:this.state.deptId,
      projId:value
    }
    // fix：暴力清除 重新请求缓存问题
    this.setState({
      allTimeList: []
    })
    getALLWorkTime(data).then((res) => {
      if (res.data.code == 1) {
        this.setState({
          allTimeList: res.data.data.result.projManhourList,
          projId:value
        });
        let maxLength= 0;
        res.data.data.result.projManhourList.map(val=>{
          maxLength = val.hourNumCount >maxLength?val.hourNumCount :maxLength;
        })
        this.setState({
          allMaxLength:maxLength,
        })
      
        
      } else {
        message.error(res.data.message);
      }
    });
  };
  

  
 onSearch = (val)=> {
    console.log('search:', val);
  };
  render() {
    let deptList= '';
    if(this.state.deptList.length>0){
      deptList = this.state.deptList.map(val=>{
          return (
            <Option value={val.projId}>{val.projName}</Option>
          )
      })
    }
    // fix: 新增projId
    let data = {
      endTime: this.state.endTime,
      startTime: this.state.startTime,
      projDeptId: this.state.deptId,
      projId: this.state.projId
    };
    let department;
    department = this.state.departmentList.map((val) => {
      return (
        <Option value={val.deptId} key={val.deptId}>
          {val.name}
        </Option>
      );
    });
    let allTimeList = '';

    if (this.state.allTimeList.length > 0) {
      allTimeList = this.state.allTimeList.map((val, key) => {
        return <AllWorkTimeMsg  msg={val} data={data} key={this.state.randomList[key]} maxLength={this.state.allMaxLength} level={1}/>;
      });
    }
    let deptTimeList = '';
    let deptProList  = '';
    if (this.state.deptTimeList) {
    
      deptTimeList = this.state.deptTimeList.map((val, key) => {
        console.log(val)
        return (
          <DeptTime key={Math.random()} msg = {val} maxLength ={this.state.deptMaxLength} color={this.state.deptColorList}/>
        );
      });
      deptProList =  this.state.deptProList.map((val,index)=>{
      
      return (  <li> <div style={{background:this.state.deptColorList[index]}}></div>{val.projName} </li>)
      })
    }
    let perTimeList = '';
    let perProList  = '';
    if (this.state.perProList) {
    
      perTimeList = this.state.perProList.map((val, key) => {
        console.log(val)
        return (
          <PerTime key={Math.random()} msg = {val} maxLength ={this.state.perMaxLength} color={this.state.perColorList}/>
        );
      });
      perProList =  this.state.perHourList.map((val,index)=>{
      console.log(val)
      return (  <li> <div style={{background:this.state.perColorList[index]}}></div>{val.projName} </li>)
      })
    }
   
    return (
      <Fragment>
        <Titler />
        <div className="content">
          <div className="left">
            <ul>
              <li className="active">工时统计</li>
            </ul>
          </div>

          <div className="right">
            <div className="changeDepartment">
              <label className="tipName">项目所属部门:</label>
              <div className="getName" onClick={this.showTip}>
                {/* <Select
                 showSearch
                placeholder={this.state.deptName}
                filterOption={(input, option) =>
                 option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
               }
                 style={{ width: 240 }}
                  onChange={this.handleChange}>
                  {department}
                </Select> */}
                {this.state.deptName}
                <DownOutlined style={{float:'right',marginTop:'8px',marginRight:'10px'}}/>
              </div>
              <div className='fundPm'> 
                  <label>项目选择：</label>
                  <Select
                    showSearch
                    style={{ width: 160 }}
                    placeholder="全部"
                    optionFilterProp="children"
                    onChange={this.onChange1}
                  
               
                    filterOption={(input, option) =>
                      option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }
                  >
                    {deptList}
                   
                  </Select>

              </div>
              <div className="tRight">
                    <div className="pickTime">
                      <Radio.Group onChange={this.onChange} defaultValue="0">
                        <Radio.Button value="0">上月</Radio.Button>
                        <Radio.Button value="1">上周</Radio.Button>
                        <Radio.Button value="2">本月</Radio.Button>
                        <Radio.Button value="3">时间段</Radio.Button>
                      </Radio.Group>
                    </div>
                    
                    <div className={this.state.showTime ? 'getTime' : 'hidden'}>
                      <RangePicker onChange={this.getPickTime} width={260} />
                    </div>
                  </div>
            </div>

            <div className="ProAnalysis">
              <div className="analysisMsg" style={{paddingBlock:'80px'}}>
                <div className="msgTitle">
                  <h3>工时总览</h3>
                  <Button type="primary"  style={{float:'right',marginRight:'10px'}} ghost  onClick={this.getExcel}>
                      导出Excel数据
                    </Button>
                </div>

                <div className="tableBg allHeight">{allTimeList}</div>
              </div>
{/* 
              <div className="analysisMsg">
                <div className="msgTitle">
                  <h3>部门工时分布</h3>
                </div>

                <div className="tableBg">{deptTimeList}</div>
                <div  className='deptProName'><ul>
                  {deptProList}
                  
                </ul></div>
              </div>

              <div className="analysisMsg">
                <div className="msgTitle">
                  <h3>人员工时分布</h3>
                </div>

                <div className="tableBg">{perTimeList}</div>
                <div  className='deptProName'><ul>
                  {perProList}
                  
                </ul></div>
                <div className='page'><Pagination showSizeChanger={false}  current={this.state.current} total={this.state.allCount} hideOnSinglePage={true}   onChange={this.changePage}/></div>
              </div> */}
            </div>
          </div>
        </div>
        <Modal
          title="所属部门选择"
          visible={this.state.flag}
          onCancel={this.handleCancel}
          width={400}
          footer={[
            <Button type="primary" key="confirm" onClick={this.handleChange}>
              确定
            </Button>,
            <Button key="cancel" onClick={this.handleCancel}>
              取消
            </Button>,
          ]}
        >
         <div className="border1">
         <Search
                style={{ marginBottom: 8 }}
                placeholder="请输入快速搜索"
                // onChange={this.inputNull}
                onSearch={this.onSearch1}
              />
          <Tree
            
            onExpand={this.onExpand}
            treeData={this.state.departmentList}
            titleRender={(nodeData) => (
              <div className="oprateWrap" key={nodeData.id}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <span
                    onClick={(event) => this.gethandleChange1(nodeData.id, nodeData.title)}
                    className={` ${this.state.deptId1 == nodeData.id ? 'nocheckedCircle' : 'checkedCircle'}`}
                  ></span>
                  {/* <input style={{marginRight:'5px'}} type="radio"
                                         
                                           className={` ${this.state.currentIndex== nodeData.id? 'dispalyClass1' : 'noneClass2'}`}
                                              value={nodeData.id} name="cheakRadios"/> */}

                  <span>{nodeData.title}</span>
                </div>
              </div>
            )}
          />
         </div>
        </Modal>
      </Fragment>
    );
  }
}

// export default ProAnalysis;
export default connect(stateToProps, dispatchTOProps)(ProAnalysis);
