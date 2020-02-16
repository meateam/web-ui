<template>
  <div class="card floating">
    <div class="card-title">
      <h2>{{ $t('prompts.fileInfo') }}</h2>
    </div>

    <div class="card-content">
      <p v-if="selected.length > 1">{{ $t('prompts.filesSelected', { count: selected.length }) }}</p>

      <p v-if="selected.length < 2"><strong>{{ $t('prompts.displayName') }}</strong> {{ name || $t(defaultDisplayName) }}</p>
      <p v-if="!dir || selected.length > 1"><strong>{{ $t('prompts.size') }}: </strong>
        <span style="direction: ltr; display: inline-block;" id="content_length">{{ humanSize }}</span>
      </p>
			<p v-if="!dir || selected.length == 1"><strong>{{ $t('prompts.type') }}:</strong> {{ type }}</p>
      <p v-if="selected.length < 2"><strong>{{ $t('prompts.lastModified') }}:</strong> {{ humanTime }}</p>
  
      <template v-if="dir && selected.length === 0">
        <p><strong>{{ $t('prompts.numberFiles') }}:</strong> {{ req.numFiles }}</p>
        <p><strong>{{ $t('prompts.numberDirs') }}:</strong> {{ req.numDirs }}</p>
      </template>

      <p v-if="selected.length < 2"><strong>{{ $t('role.owner') }}:</strong> {{ ownerName }}</p>

      <div class="permission-list" v-if="showPermissionList">
        <strong>{{$t('prompts.permissions')}}:</strong>
        <permission-list :id="selectedItem.id"></permission-list>
      </div>
    </div>

    <div class="card-action" :class="direction">
      <button type="submit"
        @click="$store.commit('closeHovers')"
        class="button button--flat"
        :aria-label="$t('buttons.ok')"
        :title="$t('buttons.ok')">{{ $t('buttons.ok') }}</button>
    </div>
  </div>
</template>

<script>
import {mapState, mapGetters} from 'vuex'
import filesize from 'filesize'
import moment from 'moment'
import { files as api, users } from '@/api'
import PermissionList from '../common/PermissionList'

export default {
  name: 'info',
  components: {
    PermissionList
  },
  data: function() {
    return {
      ownerName: ''
    };
  },
  async mounted() {
    const getUser = this.selectedItem.isExternal?users.getExternal:users.get;
    const res = await getUser(this.selectedItem.ownerId);
    this.ownerName = res.user.fullName;
  },
  computed: {
    ...mapState(['req', 'selected']),
    ...mapGetters(['selectedCount', 'isListing', 'shares', 'direction']),
    humanSize: function () {
      if (this.selectedCount === 0 || !this.isListing) {
        return filesize(this.req.size || 0)
      }
      let sum = 0

      for (let selected of this.selected) {
        sum += this.req.items[selected].size || 0
      }

      return filesize(sum)
    },
    humanTime: function () {
      if (this.selectedCount === 0) {
        return moment(this.req.modified).fromNow()
      }

      return moment(this.req.items[this.selected[0]].modified).fromNow()
    },
    name: function () {
      return this.selectedCount === 0 ? this.req.name : this.req.items[this.selected[0]].name
		},
		type: function() {
			return this.selectedCount === 0 ? this.req.type : this.req.items[this.selected[0]].type;
		},
    dir: function () {
      return this.selectedCount > 1 || (this.selectedCount === 0
        ? this.req.isDir
        : this.req.items[this.selected[0]].isDir)
    },
    selectedItem: function() {
      return this.selectedCount > 0 && this.selectedCount < 2 ? this.req.items[this.selected[0]] : this.req;
    },
    showPermissionList: function() {
      return (this.selectedCount > 0 && this.selectedCount < 2) || this.req.id
    },
    defaultDisplayName: function() {
      return this.shares ? 'sidebar.myFiles.titleShared' : 'sidebar.myFiles.title'; 
    }
  },
  methods: {
    checksum: async function (event, algo) {
      event.preventDefault()

      let link

      if (this.selectedCount) {
        link = this.req.items[this.selected[0]].url
      } else {
        link = this.$route.path
      }

      try {
        const hash = await api.checksum(link, algo)
        event.target.innerHTML = hash
      } catch (e) {
        this.$showError(e)
      }
    }
  }
}
</script>
<style scoped>
.permission-list {
  border-top: 1px solid #dadce0;
  padding-top: 16px;
}
</style>
