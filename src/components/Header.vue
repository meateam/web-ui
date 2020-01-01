<template>
  <header>
    <div>
      <button @click="openSidebar" :aria-label="$t('buttons.toggleSidebar')" :title="$t('buttons.toggleSidebar')" class="action">
        <i class="material-icons">menu</i>
      </button>
      <img @click="redirectToMain" :src="logoURL" :class="direction" alt="File Browser">
      <search class="search" :class="direction" v-if="isLogged"></search>
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
import { logoURL, UploadRole, DownloadRole, DeleteRole, RenameRole, ShareRole, MoveRole } from '@/utils/constants'
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
      return this.isListing && UploadRole(this.req.role) && this.selectedCount === 0
    },
    showSaveButton () {
      return this.isEditor
    },
    showDownloadButton () {
      // Show only if one file selected and the selected file is not a folder.
      return this.isFiles && this.selectedCount === 1 && ! this.req.items[this.selected[0]].isDir && DownloadRole(this.req.items[this.selected[0]].role);
    },
    showDeleteButton () {
      if (this.isFiles) {
        if (this.isListing) {
          if (this.selectedCount === 0) {
            // Can't delete a file that is being shared with you directly.
            if (this.req.permission && this.req.permission.id !== this.req.id) {
              return false;
            }
            
            return this.req.id && DeleteRole(this.req.role);
          } else {
            // Can't delete a file that is being shared with you directly.
            if (this.req.items[this.selected[0]].permission &&
                this.req.items[this.selected[0]].permission.id !== this.req.items[this.selected[0]].id) {
              return false;
            }

            return DeleteRole(this.req.items[this.selected[0]].role);
          }
        } else {
          return this.req.items && DeleteRole(this.req.items[this.selected[0]].role);
        }
      }

      return false;
    },
    showRenameButton () {
      if (this.isFiles) {
        if (this.isListing) {
          if (this.selectedCount === 0) {
            return this.req.id && RenameRole(this.req.role);
          } else {
            return this.selectedCount === 1 && RenameRole(this.req.items[this.selected[0]].role);
          }
        } else {
          return this.req.items && RenameRole(this.req.items[this.selected[0]].role);
        }
      }

      return false;
    },
    showShareButton () {
      if (this.isFiles) {
        if (this.isListing) {
         if (this.selectedCount === 0) {
            return this.req.id && ShareRole(this.req.role);
          } else {
            return this.selectedCount === 1 && ShareRole(this.req.items[this.selected[0]].role);
          }
        } else {
          return this.req.items && ShareRole(this.req.items[this.selected[0]].role);
        }
      }

      return false;
    },
    showMoveButton () {
      if (this.isFiles) {
        if (this.isListing) {
         if (this.selectedCount === 0) {
            return this.req.id && MoveRole(this.req.role);
          } else {
            return this.selectedCount > 0 && MoveRole(this.req.items[this.selected[0]].role);
          }
        } else {
          return this.req.items && MoveRole(this.req.items[this.selected[0]].role);
        }
      }

      return false;
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
<style scoped>
  .search.ltr {
    margin-left: 13em;
    width: 75%;
  }

  .search.rtl {
    margin-right: 13em;
    width: 75%;
  }
</style>
