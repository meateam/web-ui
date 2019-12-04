<template>
  <header>
    <div>
      <button @click="openSidebar" :aria-label="$t('buttons.toggleSidebar')" :title="$t('buttons.toggleSidebar')" class="action">
        <i class="material-icons">menu</i>
      </button>
      <img @click="redirectToMain" :src="logoURL" :class="direction" alt="File Browser">
      <search v-if="isLogged"></search>
    </div>
    <div>
      <template v-if="isLogged">
        <button @click="openSearch" :aria-label="$t('buttons.search')" :title="$t('buttons.search')" class="search-button action">
          <i class="material-icons">search</i>
        </button>

        <button v-show="showSaveButton" :aria-label="$t('buttons.save')" :title="$t('buttons.save')" class="action" id="save-button">
          <i class="material-icons">save</i>
        </button>

        <button @click="openMore" id="more" :aria-label="$t('buttons.more')" :title="$t('buttons.more')" class="action">
          <i class="material-icons">more_vert</i>
        </button>

        <!-- Menu that shows on listing AND mobile when there are files selected -->
        <div id="file-selection" v-if="isMobile && isListing">
          <span v-if="selectedCount > 0">{{ selectedCount }} selected</span>
          <share-button v-show="showShareButton"></share-button>
          <rename-button v-show="showRenameButton"></rename-button>
          <!-- <copy-button v-show="showCopyButton"></copy-button> -->
          <move-button v-show="showMoveButton"></move-button>
          <delete-button v-show="showDeleteButton"></delete-button>
        </div>

        <!-- This buttons are shown on a dropdown on mobile phones -->
        <div id="dropdown" :class="{ active: showMore }">
          <div v-if="!isListing || !isMobile">
            <share-button v-show="showShareButton"></share-button>
            <rename-button v-show="showRenameButton"></rename-button>
            <!-- <copy-button v-show="showCopyButton"></copy-button> -->
            <move-button v-show="showMoveButton"></move-button>
            <delete-button v-show="showDeleteButton"></delete-button>
          </div>

          <switch-button v-show="isListing"></switch-button>
          <download-button v-show="showDownloadButton"></download-button>
          <upload-button v-show="showUpload"></upload-button>
          <info-button v-show="isFiles"></info-button>
          <select-button v-show="isListing"></select-button>
          <user-button :user="user"></user-button>
        </div>
      </template>

      <div v-show="showOverlay" @click="resetPrompts" class="overlay"></div>
    </div>
  </header>
</template>

<script>
import Search from './Search'
import InfoButton from './buttons/Info'
import DeleteButton from './buttons/Delete'
import RenameButton from './buttons/Rename'
import UploadButton from './buttons/Upload'
import DownloadButton from './buttons/Download'
import SwitchButton from './buttons/SwitchView'
import MoveButton from './buttons/Move'
// import CopyButton from './buttons/Copy'
import ShareButton from './buttons/Share'
import UserButton from './buttons/User';
import SelectButton from './buttons/Select';
import {mapGetters, mapState} from 'vuex'
import { logoURL } from '@/utils/constants'
import * as api from '@/api'
import buttons from '@/utils/buttons'

export default {
  name: 'header-layout',
  components: {
    Search,
    InfoButton,
    DeleteButton,
    ShareButton,
    RenameButton,
    DownloadButton,
    // CopyButton,
    UploadButton,
    SwitchButton,
    MoveButton,
    UserButton,
    SelectButton
  },
  data: function () {
    return {      
      width: window.innerWidth,
      pluginData: {
        api,
        buttons,
        'store': this.$store,
        'router': this.$router
      }
    }
  },
  created () {
    window.addEventListener('resize', () => {
      this.width = window.innerWidth
    })
  },
  computed: {
    ...mapGetters([
      'selectedCount',
      'isFiles',
      'isEditor',
      'isListing',
      'isLogged',
      'shares',
      'currentFolder',
      'direction'
    ]),
    ...mapState([
      'req',
      'user',
      'loading',
      'reload',
      'multiple',
      'selected'
    ]),
    logoURL: () => logoURL,
    isMobile () {
      return this.width <= 736
    },
    showUpload () {
      return this.isListing && !this.shares && this.selectedCount === 0
    },
    showSaveButton () {
      return this.isEditor
    },
    showDownloadButton () {
      // Show only if one file selected and the selected file is not a folder.
      return this.isFiles && this.selectedCount === 1 && ! this.req.items[this.selected[0]].isDir;
    },
    showDeleteButton () {
      return this.isFiles && (this.isListing
        ? (this.selectedCount !== 0)
        : true) && ((this.shares && this.currentFolder.id == '') || !this.shares)
    },
    showRenameButton () {
      return this.isFiles && (this.isListing
        ? (this.selectedCount === 1)
        : true) && !this.shares
    },
    showShareButton () {
      return this.isFiles && (this.isListing
        ? (this.selectedCount === 1)
        : true) && !this.shares
    },
    showMoveButton () {
      return this.isFiles && (this.isListing
        ? (this.selectedCount > 0)
        : true) && !this.shares
    },
    showCopyButton () {
      return this.isFiles && (this.isListing
        ? (this.selectedCount > 0)
        : true)
    },
    showMore () {
      return this.isFiles && this.$store.state.show === 'more'
    },
    showOverlay () {
      return this.showMore
    }
  },
  methods: {
    openSidebar () {
      this.$store.commit('showHover', 'sidebar')
    },
    openMore () {
      this.$store.commit('showHover', 'more')
    },
    openSearch () {
      this.$store.commit('showHover', 'search')
    },
    openSelect () {
      this.$store.commit('multiple', true)
      this.resetPrompts()
    },
    resetPrompts () {
      this.$store.commit('closeHovers')
    },
    redirectToMain() {
      this.$router.push({path: '/files'});
      this.$store.commit('changeFolder', '');
      this.$store.commit('setReload', true);
    }
  }
}
</script>
