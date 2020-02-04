<template>
  <div class="stepper" id="stepper">
    <horizontal-stepper
      class="stepper"
      :steps="demoSteps"
      :locale="$t('settings.langName')"
      @completed-step="completeStep"
      :top-buttons="true"
      @active-step="isStepActive"
      @stepper-finished="onStepperFinished"
    ></horizontal-stepper>
  </div>
</template>

<script>
import HorizontalStepper from "vue-stepper";
import StepOne from "../files/StepOne.vue";
import StepTwo from "../files/StepTwo.vue";
import StepThree from "../files/StepThree.vue";

import { mapState } from "vuex";
import { createExShare } from "@/api/exShare";

export default {
  name: "app",
  components: {
    HorizontalStepper,
  },
  data() {
    return {
      demoSteps: [
        // StepOne - choose users to share to
        {
          icon: "mail",
          name: "first",
          title: this.$t("prompts.searchUser"),
          component: StepOne,
          completed: false
        },
        // StepTwo - choose approvers for the share
        {
          icon: "payment",
          name: "second",
          title: this.$t("prompts.searchApprover"),
          component: StepTwo,
          completed: false
        },
        // StepThree - add information and classification
        {
          icon: "announcement",
          name: "third",
          title: this.$t("exShare.headerTS"),
          component: StepThree,
          completed: false
        }
      ],
      activeStep: 0
    };
  },
  computed: {
    ...mapState(["selected", "req"]),
    selectedItem() {
      return this.req.items[this.selected[0]];
    }
  },
  methods: {
    completeStep(payload) {
      this.demoSteps.forEach(step => {
        if (step.name === payload.name) {
          step.completed = true;
        }
      });
    },
    isStepActive(payload) {
      this.demoSteps.forEach(step => {
        if (step.name === payload.name) {
          if (step.completed === true) {
            step.completed = false;
          }
        }
      });
    },
    async onStepperFinished() {
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
      this.$emit("close-share");
    }
  }
};
</script>

<style scoped></style>
