<template>
  <div class="action">
    <div>
      {{user.firstName[0] + user.lastName[0]}}
      </div>
  </div>
</template>

<script>
export default {
  name: "user-button",
  props: ["user"],

};
</script>

<style scoped>
div {
  padding: 0.4em;
}
</style>
