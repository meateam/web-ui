<template>
  <div class="card floating">
    <div class="card-title">
      <h2>{{ $t('prompts.move') }}</h2>
    </div>

    <div class="card-content">
      <tabs :onSelect="onTabSelect" :defaultIndex="initialIndex">
        <tab :title="$t('sidebar.myFiles.title')"></tab>
        <tab :title="$t('sidebar.sharedFiles')"></tab>
      </tabs>
      <file-list
        ref="fileList"
        :path="fileListPath"
        :id="currentFileListID"
        :shares="isSharesIndex()"
        @update:selected="val => dest = val"></file-list>
    </div>

    <div :class="direction" class="card-action">
      <button class="button button--flat button--grey"
        @click="$store.commit('closeHovers')"
        :aria-label="$t('buttons.cancel')"
        :title="$t('buttons.cancel')">{{ $t('buttons.cancel') }}</button>
      <button class="button button--flat"
        @click="move"
        :disabled="disableMove()"
        :aria-label="$t('buttons.move')"
        :title="$t('buttons.move')">{{ $t('buttons.move') }}</button>
    </div>
  </div>
</template>

<script>
const myFilesTabIndex = 0;
const sharedFilesTabIndex = 1;
const initialRootPath = [{id: '', name: ''}];

import { mapGetters, mapState } from 'vuex'
import { Tabs, Tab } from 'vue-slim-tabs';
import FileList from './FileList'
import { files as api } from '@/api'
import buttons from '@/utils/buttons'

export default {
  name: 'move',
  components: { FileList, Tabs, Tab },
  data: function () {
    return {
      current: window.location.pathname,
      dest: {},
      myFilesPath: initialRootPath,
      sharesFilesPath: initialRootPath,
      fileListPath: initialRootPath,
      currentTabIndex: myFilesTabIndex,
      currentFileListID: '',
      myFilesFileListID: '',
      sharesFilesFileListID: '',
    }
  },
  computed: {
    ...mapGetters(['direction', 'isListing', 'shares', 'selectedCount']),
    ...mapState(['req', 'selected', 'path']),
    initialIndex() {
      return this.shares ? sharedFilesTabIndex : myFilesTabIndex;
    }
  },
  mounted: function () {
    this.fileListPath = [...this.path];
    const isPopPath = !this.isListing || this.selectedCount === 0;
    if (isPopPath) {
      this.fileListPath.pop();
    }

    if (this.shares) {
      this.currentTabIndex = sharedFilesTabIndex;
      if (isPopPath) {
        this.sharesFilesFileListID = this.req.parent || '';
      } else {
        this.sharesFilesFileListID = this.$store.getters.currentFolder.id;
      }
      this.sharesFilesPath = this.fileListPath;
      this.currentFileListID = this.sharesFilesFileListID;
    } else {
      this.currentTabIndex = myFilesTabIndex;
      if (isPopPath) {
        this.myFilesFileListID = this.req.parent || '';
      } else {
        this.myFilesFileListID = this.$store.getters.currentFolder.id;
      }
      this.myFilesPath = this.fileListPath;
      this.currentFileListID = this.myFilesFileListID;
    }
  },
  methods: {
    isSharesIndex() {
      return this.currentTabIndex === sharedFilesTabIndex;
    },
    move: async function (event) {
      event.preventDefault()
      buttons.loading('move')
      let items = []

      if (this.selected.length > 0) {
        for (let item of this.selected) {
          items.push(this.req.items[item].id)
        }
      } else {
        items.push(this.req.id);
      }

      try {
        let failed = await api.move(items, this.dest.dest.id);
        failed = JSON.parse(failed);
        const successfulUpdateCount = items.length - ((failed && failed.length) || 0);
        if (successfulUpdateCount !== items.length) {
          const failedCount = items.length - successfulUpdateCount;
          throw new Error(`failed to move ${failedCount} item${failedCount > 1 ? 's' : ''}`);
        }

        buttons.success('move');
        if (this.dest.path.findIndex(path => path.id === this.dest.dest.id) < 0) {
          this.$store.commit('setPath', this.dest.path.concat([this.dest.dest]));
        } else {
          this.$store.commit('setPath', this.dest.path);
        }

        this.$store.commit('setReload', true);
      } catch (e) {
        buttons.done('move');
        this.$showError(e);
      }

      event.preventDefault();
    },
    disableMove() {
      if ((!this.isListing || this.selected.length === 0) && this.dest.dest) {
        return this.req.id == this.dest.dest.id;
      } else {
        return this.$store.getters.currentFolder.id === this.dest.dest;
      }
    },
    async onTabSelect(_, index) {
      const path = [...this.dest.path];
      const id = this.$refs.fileList.current.id
      
      if (this.$refs.fileList.selected == null) {
        path.push({...this.dest.dest});
      }

      if (this.currentTabIndex === myFilesTabIndex) {
        this.myFilesPath = path;
        this.myFilesFileListID = id;
      } else if (this.currentTabIndex === sharedFilesTabIndex) {
        this.sharesFilesPath = path;
        this.sharesFilesFileListID = id;
      }

      if (this.currentTabIndex != index) {

        if (index === myFilesTabIndex) {
          this.fileListPath = this.myFilesPath;
          this.currentFileListID = this.myFilesFileListID;
        } else if (index === sharedFilesTabIndex) {
          this.fileListPath = this.sharesFilesPath;
          this.currentFileListID = this.sharesFilesFileListID;
        }
      }

      this.currentTabIndex = index;
    }
  }
}
</script>
<style src="vue-slim-tabs/themes/default.css"></style>
<style>
.vue-tablist {
  padding-right: 0;
  padding-left: 0;
}
</style>
