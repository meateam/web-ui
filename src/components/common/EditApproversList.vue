<template>
  <div class="list approvers-list">
    <div class="item" v-if="owner.id">
      <span class="user-info">
        <span>{{ owner.fullName }} </span>
        <p>{{ owner.hierarchyFlat }}</p>
      </span>
      <span class="owner-label">
        {{ $t("role.owner") }}
      </span>
    </div>
    <div v-for="user in getApprovers" :key="user.id" class="item">
      <span v-if="$store.state.user.id != user.id" class="user-info">
        <span>{{ user.fullName }} </span>
        <p>{{ user.hierarchyFlat }}</p>
      </span>
      <span
        class="delete-permission"
        @click="deleteApprover(user)"
        :aria-label="$t('buttons.deletePermission')"
        :title="$t('buttons.deletePermission')"
      >
        <i v-if="$store.state.user.id != user.id" class="material-icons">delete</i>
      </span>
    </div>
  </div>
</template>
<script>
import { files } from "@/api";
import { mapState, mapGetters, mapMutations } from "vuex";

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
    ...mapMutations(["addApprover", "removeApprover"])
  },
  methods: {
    deleteApprover: async function(user) {
      try {
        await files.unShare(this.id, user.id);
      } catch (err) {
        this.$showError(err);
        return;
      }
      this.$store.commit("removeApprover", user.id);
      if (this.$store.getters.getApprovers.length <= 0) {
        this.$emit("list-empty", { value: true });
      }
    },
    addUser: function(user) {
      if (!user) return;
      if (!this.approvers.find(currUser => currUser.id === user.id)) {
        this.$store.commit("addApprover", user);
      }
    }
  }
};
</script>
<style scoped>
.material-icons:hover{
  color: crimson;
}

.approvers-list {
  margin-top: 20px;
}
.user-info {
  display: block;
  width: 90%;
}

.user-info > p {
  font-size: 13px;
  margin-top: 2px;
  margin-bottom: 0;
}

.delete-permission {
  cursor: pointer;
}

.owner-label {
  line-height: 2em;
}

.item {
    margin-top: 20px;
  margin-bottom: 10px;
  display: flex;
}
</style>
