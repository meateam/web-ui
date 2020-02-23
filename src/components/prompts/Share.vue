<template>
  <div class="card floating" id="share">

    <tabs v-if="!finished" :options="{ useUrlFragment: false, defaultTabHash: 'firstTab'}">
      <tab :name="$t('exShare.changeToRegShare')" id="firstTab" class="regular-share">
      <template>
        <div class="card-content">
          <div class="user-role-select">
            <ul id="user-role-list">
              <li>
                <div class="autocomplete">
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
                          <div class="share-title">{{ getResultValue(result) }}</div>
                          <div class="share-snippet">{{ result.hierarchyFlat }}</div>
                        </div>
                      </li>
                    </template>
                  </autocomplete>
                </div>
                <select class="space-div" v-model="role" :aria-label="$t('role.input')">
                  <option value="READ">{{ $t("role.read") }}</option>
                  <option value="WRITE">{{ $t("role.write") }}</option>
                </select>
                <i class='material-icons select-icon'>{{roleToIconName(role)}}</i>
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
          <edit-permission-list :id="selectedItem.id" ref="editPermissionList"></edit-permission-list>
        </div>
      </template>
      </tab>
      <tab id="secondTab" :name="externalShareName" v-if="regularShare && !selectedItem.isDir && vip">
          <shareEx v-if="enableExternalShare" @finished-exshare="finishExShare" @close-share="$store.commit('closeHovers')"></shareEx>
          <div v-else class="service-unavailable">
            <div>
              <i class='material-icons'>build</i>
            </div>
            <div>
              <p>
                {{$t('exShare.serviceUnavailable')}}
              </p>
              <b>
                {{$t('exShare.tryAgainLater')}}
              </b>
            </div>
          </div>
      </tab>
    </tabs>

    <template v-if="finished" style="pading:0px">
      <alertDialog @finish-agree="onStepperFinished"></alertDialog>
    </template>

  </div>
</template>

<script>
import { mapState, mapGetters, mapMutations } from "vuex";
import {Tabs, Tab} from 'vue-tabs-component';
import { Roles, minAutoComplete, config } from "@/utils/constants";
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
    alertDialog: AlertDialog,
    tabs: Tabs,
    tab: Tab
  },
  data: function() {
    return {
      finished: false,
      role: Roles.read,
      searchText: "",
      user: "",
      regularShare: true,
      externalShareName: config.externalShareName,
      vip: false,
      enableExternalShare: config.enableExternalShare,
    };
  },
  computed: {
    ...mapState(["req", "selected", "selectedCount", "isVIP"]),
    ...mapGetters(["isListing", "selectedCount", "userID"]),
    ...mapMutations([
      "emptyGlobalExternalUsers",
      "emptyApprovers",
      "resetStepsRes",
      "setIsVIP"
    ]),
    allowedToexternalyShare() {
      return this.$store.getters.user.currentUnit === config.externalExclusiveUnit;
    },
    selectedItem() {
      return this.req.items && this.selectedCount !== 0
        ? this.req.items[this.selected[0]]
        : this.req;
    }
  },
  async beforeMount() {},
  async mounted() {
    if (this.isVIP === undefined) {
      const vip = await usersApi.checkIfVIP(this.userID);
      this.$store.commit("setIsVIP", vip);
      this.vip = vip;
    } else this.vip = this.isVIP;
    
  },
  beforeDestroy() {},
  destroyed() {
        this.$store.commit("emptyGlobalExternalUsers");
        this.$store.commit("emptyApprovers");
        this.$store.commit("resetStepsRes");
  },
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
    roleToIconName(roleName) {
      switch (roleName) {
        case Roles.read:
          return "remove_red_eye";
        case Roles.write:
          return "edit";
        default:
          return "remove_red_eye";
      }
    },
    changeShare() {
      this.$store.commit("emptyGlobalExternalUsers");
      this.$store.commit("emptyApprovers");
      this.$store.commit("resetStepsRes");
      this.regularShare = !this.regularShare;
    },
    async onStepperFinished(payload) {
      if (!payload.value) {
        this.finished = false;
        this.$store.commit("closeHovers");
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
          reqApprovers,
          this.selectedItem.name
        );
      } catch (err) {
        this.$showError({ message: this.$t("exShare.finalErrorMsg") });
        return;
      }
      this.$showSuccess(this.$t("exShare.finalSuccessMsg"));
      this.$store.commit("closeHovers");
    }
  }
};
</script>

<style scoped>
.space-div {
  margin: 10px;
  margin-left: 2px;
  padding-left: 30px;
  height: 35px;
}
.title {
  text-align: center;
}

#app {
  min-width: 200px;
  margin: 0 auto;
}

.share-result {
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

.regular-share{
  padding: 1.5em;
}

#share {
  padding: 0px;
}

.autocomplete {
  flex-grow: 1;
}

.select-icon {
  margin-right: -45px;
  margin-left: 28px;
}

.service-unavailable {
  padding: 35px;
  text-align: center;
  font-size: 25px;
  font-weight: bold;
}

.service-unavailable p {
  margin: 55px 30px 22px 30px;
  font-size: 35px;
}

.service-unavailable .material-icons {
  font-size: 90px;
}
</style>
