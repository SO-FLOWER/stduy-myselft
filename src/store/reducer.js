//这个文件相当于是仓库的管理员，他管理这个仓库的东西，修改数据，新增数据都必须经过他；

//defaultState这个是仓库里的东西，我们会使用这个数据
const defaultState = {
    dataParentDeptId:'',
    // powerList:[]
}

//我们会触发里面的方法，对仓库的东西进行修改
export default (state = defaultState, action) => {
  
    if (action.type === 'changeDataId') {
        
        let initState = JSON.parse(JSON.stringify(state));
        initState.dataParentDeptId = action.value;
       
        return initState;
    }
    // if (action.type === 'getPowerList') {
        
    //     let initState = JSON.parse(JSON.stringify(state));
    //     initState.powerList = action.value;
    //     return initState;
    // }
    return state;
}