<template>
  <span id="user-button">
    <div v-show="nameExists" class="action" @click="toggleUser" :aria-label="$t('buttons.user')" :title="$t('buttons.user')">
      <div>{{ nameLetters }}</div>
      <span>{{ $t('buttons.user') }}</span>
    </div>
    <div :class="{'fade-on': userToggled}" class="speech-bubble fade">
        {{$t('header.signedAs')}}&nbsp;
        <span class="bold-name">{{ fullName }}</span>
    </div>
  </span>
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
    toggleUser: function () {
      this.userToggled = !this.userToggled;
      if(this.userToggledTimeout) clearTimeout(this.userToggledTimeout);
      this.userToggledTimeout = setTimeout(() => this.userToggled = false, 2000);
    }
  }
};
</script>
