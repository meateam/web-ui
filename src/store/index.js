import Vue from 'vue'
import Vuex from 'vuex'
import mutations from './mutations'
import getters from './getters'

Vue.use(Vuex)

const state = {
  user: null,
  path: [{name: "", id: ""}],
  req: {},
  oldReq: {},
  clipboard: {
    key: '',
    items: []
  },
  quota: {
    used: 0,
    limit: 0
  },
  jwt: '',
  progress: 0,
  loading: false,
  reload: false,
  selected: [],
  multiple: false,
  show: null,
  showShell: false,
  showMessage: null,
  showConfirm: null,
  shares: false,
  search: false,
  globalExternalUsers: [],
}

export default new Vuex.Store({
  strict: true,
  state,
  getters,
  mutations
})
