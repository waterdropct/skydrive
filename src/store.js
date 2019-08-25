import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex);
const store = new Vuex.Store({
    state: {
        token: window.localStorage.getItem('token'),
        userName: window.localStorage.getItem('userName'),
        userId: window.localStorage.getItem('userId')
    },
    mutations: {
        LOGIN: (state, data) => { //登陆
            state.userName = data.userName;
            state.userId = data.userId;
            state.token = data.token;
            window.localStorage.setItem('token', data.token);
            window.localStorage.setItem('userName', data.userName);
            window.localStorage.setItem('userId', data.userId);
        },
        LOGOUT: (state) => { //注销
            state.userName = "";
            state.userId = "";
            state.token = "";
            window.localStorage.removeItem('token');
            window.localStorage.removeItem('userName');
            window.localStorage.removeItem('userId');
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