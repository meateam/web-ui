<template>
  <div v-if="req.items.length == 0">
    <h2 class="message">
      <i class="material-icons">sentiment_dissatisfied</i>
      <span>{{ $t('files.lonely') }}</span>
    </h2>
    <input style="display:none" type="file" id="upload-input" @change="uploadInput($event)" multiple>
  </div>
  <div v-else id="listing"
    :class="user.viewMode"
    @dragenter="dragEnter"
    @dragend="dragEnd">
    <div>
      <div class="item header">
        <div></div>
        <div>
          <p :class="{ active: nameSorted() }" class="name"
            role="button"
            tabindex="0"
            @click="sort('name')"
            :title="$t('files.sortByName')"
            :aria-label="$t('files.sortByName')">
            <span>{{ $t('files.name') }}</span>
            <i class="material-icons">{{ nameIcon() }}</i>
          </p>
          <p :class="{ active: sizeSorted() }" class="size"
            role="button"
            tabindex="0"
            @click="sort('size')"
            :title="$t('files.sortBySize')"
            :aria-label="$t('files.sortBySize')">
            <span>{{ $t('files.size') }}</span>
            <i class="material-icons">{{ sizeIcon() }}</i>
          </p>
          <p :class="{ active: modifiedSorted() }" class="modified"
            role="button"
            tabindex="0"
            @click="sort('modified')"
            :title="$t('files.sortByLastModified')"
            :aria-label="$t('files.sortByLastModified')">
            <span>{{ $t('files.lastModified') }}</span>
            <i class="material-icons">{{ modifiedIcon() }}</i>
          </p>
        </div>
      </div>
    </div>

    <h2 :class="direction" v-if="req.numDirs > 0">{{ $t('files.folders') }}</h2>
    <div v-if="req.numDirs > 0">
      <item v-for="(item) in dirs"
        :key="base64(item.name)"
        v-bind:index="item.index"
        v-bind:name="item.name"
        v-bind:id="item.id"
        v-bind:isDir="item.isDir"
        v-bind:url="item.url"
        v-bind:modified="item.modified"
        v-bind:type="item.type"
        v-bind:size="item.size"
        @contextmenu.prevent="$refs.menu.open($event, {file: item})">
      </item>
    </div>

    <h2 :class="direction" v-if="req.numFiles > 0">{{ $t('files.files') }}</h2>
    <div v-if="req.numFiles > 0">
      <item v-for="(item) in files"
        :key="base64(item.name)"
        v-bind:index="item.index"
        v-bind:name="item.name"
        v-bind:isDir="item.isDir"
        v-bind:id="item.id"
        v-bind:modified="item.modified"
        v-bind:type="item.type"
        v-bind:size="item.size"
        v-bind:class="{external: item.isExternal}"
        @contextmenu.prevent="$refs.menu.open($event, {file: item})">
      </item>
    </div>
    <vue-context ref="menu">
      <template slot-scope="child" v-if="child.data">
        <li>
          <a class="pointer" @click.prevent="showInfo(child.data.file)">
            <i class="material-icons context-icon">info</i> {{ $t('buttons.info') }}
          </a>
        </li>
        <li v-if="canPreview(child.data.file)">
          <a class="pointer" @click.prevent="preview(child.data.file)">
            <i class="material-icons context-icon">picture_as_pdf</i> {{$t('buttons.preview')}}
          </a>
        </li>
        <li v-if="showDownloadButton(child.data.file)">
          <a class="pointer" @click.prevent="download(child.data.file)">
            <i class="material-icons context-icon">file_download</i> {{$t('buttons.download')}}
          </a>
        </li>
        <li v-if="showDeleteButton(child.data.file)">
          <a class="pointer" @click.prevent="deleteFile(child.data.file)">
            <i class="material-icons context-icon">delete</i> {{$t('buttons.delete')}}
          </a>
        </li>
        <li v-if="showShareButton(child.data.file)">
          <a class="pointer" @click.prevent="showShare(child.data.file)">
            <i class="material-icons context-icon">share</i> {{$t('buttons.share')}}
          </a>
        </li>
        <li v-if="showMoveButton(child.data.file)">
          <a class="pointer" @click.prevent="showMove(child.data.file)">
            <i class="material-icons rtl context-icon">forward</i> {{$t('buttons.move')}}
          </a>
        </li>
        <li v-if="showRenameButton(child.data.file)">
          <a class="pointer" @click.prevent="showRename(child.data.file)">
            <i class="material-icons context-icon">mode_edit</i> {{$t('buttons.rename')}}
          </a>
        </li>
      </template>
    </vue-context>

    <input style="display:none" type="file" id="upload-input" @change="uploadInput($event)" multiple>

    <div :class="{ active: $store.state.multiple }" id="multiple-selection">
    <p>{{ $t('files.multipleSelectionEnabled') }}</p>
      <div @click="$store.commit('multiple', false)" tabindex="0" role="button" :title="$t('files.clear')" :aria-label="$t('files.clear')" class="action">
        <i class="material-icons">clear</i>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapState, mapMutations } from 'vuex';
