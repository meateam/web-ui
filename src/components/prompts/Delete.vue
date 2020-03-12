<template>
  <div class="card floating">
    <div class="card-content">
      <p v-if="req.kind !== 'listing' && selectedCount < 2">{{ $t('prompts.deleteMessageSingle') }}</p>
      <p v-else>{{ $t('prompts.deleteMessageMultiple', { count: selectedCount}) }}</p>
    </div>
    <div :class="direction" class="card-action">
      <button @click="$store.commit('closeHovers')"
        class="button button--flat button--grey"
        :aria-label="$t('buttons.cancel')"
        :title="$t('buttons.cancel')">{{ $t('buttons.cancel') }}</button>
      <button @click="submit"
        class="button button--flat button--red"
        :aria-label="$t('buttons.delete')"
        :title="$t('buttons.delete')">{{ $t('buttons.delete') }}</button>
    </div>
  </div>
</template>

<script>
import {mapGetters, mapMutations, mapState} from 'vuex'
import { files as api } from '@/api'
import buttons from '@/utils/buttons'

export default {
  name: 'delete',
  computed: {
    ...mapGetters(['isListing', 'selectedCount', 'shares', 'direction']),
    ...mapState(['req', 'selected', 'path', 'user'])
  },
  methods: {
    ...mapMutations(['closeHovers']),
    submit: async function () {
      this.closeHovers()
      buttons.loading('delete')

      try {
        if (!this.isListing) {
          await api.remove(this.req.id);
          buttons.success('delete');
          const currentIndex = this.path.findIndex(path => path.id === this.req.id);
          const id = this.path[currentIndex > 0 ? currentIndex - 1 : 0].id;
          this.$store.commit('changeFolder', id);
          if (this.$route.path !== `/files${id ? `/${id}` : ''}`) {
            this.$router.push({path: `/files${id ? `/${id}` : ''}`});
          }
          this.$store.commit('setReload', true);
          return
        }

        let promises = [];
        if (this.selectedCount === 0) {
          promises.push(api.remove(this.req.id));
        } else {
          for (let index of this.selected) {
            promises.push(api.remove(this.req.items[index].id));
          }
        }

        await Promise.all(promises);
        buttons.success('delete');
        if (this.selectedCount === 0) {
          const currentIndex = this.path.findIndex(path => path.id === this.req.id);
          const id = this.path[currentIndex > 0 ? currentIndex - 1 : 0].id;
          this.$store.commit('changeFolder', id);
          if (this.$route.path !== `/files${id ? `/${id}` : ''}`) {
            this.$router.push({path: `/files${id ? `/${id}` : ''}`});
          }
        }
        this.$store.commit('setReload', true);
      } catch (e) {
        buttons.done('delete')
        this.$showError(e)
        if (this.isListing) this.$store.commit('setReload', true)
      }
    }
  }
}
</script>
