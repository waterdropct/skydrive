import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex);
const store = new Vuex.Store({
    state: {
        token: window.localStorage.getItem('token'),
        userName: window.localStorage.getItem('userName')
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