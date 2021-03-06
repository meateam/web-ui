<template>
  <div class="list">
    <div class="item" v-for="user in usersToDisplay" :key="user.id" v-tooltip.bottom="$t('role.permission', { user: user.fullName, role: i18nuserRole(user) })">
      <div>{{user.letters}}</div>
    </div>
    <div 
      v-if="extraUsers.length > 0" 
      class="item extra-permissions" 
      v-tooltip.bottom="extraUsersTooltip"
      @click.stop ="$refs.menu.open ($event, { users: extraUsers })"
    >
      <div>+{{extraUsers.length}}</div>
    </div>
    <vue-context ref="menu">
      <template>
        <li v-for="user in extraUsers" :key="user.id" >
            <a style="display: flex">
              <div class="item">
                <div>{{user.letters}}</div>
              </div>
              <div>
                {{user.fullName}}<br> 
                <span>{{$t(i18nuserRole(user))}}</span>
              </div></a>
        </li>
      </template>
    </vue-context>
  </div>
</template>
<script>

/* eslint-disable */ 

import { files, users } from "@/api";
import VueContext from 'vue-context';
import 'vue-context/dist/css/vue-context.css';

export default {
  name: "permission-list",
  props: ["id"],
  components: {VueContext},
  data: function() {
    return {
      users: [],
      usersToDisplay: []
    };
  },
  computed: {
    extraUsers() {
      return this.users.length > 6 ? this.users.splice(6) : [];
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
    const permissions = await files.getPermissions(this.id);
    const permissionsMap = {};
    for (let i = 0; i < permissions.length; i++) {
      permissionsMap[permissions[i].userID] = permissions[i];
      promises.push(users.get(permissions[i].userID));
    }

    try {
      this.users = (await Promise.all(promises))
        .filter(res => !!res && !!res.user && res.user.firstName && res.user.lastName && res.user.fullName)
        .map(res => {
          res.user.letters = (res.user.firstName[0] + res.user.lastName[0]).toUpperCase();
          res.user.role = permissionsMap[res.user.id].role;

          return res.user;
        });
      this.usersToDisplay = this.users;
      // eslint-disable-next-line
    } catch(err) {}
  },
  methods: {
    i18nuserRole(user) {
      return this.$t(`role.${user.role.toLowerCase()}`);
    },
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
  margin-left: 8px;
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

ul.v-context {
  right: 155px;
  top: 345px !important;
  width: 250px;
  max-height: 200px;
}

ul.v-context > li >a {
  padding: 8px 10px;
  font-size: 15px;
}

ul.v-context > li > a  span {
  font-size: 12px;
}

ul.v-context .item {
  font-size: 30px;
  border-radius: 20px;
  height: 40px;
  width: 40px;
  font-size: 16px;
  line-height: 40px;  
  margin-top: -3px;
}
</style>