import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from './components/Login' //登陆
import NotFound from './components/NotFound' //404
import CloudDisk from './components/CloudDisk' //主页

Vue.use(VueRouter)
const router = new VueRouter({
    mode: 'history',
    routes: [{
        path: '/',
        component: Login
    },{
        path: '/cloud',
        component: CloudDisk,
        meta: {
            requireAuth: true
        }
    },{
        path: '*',
        component: NotFound
    }]
})
//路由认证
router.beforeEach((to, from, next) => {
    let isAuth = sessionStorage.getItem("userAccess");
    if(to.matched.some( record => record.meta.requireAuth) && !isAuth){
        next({
            path: '/',
            query: {redirect: to.fullPath}
        })
    }else{
        next()
    }
})
export default router