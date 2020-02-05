<template>
  <div class="dialog">
    <b style="color:white">{{ $t("exShare.dangerAlert.header") }}</b>
    <br />
    <b style="color:white">{{ $t("exShare.dangerAlert.message") }}</b>
    <br />
    <br />
    <b style="color:white">{{ $t("exShare.dangerAlert.finish") }}</b>
    <br />
    <br />
    <b> </b>
    <div>
      <button class="dialog-button right-button" @click="onAgreeClick">
        {{ $t("exShare.dangerAlert.agree") }}
      </button>
      <button class="dialog-button left-button" @click="onDisagreeClick">
        {{ $t("exShare.dangerAlert.disagree") }}
      </button>
    </div>
  </div>
</template>
<script>
export default {
  methods: {
    onAgreeClick() {
        this.$emit("finish-agree", { value: true });
    },
    onDisagreeClick() {
        this.$emit("finish-agree", { value: false });
    }
  }
};
</script>
<style>
.dialog {
  background-color: red;
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
  background: #99ccff;
  color: black;
  border: 1px solid rgba(0, 0, 0, 0.05);
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.05);
  transition: 0.1s ease all;
  user-select: none;
}

.dialog-button:hover {
  background-color: var(--dark-blue);
}
</style>
