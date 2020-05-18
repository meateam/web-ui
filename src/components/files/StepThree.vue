<template>
  <div class="step3">
    <div class="space-between">
      <p>{{ $t("exShare.headerTS") }}</p>
      <i class="material-icons blink" v-tooltip="$t('exShare.addInfoInfo')">info</i>
    </div>
    <div class="card-content">
      <b-input @input="onInput" id="infoText" maxlength="200" type="textarea"></b-input>
    </div>
    <form>
      <p>{{ $t("exShare.chooseClass") }}</p>
      <b-select class="select" @change="onInput" id="classSelect">
        <option v-bind:key="c" v-for="c in classifications">{{ c }}</option>
      </b-select>
      <p v-if="isTopSecret === true" style="color: red">{{ $t("exShare.classErrMessage") }}</p>
    </form>
  </div>
</template>

<script>
import { mapMutations, mapGetters } from "vuex";

export default {
  data() {
    return {
      text: "",
      classifications: this.$t("exShare.classifications"),
      classTopSecret: this.$t("exShare.classTopSecret"),
      isTopSecret: false
    };
  },
  computed: {
    ...mapGetters(["getStepThreeRes"]),
    ...mapMutations(["setStepThreeRes"])
  },
  methods: {
    onInput() {
      const info = document.getElementById("infoText").value;
      const classification = document.getElementById("classSelect").value;
      this.$store.commit("setStepThreeRes", { info, classification });
      this.isTopSecret = classification === this.classTopSecret;
      if (!this.isTopSecret) {
        this.$emit("can-continue", { value: true });
      } else {
        this.$emit("can-continue", { value: false });
      }
    }
  }
};
</script>

<style>
.step3 {
  margin: 10px;
}
.select {
  background-color: aliceblue;
  float: right;
}
</style>
