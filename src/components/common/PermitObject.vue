<template>
    <div v-tooltip.bottom="$t('status.message', { user: user.fullName, status: i18nuserRole(user) })"
    v-bind:class="classObject" >
        <div>{{user.letters}}</div>
    </div>
</template>
<script>

export default {
  name: "permit-object",
  props: ["user"],
  components: {},
  data: function() {
    return {
    };
  },
  computed: {
    classObject: function () {
      const simpleStatus = {
        approved: false,
        sending: false,
        pending: false,
        denied: false
      };
      switch(this.user.status) {
        case "denied":
            simpleStatus.denied = true;
            break;
        case "failed":
            simpleStatus.denied = true;
            break;
        case "sending":
          simpleStatus.sending = true;
          break;
        case "passed":
          simpleStatus.approved = true;
          break;
        default:
          simpleStatus.pending = true;
      }
      return simpleStatus;
    }
  },
  methods: {
    i18nuserRole(user) {
      return this.$t(`status.${user.status.toLowerCase()}`);
    }
  }
};
</script>


<style scoped>

.pending {
  background-color: #8e9398;
}

.sending {
  background-color: #FFB300;
}

.denied {
  background-color: #FF7043;
}

.approved {
  background-color: #00C853;
}

</style>