<template>
  <div v-bind:style="{direction: direction}">
    <router-view></router-view>
  </div>
</template>

<script>
import {mapGetters} from 'vuex'
export default {
  name: 'app',
  computed: {
    ...mapGetters(['direction'])
  },
  mounted () {
    const loading = document.getElementById('loading')
    loading.classList.add('done')

    setTimeout(function () {
      loading.parentNode.removeChild(loading)
    }, 200)
  }
}
</script>

<style>
@import './css/styles.css';
</style>
