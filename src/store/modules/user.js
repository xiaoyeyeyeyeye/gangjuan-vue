import { login, logout, getInfo } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
// import router, { resetRouter } from '@/router'
import { resetRouter } from '@/router'
// import axios from 'axios'

const state = {
  token: getToken(),
  user: {},
  roles: []
}

const getters = {
  token: state => state.token,
  user: state => state.user,
  roles: state => state.roles
}

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_USER(state, user) {
    state.user = user
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
  }
}

// axios.defaults.withCredentials = true

const actions = {
  async getInfo({ commit }) {
    const token = getToken()
    if (!token) {
      throw new Error('token 不存在')
    }

    const res = await getInfo()
    if (!res) {
      throw new Error('获取用户信息失败')
    }

    const user = {
      userId: res.userId,
      name: res.name,
      roleId: res.roleId
    }

    commit('SET_USER', user)
    commit('SET_ROLES', [res.roleId])

    localStorage.setItem('user', JSON.stringify(user))

    return user
  },
  async login({ commit }, payload) {
    const res = await login(payload)

    if (!res) {
      throw new Error('登录失败，接口未返回数据')
    }
    console.log(res)

    const token = res.token
    if (!token) {
      throw new Error('登录失败，未返回 token')
    }
    commit('SET_TOKEN', token)
    setToken(token)

    const user = {
      userId: res.userId,
      name: res.name,
      roleId: res.roleId
    }

    commit('SET_USER', user)

    const roles = [res.roleId]
    commit('SET_ROLES', roles)

    localStorage.setItem('user', JSON.stringify(user))

    return res
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
  }
}

//   // dynamically modify permissions
//   async changeRoles({ commit, dispatch }, role) {
//     const token = role + '-token'

//     commit('SET_TOKEN', token)
//     setToken(token)

//     const { roles } = await dispatch('getInfo')

//     resetRouter()

//     // generate accessible routes map based on roles
//     const accessRoutes = await dispatch('permission/generateRoutes', roles, { root: true })
//     // dynamically add accessible routes
//     router.addRoutes(accessRoutes)

//     // reset visited views and cached views
//     dispatch('tagsView/delAllViews', null, { root: true })
//   }
// }

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
