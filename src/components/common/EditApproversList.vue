<template>
  <div class="list">
    <div class="item" v-if="owner.id">
      <span class="user-info">
        <span>{{owner.fullName}} </span>
        <p>{{owner.hierarchyFlat}}</p>
      </span>
      <span class="owner-label">
        {{$t('role.owner')}}
      </span>
    </div>
    <div v-for="user in getApprovers" :key="user.userID" class="item">
      <span class="user-info">
        <span>{{user.fullName}} </span>
        <p>{{user.hierarchyFlat}}</p>
      </span>
      <span
        class="delete-permission"
        @click="deleteApprover(user)"
        :aria-label="$t('buttons.deletePermission')"
        :title="$t('buttons.deletePermission')">
          <i class="material-icons">delete</i>
      </span>
    </div>
  </div>
</template>
<script>
import { files } from "@/api";
import { mapState, mapGetters, mapMutations } from 'vuex'

export default {
    name: "edit-approvers-list",
    props: ["id"],
    data: function() {
    return {
      owner: {}
    };
  },
  computed: {
    ...mapState(["approvers"]),
    ...mapGetters(["getApprovers"]),
    ...mapMutations([ "addApprover", "removeApprover" ]),
  },
  async mounted() {
    await this.onMount();
  },
  methods: {
    deleteApprover: async function(user) {
      try{
        await files.unShare(this.id, user.id);
      } catch(err) {
        this.$showError(err)
      }
      this.$store.commit("removeApprover", user.id);
      await this.onMount();
    },
    onMount: async function() {
    },
    addUser: function(user) {
      if (!user) return;
      if (!this.approvers.find(currUser => currUser.id === user.id)) {
        this.$store.commit("addApprover", user);
      }
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