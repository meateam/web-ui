<template>
  <div class="card floating">
    <div class="card-title">
      <h2>{{ $t('prompts.newDir') }}</h2>
    </div>

    <div class="card-content">
      <p>{{ $t('prompts.newDirMessage') }}</p>
      <input class="input input--block" type="text" @keyup.enter="submit" v-model.trim="name" v-focus>
    </div>

    <div class="card-action">
      <button
        class="button button--flat button--grey"
        @click="$store.commit('closeHovers')"
        :aria-label="$t('buttons.cancel')"
        :title="$t('buttons.cancel')"
      >{{ $t('buttons.cancel') }}</button>
      <button
        class="button button--flat"
        :aria-label="$t('buttons.create')"
        :title="$t('buttons.create')"
        @click="submit"
      >{{ $t('buttons.create') }}</button>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { files as api } from '@/api'

export default {
  name: 'new-dir',
  data: function() {
    return {
      name: ''
    };
  },
  computed: {
    ...mapGetters([ 'isFiles', 'isListing', 'currentFolder' ])
  },
  methods: {
    submit: async function(event) {
      event.preventDefault()

      let folderName = this.name;
      let currentFolderId = this.$store.getters.currentFolder.id;

      try {
        await api.uploadFolder(currentFolderId, folderName, () => console.log("Uploading folder"));
        this.$store.commit('setReload', true)
      } catch (e) {
        this.$showError(e);
      }
      this.$store.commit('closeHovers')
    }
  }
};
</script>

