<template>
  <div v-bind:style="{direction: direction}">
    <router-view></router-view>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import io from "socket.io-client";
// import { baseURL } from "@/utils/constants";

export default {
  name: "app",
  computed: {
    ...mapGetters(["direction"])
  },
  mounted() {
    const loading = document.getElementById("loading");
    loading.classList.add("done");
    // io(`${baseURL}/configuration`).on("refresh", () => {
    io(`http://localhost:3000/configuration`).on("refresh", () => {
      location.reload();
    });

    setTimeout(function() {
      loading.parentNode.removeChild(loading);
    }, 200);
  }
};
</script>

<style>
@import "./css/styles.css";
</style>
