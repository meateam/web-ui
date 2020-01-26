<template>
  <div id="app">
    <horizontal-stepper
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
          title: "Choose Users",
          // subtitle: 'Subtitle sample',
          component: StepOne,
          completed: false
        },
        {
          icon: "payment",
          name: "second",
          title: "Choose Approvers",
          // subtitle: 'Subtitle sample',
          component: StepTwo,
          completed: false
        },
        {
          icon: "announcement",
          name: "third",
          title: "Add info",
          // subtitle: 'Subtitle sample',
          component: StepOne,
          completed: true
        }
      ],
      activeStep: 0
    };
  },
  computed: {},
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
    alert() {
      alert("end");
    }
  }
};
</script>

<style scoped></style>
