<template>
  <div class="quota-bar">
    <div class="quota-fill" :style="style"></div>
  </div>
</template>

<script>
export default {
  name: "quota-bar",
  props: ["percentage"],
  computed: {
    style() {
      return {
        width: this.percentage + "%"
      };
    }
  }
};
</script>

<style scoped>
.quota-bar {
  height: 0.2em;
  width: 100%;
  background-color: #33333333;
  border-radius: 0.4em;
}

.quota-fill {
  height: 100%;
  width: 100%;
  background-color: #2979ff;
  border-radius: 0.4em;
}
</style>}