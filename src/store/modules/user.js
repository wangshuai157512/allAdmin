import { login } from '@/api/login'
import { setToken, getToken, removeToken, setProjectState, getProjectState } from '@/utils/auth'

const user = {
  state: {
    token: getToken(),
    projectState: getProjectState(),
    name: '',
    avatar: '',
    roles: []
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_NAME: (state, name) => {
      state.name = name
    },
    SET_PROJECT_STATE: (state, projectState) => {
      state.projectState = projectState
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    }
  },

  actions: {
    // 登录
    Login({ commit }, userInfo) {
      const username = userInfo.username.trim()
      return new Promise((resolve, reject) => {
        login(username, userInfo.password).then(response => {
          if (response.success) {
            commit('SET_TOKEN', response.token)
            commit('SET_PROJECT_STATE', response.user.project)
            setToken(response.token)
            setProjectState(response.user.project)
            resolve()
          } else {
            reject(response)
          }
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 登出
    LogOut({ commit }) {
      return new Promise((resolve) => {
        commit('SET_TOKEN', '')
        commit('SET_ROLES', [])
        removeToken()
        resolve()
        // logout(state.token).then(() => {
        //   commit('SET_TOKEN', '')
        //   commit('SET_ROLES', [])
        //   removeToken()
        //   resolve()
        // }).catch(error => {
        //   reject(error)
        // })
      })
    },

    // 前端 登出
    FedLogOut({ commit }) {
      return new Promise(resolve => {
        commit('SET_TOKEN', '')
        removeToken()
        resolve()
      })
    }
  }
}

export default user
