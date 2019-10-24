<template>
  <div class="list">
    <div class="item" v-for="user in usersToDisplay" :key="user.id" v-tooltip.bottom="user.label">
      <div>{{user.letters}}</div>
    </div>
  </div>
</template>
<script>
import { files } from "@/api";
import UserButton from "../buttons/User";
import VTooltip from "v-tooltip";

const roles = {
  1: "owner",
  3: "read"
};
export default {
  name: "permission-list",
  props: ["id"],
  components: {
    UserButton,
    VTooltip
  },
  data: function() {
    return {
      users: [],
      usersToDisplay: []
    };
  },
  async mounted() {
    // TODO: get user's details from each file permissions.
    const users = await files.getPermissions(this.id);
    for (let i = 0; i < users.length; i++) {
      users[i].letters = users[i].userID[0] + users[i].userID[1];
      users[i].label = `user ${users[i].userID} has ${roles[users[i].role]} permission`;

      if (this.usersToDisplay.length < 6) {
        this.usersToDisplay.push(users[i]);
      }
    }
  },
  methods: {
    letters() {
      return this.users;
    }
  }
};
</script>

<style scoped>
.list {
  display: block;
  height: 32px;
  margin-top: 16px;
  min-height: 32px;
  padding: 0 16px 0 0;
  height: 48px;
  position: relative;
}

.item {
  display: inline-block;
  border-radius: 16px;
  height: 32px;
  overflow: hidden;
  position: relative;
  width: 32px;
  text-align: center;
  color: #fff;
  font-size: 16px;
  line-height: 32px;
  vertical-align: middle;
  background-color: #42a5f5;
  cursor: pointer;
  margin-right: 8px;
}
</style>