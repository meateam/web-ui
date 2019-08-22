<template>
  <div id="quota" :title="quotaPercentage">
    <quota-bar :percentage="quota"></quota-bar>
    <quota-details :percentage="quota"></quota-details>
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
      return this.quota + "%";
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