<template>
  <div v-show="nameExists" @click="toggleUser" class="action">
    <div>{{nameLetters}}</div>
    <div :class="{'fade-on':userToggled}" class="speech-bubble fade">
      {{$t('header.signedAs')}}&nbsp;
      <span class="bold-name">{{fullName}}</span>
    </div>
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
  computed: {
    nameExists: function () {
      return this.user.firstName && this.user.lastName;
    },
    fullName: function () {
      return this.user.firstName + " " + this.user.lastName;
    },
    nameLetters: function () {
      return this.user.firstName[0] + this.user.lastName[0];
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
