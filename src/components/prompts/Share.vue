<template>
  <div class="card floating" id="share">
    <template v-if="finished">
      <alertDialog @finish-agree="onStepperFinished"></alertDialog>
    </template>
    <template v-if="!finished">
      <template v-if="!regularShare">
        <shareEx @finished-exshare="finishExShare" @close-share="$store.commit('closeHovers')"> </shareEx>
      </template>

      <template v-if="regularShare">
        <div class="card-title">
          <h2>{{ $t("buttons.share") }}</h2>
        </div>
        <div class="card-content">
          <div class="user-role-select">
            <ul id="user-role-list">
              <li>
                <autocomplete
                  :search="search"
                  :autoSelect="true"
                  @submit="saveUser"
                  :get-result-value="getResultValue"
                  :placeholder="$t('prompts.searchUser')"
                >
                  <template v-slot:result="{ result, props }">
                    <li v-bind="props" class="share-result">
                      <div>
                        <div class="share-title">
                          {{ getResultValue(result) }}
                        </div>
                        <div class="share-snippet">
                          {{ result.hierarchyFlat }}
                        </div>
                      </div>
                    </li>
                  </template>
                </autocomplete>

                <select class="space-div" v-model="role" :aria-label="$t('role.input')">
                  <option value="READ">{{ $t("role.read") }}</option>
                  <option value="WRITE">{{ $t("role.write") }}</option>
                </select>
                <button
                  class="action"
                  @click="submit"
                  :aria-label="$t('buttons.create')"
                  :title="$t('buttons.create')"
                >
                  <i class="material-icons">add</i>
                </button>
              </li>
            </ul>
          </div>
          <edit-permission-list :id="selectedItem.id" ref="editPermissionList">
          </edit-permission-list>
        </div>
      </template>

      <div class="card-action">
        <button
          class="button button--flat"
          @click="$store.commit('closeHovers')"
          :aria-label="$t('buttons.close')"
          :title="$t('buttons.close')"
        >
          {{ $t("buttons.close") }}
        </button>
        <button
          v-if="!regularShare"
          class="button button--flat"
          @click="changeShare"
        >
          {{ $t("exShare.changeToRegShare") }}
        </button>
        <button
          v-if="regularShare"
          class="button button--flat"
          @click="changeShare"
        >
          {{ $t("exShare.changeToExShare") }}
        </button>
      </div>
    </template>
  </div>
</template>

<script>
import { mapState, mapGetters, mapMutations } from "vuex";
import { Roles, minAutoComplete } from "@/utils/constants";
import { share as shareApi, users as usersApi } from "@/api";
import { createExShare } from "@/api/exShare";
import Autocomplete from "@trevoreyre/autocomplete-vue";
import EditPermissionList from "../common/EditPermissionList";
import moment from "moment";
import "@trevoreyre/autocomplete-vue/dist/style.css";

import AlertDialog from "../files/AlertDialog";
import ShareExternal from "./ShareExternal";

export default {
  name: "share",
  components: {
    Autocomplete,
    EditPermissionList,
    shareEx: ShareExternal,
    alertDialog: AlertDialog
  },
  data: function() {
    return {
      finished: false,
      role: Roles.read,
      searchText: "",
      user: "",
      regularShare: true
    };
  },
  computed: {
    ...mapState(["req", "selected", "selectedCount"]),
    ...mapGetters(["isListing", "selectedCount"]),
    ...mapMutations([
      "emptyGlobalExternalUsers",
      "emptyApprovers",
      "resetStepsRes"
    ]),
    selectedItem() {
      return this.req.items && this.selectedCount !== 0
        ? this.req.items[this.selected[0]]
        : this.req;
    }
  },
  async beforeMount() {},
  mounted() {},
  beforeDestroy() {},
  methods: {
    finishExShare() {
      this.finished = true;
    },
    saveUser(user) {
      this.user = user;
    },
    submit: async function() {
      if (!this.role) return;
      if (!this.user) return;

      try {
        await shareApi.create(this.selectedItem.id, this.user.id, this.role);
        this.$showSuccess(
          this.$t("success.shared", { user: this.getResultValue(this.user) })
        );
        this.$refs.editPermissionList.addUser(this.user);
      } catch (e) {
        this.$showError(e);
      }
    },
    async search(input) {
      if (input.length < minAutoComplete) {
        return [];
      }
      const res = await usersApi.searchUserByName(input);
      const users = res.data.users;
      if (users) {
        return users;
      }
      return [];
    },
    humanTime(time) {
      return moment(time * 1000).fromNow();
    },
    getResultValue(result) {
      return `${result.firstName} ${result.lastName}`;
    },
    changeShare() {
      this.$store.commit("emptyGlobalExternalUsers");
      this.$store.commit("emptyApprovers");
      this.$store.commit("resetStepsRes");
      this.regularShare = !this.regularShare;
    },
    async onStepperFinished(payload) {
      if(!payload.value) {
        this.finished = false;
        this.$store.commit('closeHovers');
        return;
      }
      const users = this.$store.getters.getGlobalExternalUsers;
      const approvers = this.$store.getters.getApprovers;

      const reqUsers = [];
      const reqApprovers = [];
      users.forEach(user => {
        reqUsers.push({ id: user.id, full_name: user.full_name });
      });
      approvers.forEach(approver => {
        reqApprovers.push(approver.id);
      });

      const step3Res = this.$store.getters.getStepThreeRes;
      const reqClassification = step3Res.classification;
      const reqInfo = step3Res.info;

      try {
        await createExShare(
          this.selectedItem.id,
          reqUsers,
          reqClassification,
          reqInfo,
          reqApprovers
        );
      } catch (err) {
        this.$showError({ message: this.$t("exShare.finalErrorMsg") });
        return;
      }
      this.$showSuccess(this.$t("exShare.finalSuccessMsg"));
      this.$store.commit('closeHovers');
    }
  }
};
</script>

<style scoped>
.space-div {
  margin:10px;
}
.title {
  text-align: center;
}

#app {
  min-width: 200px;
  margin: 0 auto;
}

.share-result {
  min-width: 700px;
  padding: 5px;
  background: transparent;
}

.share-result:hover {
  background: #bdddf0;
}

.share-title {
  font-size: 20px;
  margin-bottom: 1px;
  margin-top: 1px;
  margin-right: 10px;
}

.share-snippet {
  font-size: 14px;
  color: rgba(0, 0, 0, 0.54);
}
</style>
