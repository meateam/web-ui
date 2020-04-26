<template>
  <div>
    <div id="progress">
      <div v-bind:style="{ width: $store.state.progress + '%' }"></div>
    </div>
    <site-header></site-header>
    <sidebar></sidebar>
    <main :class="direction">
      <router-view></router-view>
    </main>
    <prompts></prompts>
    <plus-button></plus-button>
  </div>
</template>

<script>
import { mapState, mapGetters } from "vuex";
import Sidebar from "@/components/Sidebar";
import Prompts from "@/components/prompts/Prompts";
import SiteHeader from "@/components/Header";
import PlusButton from "@/components/buttons/Plus";

export default {
  name: "layout",
  components: {
    Sidebar,
    SiteHeader,
    Prompts,
    PlusButton
  },
  computed: {
    ...mapGetters(["isLogged", "direction"]),
    ...mapState(["user"])
  },
  watch: {
    $route: function() {
      this.$store.commit("resetSelected");
      this.$store.commit("multiple", false);
      if (this.$store.state.show !== "success")
        this.$store.commit("closeHovers");
    }
  }
};
</script>
