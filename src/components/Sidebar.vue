<template>
  <nav :class="{active}">
    <template v-if="isLogged">
      <div
        @click="onMyFilesClick"
        class="action"
        :class="{ selected: !shares && !isSearch}"
        to="/files"
        :aria-label="$t('sidebar.myFiles.title')"
        :title="$t('sidebar.myFiles.title')">
          <i class="material-icons">folder</i>
          <span v-if="nameExists">{{ $t('sidebar.myFiles.personalized', {person: user.firstName}) }}</span>
          <span v-else>{{ $t('sidebar.myFiles.title') }}</span>
      </div>
      <div
        @click="onSharedWithMeClick"
        :class="{ selected: shares && !isSearch}"
        class="action" to="/shares"
        :aria-label="$t('sidebar.sharedFiles')"
        :title="$t('sidebar.sharedFiles')">
          <i class="material-icons">folder_shared</i>
          <span>{{ $t('sidebar.sharedFiles') }}</span>
      </div>
      <div v-if="showCreateUpload">
        <button @click="$store.commit('showHover', 'newDir')" class="action" :aria-label="$t('sidebar.newFolder')" :title="$t('sidebar.newFolder')">
          <i class="material-icons">create_new_folder</i>
          <span>{{ $t('sidebar.newFolder') }}</span>
        </button>
      </div>
      <div @click="onMySharesClick">
        <a v-bind:href="approvalServiceUrl" class="action" target="_blank" :aria-label="myExternalSharesName" :title="myExternalSharesName">
          <i class="material-icons">info</i>
          <span>{{myExternalSharesName}}</span>
        </a>
      </div>
      <div>
        <a v-bind:href="supportLink" class="action" target="_blank" :aria-label="$t('sidebar.contactUs')" :title="$t('sidebar.contactUs')">
          <i class="material-icons">headset_mic</i>
          <span>{{$t('sidebar.contactUs')}}</span>
        </a>
      </div>
      <div>
        <a class="action" target="_blank" :aria-label="$t('sidebar.storage')" :title="$t('sidebar.storage')" style="cursor: default">
          <i class="material-icons">storage</i>
          <span>{{$t('sidebar.storage')}}</span>
          <quota :quota="quota"></quota>
        </a>
      </div>
    </template>
  </nav>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import * as auth from '@/utils/auth'
import { signup, disableExternal, noAuth, config, UploadRole } from '@/utils/constants'
import Quota from './quota/Quota'

export default {
  name: 'sidebar',
  components: {
    Quota
  },
  data: function () {
    return {
      myExternalSharesName: config.myExternalSharesName  
    }
  },
  computed: {
    ...mapState([ 'req', 'user', 'quota' ]),
    ...mapGetters([ 'isLogged', 'shares', 'isSearch' ]),
    active () {
      return this.$store.state.show === 'sidebar'
    },
    signup: () => signup,
    supportLink: () => config.supportLink,
    approvalServiceUrl: () => config.approvalServiceUrl,
    disableExternal: () => disableExternal,
    noAuth: () => noAuth,
    nameExists: function () {
       return this.user.firstName && this.user.lastName
    },
    showCreateUpload() {
      return UploadRole(this.req.role);
    }
  },
  methods: {
    help () {
      this.$store.commit('showHover', 'help')
    },
    onMyFilesClick() {
      this.$store.commit("setShares", false);
      this.$store.commit("changeFolder", '');
      this.$store.commit("setReload", true);
    },
    onSharedWithMeClick() {
      this.$store.commit("setShares", true);
      this.$store.commit("changeFolder", '');
      this.$store.commit("setReload", true);
    },
    onMySharesClick() {
      console.log(config);
    },
    logout: auth.logout
  }
}
</script>
<style scoped>
.selected {
  background-color: rgba(0, 0, 0, .1);
}
</style>
