import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from './components/Login' //登陆
import HelloWorld from './components/HelloWorld' //主页

Vue.use(VueRouter)
export default new VueRouter({
    mode: 'history',
    routes: [{
        path: '/index',
        component: Login
    },{
        path: '/skydrive',
        component: HelloWorld
    }]
})