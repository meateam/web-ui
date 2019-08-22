<template>
  <div class="quota-usage-container">
      {{`${$t('quota.usage')}: ${percentage}%`}}
  </div>
</template>

<script>
export default {
  name: "quota-details",
  props: ["percentage"]
};
</script>

<style scoped>
.quota-usage-container {
  color: #333333d0;
  font-size: 0.8em;
  margin-top: 0.5em;
}
</style>
