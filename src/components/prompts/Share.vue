<template>
  <div class="card floating" id="share">
    <tabs v-if="!finishedExShare" :options="{ useUrlFragment: false, defaultTabHash: 'firstTab'}">
      <tab :name="$t('exShare.changeToRegShare')" id="firstTab" class="regular-share tab-content">
        <share-first-tab></share-first-tab>
      </tab>

      <tab id="secondTab" :name="externalShareName" v-if="regularShare && !selectedItem.isDir">
        <share-second-tab @finished-second-tab="finishExShare"></share-second-tab>
      </tab>
    </tabs>

    <alertDialog v-if="finishedExShare" style="pading:0px" @finish-agree="onStepperFinished"></alertDialog>
  </div>
</template>

<script>
import { mapState, mapGetters, mapMutations } from "vuex";
import { Tabs, Tab } from "vue-tabs-component";
import { exShare } from "@/api";
import { allowedFileTypes, config } from "@/utils/constants";

import AlertDialog from "../files/AlertDialog";
import ShareFirstTab from "../files/ShareFirstTab";
import ShareSecondTab from "../files/ShareSecondTab";

export default {
  name: "share",
  components: {
    ShareFirstTab,
    ShareSecondTab,
    alertDialog: AlertDialog,
    tabs: Tabs,
    tab: Tab
  },
  data: function() {
    return {
      finishedExShare: false,
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
    ...mapMutations(["emptyGlobalExternalUsers", "emptyApprovers", "resetStepsRes"]),
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
    // Wrap up the external share and send the request 
    // in the correct format.
    async onStepperFinished(payload) {
      if (!payload.value) {
        this.finishedExShare = false;
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
    },
    finishExShare() {
      this.finishedExShare = true;
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
