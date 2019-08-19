<template>
  <nav :class="{active}">
    <template v-if="isLogged">
      <router-link class="action" to="/files" :aria-label="$t('sidebar.myFiles')" :title="$t('sidebar.myFiles.title')">
        <i class="material-icons">folder</i>
        <span v-if="nameExists">{{ $t('sidebar.myFiles.personalized', {person: user.firstName}) }}</span>
        <span v-else>{{ $t('sidebar.myFiles.title') }}</span>
      </router-link>

      <div>
        <button @click="$store.commit('showHover', 'newDir')" class="action" :aria-label="$t('sidebar.newFolder')" :title="$t('sidebar.newFolder')">
          <i class="material-icons">create_new_folder</i>
          <span>{{ $t('sidebar.newFolder') }}</span>
        </button>
      </div>

    </template>

    <p class="credits">
      <span>
        <span>Beta version</span>
        <span> {{ version }}</span>
      </span>
      <span>Enter link to support</span>
    </p>
  </nav>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import * as auth from '@/utils/auth'
import { version, signup, disableExternal, noAuth } from '@/utils/constants'

export default {
  name: 'sidebar',
  computed: {
    ...mapState([ 'user' ]),
    ...mapGetters([ 'isLogged' ]),
    active () {
      return this.$store.state.show === 'sidebar'
    },
    signup: () => signup,
    version: () => version,
    disableExternal: () => disableExternal,
    noAuth: () => noAuth,
    nameExists: function () {
       return this.user.firstName && this.user.lastName 
    }
  },
  methods: {
    help () {
      this.$store.commit('showHover', 'help')
    },
    logout: auth.logout
  }
}
</script>
