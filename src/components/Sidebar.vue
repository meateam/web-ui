<template>
  <nav :class="{active}">
    <template v-if="isLogged">
      <div @click="onMyFilesClick" class="action" to="/files" :aria-label="$t('sidebar.myFiles.title')" :title="$t('sidebar.myFiles.title')">
        <i class="material-icons">folder</i>
        <span v-if="nameExists">{{ $t('sidebar.myFiles.personalized', {person: user.firstName}) }}</span>
        <span v-else>{{ $t('sidebar.myFiles.title') }}</span>
      </div>

      <div>
        <button @click="$store.commit('showHover', 'newDir')" class="action" :aria-label="$t('sidebar.newFolder')" :title="$t('sidebar.newFolder')">
          <i class="material-icons">create_new_folder</i>
          <span>{{ $t('sidebar.newFolder') }}</span>
        </button>
      </div>
      <div>
        <a v-bind:href = supportLink class="action" target="_blank" :aria-label="$t('sidebar.contactUs')" :title="$t('sidebar.contactUs')">
          <i class="material-icons">headset_mic</i>
          <span>{{$t('sidebar.contactUs')}}</span>
        </a>
      </div>
      <div>
        <quota :quota="quota"></quota>
      </div>
    </template>

    <p class="credits">
      <span>
        <span>Beta version</span>
        <span> {{ version }}</span>
      </span>
    </p>
  </nav>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import * as auth from '@/utils/auth'
import { version, signup, disableExternal, noAuth, config } from '@/utils/constants'
import Quota from './quota/Quota'

export default {
  name: 'sidebar',
  components: {
    Quota
  },
  computed: {
    ...mapState([ 'user', 'quota' ]),
    ...mapGetters([ 'isLogged' ]),
    active () {
      return this.$store.state.show === 'sidebar'
    },
    signup: () => signup,
    supportLink: () => config.supportLink,
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
    onMyFilesClick() {
      this.$store.commit("changeFolder", '');
      this.$store.commit("setReload", true);
    },
    logout: auth.logout
  }
}
</script>
