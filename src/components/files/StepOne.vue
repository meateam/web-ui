<template>
  <div class="step1">
    <div class="space-between">
      <p>{{ $t("exShare.SOHeader") }}:</p>
      <i class="material-icons blink" v-tooltip="$t('exShare.chooseExUsersInfo')">info</i>
    </div>

    <autocomplete :isExternal="external" v-on:onSelect="addExUser($event)"></autocomplete>

    <div v-bind:key="exUser.id" v-for="exUser in externalUsers" class="user-exshare">
      <div>{{ exUser.hierarchy }} : {{ exUser.full_name }}</div>
      <div @click="removeExUser(exUser.id)">
        <i class="material-icons">delete</i>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations, mapGetters } from "vuex";
import Autocomplete from "../shared/Autocomplete";

export default {
  components: {
    Autocomplete
  },
  props: ["clickedNext", "currentStep"],
  data() {
    return {
      selected: "",
      externalUsers: [],
      external: true
    };
  },
  computed: {
    ...mapGetters(["getGlobalExternalUsers"]),
    ...mapState(["globalExternalUsers"]),
    ...mapMutations([
      "emptyGlobalExternalUsers",
      "addGlobalExternalUser",
      "removeGlobalExternalUser"
    ])
  },
  activated: function() {
    if (this.$store.getters.getGlobalExternalUsers == 0) {
      this.$emit("can-continue", { value: false });
    } else {
      this.$emit("can-continue", { value: true });
    }
  },
  methods: {
    addExUser(user) {
      if (user.value && user.value.id) {
        if (this.checkExists(user.value.id)) {
          return;
        }
      }
      this.$store.commit("addGlobalExternalUser", user.value);
      this.externalUsers.push(user);
      this.$emit("can-continue", { value: true });
    },
    removeExUser(id) {
      this.externalUsers = this.externalUsers.filter(exUser => {
        return exUser.id != id;
      });
      this.$store.commit("removeGlobalExternalUser", id);
      if (this.externalUsers == 0) {
        this.$emit("can-continue", { value: false });
      }
    },
    checkExists(id) {
      if (!id) {
        return false;
      }
      return this.externalUsers.some(user => user.id === id);
    }
  }
};
</script>
<style scoped>
.user-exshare {
  display: flex;
  margin: 10px;
  justify-content: space-between;
}

.step1 {
  margin: 10px;
}

.material-icons:hover {
  color: crimson;
  cursor: pointer;
}
</style>
