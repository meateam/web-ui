<template>
  <div class="card floating" id="share">
    <tabs v-if="!finished" :options="{ useUrlFragment: false, defaultTabHash: 'firstTab'}">
      
      <tab :name="$t('exShare.changeToRegShare')" id="firstTab" class="regular-share tab-content">
        <first-tab></first-tab>
      </tab>

      <tab id="secondTab" :name="externalShareName" v-if="regularShare && !selectedItem.isDir">
        <shareEx
          class="tab-content"
          v-if="enableExternalShare && isAllowedFileType"
          @finished-exshare="finishExShare"
          @close-share="$store.commit('closeHovers')"
        ></shareEx>
        <div v-else-if="!isAllowedFileType" class="service-unavailable">
          <div>
            <i class="material-icons tab-content">insert_drive_file</i>
          </div>
          <div>
            <p>{{$t('exShare.badFileType')}}</p>
            <b>{{$t('exShare.allowedFileTypes')}}</b>
            <br />
            <br />
            <b>{{ allowedTypes() }}</b>
          </div>
        </div>
        <div v-else class="service-unavailable tab-content">
          <div>
            <i class="material-icons">build</i>
          </div>
          <div>
            <p>{{$t('exShare.serviceUnavailable')}}</p>
            <b>{{$t('exShare.tryAgainLater')}}</b>
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
import { Tabs, Tab } from "vue-tabs-component";
import { exShare } from "@/api";

import moment from "moment";
import "@trevoreyre/autocomplete-vue/dist/style.css";
import { allowedFileTypes, config } from "@/utils/constants";
import AlertDialog from "../files/AlertDialog";
import ShareExternal from "./ShareExternal";

import FirstTab from "../files/FirstTab";

export default {
  name: "share",
  components: {
    FirstTab,
    shareEx: ShareExternal,
    alertDialog: AlertDialog,
    tabs: Tabs,
    tab: Tab
  },
  data: function() {
    return {
      finished: false,

      searchText: "",
      user: "",
      regularShare: true,
      externalShareName: config.externalShareName,
      enableExternalShare: config.enableExternalShare
    };
  },
  computed: {
    ...mapState(["req", "selected", "selectedCount"]),
    ...mapGetters(["isListing", "selectedCount", "userID"]),
    ...mapMutations([
      "emptyGlobalExternalUsers",
      "emptyApprovers",
      "resetStepsRes"
    ]),
    selectedItem() {
      return this.req.items && this.selectedCount !== 0
        ? this.req.items[this.selected[0]]
        : this.req;
    },
    isAllowedFileType() {
      const nameArray = this.selectedItem.name.split(".");
      const fileType = nameArray[nameArray.length - 1];
      return allowedFileTypes.includes(fileType.toLowerCase());
    }
  },
  destroyed() {
    this.$store.commit("emptyGlobalExternalUsers");
    this.$store.commit("emptyApprovers");
    this.$store.commit("resetStepsRes");
  },
  methods: {
    allowedTypes() {
      return allowedFileTypes
        .toString()
        .split(",")
        .join(", ");
    },
    finishExShare() {
      this.finished = true;
    },
    humanTime(time) {
      return moment(time * 1000).fromNow();
    },
    getResultValue(result) {
      return `${result.firstName} ${result.lastName}`;
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
        await exShare.createExShare(
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
      this.$showLongSuccess(this.$t("exShare.finalSuccessMsg"));
      this.$store.commit("closeHovers");
    }
  }
};

</script>

<style scoped>
.tab-content {
  stroke: #000000;
  stroke-width: 10px;
}

.regular-share {
  padding: 1.5em;
}

#share {
  padding: 0px;
}

</style>
