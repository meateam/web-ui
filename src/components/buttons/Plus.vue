<template>
  <fab
    :position="position"
    :bg-color="bgColor"
    :actions="fabActions"
    @uploadFile="uploadFile"
    @createFolder="createFolder"
  ></fab>
</template>

<script>
import fab from "vue-fab";

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
        },
        {
          name: "createFolder",
          icon: "create_new_folder"
        }
      ]
    };
  },
  methods: {
    uploadFile() {
      document.getElementById('upload-input').click();
    },
    createFolder() {
      this.$store.commit('showHover', 'newDir');
    }
  }
};
</script>