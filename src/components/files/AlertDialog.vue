<template>
  <div class="dialog">
    <div class="warning-message">
      <div class="warning-header">
        <i class="material-icons" id="warning-icon">error</i>
        <br />
        <b style="font-size: 34px;">{{ $t("exShare.dangerAlert.header") }}</b>
      </div>
      <div>
        <p class="warning-bold">{{ $t("exShare.dangerAlert.message.beginning1") }}</p>
        <p class="warning-bold">{{ $t("exShare.dangerAlert.message.beginning2") }}</p>
        <ol>
          <li> {{ $t("exShare.dangerAlert.message.line1") }} </li>
          <li> {{ $t("exShare.dangerAlert.message.line2") }} </li>
          <li> {{ $t("exShare.dangerAlert.message.line3") }} </li>
          <li> {{ $t("exShare.dangerAlert.message.line4") }} </li>
          <li> {{ $t("exShare.dangerAlert.message.line5") }} </li>
          <li> {{ $t("exShare.dangerAlert.message.line6") }} </li>
        </ol>
      </div>
    </div>
    <div class="my-checkbox">
      <input @click="onChecked($event)" type="checkbox" id="acceptTerms" class="actualCheckbox" v-model="acceptTerms">
      <b>{{ $t("exShare.dangerAlert.terms") }}</b>
    </div>
    <br />
    <br />
    <b> </b>
    <div class="alert-buttons">
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
  background: #EEEEEE;
  color: black;
  border: 1px solid rgba(0, 0, 0, 0.05);
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.05);
  transition: 0.1s ease all;
  user-select: none;
}

.dialog-button:hover {
  background-color: lightgrey;
}

.dialog-button:disabled {
  border: 1px solid #999999;
  background-color: #dddddd;
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

.warning-header b {
  font-size: 21px;
  text-align: center;
}

.alert-buttons .dialog-button {
  width: 110px;
}

.my-checkbox {
  display: inline-flex;
}

.my-checkbox > b{
  margin: -4px 4px;
}

.warning-message , .my-checkbox {
  color: white;
}

.warning-bold {
  font-weight:600;
  padding-top: .1rem;
}

</style>
