import { login, logout, getInfo } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import router, { resetRouter } from '@/router'

const state = {
  token: getToken(),
  name: '',
  avatar: '',
  introduction: '',
  roles: []
}

const getters = {
  token: state => state.token,
  name: state => state.name,
  avatar: state => state.avatar,
  roles: state => state.roles
}

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_INTRODUCTION: (state, introduction) => {
    state.introduction = introduction
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
  }
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    const { loginId, password } = userInfo
    console.log('进入user的actions')
    return new Promise((resolve, reject) => {
      login({ loginId: loginId.trim(), password: password }).then(response => {
        console.log('进入user的actions的Promise')
        console.log('response的内容为', JSON.stringify(response))
        // 直接使用返回的对象
        const token = response.token || 'mock-token'
        if (token) {
          commit('SET_TOKEN', token)
          setToken(token)
          resolve()
        } else {
          reject('登录失败：后端未返回 token')
        }
      }).catch(error => {
        reject(error)
      })
    })
  },

  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getInfo(state.token).then(response => {
        const res = response // 根据你的接口，这里就是 {userId, name, roleId, token}
        if (!res) {
          return reject('getInfo: 返回数据为空')
        }

        const roles = res.roleId === 1 ? ['admin'] : ['user']

        commit('SET_ROLES', roles)
        commit('SET_NAME', res.name)
        commit('SET_AVATAR', res.avatar || '')
        commit('SET_INTRODUCTION', res.introduction || '')
        resolve(res)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  logout({ commit, state, dispatch }) {
    return new Promise((resolve, reject) => {
      logout(state.token).then(() => {
        commit('SET_TOKEN', '')
        commit('SET_ROLES', [])
        removeToken()
        resetRouter()

        // reset visited views and cached views
        // to fixed https://github.com/PanJiaChen/vue-element-admin/issues/2485
        dispatch('tagsView/delAllViews', null, { root: true })

        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      commit('SET_TOKEN', '')
      commit('SET_ROLES', [])
      removeToken()
      resolve()
    })
  },

  // dynamically modify permissions
  async changeRoles({ commit, dispatch }, role) {
    const token = role + '-token'

    commit('SET_TOKEN', token)
    setToken(token)

    const { roles } = await dispatch('getInfo')

    resetRouter()

    // generate accessible routes map based on roles
    const accessRoutes = await dispatch('permission/generateRoutes', roles, { root: true })
    // dynamically add accessible routes
    router.addRoutes(accessRoutes)

    // reset visited views and cached views
    dispatch('tagsView/delAllViews', null, { root: true })
  }
}

// export default {
//   namespaced: true,
//   state,
//   mutations,
//   actions
// }

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}
