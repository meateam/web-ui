<template>
  <shareEx
    class="tab-content"
    v-if="enableExternalShare && isAllowedFileType"
    @finished-exshare="finishSecondTab"
    @close-share="$store.commit('closeHovers')"
  ></shareEx>
  <div v-else-if="!isAllowedFileType" class="service-unavailable">
    <div class="bad-file-type">
      <b>{{$t('exShare.badFileType')}}</b>
      <p>{{$t('exShare.allowedFileTypes')}}</p>
    </div>
    <br />
    <p>{{ allowedTypes() }}</p>
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
</template>

<script>
import { mapState, mapGetters } from "vuex";
import ShareExternal from "../prompts/ShareExternal";
import { allowedFileTypes, config } from "@/utils/constants";

export default {
  name: "share-second-tab",
  components: {
    shareEx: ShareExternal
  },
  data() {
    return {
      enableExternalShare: config.enableExternalShare
    };
  },
  computed: {
    ...mapState(["req", "selected", "selectedCount"]),
    ...mapGetters(["selectedCount"]),
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
  methods: {
    allowedTypes() {
      return allowedFileTypes
        .toString()
        .split(",")
        .join(", ");
    },
    finishSecondTab() {
      this.$emit("finished-second-tab");
    }
  }
};
</script>

<style>
.bad-file-type {
  text-align: center;
  width: fit-content;
  color: #353446;
  padding: 8px;
  margin: auto;
  border: 0.5px solid #353446;
}
</style>