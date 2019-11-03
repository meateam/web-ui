import * as i18n from '@/i18n'
import moment from 'moment'

const mutations = {
  closeHovers: state => {
    state.show = null
    state.showMessage = null
  },
  showHover: (state, value) => {
    if (typeof value !== 'object') {
      state.show = value
      return
    }

    state.show = value.prompt
    state.showMessage = value.message
    state.showConfirm = value.confirm
  },
  showError: (state, value) => {
    state.show = 'error'
    state.showMessage = value
  },
  showSuccess: (state, value) => {
    state.show = 'success'
    state.showMessage = value
  },
  setLoading: (state, value) => { state.loading = value },
  setReload: (state, value) => { state.reload = value },
  setUser: (state, value) => {
    if (value === null) {
      state.user = null
      return
    }

    let locale = value.locale

    if (locale === '') {
      locale = i18n.detectLocale()
    }

    moment.locale(locale)
    i18n.default.locale = locale
    state.user = value
  },
  setJWT: (state, value) => (state.jwt = value),
  multiple: (state, value) => (state.multiple = value),
  addSelected: (state, value) => (state.selected.push(value)),
  addPlugin: (state, value) => {
    state.plugins.push(value)
  },
  removeSelected: (state, value) => {
    let i = state.selected.indexOf(value)
    if (i === -1) return
    state.selected.splice(i, 1)
  },
  resetSelected: (state) => {
    state.selected = []
  },
  updateUser: (state, value) => {
    if (typeof value !== 'object') return

    for (let field in value) {
      if (field === 'locale') {
        moment.locale(value[field])
        i18n.default.locale = value[field]
      }

      state.user[field] = value[field]
    }
  },
  updateRequest: (state, value) => {
    state.oldReq = state.req
    state.req = value
  },
  updateClipboard: (state, value) => {
    state.clipboard.key = value.key
    state.clipboard.items = value.items
  },
  resetClipboard: (state) => {
    state.clipboard.key = ''
    state.clipboard.items = []
  },
  setProgress: (state, value) => {
    state.progress = value
  },
  pushFolder: (state, value) => {
    if (typeof value !== 'object') return;
    if (!value.id || !value.name) return;
    state.path.push(value);
  },
  changeFolder: (state, value) => {
    let index = value ? state.path.findIndex(folder => folder.id === value) : 0;
    state.path = state.path.slice(0, index + 1);
  },
  renameFolder: (state, value) => {
    let index = value ? state.path.findIndex(folder => folder.id === value.id) : 0;
    state.path[index].name = value.name;
  },
  setPath: (state, value) => {
    if (!value) return;
    state.path = value;
  },
  setQuota: (state, value) => {
    if (!value || !value.limit) return;
    state.quota.used = value.used || 0;
    state.quota.limit = value.limit;
  },
  setShares: (state, value) => {
    state.shares = value;
  }
}

export default mutations
