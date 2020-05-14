<template>
  <div class="step3">
    <div>
      <div>
        <i class="material-icons blink" v-tooltip="$t('exShare.addInfoInfo')">info</i>
      </div>
      <h3>{{ $t("exShare.headerTS") }}</h3>
    </div>
    <div class="card-content">
      <textarea @input="onInput" id="infoText" class="textbox" rows="4" cols="50"></textarea>
    </div>
    <form>
      <p>{{ $t("exShare.chooseClass") }}</p>
      <select @change="onInput" id="classSelect">
        <option v-bind:key="c" v-for="c in classifications">{{ c }}</option>
      </select>
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

select {
  background-color: aliceblue;
}
textarea {
  max-height: 500px;
  min-height: 50px;
  min-width: 300px;
  max-width: 100%;
  padding: 5px;
  background-color: aliceblue;
  border-radius: 5px;
}
i {
  cursor: default;
}
</style>
