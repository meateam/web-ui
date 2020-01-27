<template>
  <div class="stepper" id="stepper">
    <horizontal-stepper class="stepper"
      :steps="demoSteps"
      @completed-step="completeStep"
      :top-buttons="true"
      @active-step="isStepActive"
      @stepper-finished="alert"
    ></horizontal-stepper>
  </div>
</template>

<script>
import HorizontalStepper from "vue-stepper";
import StepOne from "../files/StepOne.vue";
import StepTwo from "../files/StepTwo.vue";
import StepThree from "../files/StepThree.vue";

import { createExShare } from '@/api/exShare';

export default {
  name: "app",
  components: {
    HorizontalStepper
  },
  data() {
    return {
      demoSteps: [
        {
          icon: "mail",
          name: "first",
          title: this.$t('prompts.searchUser'),
          component: StepOne,
          completed: false
        },
        {
          icon: "payment",
          name: "second",
          title: this.$t('prompts.searchApprover'),
          component: StepTwo,
          completed: false
        },
        {
          icon: "announcement",
          name: "third",
          title: this.$t('exShare.headerTS'),
          component: StepThree,
          completed: false
        }
      ],
      activeStep: 0
    };
  },
  computed: {},
  methods: {
    completeStep(payload) {
        console.log('completeStep');
        console.log(payload);
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
    alert() {
      alert("end");
    },
    
  }
};
</script>

<style scoped>

</style>
