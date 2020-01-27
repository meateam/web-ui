<template>
    <div class="step1">
        <p>Choose approvers:</p>
        <my-autosuggestor :isExternal="external" @select="addApprover"></my-autosuggestor>

        <edit-approvers-list :id="selectedItem.id" ref="editApproversList">
        </edit-approvers-list>
    </div>
</template>

<script>
    import { mapState } from "vuex";
    import AutoSuggestor from './AutoSuggestor'
    import EditApproversList from "../common/EditApproversList";

    export default {
        components: {
            'my-autosuggestor': AutoSuggestor,
            EditApproversList,
        },
        props: ['currentStep'],
        data() {
            return {
                external: false,
                approvers: [],
            }
        },
        computed: {    
            ...mapState(["req", "selected", "selectedCount"]),
            selectedItem() {
                console.log(this.req.items);
                return this.req.items[this.selected[0]];
            }
        },
        methods: {
          canContinue() {
              this.$emit('can-continue', {value: true});
          },
          addApprover(approver) {
              this.approvers.push(approver.value)
              console.log(this.approvers);
          }
        },
        mounted() {
//            this.$emit('can-continue', {value: true})
        }
    }
</script>
