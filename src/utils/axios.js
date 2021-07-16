/*
 * @Description: file content
 * @Author: 琚志强 1020814597
 * @Date: 2021-01-18 14:12:26
 * @LastEditors: 琚志强
 * @LastEditTime: 2021-02-26 15:19:06
 */
import axios from 'axios';

//第一步创建实例

const instance = axios.create({
  baseURL: 'http://192.168.11.183:3001/',
  timeout: 500000,
});

// 添加请求拦截器
instance.interceptors.request.use(
  function (config) {
    config.headers.common['Content-Type'] = 'application/json';
    if (window.sessionStorage.getItem('accessToken')) {
      config.headers.common['Authorization'] = window.sessionStorage.getItem('accessToken');
    }
    // 在发送请求之前做些什么
    return config;
  },
  function (error) {
    // 对请求错误做些什么
    return Promise.reject(error);
  },
);

// 添加响应拦截器
instance.interceptors.response.use(
  function (response) {
    // token 过期 前往登录页面
    if(response.data.code === 40001){
      window.sessionStorage.clear();
      return window.location.href= '/';
    };
    // 对响应数据做点什么
    return response;
  },
  function (error) {
    // 对响应错误做点什么
    return Promise.reject(error);
  },
);

export default instance;