import VueContext from 'vue-context';
import 'vue-context/dist/css/vue-context.css';

import Item from './ListingItem'
import css from '@/utils/css'
import { files as api } from '@/api'
import buttons from '@/utils/buttons'
import { checkConflict } from '@/utils/files'
import {
  checkMimeType,
  checkDocumentPreview,
  DownloadRole,
  DeleteRole,
  RenameRole,
  ShareRole,
  MoveRole
} from '@/utils/constants';

export default {
  name: 'listing',
  components: { Item, VueContext },
  watch: {
    req: function() {
      this.refreshItems();
    }
  },
  data: function () {
    return {
      show: 50,
      dirs: [],
      files: [],
      sorting: {by: 'name', asc: true}
    }
  },
  computed: {
    ...mapGetters(['direction', 'shares']),
    ...mapState(['req', 'selected', 'user'])
  },
  mounted: function () {
    this.refreshItems()
    // Check the columns size for the first time.
    this.resizeEvent()

    // Add the needed event listeners to the window and document.
    window.addEventListener('keydown', this.keyEvent)
    window.addEventListener('resize', this.resizeEvent)
    window.addEventListener('scroll', this.scrollEvent)
    document.addEventListener('dragover', this.preventDefault)
    document.addEventListener('drop', this.drop)
  },
  beforeDestroy () {
    // Remove event listeners before destroying this page.
    window.removeEventListener('keydown', this.keyEvent)
    window.removeEventListener('resize', this.resizeEvent)
    window.removeEventListener('scroll', this.scrollEvent)
    document.removeEventListener('dragover', this.preventDefault)
    document.removeEventListener('drop', this.drop)
  },
  methods: {
    ...mapMutations([ 'updateUser', 'addSelected', 'resetSelected' ]),
    refreshItems: function() {
      this.dirs = [];
      this.files = [];
      
      this.req.items.forEach((item) => {
        if (item.isDir) {
          this.dirs.push(item)
        } else {
          this.files.push(item)
        }
      });
    },
    nameSorted: function() {
      return (this.sorting.by === 'name')
    },
    sizeSorted: function() {
      return (this.sorting.by === 'size')
    },
    modifiedSorted: function() {
      return (this.sorting.by === 'modified')
    },
    ascOrdered: function() {
      return this.sorting.asc
    },
    nameIcon: function() {
      if (this.nameSorted() && this.ascOrdered()) {
        return 'arrow_downward'
      }

      return 'arrow_upward'
    },
    sizeIcon () {
      if (this.sizeSorted() && this.ascOrdered()) {
        return 'arrow_downward'
      }

      return 'arrow_upward'
    },
    modifiedIcon () {
      if (this.modifiedSorted() && this.ascOrdered()) {
        return 'arrow_downward'
      }

      return 'arrow_upward'
    },
    base64: function (name) {
      return window.btoa(unescape(encodeURIComponent(name)))
    },
    keyEvent (event) {
      if (!event.ctrlKey && !event.metaKey) {
        return
      }

      let key = String.fromCharCode(event.which).toLowerCase()

      switch (key) {
        case 'f':
          event.preventDefault()
          this.$store.commit('showHover', 'search')
          break
        case 'c':
        case 'x':
          this.copyCut(event, key)
          break
        case 'v':
          this.paste(event)
          break
      }
    },
    preventDefault (event) {
      // Wrapper around prevent default.
      event.preventDefault()
    },
    copyCut (event, key) {
      if (event.target.tagName.toLowerCase() === 'input') {
        return
      }

      let items = []

      for (let i of this.selected) {
        items.push({
          from: this.req.items[i].url,
          name: encodeURIComponent(this.req.items[i].name)
        })
      }

      if (items.length == 0) {
        return
      }

      this.$store.commit('updateClipboard', {
        key: key,
        items: items
      })
    },
    paste (event) {
      if (event.target.tagName.toLowerCase() === 'input') {
        return
      }

      let items = []

      for (let item of this.$store.state.clipboard.items) {
        const from = item.from.endsWith('/') ? item.from.slice(0, -1) : item.from
        const to = this.$route.path + item.name
        items.push({ from, to })
      }

      if (items.length === 0) {
        return
      }

      if (this.$store.state.clipboard.key === 'x') {
        api.move(items).then(() => {
          this.$store.commit('setReload', true)
        }).catch(e => this.$showError(e))
        return
      }

      api.copy(items).then(() => {
        this.$store.commit('setReload', true)
      }).catch(e => this.$showError(e))
    },
    resizeEvent () {
      // Update the columns size based on the window width.
      let columns = Math.floor(document.querySelector('main').offsetWidth / 300)
      let items = css(['#listing.mosaic .item', '.mosaic#listing .item'])
      if (columns === 0) columns = 1
      items.style.width = `calc(${100 / columns}% - 1em)`
    },
    scrollEvent () {
      if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
        this.show += 50
      }
    },
    dragEnter () {
      if (this.shares) return;
      // When the user starts dragging an item, put every
      // file on the listing with 50% opacity.
      let items = document.getElementsByClassName('item')

      Array.from(items).forEach(file => {
        file.style.opacity = 0.5
      })
    },
    dragEnd () {
      if (this.shares) return;
      this.resetOpacity()
    },
    drop: function (event) {
      if (this.shares) return;
      event.preventDefault()
      this.resetOpacity()

      let dt = event.dataTransfer
      let files = dt.files
      let el = event.target

      if (files.length <= 0) return

      for (let i = 0; i < 5; i++) {
        if (el !== null && !el.classList.contains('item')) {
          el = el.parentElement
        }
      }

      let base = ''
      if (el !== null && el.classList.contains('item') && el.dataset.dir === 'true') {
        base = el.dataset.id;
      }

      if (base !== '') {
        api.fetch(base)
          .then(req => {
            this.checkConflict(files, req.items, base)
          })
          .catch(e => this.$showError(e))
        return
      }

      this.checkConflict(files, this.req.items, this.$store.getters.currentFolder.id);
    },
    checkConflict (files, items, base) {
      const conflict = checkConflict(files, items, base);
      if (!conflict) {
        this.handleFiles(files, base)
        return
      }

      this.$store.commit('showHover', {
        prompt: 'replace',
        confirm: (event) => {
          event.preventDefault();
          this.$store.commit('closeHovers');
        }
      })
    },
    uploadInput (event) {
      this.checkConflict(event.currentTarget.files, this.req.items, this.$store.getters.currentFolder.id);
      event.currentTarget.value=""; // resets file choice
    },
    resetOpacity () {
      let items = document.getElementsByClassName('item')

      Array.from(items).forEach(file => {
        file.style.opacity = 1
      })
    },
    handleFiles (files, base) {
      buttons.loading('upload')
      let promises = []
      let progress = new Array(files.length).fill(0)

      let onupload = (id) => (event) => {
        progress[id] = (event.loaded / event.total) * 100

        let sum = 0
        for (let i = 0; i < progress.length; i++) {
          sum += progress[i]
        }

        this.$store.commit('setProgress', Math.ceil(sum / progress.length))
      }

      for (let i = 0; i < files.length; i++) {
        promises.push(api.post(base, files[i], onupload(i)));
      }

      let finish = () => {
        buttons.success('upload')
        this.$store.commit('setProgress', 0)
      }

      Promise.all(promises)
        .then(() => {
          finish()
          this.$store.commit('setReload', true)
        })
        .catch(error => {
          finish()
          this.$showError(error)
        })

      return false
    },
    sort (by) {
      const sorting = {by, asc: false};

      switch (by) {
        case 'name': {
          sorting.asc = this.nameIcon() === 'arrow_upward';
          
          if (sorting.asc) {
            this.dirs.sort((dirA, dirB) => dirA.name.localeCompare(dirB.name));
            this.files.sort((fileA, fileB) => fileA.name.localeCompare(fileB.name));
          } else {
            this.dirs.sort((dirA, dirB) => dirB.name.localeCompare(dirA.name));
            this.files.sort((fileA, fileB) => fileB.name.localeCompare(fileA.name));
          }

          break;
        }
        case 'size': {
          sorting.asc = this.sizeIcon() === 'arrow_upward';
          
          if (sorting.asc) {
            this.dirs.sort((dirA, dirB) => dirA.size - dirB.size);
            this.files.sort((fileA, fileB) => fileA.size - fileB.size);
          } else {
            this.dirs.sort((dirA, dirB) => dirB.size - dirA.size);
            this.files.sort((fileA, fileB) => fileB.size - fileA.size);
          }
          
          break;
        }
        case 'modified': {
          sorting.asc = this.modifiedIcon() === 'arrow_upward';
          
          if (sorting.asc) {
            this.dirs.sort((dirA, dirB) => dirA.modified - dirB.modified);
            this.files.sort((fileA, fileB) => fileA.modified - fileB.modified);
          } else {
            this.dirs.sort((dirA, dirB) => dirB.modified - dirA.modified);
            this.files.sort((fileA, fileB) => fileB.modified - fileA.modified);
          }

          break;
        }
      }

      this.sorting = sorting;
    },
    showInfo: function (file) {
      this.resetSelected();
      this.addSelected(file.index);
      this.$store.commit('showHover', 'info');
    },
    showDownloadButton (file) {
      return !file.isDir && DownloadRole(file.role);
    },
    showDeleteButton (file) {
      // Can't delete a file that is being shared with you directly.
      if (file.permission && file.permission.fileID !== file.id) {
        return false;
      }

      return DeleteRole(file.role);
    },
    showRenameButton (file) {
      return RenameRole(file.role);
    },
    showShareButton (file) {
      return ShareRole(file.role);
    },
    showMoveButton (file) {
      return MoveRole(file.role);
    },
    download: function (file) {
      api.download([file.id]);
    },
    deleteFile: async function (file) {
      this.resetSelected();
      this.addSelected(file.index);
      this.$store.commit('showHover', 'delete');
    },
    showShare: function (file) {
      this.resetSelected();
      this.addSelected(file.index);
      this.$store.commit('showHover', 'share');
    },
    showMove: function (file) {
      this.resetSelected();
      this.addSelected(file.index);
      this.$store.commit('showHover', 'move');
    },
    showRename: function (file) {
      this.resetSelected();
      this.addSelected(file.index);
      this.$store.commit('showHover', 'rename');
    },
    canPreview: function (file) {
      return checkMimeType(file.type) || checkDocumentPreview(file.type);
    },
    preview: function (file) {
      this.$store.commit('pushFolder', { id: file.id, name: file.name });
      this.$store.commit('setReload', true);

      return;
    }
  }
}
</script>
