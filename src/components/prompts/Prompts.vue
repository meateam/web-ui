<template>
  <div>
    <help v-if="showHelp" ></help>
    <download v-else-if="showDownload"></download>
    <new-file v-else-if="showNewFile"></new-file>
    <new-dir v-else-if="showNewDir"></new-dir>
    <new-dir v-else-if="showNewDoc"></new-dir>
    <rename v-else-if="showRename"></rename>
    <delete v-else-if="showDelete"></delete>
    <info v-else-if="showInfo"></info>
    <move v-else-if="showMove"></move>
    <copy v-else-if="showCopy"></copy>
    <replace v-else-if="showReplace"></replace>
    <share v-else-if="show === 'share'"></share>
    <div v-show="showOverlay" @click="resetPrompts" class="overlay"></div>
  </div>
</template>

<script>
import Help from './Help'
import Info from './Info'
import Delete from './Delete'
import Rename from './Rename'
import Download from './Download'
import Move from './Move'
import Copy from './Copy'
import NewFile from './NewFile'
import NewDir from './NewDir'
import NewDoc from './NewDoc'
import Replace from './Replace'
import Share from './Share'
import { mapState } from 'vuex'
import buttons from '@/utils/buttons'

export default {
  name: 'prompts',
  components: {
    Info,
    Delete,
    Rename,
    Download,
    Move,
    Copy,
    Share,
    NewFile,
    NewDir,
    NewDoc,
    Help,
    Replace
  },
  data: function () {
    return {
      pluginData: {
        buttons,
        'store': this.$store,
        'router': this.$router
      }
    }
  },
  mounted() {
    window.addEventListener("keydown", this.keyEvent);
  },
  beforeDestroy() {
    window.removeEventListener("keydown", this.keyEvent);
  },
  computed: {
    ...mapState(['show', 'plugins']),
    showInfo: function () { return this.show === 'info' },
    showHelp: function () { return this.show === 'help' },
    showDelete: function () { return this.show === 'delete' },
    showRename: function () { return this.show === 'rename' },
    showMove: function () { return this.show === 'move' },
    showCopy: function () { return this.show === 'copy' },
    showNewFile: function () { return this.show === 'newFile' },
    showNewDir: function () { return this.show === 'newDir' },
    showNewDoc: function () { return this.show === 'newDoc' },
    showDownload: function () { return this.show === 'download' },
    showReplace: function () { return this.show === 'replace' },
    showOverlay: function () {
      return (this.show !== null && this.show !== 'search' && this.show !== 'more')
    }
  },
  methods: {
    resetPrompts () {
      this.$store.commit('closeHovers');
    },
    keyEvent(event) {
      event.stopPropagation();
      if(event.key === "Escape") this.resetPrompts();
    }
  }
}
</script>
