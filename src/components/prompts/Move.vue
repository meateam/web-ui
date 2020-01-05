<template>
  <div class="card floating">
    <div class="card-title">
      <h2>{{ $t('prompts.move') }}</h2>
    </div>

    <div class="card-content">
      <tabs :onSelect="onTabSelect" :defaultIndex="initialIndex">
        <tab :title="$t('sidebar.myFiles.title')">
          <file-list
            ref="myFilesList"
            :path="myFilesPath"
            :id="myFilesFileListID"
            :shares="false"
            @update:selected="val => myFilesDest = val">
            </file-list>
        </tab>
        <tab :title="$t('sidebar.sharedFiles')">
          <file-list
            ref="sharesFileList"
            :path="sharesFilesPath"
            :id="sharesFilesFileListID"
            :shares="true"
            @update:selected="val => sharesFilesDest = val">
            </file-list>
        </tab>
      </tabs>
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
      myFilesDest: {},
      sharesFilesDest: {},
      myFilesPath: initialRootPath,
      sharesFilesPath: initialRootPath,
      currentTabIndex: myFilesTabIndex,
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
    const isPopPath = !this.isListing || this.selectedCount === 0;

    if (this.shares) {
      this.currentTabIndex = sharedFilesTabIndex;
      if (isPopPath) {
        this.sharesFilesFileListID = this.req.parent || '';
      } else {
        this.sharesFilesFileListID = this.$store.getters.currentFolder.id;
      }
      this.sharesFilesPath = [...this.path];
      if (isPopPath) {
        this.sharesFilesPath.pop();
      }
    } else {
      this.currentTabIndex = myFilesTabIndex;
      if (isPopPath) {
        this.myFilesFileListID = this.req.parent || '';
      } else {
        this.myFilesFileListID = this.$store.getters.currentFolder.id;
      }
      this.myFilesPath = [...this.path];
      if (isPopPath) {
        this.myFilesPath.pop();
      }
    }
  },
  methods: {
    isSharesIndex() {
      return this.currentTabIndex === sharedFilesTabIndex;
    },
    currentFileList() {
      return this.isSharesIndex() ? this.$refs.sharesFileList : this.$refs.myFilesList;
    },
    currentDest() {
      return this.isSharesIndex() ? this.sharesFilesDest : this.myFilesDest;
    },
    move: async function (event) {
      event.preventDefault();
      buttons.loading('move');
      let items = [];

      if (this.selected.length > 0) {
        for (let item of this.selected) {
          items.push(this.req.items[item].id);
        }
      } else {
        items.push(this.req.id);
      }

      try {
        let failed = await api.move(items, this.currentDest().dest.id);
        failed = JSON.parse(failed);
        const successfulUpdateCount = items.length - ((failed && failed.length) || 0);
        if (successfulUpdateCount !== items.length) {
          const failedCount = items.length - successfulUpdateCount;
          throw new Error(`failed to move ${failedCount} item${failedCount > 1 ? 's' : ''}`);
        }

        buttons.success('move');
        if (this.currentDest().path.findIndex(path => path.id === this.currentDest().dest.id) < 0) {
          this.$store.commit('setPath', this.currentDest().path.concat([this.currentDest().dest]));
        } else {
          this.$store.commit('setPath', this.currentDest().path);
        }

        this.$store.commit('setShares', this.isSharesIndex());
        this.$store.commit('setReload', true);
      } catch (e) {
        buttons.done('move');
        this.$showError(e);
      }
    },
    disableMove() {
      let items = [];

      if (this.selected.length > 0) {
        for (let item of this.selected) {
          items.push(this.req.items[item].id);
        }
      } else {
        items.push(this.req.id);
      }

      if (this.currentDest().dest) {
        if (this.isSharesIndex() && this.currentDest().dest.id === '') {
          return true;
        }

        for (let i = 0; i < items.length; i++) {
          if (items[i] === this.currentDest().dest.id) {
            return true;
          }
        }
      }

      return false;
    },
    onTabSelect(_, index) {
      const currentFileList = this.currentFileList();
      const path = [...currentFileList.parents];
      const id = currentFileList.current.id;
      
      path.push({...currentFileList.current});

      if (this.currentTabIndex === myFilesTabIndex) {
        this.myFilesPath = path;
        this.myFilesFileListID = id;
      } else if (this.currentTabIndex === sharedFilesTabIndex) {
        this.sharesFilesPath = path;
        this.sharesFilesFileListID = id;
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
<style scoped>
.card-content {
  padding-top: 0 !important;
}
.card>div:first-child {
  padding-bottom: 0 !important;
}
</style>
