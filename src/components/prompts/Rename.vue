<template>
  <div class="card floating">
    <div class="card-title">
      <h2>{{ $t('prompts.rename') }}</h2>
    </div>

    <div class="card-content">
      <p>{{ $t('prompts.renameMessage') }} <code>{{ oldName() }}</code>:</p>
      <input class="input input--block" v-focus type="text" @keyup.enter="submit" v-model.trim="name">
    </div>

    <div :class="direction" class="card-action">
      <button class="button button--flat button--grey"
        @click="$store.commit('closeHovers')"
        :aria-label="$t('buttons.cancel')"
        :title="$t('buttons.cancel')">{{ $t('buttons.cancel') }}</button>
      <button @click="submit"
        class="button button--flat"
        type="submit"
        :aria-label="$t('buttons.rename')"
        :title="$t('buttons.rename')">{{ $t('buttons.rename') }}</button>
    </div>
  </div>
</template>

<script>
import { mapMutations, mapState, mapGetters } from 'vuex'
import { files as api } from '@/api'

export default {
  name: 'rename',
  data: function () {
    return {
      name: ''
    }
  },
  created () {
    this.name = this.oldName()
  },
  computed: {
    ...mapMutations(['renameFolder']),
    ...mapState(['req', 'selected', 'path']),
    ...mapGetters(['isListing', 'selectedCount', 'direction'])
  },
  methods: {
    cancel: function () {
      this.$store.commit('closeHovers');
    },
    oldName: function () {
      if (this.selectedCount > 1) {
        // This shouldn't happen.
        return;
      }

      if (!this.isListing) {
        return this.req.name;
      }

      if (this.selectedCount === 0) {
        return this.req.name;
      }

      return this.req.items[this.selected[0]].name;
    },
    submit: async function () {
      const id = this.isListing && this.selectedCount !== 0 ? this.req.items[this.selected[0]].id : this.req.id;

      try {
        await api.rename(id, this.name);

        if (!this.isListing || this.selectedCount === 0) {
          // Update file name in path.
          this.$store.commit('renameFolder', { id, name: this.name });
        }

        // Update file name in listing.
        this.$store.commit('setReload', true);
      } catch (e) {
        this.$showError(e);
      }

      this.$store.commit('closeHovers');
    }
  }
}
</script>
