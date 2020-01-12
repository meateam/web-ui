<template>
    <button @click="changeShare">
        <i class="material-icons">content_copy</i>
        <span>{{ regularShare ? $t('buttons.shareExternal') : $t('buttons.shareInternal') }}</span>
    </button>
</template>

<script>
export default {
  name: 'change-share-button',
  methods: {
    show: function () {
      this.$store.commit('setShareType')
    }
  }
}
</script>