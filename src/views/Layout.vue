<template>
  <div>
    <div id="progress">
      <div v-bind:style="{ width: $store.state.progress + '%' }"></div>
    </div>
    <site-header></site-header>
    <sidebar></sidebar>
    <main :class="direction">
      <router-view></router-view>
      <img :src="plusURL" class="plusButton" @click="upload" alt="Italian Trulli" />
    </main>
    <prompts></prompts>
  </div>
</template>

<script>
import { mapState, mapGetters } from "vuex";
import Sidebar from "@/components/Sidebar";
import Prompts from "@/components/prompts/Prompts";
import SiteHeader from "@/components/Header";
import { plusURL } from "@/utils/constants";

export default {
  name: "layout",
  components: {
    Sidebar,
    SiteHeader,
    Prompts
  },
  computed: {
    ...mapGetters(["isLogged", "direction"]),
    ...mapState(["user"]),
    plusURL: () => plusURL
  },
  watch: {
    $route: function() {
      this.$store.commit("resetSelected");
      this.$store.commit("multiple", false);
      if (this.$store.state.show !== "success") this.$store.commit("closeHovers");
    }
  },
  methods: {
    upload: function() {
      document.getElementById("upload-input").click();
    }
  }
};
</script>
<style scoped>
.plusButton {
  -webkit-border-radius: 50%;
  border-radius: 50%;
  border: none;
  bottom: 24px;
  cursor: pointer;
  height: 56px;
  position: fixed;
  left: 24px;
  width: 56px;
  z-index: 2;
  -webkit-transform: scale(0.8);
  -webkit-transition-duration: 0.5s;
  opacity: 0.7;
  margin: 0 10px 5px 0;
}

.plusButton:hover {
  -webkit-transform: scale(1.1);
  box-shadow: 0px 0px 30px gray;
  opacity: 1;
}
</style>>