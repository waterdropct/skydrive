import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex);
const store = new Vuex.Store({
    state: {
        token: window.localStorage.getItem('token'),
        userName: window.localStorage.getItem('userName'),
        diskContent: {
            id: '1',
            name: "全部文件",
            type: 'folder',
            size: '-',
            children: [{
                id: '1.1',
                name: '目录1',
                type: 'folder',
                size: '-',
                updateTime: '2019-07-04',
                children: [{
                    id: '1.1.1',
                    name: '文件1.1.1',
                    type: 'file',
                    size: '1.4kb',
                    updateTime: '2019-07-04'
                }]
            },{
                id: '1.2',
                name: '目录2',
                size: '-',
                type: 'folder',
                updateTime: '2019-07-04'
            },{
                id: '1.3',
                name: '文件1',
                type: 'file',
                size: '1.4kb',
                updateTime: '2019-07-04'
            },{
                id: '1.4',
                name: '文件2',
                type: 'file',
                size: '1.4kb',
                updateTime: '2019-07-04'
            }]

        }
    },
    mutations: {
        LOGIN: (state, data) => { //登陆
            state.userName = data.userName;
            state.token = data.token;
            window.localStorage.setItem('token', data.token);
            window.localStorage.setItem('userName', data.userName);
        },
        LOGOUT: (state) => { //注销
            state.userName = "";
            state.token = "";
            window.localStorage.removeItem('token');
            window.localStorage.removeItem('userName');
        }
    },
    actions: {
        UserLogin({ commit }, data){
            commit('LOGIN', data);
        },
        UserLogout({ commit }){
            commit('LOGOUT');
        },
    }
});
export default store