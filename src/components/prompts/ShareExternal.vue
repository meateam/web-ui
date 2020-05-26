<template>
  <div class="stepper" id="stepper">
    <horizontal-stepper
      class="stepper"
      :steps="demoSteps"
      :locale="$t('settings.langName')"
      @completed-step="completeStep"
      :top-buttons="false"
      :isRTL="$t('settings.langName')==='he'"
      @active-step="updateActiveSteps"
      @stepper-finished="onStepperFinished"
    ></horizontal-stepper>
  </div>
</template>

<script>
import HorizontalStepper from "vue-stepper-sh";
import StepOne from "../files/StepOne.vue";
import StepTwo from "../files/StepTwo.vue";
import StepThree from "../files/StepThree.vue";

import { mapState } from "vuex";


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
    updateActiveSteps(payload) {
      this.demoSteps.forEach(step => {
        if (step.name === payload.name) {
          if (step.completed === true) {
            step.completed = false;
          }
        }
      });
    },
    async onStepperFinished() {
      this.$emit("finished-exshare", { value: true });
    }
  }
};
</script>

<style scoped>
.stepper {
  overflow: visible;
  background-color: transparent;
  box-shadow: none;
}
.circle {
  background-color: transparent;
}
</style>