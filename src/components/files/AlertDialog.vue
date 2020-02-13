<template>
  <div class="dialog">
    <div class="warning-header">
      <i class="material-icons" id="warning-icon">warning</i>
      <br />
      <b style="font-size: 34px; color:white">{{ $t("exShare.dangerAlert.header") }}</b>
    </div>
    <b style="color:white">{{ $t("exShare.dangerAlert.message") }}</b>
    <br />
    <br />
    <div class="myCheckbox">
      <input @click="onChecked($event)" type="checkbox" id="acceptTerms" class="actualCheckbox" v-model="acceptTerms">
      <b style="color:white">{{ $t("exShare.dangerAlert.finish") }}</b>
    </div>
    <br />
    <br />
    <b> </b>
    <div>
      <button class="dialog-button left-button" :disabled='!agreedToTerms' @click="onAgreeClick">
        {{ $t("exShare.dangerAlert.agree") }}
      </button>
      <button class="dialog-button right-button" @click="onDisagreeClick">
        {{ $t("exShare.dangerAlert.disagree") }}
      </button>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      checked: false,
      acceptTerms: false
    };
  },
  methods: {
    onAgreeClick() {
        this.$emit("finish-agree", { value: true });
    },
    onDisagreeClick() {
        this.$emit("finish-agree", { value: false });
    },
    onChecked(event) {
      this.checked = event.target.checked;
    }
  },
  computed: {
    agreedToTerms() {
      return this.acceptTerms;
    }
  }
};
</script>
<style>
.dialog {
  background-color: #ee4034;
  max-width: 600px;
  border-radius: 8px;
  padding: 1.5em;
}

.right-button {
  color: var(--dark-blue);
  background: transparent;
  border-radius: 10px;
  box-shadow: 0 0 0;
  border: 0;
  text-transform: uppercase;
}

.left-button {
  float: left;
  background-color: white;
}

.dialog-button {
  border-radius: 0.2em;
  outline: 0;
  border: 0;
  padding: 0.5em 1em;
  cursor: pointer;
  background: lightgray;
  color: black;
  border: 1px solid rgba(0, 0, 0, 0.05);
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.05);
  transition: 0.1s ease all;
  user-select: none;
}

.dialog-button:hover {
  background-color: darkgrey;
}

.dialog-button:disabled {
  border: 1px solid #999999;
  background-color: #cccccc;
  color: #666666;
}

.warning-header {
  text-align: center;
  padding-bottom: 20px;
}

#warning-icon {
  font-size: 100px;
  color: white;
}
</style>
