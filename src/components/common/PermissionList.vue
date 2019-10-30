<template>
  <div class="list">
    <div class="item" v-for="user in usersToDisplay" :key="user.userID" v-tooltip.bottom="user.label">
      <div>{{user.letters}}</div>
    </div>
    <div v-if="extraUsers.length > 0" class="item extra-permissions" v-tooltip.bottom="extraUsersTooltip">
      <div>+{{extraUsers.length}}</div>
    </div>
  </div>
</template>
<script>
import { files, users } from "@/api";
import VTooltip from "v-tooltip";

const roles = {
  1: "owner",
  3: "read"
};
export default {
  name: "permission-list",
  props: ["id"],
  components: {
    VTooltip
  },
  data: function() {
    return {
      users: [],
      usersToDisplay: []
    };
  },
  computed: {
    extraUsers() {
      return this.users.length > 6 ? this.users.slice(6) : [];
    },
    extraUsersTooltip() {
      // Switch direction for hebrew.
      if (this.$i18n.locale === "he") {
        return `${this.$t("buttons.morePlural")} +${this.extraUsers.length}`
      }

      return `+${this.extraUsers.length} ${this.$t("buttons.morePlural")}`;
    }
  },
  async mounted() {
    // TODO: get user's details from each file permissions.
    this.users = await files.getPermissions(this.id);
    for (let i = 0; i < this.users.length; i++) {
      const user = (await users.get(this.users[i].userID)).user;
      this.users[i].letters = (user.firstName[0] + user.lastName[0]).toUpperCase();
      this.users[i].label = `user ${user.fullName} has ${roles[this.users[i].role]} permission`;

      if (this.usersToDisplay.length < 6) {
        this.usersToDisplay.push(this.users[i]);
      }
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
  -webkit-font-smoothing: antialiased;
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

.item.extra-permissions {
  display: inline-block;
  color: #616161;
  border: 2px solid rgba(0,0,0,0.2);
  border-radius: 16px;
  box-sizing: border-box;
  height: 32px;
  width: 32px;
  position: relative;
  text-align: center;
  background-color: #fff;
}

.item.extra-permissions > div {
  font-size: 13px;
  line-height: 28px;
}
</style>