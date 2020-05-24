<template>
  <div v-bind:style="{direction: direction}">
    <router-view></router-view>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import io from "socket.io-client";
import { socketURL } from "@/utils/constants";

export default {
  name: "app",
  computed: {
    ...mapGetters(["direction"])
  },
  mounted() {
    const loading = document.getElementById("loading");
    loading.classList.add("done");
    io(`${socketURL}/configuration`, { query: { token: this.$store.state.jwt } }).on(
      "refresh",
      () => {
        location.reload();
      }
    );

    setTimeout(function() {
      loading.parentNode.removeChild(loading);
    }, 200);
  }
};
</script>

<style>
@import "./css/styles.css";
</style>
