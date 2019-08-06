import axios from 'axios'
import store from './store.js'
import router from './router.js'

//创建axios实例
var instance = axios.create({
baseURL: 'http://localhost:3000/api/',
  timeout: 7000, //超时返回错误
  headers: { 'Content-Type': 'application/json;charset=UTF-8'},
});

//request拦截器
instance.interceptors.request.use(
  config => {
    config.headers['skyAuth'] = `aut${store.state.token}` //自定义header-token
    return config;
  }
);

//respone拦截器
instance.interceptors.response.use(
  response => {
    return response;
  },
  error => { //错误处理
    if (error.response) {
      switch (error.response.status) {
        case 401:
          store.dispatch('UserLogout'); //重新认证
          router.replace({ //跳转到登录页面
            path: '/',
            query: { redirect: router.currentRoute.fullPath } // 将跳转的路由path作为参数，登录成功后跳转到该路由
          });
      }
    }
    return Promise.reject(error.response);
  }
);

export default {
    //封装get请求
    getService(url){
        return instance.get(url);
    },
    //封装post请求
    postService(url, data){
        return instance.post(url, data);
    },
    //封装patch请求
    patchService(url, data){
        return instance.patch(url, data);
    }
}