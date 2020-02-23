<template>
  <div class="list">
    <div class="item" v-for="user in usersToDisplay" :key="user.id" 
      v-tooltip.bottom="$t('status.message', { user: user.fullName, status: i18nuserRole(user) })"
    >
      <permit-object :user="user"></permit-object>
    </div>
    <div v-if="extraUsers.length > 0" class="item extra-permissions" v-tooltip.bottom="extraUsersTooltip">
      <div>+{{extraUsers.length}}</div>
    </div>
  </div>
</template>
<script>
import { files, users } from "@/api";
import PermitObject from './PermitObject'

export default {
  name: "permit-list",
  props: ["id"],
  components: {
    PermitObject
  },
  data: function() {
    return {
      users: [],
      usersToDisplay: []
    };
  },
  computed: {
    extraUsers() {
      // return this.users.length > 6 ? this.users.slice(6) : [];
      return [];
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
    const promises = [];
    const permits = await files.getPermits(this.id);
    const permitsMap = {};
    for (let i = 0; i < permits.length; i++) {
      permitsMap[permits[i].userId] = permits[i];
      const res = await users.getExternal(permits[i].userId);
      res.user.status = files.simplifyStatus(permits[i].status);
      promises.push(res);
    }

    try {
      this.users = (await Promise.all(promises))
        .filter(res => !!res && !!res.user && res.user.firstName && res.user.lastName && res.user.fullName)
        .map(res => {
          res.user.letters = (res.user.firstName[0] + res.user.lastName[0]).toUpperCase();
          res.user.status = files.simplifyStatus(permitsMap[res.user.id].status);
          return res.user;
        });
      this.usersToDisplay = this.users;
      // eslint-disable-next-line
    } catch(err) {}
  },
  methods: {
    i18nuserRole(user) {
      return this.$t(`status.${user.status.toLowerCase()}`);
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
  overflow-x: auto;
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