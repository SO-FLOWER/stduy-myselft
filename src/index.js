import React from 'react';
import ReactDOM from 'react-dom';
import Router from './router.js';
import * as serviceWorker from './serviceWorker';
import {Provider} from 'react-redux';
import store from './store/index'
import './index.less'
import { ConfigProvider } from 'antd'; // 引入ConfigProvider全局化配置
import zhCN from 'antd/es/locale/zh_CN';  // 引入中文包
ReactDOM.render(
  <React.Fragment>
   <Provider store={store}>
        {/* <App /> */}
        <ConfigProvider locale={zhCN}>
        <Router />
        </ConfigProvider>
    </Provider>

  </React.Fragment>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();

