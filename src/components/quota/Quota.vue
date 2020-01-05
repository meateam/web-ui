<template>
  <div id="quota">
    <quota-bar :percentage="quotaPercentage"></quota-bar>
    <quota-details :quota="quota"></quota-details>
  </div>
</template>

<script>
import QuotaBar from "./QuotaBar";
import QuotaDetails from "./QuotaDetails";

export default {
  name: "quota",
  props: ["quota"],
  components: {
    QuotaBar,
    QuotaDetails
  },
  computed: {
    quotaPercentage() {
      let percent = (this.quota.used / this.quota.limit) * 100;
      percent = isNaN(percent) ? 0 : percent;
      return Number(percent.toFixed(2));
    }
  }
};
</script>

<style scoped>
#quota {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: space-between;
  padding: 1em;
}
</style>