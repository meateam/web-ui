<template>
  <nav :class="navClass">
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
      <div v-if="showCreateUpload">
        <button @click="uploadFolder" class="action" id="upload-folder">
        <i class="material-icons">create_new_folder</i>
        <span>{{ $t('sidebar.uploadFolder') }}</span>
        </button>
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
import buttons from '@/utils/buttons'
import { files as api } from '@/api'
import { checkConflict } from '@/utils/files'
import { signup, disableExternal, noAuth, config, UploadRole } from '@/utils/constants'
import Quota from './quota/Quota'

export default {
  name: 'sidebar',
  components: {
    Quota
  },
  computed: {
    ...mapState([ 'req', 'user', 'quota' ]),
    ...mapGetters([ 'isLogged', 'shares', 'isSearch', 'direction' ]),
    active () {
      return this.$store.state.show === 'sidebar'
    },
    navClass() {
      const isLtr = this.direction === 'ltr' ? true : false;
      const isRtl = this.direction === 'rtl' ? true : false;
      if (isLtr) {
        return {'active': this.$store.state.show === 'sidebar', 'ltr': true};
      }

      if (isRtl) {
        return {'active': this.$store.state.show === 'sidebar', 'rtl': true};
      }
    },
    signup: () => signup,
    supportLink: () => config.supportLink,
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
      if (this.$route.path !== '/files') {
        this.$router.push({path: '/files'});
      }
      this.$store.commit("setReload", true);
    },
    onSharedWithMeClick() {
      this.$store.commit("setShares", true);
      this.$store.commit("changeFolder", '');
      if (this.$route.path !== '/files') {
        this.$router.push({path: '/files'});
      }
      this.$store.commit("setReload", true);
    },
    logout: auth.logout,
    uploadFolder() {
      const b = document.createElement("input");
      b.style.display = "none";
      b.type = "file";
      b.webkitdirectory = "true";
      b.addEventListener("change", this.handleFolderUpload, false);
      b.click();
    },
    async handleFolderUpload(event) {
      const files = event.target.files;
      if (!files || files.length <= 0) {
        return
      }

      buttons.loading('upload');
      let promises = [];
      let progress = new Array(files.length).fill(0);

      let onupload = (id) => (event) => {
        progress[id] = (event.loaded / event.total) * 100

        let sum = 0
        for (let i = 0; i < progress.length; i++) {
          sum += progress[i]
        }

        this.$store.commit('setProgress', Math.ceil(sum / progress.length))
      }
      const createdFolders = {};
      const topFolder = {name: files[0].webkitRelativePath.split('/')[0]}
      const conflicts = checkConflict([topFolder], this.req.items);
      if (conflicts) {
        this.$store.commit('showHover', {
          prompt: 'replace',
          confirm: (event) => {
            event.preventDefault();
            this.$store.commit('closeHovers');
          }
        });
        return
      }

      for (let i = 0; i < files.length; i++) {
        const relativePath = files[i].webkitRelativePath;
        const splittedPath = relativePath.split('/');
        const parentDirectories = splittedPath.slice(0, splittedPath.length - 1);

        // Create dependency folders of the current file.
        for (let j = 0; j < parentDirectories.length; j++) {
          // Create folder if not created yet, under the previous folder.
          const path = parentDirectories.slice(0, j + 1).join('/');
          if (!createdFolders[path]) {
            const folderName = parentDirectories[j];
            const parentID = j == 0 ? this.$store.getters.currentFolder.id : createdFolders[parentDirectories.slice(0, j).join('/')]
            try {
              // eslint-disable-next-line
              createdFolders[path] = await api.uploadFolder(parentID, folderName, () => console.log("Uploading folder"));
            } catch (e) {
              this.$showError(e);
            }
          }
        }

        promises.push(api.post(createdFolders[parentDirectories.slice(0, parentDirectories.length).join('/')], files[i], onupload(i)));
      }

      let finish = () => {
        buttons.success('upload');
        this.$store.commit('setProgress', 0);
      };

      Promise.all(promises)
        .then(() => {
          finish()
          this.$store.commit('setReload', true)
        })
        .catch(error => {
          finish()
          this.$showError(error)
        });
    }
  }
}
</script>
<style scoped>
.selected {
  background-color: rgba(0, 0, 0, .1);
}
</style>
