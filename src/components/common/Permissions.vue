<template>
    <div>
        <user-button v-for="user in users" :user="user" :key="user.id"></user-button>
    </div>
</template>
<script>
import {files} from '@/api'
import UserButton from '../buttons/User';

export default {
  name: "permissions",
  props: ["id"],
  components: {
    UserButton
  },
  data: function () {
    return {
      users: []
    }
  },
  mounted() {
    // TODO: get user's details from each file permissions.
    this.users = await files.getPermissions(this.id);
  }
};
</script>