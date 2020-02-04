<template>
  <div class="step2">
    <p>{{ $t("exShare.STwoHeader") }}:</p>
    <div class="myCheckbox">
      <input
        class="actualCheckbox"
        @click="onChecked($event)"
        type="checkbox"
        id="checkboxID"
        v-model="checked"
      />{{ $t("exShare.addMeAsApprover") }}<br />
    </div>
    <my-autosuggestor
      :isExternal="external"
      @select="submitApprover"
    ></my-autosuggestor>

    <edit-approvers-list
      :id="selectedItem.id"
      @list-empty="emitCanContinue"
      ref="editApproversList"
    >
    </edit-approvers-list>
  </div>
</template>

<script>
import { mapState } from "vuex";
import AutoSuggestor from "./AutoSuggestor";
import EditApproversList from "../common/EditApproversList";
import { share as shareApi } from "@/api";

export default {
  components: {
    "my-autosuggestor": AutoSuggestor,
    EditApproversList
  },
  props: ["currentStep"],
  data() {
    return {
      external: false,
      checked: false
    };
  },
  computed: {
    ...mapState(["req", "selected", "selectedCount", "approvers"]),
    selectedItem() {
      return this.req.items[this.selected[0]];
    }
  },
  activated: function() {
    const selfUser = this.extractSelfUser();
    this.$refs.editApproversList.addUser(selfUser);
    this.emitCanContinue()
  },
  methods: {
    // check if user can continue to the next step, and emit accordingly.
    emitCanContinue() {
      const approversLength = this.$store.getters.getApprovers.length;
      if ( (approversLength == 1 && this.checked) || (approversLength > 1) ) {
        this.$emit("can-continue", { value: true });
        return true;
      }
      this.$emit("can-continue", { value: false });
      return false;
    },
    onChecked(event) {
      this.checked = event.target.checked;
      this.emitCanContinue()
    },
    submitApprover: async function(approver) {
      try {
        await shareApi.create(
          this.selectedItem.id,
          approver.value.id,
          "READ",
          false
        );
        this.$refs.editApproversList.addUser(approver.value);
        this.$showSuccess(
          `successfully shared with ${approver.value.fullName}`
        );
        this.$emit("can-continue", { value: true });
      } catch (err) {
        this.$showError(err);
      }
    },
    // extract the self user's fields to match the approver's fields.
    extractSelfUser() {
      const selfUser = this.$store.state.user;
      const user = {
        firstName: selfUser.firstName,
        fullName: selfUser.fullName,
        hierarchy: selfUser.hierarchy,
        hierarchyFlat: selfUser.hierarchyFlat,
        id: selfUser.id,
        lastName: selfUser.lastName,
        mail: selfUser.mail
      };
      return user;
    }
  }
};
</script>
<style>
.step2 {
  margin: 10px;
  min-height: 400px;
}
.myCheckbox {
  margin: 1%;
}
input {
  width: 25px;
  margin:10px;
}
</style>
