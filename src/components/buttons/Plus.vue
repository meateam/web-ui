<template>
  <div v-show="showPlus">
    <fab
      :bg-color="bgColor"
      :actions="fabActions"
      :position="position"
      @uploadFile="uploadFile"
      @createFolder="createFolder"
    ></fab>
  </div>
</template>

<script>
import fab from "vue-fab";
import { UploadRole } from "@/utils/constants";
import { mapState } from "vuex";

export default {
  name: "plus-button",
  components: {
    fab
  },
  data() {
    return {
      bgColor: "#64B984",
      position: "bottom-left",
      fabActions: [
        {
          name: "uploadFile",
          icon: "file_upload",
          tooltip: this.$t("sidebar.newFile")
        },
        {
          name: "createFolder",
          icon: "create_new_folder",
          tooltip: this.$t("sidebar.newFolder")
        }
      ]
    };
  },
  methods: {
    uploadFile() {
      document.getElementById("upload-input").click();
    },
    createFolder() {
      this.$store.commit("showHover", "newDir");
    }
  },
  computed: {
    ...mapState([ 'req']),
    showPlus() {
      return UploadRole(this.req.role);
    }
  }
};
</script>

