<template>
  <div class="list">
    <div v-for="user in users" :key="user.userID" class="item">
      <span class="user-info">
        <span>{{user.fullName}} </span>
        <p>{{user.hierarchyFlat}}</p>
      </span>
      <template v-if="isUserFileOwner(user)">
        <span class="user-info">
          <span>{{owner.fullName}} </span>
          <p>{{owner.hierarchyFlat}}</p>
        </span>
        <span class="owner-label">
          {{$t('role.owner')}}
        </span>
      </template>
      <span
        v-else-if="isDirectPermission(user)"
        class="delete-permission"
        @click="deletePermission(user)"
        :aria-label="$t('buttons.deletePermission')"
        :title="$t('buttons.deletePermission')">
          <i class="material-icons">delete</i>
      </span>
    </div>
  </div>
</template>
<script>
import {mapState, mapGetters} from 'vuex'
import { files, users } from "@/api";
import { Roles } from '@/utils/constants';

export default {
    name: "edit-permission-list",
    props: ["id"],
    data: function() {
    return {
      users: [],
      owner: {},
      userPermissions: {},
    };
  },
  async mounted() {
    await this.onMount();
  },
  computed: {
    ...mapState(['req', 'selected']),
    ...mapGetters(['selectedCount', 'userID'])
  },
  methods: {
    deletePermission: async function(user) {
      await files.unShare(this.id, user.id);
      if (this.userID != user.id) {
        await this.onMount();
      } else {
        this.users.splice(this.users.findIndex(u => u.id == user.id), 1);
      }
    },
    onMount: async function() {
      const permissions = await files.getPermissions(this.id);
      let ownerID = '';
      let promises = [];
      for (let i = 0; i < permissions.length; i++) {
        if (permissions[i].role === Roles.owner) {
          ownerID = permissions[i].userID;
        }

        promises.push(users.get(permissions[i].userID));
      }

      try {
        this.users = (await Promise.all(promises))
          .filter(res => !!res && !!res.user)
          .map(res => res.user)
          .filter(user => {
            if (user.id === ownerID) {
              this.owner = user;

              return false;
            }

            return true;
          });
        this.users.forEach(user => {
          const isDirectPermission = permissions.find(e => e.userID == user.id).fileID == this.id;
          this.userPermissions[user.id] = isDirectPermission;
        });
        // eslint-disable-next-line
      } catch (err) {}
    },
    addUser: function(user) {
      if (!user) return;
      
      if (!this.users.find(currUser => currUser.id === user.id)) {
        this.users.push(user);
        this.userPermissions[user.id] = true;
      }
    },
    isUserFileOwner(user) {
      return (this.req.items && this.selectedCount !== 0 ? this.req.items[this.selected[0]].ownerId : this.req.ownerId) == user.id;
    },
    isDirectPermission(user) {
      return this.userPermissions[user.id];
    }
  }
}
</script>
<style scoped>
  .user-info {
    display: block;
    width: 90%;
    margin: 0;
  }

  .user-info > p {
    font-size: 13px; 
    margin-top: 2px; 
    margin-bottom: 0;
  }

  .delete-permission {
    cursor: pointer;
  }

  .owner-label{
    line-height: 2em;
  }

  .item {
    margin-bottom: 10px;
    display: flex;
  }
</style>