<template>
  <div class="card floating">
    <div class="card-title">
      <h2>{{ $t('prompts.move') }}</h2>
    </div>

    <div class="card-content">
      <file-list @update:selected="val => dest = val"></file-list>
    </div>

    <div :class="direction" class="card-action">
      <button class="button button--flat button--grey"
        @click="$store.commit('closeHovers')"
        :aria-label="$t('buttons.cancel')"
        :title="$t('buttons.cancel')">{{ $t('buttons.cancel') }}</button>
      <button class="button button--flat"
        @click="move"
        :disabled="$store.getters.currentFolder.id === dest.dest"
        :aria-label="$t('buttons.move')"
        :title="$t('buttons.move')">{{ $t('buttons.move') }}</button>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex'
import FileList from './FileList'
import { files as api } from '@/api'
import buttons from '@/utils/buttons'

export default {
  name: 'move',
  components: { FileList },
  data: function () {
    return {
      current: window.location.pathname,
      dest: {}
    }
  },
  computed: {
    ...mapGetters(['direction']),
    ...mapState(['req', 'selected', 'path']),
  },
  methods: {
    move: async function (event) {
      event.preventDefault()
      buttons.loading('move')
      let items = []

      for (let item of this.selected) {
        items.push(this.req.items[item].id)
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
    }
  }
}
</script>
