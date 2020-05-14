import Vue from 'vue'
import Noty from 'noty'
import i18n from '@/i18n'
import { disableExternal, config } from '@/utils/constants'

Vue.config.productionTip = true

const notyDefault = {
  type: 'info',
  layout: 'bottomRight',
  timeout: 1000,
  progressBar: true
}

Vue.prototype.$noty = (opts) => {
  new Noty(Object.assign({}, notyDefault, opts)).show()
}

Vue.prototype.$showSuccess = (message) => {
  new Noty(Object.assign({}, notyDefault, {
    text: message,
    type: 'success',
    timeout: 3000,
  })).show()
}

Vue.prototype.$showLongSuccess = (message) => {
  new Noty(Object.assign({}, notyDefault, {
    text: message,
    type: 'success',
    timeout: 6000,
  })).show()
}

Vue.prototype.$showError = (error) => {
  let btns = [
    Noty.button(i18n.t('buttons.close'), '', function () {
      n.close()
    })
  ]

  if (!disableExternal) {
    btns.unshift(Noty.button(i18n.t('buttons.reportIssue'), '', function () {
      window.open(config.supportLink)
      n.close()
    }))
  }

  let n = new Noty(Object.assign({}, notyDefault, {
    text: error.message || i18n.t('errors.general'),
    type: 'error',
    timeout: 5000,
    buttons: btns
  }))

  n.show()
}

Vue.directive('focus', {
  inserted: function (el) {
    el.focus()
  }
})

export default Vue
