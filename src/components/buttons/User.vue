<template>
  <div @click="toggleUser" class="action">
    <div>
      {{user.firstName[0] + user.lastName[0]}}
    </div>
    <div :class="{'fade-on':userToggled}" class="speech-bubble fade">{{$t('header.signedAs')}}&nbsp;<span class="bold-name">{{user.firstName + " " + user.lastName}}</span></div>
  </div>
</template>

<script>
export default {
  name: "user-button",
  props: ["user"],
  data: function () {
    return {
      userToggled: false,
      userToggledTimeout: null
    }
  },
  methods: {
    toggleUser: function() {
      this.userToggled = !this.userToggled;
      if(this.userToggledTimeout) clearTimeout(this.userToggledTimeout);
      this.userToggledTimeout = setTimeout(() => this.userToggled = false, 2000);
    }
  }
};
</script>

<style scoped>
div {
  padding: 0.4em;
}
span {
  display: initial !important
}
</style>
